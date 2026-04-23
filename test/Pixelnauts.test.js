// test/TestExe.test.js
const { expect }        = require("chai");
const { ethers }        = require("hardhat");
const { loadFixture }   = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const PRE_REVEAL = "ipfs://hidden/hidden.json";
const ROYALTY    = 500;   // 5 %
const MINT_PRICE = ethers.parseEther("0.00043"); // ~$1 USD

async function deployFixture() {
  const [owner, alice, bob] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("TestExe");
  const contract = await Factory.deploy(owner.address, PRE_REVEAL, ROYALTY);
  await contract.waitForDeployment();
  return { contract, owner, alice, bob };
}

describe("TestExe", function () {

  // ── Deployment ────────────────────────────────────────────────────────────
  describe("Deployment", function () {
    it("sets correct name and symbol", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.name()).to.equal("test.exe");
      expect(await contract.symbol()).to.equal("TEXE");
    });

    it("owner is set correctly", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("sale is inactive by default", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.saleActive()).to.equal(false);
    });

    it("collection is unrevealed by default", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.revealed()).to.equal(false);
    });

    it("mint price is ~$1 USD", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.mintPrice()).to.equal(MINT_PRICE);
    });
  });

  // ── Minting ───────────────────────────────────────────────────────────────
  describe("Minting", function () {
    async function saleOpenFixture() {
      const f = await loadFixture(deployFixture);
      await f.contract.toggleSale();
      return f;
    }

    it("reverts when sale is closed", async function () {
      const { contract, alice } = await loadFixture(deployFixture);
      await expect(
        contract.connect(alice).mint(1, { value: MINT_PRICE })
      ).to.be.revertedWith("Sale not active");
    });

    it("mints 1 token and increments supply", async function () {
      const { contract, alice } = await loadFixture(saleOpenFixture);
      await contract.connect(alice).mint(1, { value: MINT_PRICE });
      expect(await contract.totalSupply()).to.equal(1);
      expect(await contract.ownerOf(1)).to.equal(alice.address);
    });

    it("mints up to MAX_PER_WALLET (10)", async function () {
      const { contract, alice } = await loadFixture(saleOpenFixture);
      await contract.connect(alice).mint(10, { value: MINT_PRICE * 10n });
      expect(await contract.mintedPerWallet(alice.address)).to.equal(10);
    });

    it("reverts when wallet cap exceeded", async function () {
      const { contract, alice } = await loadFixture(saleOpenFixture);
      await contract.connect(alice).mint(10, { value: MINT_PRICE * 10n });
      await expect(
        contract.connect(alice).mint(1, { value: MINT_PRICE })
      ).to.be.revertedWith("Exceeds wallet cap");
    });

    it("reverts with insufficient ETH", async function () {
      const { contract, alice } = await loadFixture(saleOpenFixture);
      await expect(
        contract.connect(alice).mint(1, { value: ethers.parseEther("0.0001") })
      ).to.be.revertedWith("Insufficient ETH");
    });

    it("owner can reserve mint without ETH", async function () {
      const { contract, owner, bob } = await loadFixture(deployFixture);
      await contract.reserveMint(bob.address, 5);
      expect(await contract.totalSupply()).to.equal(5);
    });
  });

  // ── Metadata / Reveal ─────────────────────────────────────────────────────
  describe("Metadata & Reveal", function () {
    it("returns pre-reveal URI before reveal", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      await contract.reserveMint(owner.address, 1);
      expect(await contract.tokenURI(1)).to.equal(PRE_REVEAL);
    });

    it("returns correct URI after reveal", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      await contract.reserveMint(owner.address, 1);
      await contract.reveal("ipfs://NEWCID/");
      expect(await contract.tokenURI(1)).to.equal("ipfs://NEWCID/1.json");
    });

    it("reverts reveal if called twice", async function () {
      const { contract } = await loadFixture(deployFixture);
      await contract.reveal("ipfs://NEWCID/");
      await expect(contract.reveal("ipfs://OTHER/")).to.be.revertedWith("Already revealed");
    });

    it("owner can update mint price", async function () {
      const { contract } = await loadFixture(deployFixture);
      const newPrice = ethers.parseEther("0.0005");
      await contract.setMintPrice(newPrice);
      expect(await contract.mintPrice()).to.equal(newPrice);
    });
  });

  // ── Royalties ─────────────────────────────────────────────────────────────
  describe("Royalties (EIP-2981)", function () {
    it("reports correct royalty info", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      await contract.reserveMint(owner.address, 1);
      const [receiver, amount] = await contract.royaltyInfo(1, ethers.parseEther("1"));
      expect(receiver).to.equal(owner.address);
      // 5 % of 1 ETH = 0.05 ETH
      expect(amount).to.equal(ethers.parseEther("0.05"));
    });
  });

  // ── Withdrawal ────────────────────────────────────────────────────────────
  describe("Withdrawal", function () {
    it("owner can withdraw ETH", async function () {
      const { contract, owner, alice } = await loadFixture(deployFixture);
      await contract.toggleSale();
      await contract.connect(alice).mint(1, { value: MINT_PRICE });

      const before = await ethers.provider.getBalance(owner.address);
      const tx = await contract.withdraw();
      const receipt = await tx.wait();
      const gas = receipt.gasUsed * receipt.gasPrice;
      const after = await ethers.provider.getBalance(owner.address);

      expect(after).to.be.closeTo(
        before + MINT_PRICE - gas,
        ethers.parseEther("0.001")
      );
    });

    it("non-owner cannot withdraw", async function () {
      const { contract, alice } = await loadFixture(deployFixture);
      await expect(contract.connect(alice).withdraw())
        .to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });

  // ── supportsInterface ────────────────────────────────────────────────────
  describe("Interface support", function () {
    it("supports ERC-721", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.supportsInterface("0x80ac58cd")).to.equal(true);
    });
    it("supports ERC-2981", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.supportsInterface("0x2a55205a")).to.equal(true);
    });
  });
});
