# PIXELNAUTS 🟦

**5,000 unique 64×64 pixel-art NFTs on Ethereum.**
No hand-crafted traits. Rarity is driven purely by pixel count — the more pixels filled, the rarer the Pixelnaut.

> Inspired by [NORMIES](https://opensea.io/collection/normies).

---

## Rarity Tiers

| Tier | Pixel Count | Supply |
|------|------------|--------|
| Common | 100 – 900 px | ~2,000 |
| Uncommon | 900 – 1,600 px | ~1,500 |
| Rare | 1,600 – 2,400 px | ~900 |
| Epic | 2,400 – 3,200 px | ~450 |
| Legendary | 3,200 – 4,096 px | ~150 |

Each image is 64×64 internally, saved as a crisp **512×512 PNG** (8× nearest-neighbor upscale). Black pixels on white background.

---

## Project Structure

```
NFT project/
├── generate.py          ← main art + metadata generator
├── validate.py          ← pre-upload validator
├── config.py            ← all settings & rarity tiers
├── requirements.txt     ← Python deps (numpy, Pillow)
├── package.json         ← Hardhat project
├── hardhat.config.js    ← network config
├── .env.example         ← copy → .env, fill in keys
├── contracts/
│   └── Pixelnauts.sol   ← ERC-721 + EIP-2981 contract
├── scripts/
│   └── deploy.js        ← deployment script
├── test/
│   └── Pixelnauts.test.js
└── output/              ← generated (git-ignored)
    ├── images/          ← 1.png … 5000.png
    ├── metadata/        ← 1.json … 5000.json
    └── collection_summary.json
```

---

## Step 1 — Generate Art + Metadata

### Install Python deps
```bash
pip install -r requirements.txt
```

### Quick test (20 tokens)
```bash
python generate.py --count 20
```

### Full 5,000 collection
```bash
python generate.py
```

### Validate before upload
```bash
python validate.py
```

Output lands in `output/images/` and `output/metadata/`.

---

## Step 2 — Upload to IPFS

Use [Pinata](https://pinata.cloud) or [NFT.Storage](https://nft.storage):

1. Upload the entire `output/images/` folder → get `IMAGES_CID`
2. Update all metadata JSONs — replace `ipfs://YOUR_CID_HERE/` with `ipfs://IMAGES_CID/`
   ```bash
   # Quick sed replace (Linux/macOS)
   find output/metadata -name "*.json" \
     -exec sed -i 's|ipfs://YOUR_CID_HERE/|ipfs://IMAGES_CID/|g' {} +
   ```
   On Windows PowerShell:
   ```powershell
   Get-ChildItem output\metadata\*.json | ForEach-Object {
     (Get-Content $_) -replace 'ipfs://YOUR_CID_HERE/', 'ipfs://IMAGES_CID/' |
     Set-Content $_
   }
   ```
3. Upload `output/metadata/` folder → get `METADATA_CID`
4. Update `BASE_URI` in `config.py` to `ipfs://METADATA_CID/`

---

## Step 3 — Deploy Contract

### Install JS deps
```bash
npm install
```

### Copy and fill in your secrets
```bash
cp .env.example .env
# edit .env with your private key + Alchemy keys
```

### Test on Sepolia first
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Mainnet deploy
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Verify on Etherscan
```bash
npx hardhat verify --network mainnet <CONTRACT_ADDRESS> \
  "<YOUR_WALLET>" \
  "ipfs://hidden/hidden.json" \
  500
```

---

## Step 4 — Run Unit Tests

```bash
npx hardhat test
```

Expected: **18 passing** tests covering mint, caps, reveal, royalties, and withdrawal.

---

## Step 5 — Reveal

After mint sellout (or your chosen reveal date):

```solidity
// Call via Etherscan or a script:
contract.reveal("ipfs://METADATA_CID/")
```

Then call `toggleSale()` if you want to stop/pause minting.

---

## Contract Features

| Feature | Detail |
|---------|--------|
| Standard | ERC-721 + ERC721Enumerable |
| Royalties | EIP-2981 (5% default, adjustable) |
| Supply | 5,000 max |
| Mint price | 0.05 ETH (adjustable by owner) |
| Per-wallet cap | 10 |
| Reserve mint | Owner can airdrop any qty |
| Pausable | Emergency pause/unpause |
| Reveal | Pre-reveal hidden URI → reveal to IPFS |
| Withdraw | Owner pulls ETH balance |

---

## Metadata Format (OpenSea)

```json
{
  "name": "Pixelnaut #1",
  "description": "5,000 unique 64×64 pixel art characters...",
  "image": "ipfs://<CID>/1.png",
  "external_url": "https://pixelnauts.xyz/1",
  "attributes": [
    { "trait_type": "Pixel Count",   "value": 1247, "display_type": "number" },
    { "trait_type": "Pixel Density", "value": "30.4%" },
    { "trait_type": "Rarity",        "value": "Rare" }
  ]
}
```

---

## License

MIT
