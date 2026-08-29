const fs = require('node:fs');
const path = require('node:path');
const { task } = require('hardhat/config');

const CONTRACT_NAME = 'CertificateVerification';

/** Reads the address the deploy script recorded for the active network. */
function loadContractAddress(hre) {
  const file = path.join(__dirname, '..', 'deployments', `${hre.network.name}.json`);

  if (!fs.existsSync(file)) {
    throw new Error(
      `No deployment found for network "${hre.network.name}". Run: npx hardhat run scripts/deploy.js --network ${hre.network.name}`,
    );
  }

  return JSON.parse(fs.readFileSync(file, 'utf8')).contractAddress;
}

/**
 * @param signerIndex Which of the local test accounts signs. Handy for proving
 *        that an unauthorised account really is rejected by the contract.
 */
async function connect(hre, signerIndex = 0) {
  const signers = await hre.ethers.getSigners();
  const signer = signers[Number(signerIndex)];

  if (!signer) throw new Error(`No signer at index ${signerIndex}.`);

  const address = loadContractAddress(hre);
  const contract = await hre.ethers.getContractAt(CONTRACT_NAME, address, signer);

  return { contract, signer, address };
}

/** Custom errors arrive decoded when the ABI is known — surface them plainly. */
function describeError(error) {
  if (error.revert) {
    const args = error.revert.args.map((value) => value.toString()).join(', ');

    return `${error.revert.name}(${args})`;
  }

  const message = error.shortMessage || error.message || String(error);

  // Local nodes wrap the decoded error in VM boilerplate; keep only the error.
  return message.match(/custom error '(.+)'/)?.[1] ?? message;
}

async function report(action) {
  try {
    await action();
  } catch (error) {
    console.error(`\nFailed: ${describeError(error)}\n`);
    process.exitCode = 1;
  }
}

const toDate = (seconds) => (seconds ? new Date(Number(seconds) * 1000).toISOString() : '—');

/* -------------------------------------------------------------------------- */
/*                                    Reads                                    */
/* -------------------------------------------------------------------------- */

task('cert:info', 'Show the deployed contract and its admin').setAction(async (_args, hre) => {
  await report(async () => {
    const { contract, address } = await connect(hre);
    const [signer] = await hre.ethers.getSigners();
    const blockNumber = await hre.ethers.provider.getBlockNumber();

    console.log(`\nNetwork      : ${hre.network.name}`);
    console.log(`Contract     : ${address}`);
    console.log(`Block height : ${blockNumber}`);
    console.log(`Signer #0    : ${signer.address}`);
    console.log(`Is issuer    : ${await contract.isIssuer(signer.address)}\n`);
  });
});

task('cert:verify', 'Read a certificate from the chain (free, no transaction)')
  .addParam('id', 'Certificate ID')
  .setAction(async ({ id }, hre) => {
    await report(async () => {
      const { contract } = await connect(hre);
      const result = await contract.verifyCertificate(id);

      console.log(`\nCertificate ID : ${id}`);

      if (!result.exists) {
        console.log('Status         : NOT FOUND\n');
        return;
      }

      console.log(`Status         : ${result.revoked ? 'REVOKED' : 'VALID'}`);
      console.log(`Student        : ${result.studentName}`);
      console.log(`Course         : ${result.courseName}`);
      console.log(`Institution    : ${result.institutionName}`);
      console.log(`Issue date     : ${toDate(result.issueDate)}`);
      console.log(`Recorded at    : ${toDate(result.issuedAt)}`);
      console.log(`Issuer         : ${result.issuer}\n`);
    });
  });

task('cert:events', 'List every issuance and revocation ever logged').setAction(
  async (_args, hre) => {
    await report(async () => {
      const { contract } = await connect(hre);

      const issued = await contract.queryFilter(contract.filters.CertificateIssued());
      const revoked = await contract.queryFilter(contract.filters.CertificateRevoked());

      console.log(`\nCertificateIssued (${issued.length})`);
      issued.forEach((event) => {
        const { certificateId, studentName, issuer } = event.args;
        console.log(`  block ${event.blockNumber}  ${certificateId}  ${studentName}  by ${issuer}`);
      });

      console.log(`\nCertificateRevoked (${revoked.length})`);
      revoked.forEach((event) => {
        const { certificateId, reason, revokedBy } = event.args;
        console.log(`  block ${event.blockNumber}  ${certificateId}  "${reason}"  by ${revokedBy}`);
      });

      console.log('');
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Writes                                    */
/* -------------------------------------------------------------------------- */

task('cert:issue', 'Issue a certificate (sends a transaction, costs gas)')
  .addParam('id', 'Certificate ID')
  .addParam('student', 'Student name')
  .addParam('course', 'Course name')
  .addOptionalParam('institution', 'Institution name', 'ABC Institute')
  .addOptionalParam('date', 'Issue date as YYYY-MM-DD (defaults to today)')
  .addOptionalParam('signer', 'Index of the local account to sign with', '0')
  .setAction(async ({ id, student, course, institution, date, signer: signerIndex }, hre) => {
    await report(async () => {
      const { contract, signer } = await connect(hre, signerIndex);

      const issueDate = date
        ? Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000)
        : Math.floor(Date.now() / 1000) - 60;

      if (Number.isNaN(issueDate)) throw new Error(`Invalid date "${date}". Use YYYY-MM-DD.`);

      console.log(`\nSigning as ${signer.address}`);
      console.log('Sending transaction...');

      const tx = await contract.issueCertificate(id, student, course, institution, issueDate);
      console.log(`Transaction hash : ${tx.hash}`);
      console.log('Waiting for confirmation...');

      const receipt = await tx.wait();

      console.log(`Block number     : ${receipt.blockNumber}`);
      console.log(`Gas used         : ${receipt.gasUsed.toString()}`);
      console.log(`Status           : ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}\n`);
    });
  });

task('cert:revoke', 'Revoke a certificate (sends a transaction, costs gas)')
  .addParam('id', 'Certificate ID')
  .addOptionalParam('reason', 'Why it is being withdrawn', 'Revoked by issuer')
  .addOptionalParam('signer', 'Index of the local account to sign with', '0')
  .setAction(async ({ id, reason, signer: signerIndex }, hre) => {
    await report(async () => {
      const { contract, signer } = await connect(hre, signerIndex);

      console.log(`\nSigning as ${signer.address}`);
      console.log('Sending transaction...');

      const tx = await contract.revokeCertificate(id, reason);
      console.log(`Transaction hash : ${tx.hash}`);

      const receipt = await tx.wait();

      console.log(`Block number     : ${receipt.blockNumber}`);
      console.log(`Gas used         : ${receipt.gasUsed.toString()}`);
      console.log(`Status           : ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}\n`);
    });
  });

task('cert:grant-issuer', 'Give an address permission to issue certificates')
  .addParam('address', 'Wallet address to authorise')
  .setAction(async ({ address: account }, hre) => {
    await report(async () => {
      const { contract } = await connect(hre);
      const role = await contract.ISSUER_ROLE();

      const tx = await contract.grantRole(role, account);
      console.log(`\nTransaction hash : ${tx.hash}`);

      await tx.wait();

      console.log(`${account} is issuer : ${await contract.isIssuer(account)}\n`);
    });
  });
