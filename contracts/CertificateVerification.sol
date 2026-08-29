// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title CertificateVerification
/// @notice A tamper-proof registry of academic certificates.
/// @dev Authorised issuers write certificates; anyone may read them for free.
///      Records are never deleted — withdrawing a certificate flips a `revoked`
///      flag so the full history stays auditable.
contract CertificateVerification is AccessControl {
    /* ---------------------------------------------------------------------- */
    /*                                  Roles                                   */
    /* ---------------------------------------------------------------------- */

    /// @notice Accounts allowed to issue and revoke certificates.
    /// @dev DEFAULT_ADMIN_ROLE (from AccessControl) manages who holds this role.
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    /// @dev Upper bound on every text field. Bounds the gas an issuer can burn
    ///      and keeps emitted events a sane size for off-chain indexers.
    uint256 public constant MAX_FIELD_LENGTH = 128;

    /* ---------------------------------------------------------------------- */
    /*                                  Types                                   */
    /* ---------------------------------------------------------------------- */

    /// @param certificateId     Human-readable id exactly as the issuer typed it.
    /// @param issueDate         Official date on the certificate. Supplied by the
    ///                          issuer, so it may predate the on-chain record.
    /// @param issuedAt          Block timestamp of the write. Cannot be faked.
    /// @param revoked           True once withdrawn; the record itself remains.
    /// @param exists            Distinguishes a stored record from an empty slot.
    struct Certificate {
        string certificateId;
        string studentName;
        string courseName;
        string institutionName;
        address issuer;
        uint64 issueDate;
        uint64 issuedAt;
        bool revoked;
        bool exists;
    }

    /* ---------------------------------------------------------------------- */
    /*                                 Storage                                  */
    /* ---------------------------------------------------------------------- */

    /// @dev Keyed by keccak256 of the certificate id. Hashing gives a fixed-size
    ///      key, which is far cheaper than using the raw string.
    mapping(bytes32 certificateHash => Certificate certificate) private _certificates;

    /* ---------------------------------------------------------------------- */
    /*                                  Events                                  */
    /* ---------------------------------------------------------------------- */

    event CertificateIssued(
        bytes32 indexed certificateHash,
        address indexed issuer,
        string certificateId,
        string studentName,
        string courseName,
        string institutionName,
        uint64 issueDate,
        uint64 issuedAt
    );

    event CertificateRevoked(
        bytes32 indexed certificateHash,
        address indexed revokedBy,
        string certificateId,
        string reason,
        uint64 revokedAt
    );

    /* ---------------------------------------------------------------------- */
    /*                              Custom errors                               */
    /* ---------------------------------------------------------------------- */

    error ZeroAddress();
    error EmptyCertificateId();
    error EmptyStudentName();
    error EmptyCourseName();
    error EmptyInstitutionName();
    error FieldTooLong(uint256 length, uint256 maxLength);
    error InvalidIssueDate(uint64 issueDate, uint64 currentTime);
    error CertificateAlreadyExists(bytes32 certificateHash);
    error CertificateNotFound(bytes32 certificateHash);
    error CertificateAlreadyRevoked(bytes32 certificateHash);
    error NotCertificateIssuer(address caller, address issuer);

    /* ---------------------------------------------------------------------- */
    /*                                Constructor                               */
    /* ---------------------------------------------------------------------- */

    /// @param admin Account that receives both roles. Rejecting the zero address
    ///        avoids deploying a contract nobody can ever administer.
    constructor(address admin) {
        if (admin == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    /* ---------------------------------------------------------------------- */
    /*                             Write operations                             */
    /* ---------------------------------------------------------------------- */

    /// @notice Record a new certificate on-chain.
    /// @dev Reverts if the id is already taken, so a certificate can never be
    ///      silently overwritten.
    /// @return certificateHash Storage key derived from `certificateId`.
    function issueCertificate(
        string calldata certificateId,
        string calldata studentName,
        string calldata courseName,
        string calldata institutionName,
        uint64 issueDate
    ) external onlyRole(ISSUER_ROLE) returns (bytes32 certificateHash) {
        _requireValidFields(certificateId, studentName, courseName, institutionName);

        // A future date would let an issuer post-date a certificate. Earlier
        // dates are legitimate: a 2020 degree may only be recorded today.
        if (issueDate == 0 || issueDate > block.timestamp) {
            revert InvalidIssueDate(issueDate, uint64(block.timestamp));
        }

        certificateHash = keccak256(bytes(certificateId));
        if (_certificates[certificateHash].exists) {
            revert CertificateAlreadyExists(certificateHash);
        }

        uint64 issuedAt = uint64(block.timestamp);

        _certificates[certificateHash] = Certificate({
            certificateId: certificateId,
            studentName: studentName,
            courseName: courseName,
            institutionName: institutionName,
            issuer: msg.sender,
            issueDate: issueDate,
            issuedAt: issuedAt,
            revoked: false,
            exists: true
        });

        emit CertificateIssued(
            certificateHash,
            msg.sender,
            certificateId,
            studentName,
            courseName,
            institutionName,
            issueDate,
            issuedAt
        );
    }

    /// @notice Withdraw a certificate without erasing its history.
    /// @dev Callable by the original issuer or by a default admin, so one
    ///      institute cannot revoke another institute's certificates.
    /// @param reason Free-text justification. Stored only in the event log,
    ///        which is far cheaper than contract storage.
    function revokeCertificate(string calldata certificateId, string calldata reason)
        external
        onlyRole(ISSUER_ROLE)
    {
        bytes32 certificateHash = keccak256(bytes(certificateId));
        Certificate storage certificate = _certificates[certificateHash];

        if (!certificate.exists) revert CertificateNotFound(certificateHash);
        if (certificate.revoked) revert CertificateAlreadyRevoked(certificateHash);

        address issuer = certificate.issuer;
        if (issuer != msg.sender && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert NotCertificateIssuer(msg.sender, issuer);
        }

        certificate.revoked = true;

        emit CertificateRevoked(
            certificateHash,
            msg.sender,
            certificateId,
            reason,
            uint64(block.timestamp)
        );
    }

    /* ---------------------------------------------------------------------- */
    /*                             Read operations                              */
    /* ---------------------------------------------------------------------- */

    /// @notice Public verification entry point.
    /// @dev Never reverts. An unknown id is a normal answer for a verifier, not
    ///      an error, so the UI can render "not found" without catching.
    /// @return isValid True only when the certificate exists and is not revoked.
    function verifyCertificate(string calldata certificateId)
        external
        view
        returns (
            bool isValid,
            bool exists,
            bool revoked,
            string memory studentName,
            string memory courseName,
            string memory institutionName,
            uint64 issueDate,
            uint64 issuedAt,
            address issuer
        )
    {
        Certificate storage certificate = _certificates[keccak256(bytes(certificateId))];

        exists = certificate.exists;
        if (!exists) {
            return (false, false, false, "", "", "", 0, 0, address(0));
        }

        revoked = certificate.revoked;
        isValid = !revoked;
        studentName = certificate.studentName;
        courseName = certificate.courseName;
        institutionName = certificate.institutionName;
        issueDate = certificate.issueDate;
        issuedAt = certificate.issuedAt;
        issuer = certificate.issuer;
    }

    /// @notice Fetch the full record.
    /// @dev Reverts when absent — use `verifyCertificate` for the forgiving path.
    function getCertificate(string calldata certificateId)
        external
        view
        returns (Certificate memory)
    {
        bytes32 certificateHash = keccak256(bytes(certificateId));
        Certificate memory certificate = _certificates[certificateHash];

        if (!certificate.exists) revert CertificateNotFound(certificateHash);

        return certificate;
    }

    /// @notice Whether a certificate id has ever been issued (revoked or not).
    function certificateExists(string calldata certificateId) external view returns (bool) {
        return _certificates[keccak256(bytes(certificateId))].exists;
    }

    /// @notice Whether `account` may issue and revoke certificates.
    function isIssuer(address account) external view returns (bool) {
        return hasRole(ISSUER_ROLE, account);
    }

    /// @notice Storage key for a certificate id, exposed so clients can build
    ///         event-log filters without reimplementing the hashing.
    function hashCertificateId(string calldata certificateId) external pure returns (bytes32) {
        return keccak256(bytes(certificateId));
    }

    /* ---------------------------------------------------------------------- */
    /*                                 Internal                                 */
    /* ---------------------------------------------------------------------- */

    /// @dev Rejects empty and oversized text. Empty values would produce
    ///      meaningless certificates that can never be corrected, because
    ///      on-chain records are immutable once written.
    function _requireValidFields(
        string calldata certificateId,
        string calldata studentName,
        string calldata courseName,
        string calldata institutionName
    ) private pure {
        uint256 length = bytes(certificateId).length;
        if (length == 0) revert EmptyCertificateId();
        _requireWithinLimit(length);

        length = bytes(studentName).length;
        if (length == 0) revert EmptyStudentName();
        _requireWithinLimit(length);

        length = bytes(courseName).length;
        if (length == 0) revert EmptyCourseName();
        _requireWithinLimit(length);

        length = bytes(institutionName).length;
        if (length == 0) revert EmptyInstitutionName();
        _requireWithinLimit(length);
    }

    function _requireWithinLimit(uint256 length) private pure {
        if (length > MAX_FIELD_LENGTH) revert FieldTooLong(length, MAX_FIELD_LENGTH);
    }
}
