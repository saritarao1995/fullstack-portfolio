const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

const MAX_SUPPLY = 10n;
const MAX_PER_WALLET = 3n;
const MINT_PRICE = ethers.parseEther('0.01');

describe('AuroraNFT', () => {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const factory = await ethers.getContractFactory('AuroraNFT');
    const nft = await factory.deploy('Aurora', 'AUR', MAX_SUPPLY, MAX_PER_WALLET, MINT_PRICE, owner.address);

    return { nft, owner, alice, bob };
  }

  const mint = (nft, signer, quantity) =>
    nft.connect(signer).mint(quantity, { value: MINT_PRICE * quantity });

  describe('deployment', () => {
    it('sets name, symbol, caps and owner', async () => {
      const { nft, owner } = await loadFixture(deployFixture);

      expect(await nft.name()).to.equal('Aurora');
      expect(await nft.symbol()).to.equal('AUR');
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
      expect(await nft.maxPerWallet()).to.equal(MAX_PER_WALLET);
      expect(await nft.mintPrice()).to.equal(MINT_PRICE);
      expect(await nft.owner()).to.equal(owner.address);
      expect(await nft.totalSupply()).to.equal(0);
    });
  });

  describe('mint', () => {
    it('mints sequential tokens and records the wallet count', async () => {
      const { nft, alice } = await loadFixture(deployFixture);

      await expect(mint(nft, alice, 2n)).to.emit(nft, 'Transfer');

      expect(await nft.totalSupply()).to.equal(2);
      expect(await nft.ownerOf(1)).to.equal(alice.address);
      expect(await nft.ownerOf(2)).to.equal(alice.address);
      expect(await nft.mintedBy(alice.address)).to.equal(2);
      expect(await nft.balanceOf(alice.address)).to.equal(2);
    });

    it('rejects an underpaid mint', async () => {
      const { nft, alice } = await loadFixture(deployFixture);

      await expect(nft.connect(alice).mint(1, { value: MINT_PRICE - 1n }))
        .to.be.revertedWithCustomError(nft, 'InsufficientPayment')
        .withArgs(MINT_PRICE - 1n, MINT_PRICE);
    });

    it('enforces the per-wallet cap', async () => {
      const { nft, alice } = await loadFixture(deployFixture);

      await mint(nft, alice, MAX_PER_WALLET);

      await expect(mint(nft, alice, 1n))
        .to.be.revertedWithCustomError(nft, 'ExceedsWalletLimit')
        .withArgs(MAX_PER_WALLET, 1, MAX_PER_WALLET);
    });

    it('enforces max supply', async () => {
      const { nft, alice, bob } = await loadFixture(deployFixture);

      await mint(nft, alice, 3n);
      await mint(nft, bob, 3n);

      const [carol] = (await ethers.getSigners()).slice(3);
      await mint(nft, carol, 3n);

      const [dave] = (await ethers.getSigners()).slice(4);
      await expect(mint(nft, dave, 2n))
        .to.be.revertedWithCustomError(nft, 'SoldOut')
        .withArgs(1, 2);
    });

    it('rejects minting while paused', async () => {
      const { nft, alice } = await loadFixture(deployFixture);

      await nft.pause();
      await expect(mint(nft, alice, 1n)).to.be.revertedWithCustomError(nft, 'EnforcedPause');
    });

    it('returns on-chain metadata', async () => {
      const { nft, alice } = await loadFixture(deployFixture);

      await mint(nft, alice, 1n);
      const uri = await nft.tokenURI(1);

      expect(uri.startsWith('data:application/json;base64,')).to.equal(true);
    });
  });

  describe('admin', () => {
    it('lets the owner change the price and withdraw proceeds', async () => {
      const { nft, owner, alice } = await loadFixture(deployFixture);

      await mint(nft, alice, 2n);
      const before = await ethers.provider.getBalance(owner.address);

      const tx = await nft.withdraw();
      const receipt = await tx.wait();
      const gas = receipt.gasUsed * receipt.gasPrice;
      const after = await ethers.provider.getBalance(owner.address);

      expect(after).to.equal(before + MINT_PRICE * 2n - gas);
    });

    it('blocks a non-owner from withdrawing', async () => {
      const { nft, alice } = await loadFixture(deployFixture);

      await expect(nft.connect(alice).withdraw()).to.be.revertedWithCustomError(
        nft,
        'OwnableUnauthorizedAccount',
      );
    });
  });
});
