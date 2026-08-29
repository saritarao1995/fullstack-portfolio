const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');

const ISSUER_ROLE = ethers.id('ISSUER_ROLE');
const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
const MAX_FIELD_LENGTH = 128;

const SAMPLE = {
  certificateId: 'CERT-1001',
  studentName: 'Rahul Sharma',
  courseName: 'Full Stack Development',
  institutionName: 'ABC Institute',
};

/** Mirrors the contract's storage key derivation, computed off-chain. */
const hashId = (certificateId) => ethers.keccak256(ethers.toUtf8Bytes(certificateId));

describe('CertificateVerification', () => {
  async function deployFixture() {
    const [admin, issuer, rivalIssuer, outsider] = await ethers.getSigners();

    const factory = await ethers.getContractFactory('CertificateVerification');
    const certificates = await factory.deploy(admin.address);

    await certificates.grantRole(ISSUER_ROLE, issuer.address);
    await certificates.grantRole(ISSUER_ROLE, rivalIssuer.address);

    const issueDate = await time.latest();

    return { certificates, factory, admin, issuer, rivalIssuer, outsider, issueDate };
  }

  /** Issues SAMPLE unless individual fields are overridden. */
  const issue = (certificates, signer, overrides = {}) => {
    const data = { ...SAMPLE, ...overrides };

    return certificates
      .connect(signer)
      .issueCertificate(
        data.certificateId,
        data.studentName,
        data.courseName,
        data.institutionName,
        data.issueDate,
      );
  };

  describe('deployment', () => {
    it('grants the deployer-nominated admin both roles', async () => {
      const { certificates, admin } = await loadFixture(deployFixture);

      expect(await certificates.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.equal(true);
      expect(await certificates.hasRole(ISSUER_ROLE, admin.address)).to.equal(true);
      expect(await certificates.isIssuer(admin.address)).to.equal(true);
    });

    it('exposes its public constants', async () => {
      const { certificates } = await loadFixture(deployFixture);

      expect(await certificates.ISSUER_ROLE()).to.equal(ISSUER_ROLE);
      expect(await certificates.MAX_FIELD_LENGTH()).to.equal(MAX_FIELD_LENGTH);
    });

    it('starts with an empty registry', async () => {
      const { certificates } = await loadFixture(deployFixture);

      expect(await certificates.certificateExists(SAMPLE.certificateId)).to.equal(false);
    });

    it('refuses an admin of address zero', async () => {
      const factory = await ethers.getContractFactory('CertificateVerification');

      await expect(factory.deploy(ethers.ZeroAddress)).to.be.revertedWithCustomError(
        factory,
        'ZeroAddress',
      );
    });
  });

  describe('access control', () => {
    it('lets the admin appoint and dismiss issuers', async () => {
      const { certificates, outsider } = await loadFixture(deployFixture);

      expect(await certificates.isIssuer(outsider.address)).to.equal(false);

      await certificates.grantRole(ISSUER_ROLE, outsider.address);
      expect(await certificates.isIssuer(outsider.address)).to.equal(true);

      await certificates.revokeRole(ISSUER_ROLE, outsider.address);
      expect(await certificates.isIssuer(outsider.address)).to.equal(false);
    });

    it('stops a non-admin from appointing issuers', async () => {
      const { certificates, issuer, outsider } = await loadFixture(deployFixture);

      await expect(certificates.connect(issuer).grantRole(ISSUER_ROLE, outsider.address))
        .to.be.revertedWithCustomError(certificates, 'AccessControlUnauthorizedAccount')
        .withArgs(issuer.address, DEFAULT_ADMIN_ROLE);
    });
  });

  describe('issueCertificate', () => {
    it('stores every field and stamps the issuer', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });

      const certificate = await certificates.getCertificate(SAMPLE.certificateId);

      expect(certificate.certificateId).to.equal(SAMPLE.certificateId);
      expect(certificate.studentName).to.equal(SAMPLE.studentName);
      expect(certificate.courseName).to.equal(SAMPLE.courseName);
      expect(certificate.institutionName).to.equal(SAMPLE.institutionName);
      expect(certificate.issueDate).to.equal(issueDate);
      expect(certificate.issuer).to.equal(issuer.address);
      expect(certificate.revoked).to.equal(false);
      expect(certificate.exists).to.equal(true);
    });

    it('records the block timestamp as issuedAt, independent of issueDate', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      // A degree awarded a year ago, only now being written to the chain.
      const backdated = issueDate - 365 * 24 * 60 * 60;
      const minedAt = issueDate + 60;
      await time.setNextBlockTimestamp(minedAt);

      await issue(certificates, issuer, { issueDate: backdated });

      const certificate = await certificates.getCertificate(SAMPLE.certificateId);
      expect(certificate.issueDate).to.equal(backdated);
      expect(certificate.issuedAt).to.equal(minedAt);
    });

    it('emits CertificateIssued with the full payload', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      await expect(issue(certificates, issuer, { issueDate }))
        .to.emit(certificates, 'CertificateIssued')
        .withArgs(
          hashId(SAMPLE.certificateId),
          issuer.address,
          SAMPLE.certificateId,
          SAMPLE.studentName,
          SAMPLE.courseName,
          SAMPLE.institutionName,
          issueDate,
          anyValue,
        );
    });

    it('returns the storage key derived from the certificate id', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      // staticCall simulates the write locally and hands back the return value,
      // which a real transaction never delivers to its sender.
      const returned = await certificates
        .connect(issuer)
        .issueCertificate.staticCall(
          SAMPLE.certificateId,
          SAMPLE.studentName,
          SAMPLE.courseName,
          SAMPLE.institutionName,
          issueDate,
        );

      expect(returned).to.equal(hashId(SAMPLE.certificateId));
    });

    it('rejects a duplicate certificate id instead of overwriting', async () => {
      const { certificates, issuer, rivalIssuer, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });

      await expect(
        issue(certificates, rivalIssuer, { issueDate, studentName: 'Impostor' }),
      )
        .to.be.revertedWithCustomError(certificates, 'CertificateAlreadyExists')
        .withArgs(hashId(SAMPLE.certificateId));

      const certificate = await certificates.getCertificate(SAMPLE.certificateId);
      expect(certificate.studentName).to.equal(SAMPLE.studentName);
      expect(certificate.issuer).to.equal(issuer.address);
    });

    it('rejects a caller without the issuer role', async () => {
      const { certificates, outsider, issueDate } = await loadFixture(deployFixture);

      await expect(issue(certificates, outsider, { issueDate }))
        .to.be.revertedWithCustomError(certificates, 'AccessControlUnauthorizedAccount')
        .withArgs(outsider.address, ISSUER_ROLE);
    });

    it('rejects an issuer whose role was withdrawn', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      await certificates.revokeRole(ISSUER_ROLE, issuer.address);

      await expect(issue(certificates, issuer, { issueDate })).to.be.revertedWithCustomError(
        certificates,
        'AccessControlUnauthorizedAccount',
      );
    });

    describe('input validation', () => {
      const emptyFieldCases = [
        ['certificateId', 'EmptyCertificateId'],
        ['studentName', 'EmptyStudentName'],
        ['courseName', 'EmptyCourseName'],
        ['institutionName', 'EmptyInstitutionName'],
      ];

      emptyFieldCases.forEach(([field, expectedError]) => {
        it(`rejects an empty ${field}`, async () => {
          const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

          await expect(
            issue(certificates, issuer, { issueDate, [field]: '' }),
          ).to.be.revertedWithCustomError(certificates, expectedError);
        });
      });

      it('rejects a field longer than MAX_FIELD_LENGTH', async () => {
        const { certificates, issuer, issueDate } = await loadFixture(deployFixture);
        const tooLong = 'x'.repeat(MAX_FIELD_LENGTH + 1);

        await expect(issue(certificates, issuer, { issueDate, studentName: tooLong }))
          .to.be.revertedWithCustomError(certificates, 'FieldTooLong')
          .withArgs(MAX_FIELD_LENGTH + 1, MAX_FIELD_LENGTH);
      });

      it('accepts a field of exactly MAX_FIELD_LENGTH', async () => {
        const { certificates, issuer, issueDate } = await loadFixture(deployFixture);
        const atLimit = 'x'.repeat(MAX_FIELD_LENGTH);

        await expect(issue(certificates, issuer, { issueDate, studentName: atLimit })).to.not.be
          .reverted;
      });

      it('rejects a zero issue date', async () => {
        const { certificates, issuer } = await loadFixture(deployFixture);

        await expect(issue(certificates, issuer, { issueDate: 0 }))
          .to.be.revertedWithCustomError(certificates, 'InvalidIssueDate')
          .withArgs(0, anyValue);
      });

      it('rejects a post-dated certificate', async () => {
        const { certificates, issuer, issueDate } = await loadFixture(deployFixture);
        const future = issueDate + 24 * 60 * 60;

        await expect(issue(certificates, issuer, { issueDate: future }))
          .to.be.revertedWithCustomError(certificates, 'InvalidIssueDate')
          .withArgs(future, anyValue);
      });
    });
  });

  describe('verifyCertificate', () => {
    it('is a read-only call, so verifiers need no wallet or gas', async () => {
      const { certificates } = await loadFixture(deployFixture);

      expect(certificates.interface.getFunction('verifyCertificate').stateMutability).to.equal(
        'view',
      );
    });

    it('reports a freshly issued certificate as valid', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });
      const result = await certificates.verifyCertificate(SAMPLE.certificateId);

      expect(result.isValid).to.equal(true);
      expect(result.exists).to.equal(true);
      expect(result.revoked).to.equal(false);
      expect(result.studentName).to.equal(SAMPLE.studentName);
      expect(result.courseName).to.equal(SAMPLE.courseName);
      expect(result.institutionName).to.equal(SAMPLE.institutionName);
      expect(result.issueDate).to.equal(issueDate);
      expect(result.issuer).to.equal(issuer.address);
    });

    it('answers for an unknown id without reverting', async () => {
      const { certificates } = await loadFixture(deployFixture);

      const result = await certificates.verifyCertificate('CERT-DOES-NOT-EXIST');

      expect(result.isValid).to.equal(false);
      expect(result.exists).to.equal(false);
      expect(result.revoked).to.equal(false);
      expect(result.studentName).to.equal('');
      expect(result.issuer).to.equal(ethers.ZeroAddress);
    });

    it('reports a revoked certificate as existing but invalid', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });
      await certificates.connect(issuer).revokeCertificate(SAMPLE.certificateId, 'Issued in error');

      const result = await certificates.verifyCertificate(SAMPLE.certificateId);

      expect(result.isValid).to.equal(false);
      expect(result.exists).to.equal(true);
      expect(result.revoked).to.equal(true);
      // The original details survive revocation; only the flag changes.
      expect(result.studentName).to.equal(SAMPLE.studentName);
      expect(result.issuer).to.equal(issuer.address);
    });
  });

  describe('getCertificate', () => {
    it('reverts for an id that was never issued', async () => {
      const { certificates } = await loadFixture(deployFixture);

      await expect(certificates.getCertificate('CERT-9999'))
        .to.be.revertedWithCustomError(certificates, 'CertificateNotFound')
        .withArgs(hashId('CERT-9999'));
    });
  });

  describe('certificateExists', () => {
    it('tracks issuance and stays true after revocation', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      expect(await certificates.certificateExists(SAMPLE.certificateId)).to.equal(false);

      await issue(certificates, issuer, { issueDate });
      expect(await certificates.certificateExists(SAMPLE.certificateId)).to.equal(true);

      await certificates.connect(issuer).revokeCertificate(SAMPLE.certificateId, 'Fraud');
      expect(await certificates.certificateExists(SAMPLE.certificateId)).to.equal(true);
    });
  });

  describe('revokeCertificate', () => {
    it('lets the original issuer revoke and emits CertificateRevoked', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);
      const reason = 'Academic misconduct';

      await issue(certificates, issuer, { issueDate });

      await expect(certificates.connect(issuer).revokeCertificate(SAMPLE.certificateId, reason))
        .to.emit(certificates, 'CertificateRevoked')
        .withArgs(
          hashId(SAMPLE.certificateId),
          issuer.address,
          SAMPLE.certificateId,
          reason,
          anyValue,
        );

      const certificate = await certificates.getCertificate(SAMPLE.certificateId);
      expect(certificate.revoked).to.equal(true);
    });

    it('lets a default admin revoke any issuer\'s certificate', async () => {
      const { certificates, admin, issuer, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });

      await expect(
        certificates.connect(admin).revokeCertificate(SAMPLE.certificateId, 'Platform takedown'),
      ).to.emit(certificates, 'CertificateRevoked');

      expect((await certificates.getCertificate(SAMPLE.certificateId)).revoked).to.equal(true);
    });

    it('stops one issuer from revoking another issuer\'s certificate', async () => {
      const { certificates, issuer, rivalIssuer, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });

      await expect(
        certificates.connect(rivalIssuer).revokeCertificate(SAMPLE.certificateId, 'Sabotage'),
      )
        .to.be.revertedWithCustomError(certificates, 'NotCertificateIssuer')
        .withArgs(rivalIssuer.address, issuer.address);

      expect((await certificates.getCertificate(SAMPLE.certificateId)).revoked).to.equal(false);
    });

    it('stops a caller without the issuer role', async () => {
      const { certificates, issuer, outsider, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });

      await expect(certificates.connect(outsider).revokeCertificate(SAMPLE.certificateId, 'Nope'))
        .to.be.revertedWithCustomError(certificates, 'AccessControlUnauthorizedAccount')
        .withArgs(outsider.address, ISSUER_ROLE);
    });

    it('reverts when the certificate does not exist', async () => {
      const { certificates, issuer } = await loadFixture(deployFixture);

      await expect(certificates.connect(issuer).revokeCertificate('CERT-9999', 'Ghost'))
        .to.be.revertedWithCustomError(certificates, 'CertificateNotFound')
        .withArgs(hashId('CERT-9999'));
    });

    it('reverts on a second revocation', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });
      await certificates.connect(issuer).revokeCertificate(SAMPLE.certificateId, 'First');

      await expect(certificates.connect(issuer).revokeCertificate(SAMPLE.certificateId, 'Second'))
        .to.be.revertedWithCustomError(certificates, 'CertificateAlreadyRevoked')
        .withArgs(hashId(SAMPLE.certificateId));
    });
  });

  describe('hashCertificateId', () => {
    it('matches keccak256 computed off-chain', async () => {
      const { certificates } = await loadFixture(deployFixture);

      expect(await certificates.hashCertificateId(SAMPLE.certificateId)).to.equal(
        hashId(SAMPLE.certificateId),
      );
    });

    it('treats certificate ids as case sensitive', async () => {
      const { certificates, issuer, issueDate } = await loadFixture(deployFixture);

      await issue(certificates, issuer, { issueDate });

      expect(await certificates.certificateExists('cert-1001')).to.equal(false);
    });
  });
});
