const fs = require('node:fs');
const path = require('node:path');
const hre = require('hardhat');

const { ethers, network, artifacts } = hre;

const CONTRACT_NAME = 'CertificateVerification';
const LOCAL_CHAIN_IDS = new Set([31337]);

/** Sample record seeded on local networks so the UI has something to verify. */
const SEED_CERTIFICATE = {
  certificateId: 'CERT-1001',
  studentName: 'Rahul Sharma',
  courseName: 'Full Stack Development',
  institutionName: 'ABC Institute',
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log(`\nNetwork  : ${network.name} (chainId ${chainId})`);
  console.log(`Deployer : ${deployer.address}`);
  console.log(`Balance  : ${ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    throw new Error('Deployer has no ETH. Fund the account before deploying.');
  }

  console.log(`\nDeploying ${CONTRACT_NAME}...`);

  const factory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await factory.deploy(deployer.address);
  const deploymentTx = contract.deploymentTransaction();

  await contract.waitForDeployment();
  const receipt = await deploymentTx.wait();

  const contractAddress = await contract.getAddress();

  console.log(`\nContract address : ${contractAddress}`);
  console.log(`Transaction hash : ${deploymentTx.hash}`);
  console.log(`Block number     : ${receipt.blockNumber}`);
  console.log(`Gas used         : ${receipt.gasUsed.toString()}`);
  console.log(`Admin / issuer   : ${deployer.address}`);

  if (LOCAL_CHAIN_IDS.has(Number(chainId))) {
    await seedSampleCertificate(contract);
  }

  const deployment = {
    network: network.name,
    chainId: Number(chainId),
    contractName: CONTRACT_NAME,
    contractAddress,
    admin: deployer.address,
    transactionHash: deploymentTx.hash,
    blockNumber: receipt.blockNumber,
    deployedAt: new Date().toISOString(),
  };

  writeDeploymentRecord(deployment);
  writeFrontendArtifacts(deployment);

  console.log('\nDone.\n');
}

/** Issues one certificate so the verification page has real data to read. */
async function seedSampleCertificate(contract) {
  const issueDate = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  const tx = await contract.issueCertificate(
    SEED_CERTIFICATE.certificateId,
    SEED_CERTIFICATE.studentName,
    SEED_CERTIFICATE.courseName,
    SEED_CERTIFICATE.institutionName,
    issueDate,
  );
  const receipt = await tx.wait();

  console.log(`\nSeeded ${SEED_CERTIFICATE.certificateId} for ${SEED_CERTIFICATE.studentName}`);
  console.log(`Transaction hash : ${tx.hash}`);
  console.log(`Gas used         : ${receipt.gasUsed.toString()}`);
}

/** Deployment history, one file per network. Git-ignored. */
function writeDeploymentRecord(deployment) {
  const directory = path.join(__dirname, '..', 'deployments');
  fs.mkdirSync(directory, { recursive: true });

  const file = path.join(directory, `${deployment.network}.json`);
  fs.writeFileSync(file, `${JSON.stringify(deployment, null, 2)}\n`);

  console.log(`\nWrote ${path.relative(process.cwd(), file)}`);
}

/**
 * Hands the frontend the two things it needs to talk to the contract:
 * where it lives (address) and how to call it (ABI).
 */
function writeFrontendArtifacts(deployment) {
  const directory = path.join(__dirname, '..', 'frontend', 'src', 'contracts');
  fs.mkdirSync(directory, { recursive: true });

  const addressFile = path.join(directory, 'addresses.json');
  const addresses = fs.existsSync(addressFile)
    ? JSON.parse(fs.readFileSync(addressFile, 'utf8'))
    : {};

  addresses[deployment.chainId] = {
    network: deployment.network,
    certificateVerification: deployment.contractAddress,
  };

  fs.writeFileSync(addressFile, `${JSON.stringify(addresses, null, 2)}\n`);

  const { abi } = artifacts.readArtifactSync(CONTRACT_NAME);
  const abiFile = path.join(directory, `${CONTRACT_NAME}.json`);
  fs.writeFileSync(abiFile, `${JSON.stringify({ abi }, null, 2)}\n`);

  console.log(`Wrote ${path.relative(process.cwd(), addressFile)}`);
  console.log(`Wrote ${path.relative(process.cwd(), abiFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
