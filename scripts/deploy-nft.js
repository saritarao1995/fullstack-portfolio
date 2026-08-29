const fs = require('node:fs');
const path = require('node:path');
const hre = require('hardhat');

const { ethers, network, artifacts } = hre;

const MAX_SUPPLY = 100;
const MAX_PER_WALLET = 5;
const MINT_PRICE = ethers.parseEther('0.01');

async function main() {
  const [deployer] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();

  console.log(`\nNetwork  : ${network.name} (${chainId})`);
  console.log(`Deployer : ${deployer.address}`);

  const factory = await ethers.getContractFactory('AuroraNFT');
  const nft = await factory.deploy(
    'Aurora',
    'AUR',
    MAX_SUPPLY,
    MAX_PER_WALLET,
    MINT_PRICE,
    deployer.address,
  );

  await nft.waitForDeployment();
  const address = await nft.getAddress();
  const tx = nft.deploymentTransaction();

  console.log(`Contract : ${address}`);
  console.log(`Tx hash  : ${tx.hash}`);
  console.log(`Price    : 0.01 ETH`);
  console.log(`Supply   : ${MAX_SUPPLY}`);
  console.log(`Per wallet: ${MAX_PER_WALLET}\n`);

  const directory = path.join(__dirname, '..', 'nft-dapp', 'src', 'contracts');
  fs.mkdirSync(directory, { recursive: true });

  const addressFile = path.join(directory, 'addresses.json');
  const addresses = fs.existsSync(addressFile)
    ? JSON.parse(fs.readFileSync(addressFile, 'utf8'))
    : {};

  addresses[Number(chainId)] = { network: network.name, auroraNft: address };
  fs.writeFileSync(addressFile, `${JSON.stringify(addresses, null, 2)}\n`);

  const { abi } = artifacts.readArtifactSync('AuroraNFT');
  fs.writeFileSync(path.join(directory, 'AuroraNFT.json'), `${JSON.stringify({ abi }, null, 2)}\n`);

  console.log('Wrote nft-dapp/src/contracts/{addresses.json, AuroraNFT.json}\n');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
