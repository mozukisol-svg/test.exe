"""
test.exe — Color Config
========================
32×32 pixel art, scaled to 512×512.
A corrupted file recovered from a forgotten hard drive.
Traits: Background, Skin, Eyes, Hair, Clothing, Accessory.
"""

COLLECTION_NAME   = "test.exe"
COLLECTION_SYMBOL = "TEXE"
TOTAL_SUPPLY      = 5_000
DESCRIPTION       = (
    "A corrupted file recovered from a forgotten hard drive. "
    "The system tried to render a playful memory, but the output was fractured. "
    "5,000 glitched entities materialized from corrupted data. "
    "Do not open. Do not mint. Do not look away."
)
EXTERNAL_URL  = "https://textexe.xyz"
CANVAS_SIZE   = 32
OUTPUT_SCALE  = 16         # 32 × 16 = 512px output
GLOBAL_SALT   = "TESTEXE_CORRUPTED_V1_2026"
OUTPUT_DIR    = "output"
IMAGES_DIR    = "output/images"
METADATA_DIR  = "output/metadata"
BASE_URI      = "ipfs://YOUR_CID_HERE/"

# ── Color Palettes (bg, skin, outline, hair, eyes, clothing, accent) ──────────
# Each is (R,G,B)
PALETTES = {
    "Cosmic":    {"bg":(18,10,40),  "skin":(180,100,220),"outline":(0,0,0),
                  "hair":(0,220,255),"eyes":(255,50,180), "clothing":(60,20,100),"accent":(255,200,50)},
    "Forest":    {"bg":(20,40,20),  "skin":(210,175,120),"outline":(0,0,0),
                  "hair":(80,40,10), "eyes":(50,200,80),  "clothing":(30,80,30), "accent":(200,160,40)},
    "Lava":      {"bg":(40,10,0),   "skin":(255,180,100),"outline":(0,0,0),
                  "hair":(200,50,0), "eyes":(255,220,0),  "clothing":(180,30,0), "accent":(255,120,0)},
    "Ocean":     {"bg":(5,20,50),   "skin":(150,220,240),"outline":(0,0,0),
                  "hair":(0,80,180), "eyes":(0,200,255),  "clothing":(10,60,120),"accent":(200,240,255)},
    "Sakura":    {"bg":(255,200,220),"skin":(255,230,230),"outline":(80,0,30),
                  "hair":(180,0,60), "eyes":(200,50,100), "clothing":(220,80,120),"accent":(255,255,200)},
    "Void":      {"bg":(10,10,10),  "skin":(200,200,200),"outline":(50,50,50),
                  "hair":(150,150,150),"eyes":(255,255,255),"clothing":(60,60,60),"accent":(180,180,180)},
    "Toxic":     {"bg":(10,50,0),   "skin":(100,255,50), "outline":(0,0,0),
                  "hair":(180,0,255),"eyes":(255,255,0),  "clothing":(0,150,0),  "accent":(0,255,100)},
    "Desert":    {"bg":(200,160,80),"skin":(240,200,140),"outline":(60,30,0),
                  "hair":(100,50,10),"eyes":(160,80,20),  "clothing":(180,100,40),"accent":(255,220,100)},
    "Arctic":    {"bg":(180,220,240),"skin":(240,248,255),"outline":(0,40,80),
                  "hair":(220,240,255),"eyes":(0,120,200),"clothing":(100,160,220),"accent":(255,255,255)},
    "Cyberpunk": {"bg":(15,15,30),  "skin":(200,180,255),"outline":(0,0,0),
                  "hair":(0,255,180),"eyes":(255,0,100),  "clothing":(50,0,100), "accent":(0,200,255)},
    "Royal":     {"bg":(10,10,60),  "skin":(220,200,160),"outline":(0,0,0),
                  "hair":(180,140,0),"eyes":(100,180,255),"clothing":(20,20,120),"accent":(220,180,0)},
    "Sunset":    {"bg":(40,10,30),  "skin":(255,180,140),"outline":(0,0,0),
                  "hair":(200,80,0), "eyes":(255,120,0),  "clothing":(180,20,80),"accent":(255,200,100)},
    "Glitch":    {"bg":(0,0,0),     "skin":(0,255,80), "outline":(0,0,0),
                  "hair":(255,0,180),"eyes":(255,255,0), "clothing":(0,100,0),  "accent":(255,0,80)},
    "Corrupted": {"bg":(10,0,0),    "skin":(180,60,60), "outline":(0,0,0),
                  "hair":(100,0,40), "eyes":(255,40,40),  "clothing":(60,0,0),   "accent":(200,0,100)},
    "Ghost":     {"bg":(5,5,20),    "skin":(180,200,230),"outline":(20,20,60),
                  "hair":(100,120,180),"eyes":(200,220,255),"clothing":(40,50,80),"accent":(150,180,255)},
    "Terminal":  {"bg":(0,10,0),    "skin":(0,180,0),   "outline":(0,0,0),
                  "hair":(0,255,0),  "eyes":(0,255,100),  "clothing":(0,80,0),   "accent":(0,255,50)},
    "Infrared":  {"bg":(5,0,0),     "skin":(220,80,40), "outline":(0,0,0),
                  "hair":(255,30,0), "eyes":(255,200,0),  "clothing":(100,0,0),  "accent":(255,120,0)},
    "Static":    {"bg":(15,15,15),  "skin":(160,160,160),"outline":(0,0,0),
                  "hair":(80,80,80), "eyes":(220,220,220),"clothing":(50,50,50), "accent":(200,200,200)},
}
PALETTE_NAMES = list(PALETTES.keys())

