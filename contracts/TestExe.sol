// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 * ████████╗███████╗███████╗████████╗   ███████╗██╗  ██╗███████╗
 * ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝   ██╔════╝╚██╗██╔╝██╔════╝
 *    ██║   █████╗  ███████╗   ██║      █████╗   ╚███╔╝ █████╗
 *    ██║   ██╔══╝  ╚════██║   ██║      ██╔══╝   ██╔██╗ ██╔══╝
 *    ██║   ███████╗███████║   ██║   ██╗███████╗██╔╝ ██╗███████╗
 *    ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
 *
 * test.exe — 5,000 corrupted entities on Ethereum
 * A corrupted file recovered from a forgotten hard drive.
 * The system tried to render a playful memory, but the output was fractured.
 *
 * ERC-721  |  EIP-2981 Royalties  |  OpenSea compatible
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TestExe is
    ERC721,
    ERC721Enumerable,
    ERC721Pausable,
    ERC2981,
    Ownable,
    ReentrancyGuard
{
    using Strings for uint256;

    // ── Collection constants ────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY      = 5_000;
    uint256 public constant MAX_PER_WALLET  = 10;

    // ── Mint settings ───────────────────────────────────────────────────────
    // ~$1 USD at ~$2,350/ETH  — owner can adjust via setMintPrice()
    uint256 public mintPrice = 0.00043 ether;
    bool    public saleActive = false;
    bool    public revealed   = false;

    // ── Metadata ────────────────────────────────────────────────────────────
    string private _baseTokenURI;
    string private _preRevealURI;   // single placeholder shown before reveal

    // ── Per-wallet tracking ─────────────────────────────────────────────────
    mapping(address => uint256) public mintedPerWallet;

    // ── Events ──────────────────────────────────────────────────────────────
    event SaleToggled(bool active);
    event Revealed(string baseURI);
    event PriceUpdated(uint256 newPrice);
    event Withdrawn(address indexed to, uint256 amount);

    // ────────────────────────────────────────────────────────────────────────
    constructor(
        address initialOwner,
        string memory preRevealURI,
        uint96 royaltyBps          // e.g. 500 = 5 %
    )
        ERC721("test.exe", "TEXE")
        Ownable(initialOwner)
    {
        _preRevealURI = preRevealURI;
        // EIP-2981: default royalty for the whole collection
        _setDefaultRoyalty(initialOwner, royaltyBps);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // PUBLIC MINT
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Mint one or more test.exe entities.
     * @param quantity How many to mint (1–MAX_PER_WALLET per tx, subject to wallet cap).
     */
    function mint(uint256 quantity)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        require(saleActive,                                   "Sale not active");
        require(quantity > 0,                                 "quantity = 0");
        require(totalSupply() + quantity <= MAX_SUPPLY,       "Exceeds max supply");
        require(
            mintedPerWallet[msg.sender] + quantity <= MAX_PER_WALLET,
            "Exceeds wallet cap"
        );
        require(msg.value >= mintPrice * quantity,            "Insufficient ETH");

        mintedPerWallet[msg.sender] += quantity;

        for (uint256 i = 0; i < quantity; ) {
            uint256 tokenId = totalSupply() + 1;   // 1-indexed, sequential
            _safeMint(msg.sender, tokenId);
            unchecked { ++i; }
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // OWNER — TEAM / RESERVE MINT
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Reserve up to `quantity` tokens to the owner (airdrops / team).
     */
    function reserveMint(address to, uint256 quantity) external onlyOwner {
        require(totalSupply() + quantity <= MAX_SUPPLY, "Exceeds max supply");
        for (uint256 i = 0; i < quantity; ) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(to, tokenId);
            unchecked { ++i; }
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // OWNER — COLLECTION MANAGEMENT
    // ══════════════════════════════════════════════════════════════════════════

    function toggleSale() external onlyOwner {
        saleActive = !saleActive;
        emit SaleToggled(saleActive);
    }

    /**
     * @notice Update mint price. Use to keep price close to $1 USD.
     *         At $2,350/ETH → 0.00043 ether ≈ $1.
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit PriceUpdated(newPrice);
    }

    /**
     * @notice Reveal all metadata. Call after mint sells out.
     *         Cannot be called twice.
     */
    function reveal(string calldata baseURI) external onlyOwner {
        require(!revealed, "Already revealed");
        _baseTokenURI = baseURI;
        revealed = true;
        emit Revealed(baseURI);
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setPreRevealURI(string calldata uri) external onlyOwner {
        _preRevealURI = uri;
    }

    function pause()   external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ── Royalties ────────────────────────────────────────────────────────────

    /**
     * @notice Update the default royalty for the entire collection.
     * @param receiver  Royalty recipient address.
     * @param feeNumerator  Fee in basis points (e.g. 500 = 5 %).
     */
    function setDefaultRoyalty(address receiver, uint96 feeNumerator)
        external onlyOwner
    {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /**
     * @notice Override royalty for a single token.
     */
    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96  feeNumerator
    ) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    // ── ETH Withdrawal ──────────────────────────────────────────────────────

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        (bool ok, ) = payable(owner()).call{value: balance}("");
        require(ok, "Withdraw failed");
        emit Withdrawn(owner(), balance);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // METADATA
    // ══════════════════════════════════════════════════════════════════════════

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireOwned(tokenId);
        if (!revealed) {
            return _preRevealURI;
        }
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // REQUIRED OVERRIDES
    // ══════════════════════════════════════════════════════════════════════════

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable, ERC721Pausable) returns (address) {
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
        override(ERC721, ERC721Enumerable, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
