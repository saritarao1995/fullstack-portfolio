// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

/// @title AuroraNFT
/// @notice A paid ERC-721 drop with on-chain SVG art. Typical Upwork "NFT mint site" scope:
///         capped supply, per-wallet limit, pausable public mint, owner withdraw.
contract AuroraNFT is ERC721, ERC721Enumerable, Ownable, Pausable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public immutable maxSupply;
    uint256 public immutable maxPerWallet;

    uint256 public mintPrice;
    uint256 private _nextTokenId = 1;

    mapping(address minter => uint256 minted) public mintedBy;

    error SoldOut(uint256 remaining, uint256 requested);
    error ExceedsWalletLimit(uint256 alreadyMinted, uint256 requested, uint256 maxPerWallet);
    error InsufficientPayment(uint256 sent, uint256 required);
    error ZeroQuantity();
    error NothingToWithdraw();

    event MintPriceUpdated(uint256 previousPrice, uint256 newPrice);
    event Withdrawal(address indexed to, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        uint256 maxPerWallet_,
        uint256 mintPrice_,
        address owner_
    ) ERC721(name_, symbol_) Ownable(owner_) {
        if (owner_ == address(0) || maxSupply_ == 0 || maxPerWallet_ == 0) {
            revert ZeroQuantity();
        }

        maxSupply = maxSupply_;
        maxPerWallet = maxPerWallet_;
        mintPrice = mintPrice_;
    }

    function mint(uint256 quantity) external payable whenNotPaused nonReentrant {
        if (quantity == 0) revert ZeroQuantity();

        uint256 remaining = maxSupply - totalSupply();
        if (quantity > remaining) revert SoldOut(remaining, quantity);

        uint256 alreadyMinted = mintedBy[msg.sender];
        if (alreadyMinted + quantity > maxPerWallet) {
            revert ExceedsWalletLimit(alreadyMinted, quantity, maxPerWallet);
        }

        uint256 required = mintPrice * quantity;
        if (msg.value < required) revert InsufficientPayment(msg.value, required);

        mintedBy[msg.sender] = alreadyMinted + quantity;

        for (uint256 i = 0; i < quantity; ++i) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
        }
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        uint256 previous = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(previous, newPrice);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 amount = address(this).balance;
        if (amount == 0) revert NothingToWithdraw();

        (bool ok, ) = payable(owner()).call{value: amount}("");
        if (!ok) revert NothingToWithdraw();

        emit Withdrawal(owner(), amount);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        bytes32 seed = keccak256(abi.encodePacked(address(this), tokenId));
        string memory colorA = _hexColor(seed);
        string memory colorB = _hexColor(keccak256(abi.encodePacked(seed)));

        string memory svg = string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
            '<stop offset="0%" stop-color="#',
            colorA,
            '"/><stop offset="100%" stop-color="#',
            colorB,
            '"/></linearGradient></defs>',
            '<rect width="400" height="400" fill="url(#g)"/>',
            '<text x="50%" y="46%" text-anchor="middle" fill="white" font-size="28" font-family="monospace">AURORA</text>',
            '<text x="50%" y="58%" text-anchor="middle" fill="white" font-size="42" font-family="monospace">#',
            tokenId.toString(),
            '</text></svg>'
        );

        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name":"Aurora #',
                    tokenId.toString(),
                    '","description":"On-chain generative NFT. Art lives in the contract, not on IPFS.",',
                    '"attributes":[{"trait_type":"Token ID","value":"',
                    tokenId.toString(),
                    '"}],',
                    '"image":"data:image/svg+xml;base64,',
                    Base64.encode(bytes(svg)),
                    '"}'
                )
            )
        );

        return string.concat("data:application/json;base64,", json);
    }

    function remainingSupply() external view returns (uint256) {
        return maxSupply - totalSupply();
    }

    function _hexColor(bytes32 seed) private pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory out = new bytes(6);

        for (uint256 i = 0; i < 6; ++i) {
            out[i] = hexChars[uint8(seed[i]) & 15];
        }

        return string(out);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