# ── Palette-specific descriptions for metadata ───────────────────────────────
PALETTE_DESCRIPTIONS = {
    "Cosmic":    "Recovered from sector 7G. The nebula data corrupted its form, leaving traces of distant stars in its pixels.",
    "Forest":    "Found buried in a root directory. Moss-covered memory fragments cling to its silhouette.",
    "Lava":      "Thermal overflow. This entity runs too hot — its pixels are melting at the edges.",
    "Ocean":     "Pulled from a deep-sea cache. Pressure damage has warped its features beyond recognition.",
    "Sakura":    "A soft error. The gentlest corruption — petals of broken data drift through its frame.",
    "Void":      "NULL entity. No palette data found. What you see is what the void returned.",
    "Toxic":     "Biohazard flag raised. This entity was quarantined but somehow escaped the sandbox.",
    "Desert":    "Heat death of a process. Sand-colored artifacts fill the spaces where data should be.",
    "Arctic":    "Frozen mid-render. Ice crystals formed in the buffer before the process could complete.",
    "Cyberpunk": "Neon overflow. Too many color channels, not enough memory. The future leaked in.",
    "Royal":     "Privileged access entity. It wears the crown of a corrupted admin account.",
    "Sunset":    "End-of-day process dump. The last thing the system rendered before shutdown.",
    "Glitch":    "CRITICAL ERROR. This entity IS the glitch. It shouldn't exist but here it is.",
    "Corrupted": "Total data loss. Only the anger survived the corruption.",
    "Ghost":     "Phantom process. It appears in task manager but cannot be terminated.",
    "Terminal":  "Pure command line entity. It speaks only in green text on black.",
    "Infrared":  "Heat signature anomaly. Detected by thermal scan but invisible to the naked eye.",
    "Static":    "Signal lost. This entity exists between channels, in the noise between stations.",
}

# ── Rarity Tiers (by non-bg pixel count in 32×32 = 1024 max) ─────────────────
RARITY_TIERS = [
    ("Common",    0,   350, 0.40),
    ("Uncommon",  350, 500, 0.30),
    ("Rare",      500, 650, 0.18),
    ("Epic",      650, 800, 0.09),
    ("Legendary", 800, 1024,0.03),
]
TIER_NAMES   = [t[0] for t in RARITY_TIERS]
TIER_WEIGHTS = [t[3] for t in RARITY_TIERS]

# ── Mint / Contract ───────────────────────────────────────────────────────────
MINT_PRICE_ETH = "0.00043"    # ~$1 USD at ~$2,350/ETH
MAX_PER_WALLET = 10
ROYALTY_BPS    = 500
OWNER_ADDRESS  = "0x0000000000000000000000000000000000000000"
