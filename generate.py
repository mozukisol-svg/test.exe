#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import argparse, hashlib, json, os, time
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from config import *

# ─────────────────────────────────────────────────────────────────────────────
# PIXEL ART DRAWING PRIMITIVES
# ─────────────────────────────────────────────────────────────────────────────
S = CANVAS_SIZE  # 32

def px(img, x, y, c):
    if 0 <= x < S and 0 <= y < S:
        img.putpixel((x, y), c)

def rect(img, x1, y1, x2, y2, c, outline=None):
    d = ImageDraw.Draw(img)
    d.rectangle([x1, y1, x2, y2], fill=c)
    if outline:
        d.rectangle([x1, y1, x2, y2], outline=outline)

def hline(img, y, x1, x2, c):
    for x in range(x1, x2+1): px(img, x, y, c)

def vline(img, x, y1, y2, c):
    for y in range(y1, y2+1): px(img, x, y, c)

def oval_fill(img, cx, cy, rx, ry, c, outline=None):
    for y in range(S):
        for x in range(S):
            d = ((x-cx)/rx)**2 + ((y-cy)/ry)**2
            if d <= 1.0:
                px(img, x, y, c)
    if outline:
        for y in range(S):
            for x in range(S):
                d = ((x-cx)/rx)**2 + ((y-cy)/ry)**2
                if 0.85 <= d <= 1.15:
                    px(img, x, y, outline)

# ─────────────────────────────────────────────────────────────────────────────
# HAIR STYLES  (drawn above/on head)
# ─────────────────────────────────────────────────────────────────────────────
def hair_short(img, rng, p, hx, hy, hw):
    c = p['hair']; ol = p['outline']
    rect(img, hx, hy-3, hx+hw-1, hy, c, ol)

def hair_long(img, rng, p, hx, hy, hw):
    c = p['hair']; ol = p['outline']
    rect(img, hx, hy-4, hx+hw-1, hy, c, ol)
    vline(img, hx-1,   hy, hy+6, c)
    vline(img, hx+hw,  hy, hy+6, c)

def hair_spiky(img, rng, p, hx, hy, hw):
    c = p['hair']; ol = p['outline']
    spikes = rng.integers(3, 6)
    step = hw // spikes
    for i in range(spikes):
        sx = hx + i*step + step//2
        sh = int(rng.integers(3, 7))
        for dy in range(sh):
            px(img, sx, hy-dy, c)
        if dy > 1:
            px(img, sx-1, hy-dy+1, c)
            px(img, sx+1, hy-dy+1, c)
    rect(img, hx, hy-1, hx+hw-1, hy, c)

def hair_afro(img, rng, p, hx, hy, hw):
    c = p['hair']; ol = p['outline']
    oval_fill(img, hx+hw//2, hy-2, hw//2+2, 4, c, ol)

def hair_tophat(img, rng, p, hx, hy, hw):
    c = p['clothing']; ol = p['outline']
    brim_x1, brim_x2 = hx-2, hx+hw+1
    rect(img, brim_x1, hy-1, brim_x2, hy, c, ol)
    rect(img, hx, hy-6, hx+hw-1, hy-1, c, ol)

def hair_mohawk(img, rng, p, hx, hy, hw):
    c = p['accent']; ol = p['outline']
    mx = hx + hw//2
    for dy in range(int(rng.integers(4,8))):
        for dx in range(-1, 2):
            px(img, mx+dx, hy-dy, c)

def hair_cap(img, rng, p, hx, hy, hw):
    c = p['clothing']; ol = p['outline']
    rect(img, hx-1, hy-4, hx+hw, hy, c, ol)
    hline(img, hy, hx-3, hx+hw+2, c)

def hair_buns(img, rng, p, hx, hy, hw):
    c = p['hair']; ol = p['outline']
    oval_fill(img, hx+2,    hy-2, 3, 3, c, ol)
    oval_fill(img, hx+hw-3, hy-2, 3, 3, c, ol)

HAIR_FUNCS = [hair_short, hair_long, hair_spiky, hair_afro,
              hair_tophat, hair_mohawk, hair_cap, hair_buns]
HAIR_NAMES = ["Short","Long","Spiky","Afro","Top Hat","Mohawk","Cap","Buns"]

# ─────────────────────────────────────────────────────────────────────────────
# EYE STYLES
# ─────────────────────────────────────────────────────────────────────────────
def eyes_normal(img, p, lx, rx, ey):
    for ex in [lx, rx]:
        rect(img, ex, ey, ex+1, ey+1, p['eyes'])
        px(img, ex, ey, p['outline'])

def eyes_wide(img, p, lx, rx, ey):
    for ex in [lx, rx]:
        rect(img, ex-1, ey-1, ex+2, ey+2, p['eyes'], p['outline'])

def eyes_angry(img, p, lx, rx, ey):
    for i, ex in enumerate([lx, rx]):
        rect(img, ex, ey, ex+1, ey+1, p['eyes'])
        sign = 1 if i == 0 else -1
        hline(img, ey-1, ex, ex+1+sign, p['outline'])

def eyes_x(img, p, lx, rx, ey):
    for ex in [lx, rx]:
        px(img, ex,   ey,   p['outline'])
        px(img, ex+1, ey+1, p['outline'])
        px(img, ex+1, ey,   p['outline'])
        px(img, ex,   ey+1, p['outline'])

def eyes_star(img, p, lx, rx, ey):
    for ex in [lx, rx]:
        px(img, ex,   ey,   p['accent'])
        px(img, ex+1, ey,   p['accent'])
        px(img, ex,   ey+1, p['accent'])
        px(img, ex+1, ey+1, p['accent'])
        px(img, ex-1, ey,   p['eyes'])
        px(img, ex+2, ey,   p['eyes'])

def eyes_closed(img, p, lx, rx, ey):
    for ex in [lx, rx]:
        hline(img, ey, ex, ex+1, p['outline'])

EYE_FUNCS = [eyes_normal, eyes_wide, eyes_angry, eyes_x, eyes_star, eyes_closed]
EYE_NAMES = ["Normal","Wide","Angry","X Eyes","Star Eyes","Closed"]

# ─────────────────────────────────────────────────────────────────────────────
# MOUTH STYLES
# ─────────────────────────────────────────────────────────────────────────────
def mouth_smile(img, p, mx, my, mw):
    hline(img, my, mx, mx+mw, p['outline'])
    px(img, mx-1,  my-1, p['outline'])
    px(img, mx+mw+1, my-1, p['outline'])

def mouth_frown(img, p, mx, my, mw):
    hline(img, my, mx, mx+mw, p['outline'])
    px(img, mx-1,  my+1, p['outline'])
    px(img, mx+mw+1, my+1, p['outline'])

def mouth_open(img, p, mx, my, mw):
    rect(img, mx, my-1, mx+mw, my+1, p['accent'], p['outline'])

def mouth_teeth(img, p, mx, my, mw):
    rect(img, mx, my, mx+mw, my+1, (240,240,240), p['outline'])
    for tx in range(mx, mx+mw, 2):
        vline(img, tx+1, my, my+1, p['outline'])

def mouth_line(img, p, mx, my, mw):
    hline(img, my, mx, mx+mw, p['outline'])

MOUTH_FUNCS = [mouth_smile, mouth_frown, mouth_open, mouth_teeth, mouth_line]
MOUTH_NAMES = ["Smile","Frown","Open","Teeth","Line"]

# ─────────────────────────────────────────────────────────────────────────────
# ACCESSORIES  (drawn over character)
# ─────────────────────────────────────────────────────────────────────────────
def acc_none(img, p, cx, ey):
    pass

def acc_glasses(img, p, cx, ey):
    c = p['accent']
    for ex in [cx-4, cx+2]:
        rect(img, ex, ey-1, ex+3, ey+2, None, c)
    hline(img, ey, cx-1, cx+1, c)

def acc_monocle(img, p, cx, ey):
    rect(img, cx+2, ey-1, cx+5, ey+2, None, p['accent'])

def acc_earring(img, p, cx, ey):
    px(img, cx+8, ey+2, p['accent'])
    px(img, cx+8, ey+3, p['accent'])

def acc_scar(img, p, cx, ey):
    vline(img, cx+3, ey, ey+3, p['accent'])

def acc_tears(img, p, cx, ey):
    px(img, cx-3, ey+2, (100,180,255))
    px(img, cx-3, ey+3, (100,180,255))
    px(img, cx+5, ey+2, (100,180,255))

def acc_tattoo(img, p, cx, ey):
    rect(img, cx-7, ey+1, cx-5, ey+3, p['accent'])

ACC_FUNCS  = [acc_none, acc_glasses, acc_monocle, acc_earring, acc_scar, acc_tears, acc_tattoo]
ACC_NAMES  = ["None","Glasses","Monocle","Earring","Scar","Tears","Tattoo"]
ACC_WEIGHTS= [0.30,  0.18,     0.14,     0.12,     0.10,  0.09,   0.07]

# ─────────────────────────────────────────────────────────────────────────────
# CLOTHING
# ─────────────────────────────────────────────────────────────────────────────
def clothing_tee(img, p, cx, neck_y):
    c = p['clothing']; ol = p['outline']
    rect(img, cx-7, neck_y+2, cx+7, S-1, c, ol)

def clothing_suit(img, p, cx, neck_y):
    c = p['clothing']; ol = p['outline']
    rect(img, cx-7, neck_y+2, cx+7, S-1, c, ol)
    rect(img, cx-2, neck_y+2, cx+2, neck_y+6, (240,240,240))
    px(img, cx, neck_y+3, p['accent'])

def clothing_hoodie(img, p, cx, neck_y):
    c = p['clothing']; ol = p['outline']
    rect(img, cx-7, neck_y+2, cx+7, S-1, c, ol)
    rect(img, cx-3, neck_y+2, cx+3, neck_y+5, p['hair'])

def clothing_jacket(img, p, cx, neck_y):
    c = p['clothing']; ol = p['outline']
    rect(img, cx-7, neck_y+2, cx+7, S-1, c, ol)
    rect(img, cx-7, neck_y+2, cx-4, S-1, p['accent'], ol)
    rect(img, cx+4, neck_y+2, cx+7, S-1, p['accent'], ol)

def clothing_robe(img, p, cx, neck_y):
    c = p['accent']; ol = p['outline']
    rect(img, cx-6, neck_y+2, cx+6, S-1, c, ol)
    hline(img, neck_y+4, cx-2, cx+2, ol)

CLOTH_FUNCS = [clothing_tee, clothing_suit, clothing_hoodie, clothing_jacket, clothing_robe]
CLOTH_NAMES = ["T-Shirt","Suit","Hoodie","Jacket","Robe"]

# ─────────────────────────────────────────────────────────────────────────────
# BACKGROUND STYLES
# ─────────────────────────────────────────────────────────────────────────────
def bg_solid(img, p):
    img.paste(p['bg'], [0, 0, S, S])

def bg_gradient(img, p):
    bg = p['bg']
    acc = p['accent']
    for y in range(S):
        t = y / (S-1)
        c = tuple(int(bg[i]*(1-t) + acc[i]*t*0.4) for i in range(3))
        hline(img, y, 0, S-1, c)

def bg_dots(img, p):
    img.paste(p['bg'], [0, 0, S, S])
    for y in range(0, S, 3):
        for x in range(0, S, 3):
            px(img, x, y, tuple(min(255, c+30) for c in p['bg']))

def bg_stripes(img, p):
    for y in range(S):
        c = p['bg'] if y % 4 < 2 else tuple(max(0, c-20) for c in p['bg'])
        hline(img, y, 0, S-1, c)

def bg_vignette(img, p):
    cx2, cy2 = S//2, S//2
    for y in range(S):
        for x in range(S):
            d = ((x-cx2)/cx2)**2 + ((y-cy2)/cy2)**2
            t = min(1.0, d*0.8)
            c = tuple(int(p['bg'][i]*(1-t) + max(0,p['bg'][i]-40)*t) for i in range(3))
            px(img, x, y, c)

BG_FUNCS  = [bg_solid, bg_gradient, bg_dots, bg_stripes, bg_vignette]
BG_NAMES  = ["Solid","Gradient","Dots","Stripes","Vignette"]
BG_WEIGHTS= [0.40, 0.25, 0.15, 0.12, 0.08]


# ─────────────────────────────────────────────────────────────────────────────
# SPECIAL SKIN COLORS (rare overrides)
# ─────────────────────────────────────────────────────────────────────────────
SPECIAL_SKINS = {
    "Gold":    (255, 215, 0),
    "Alien":   (80, 255, 120),
    "Undead":  (160, 200, 140),
    "Marble":  (220, 220, 230),
    "Lava":    (255, 100, 30),
}

# ─────────────────────────────────────────────────────────────────────────────
# MAIN CHARACTER GENERATOR
# ─────────────────────────────────────────────────────────────────────────────
def generate_character(rng, palette_name):
    p  = dict(PALETTES[palette_name])

    # ── Ultra-rare: Monochrome B&W override (0.1% chance) ─────────────────
    is_monochrome = rng.random() < 0.001
    if is_monochrome:
        palette_name = "Monochrome"
        p = {"bg": (10, 10, 10),    "skin": (200, 200, 200), "outline": (0, 0, 0),
             "hair": (150, 150, 150), "eyes": (255, 255, 255),
             "clothing": (80, 80, 80), "accent": (180, 180, 180)}

    img = Image.new("RGB", (S, S), p['bg'])

    # Background
    bg_idx = int(rng.choice(len(BG_FUNCS), p=np.array(BG_WEIGHTS)/sum(BG_WEIGHTS)))
    BG_FUNCS[bg_idx](img, p)
    bg_name = BG_NAMES[bg_idx]

    # Special skin (5% chance)
    skin_name = "Normal"
    if rng.random() < 0.05:
        sk = list(SPECIAL_SKINS.keys())
        skin_name = sk[int(rng.integers(0, len(sk)))]
        p['skin'] = SPECIAL_SKINS[skin_name]

    # Head geometry
    cx  = S//2 + int(rng.integers(-2, 3))
    hy  = int(rng.integers(9, 14))    # head top y
    hw  = int(rng.integers(10, 14))   # head width
    hh  = int(rng.integers(10, 14))   # head height
    hx  = cx - hw//2                  # head left x

    # Draw head oval
    oval_fill(img, cx, hy+hh//2, hw//2, hh//2, p['skin'], p['outline'])

    # Hair
    hair_idx  = int(rng.integers(0, len(HAIR_FUNCS)))
    HAIR_FUNCS[hair_idx](img, rng, p, hx, hy, hw)
    hair_name = HAIR_NAMES[hair_idx]

    # Eyes
    eye_y  = hy + hh//3
    eye_lx = cx - hw//4 - 1
    eye_rx = cx + hw//4 - 1
    eye_idx = int(rng.integers(0, len(EYE_FUNCS)))
    EYE_FUNCS[eye_idx](img, p, eye_lx, eye_rx, eye_y)
    eye_name = EYE_NAMES[eye_idx]

    # Nose dot
    px(img, cx, hy + hh*2//3 - 1, p['outline'])

    # Mouth
    mouth_y  = hy + hh - 3
    mouth_w  = hw//3
    mouth_x  = cx - mouth_w//2
    mouth_idx = int(rng.integers(0, len(MOUTH_FUNCS)))
    MOUTH_FUNCS[mouth_idx](img, p, mouth_x, mouth_y, mouth_w)
    mouth_name = MOUTH_NAMES[mouth_idx]

    # Neck
    neck_y = hy + hh + 1
    neck_w = hw//4
    rect(img, cx-neck_w, neck_y, cx+neck_w, neck_y+2, p['skin'], p['outline'])

    # Clothing
    cloth_idx = int(rng.integers(0, len(CLOTH_FUNCS)))
    CLOTH_FUNCS[cloth_idx](img, p, cx, neck_y)
    cloth_name = CLOTH_NAMES[cloth_idx]

    # Accessory
    acc_w   = np.array(ACC_WEIGHTS, dtype=float)
    acc_w  /= acc_w.sum()
    acc_idx = int(rng.choice(len(ACC_FUNCS), p=acc_w))
    ACC_FUNCS[acc_idx](img, p, cx, eye_y)
    acc_name = ACC_NAMES[acc_idx]

    # Skull mode (18% chance, or forced on Corrupted/Ghost/Glitch/Terminal/Static)
    eerie_pals = {"Glitch", "Corrupted", "Ghost", "Terminal", "Infrared", "Static"}
    is_skull = (rng.random() < 0.18) or (palette_name in eerie_pals and rng.random() < 0.45)
    if is_skull:
        skull_face(img, p, cx, hy, hw, hh)
        eye_name  = "Skull Hollow"
        mouth_name = "Skull Grin"
    face_type = "Skull" if is_skull else "Human"

    # Glitch level for this token (0=none, 0.3=subtle, 0.7=heavy)
    glitch_levels  = [0, 0, 0.2, 0.35, 0.55, 0.75]
    glitch_weights = [0.30, 0.25, 0.20, 0.12, 0.08, 0.05]
    gw = np.array(glitch_weights); gw /= gw.sum()
    glitch_level = float(rng.choice(glitch_levels, p=gw))
    glitch_name  = ("None" if glitch_level == 0 else
                    "Subtle" if glitch_level < 0.4 else
                    "Heavy"  if glitch_level < 0.6 else "Extreme")

    traits = {
        "Background": bg_name,
        "Palette":    palette_name,
        "Face Type":  face_type,
        "Skin":       skin_name,
        "Hair":       hair_name,
        "Eyes":       eye_name,
        "Mouth":      mouth_name,
        "Clothing":   cloth_name,
        "Accessory":  acc_name,
        "Glitch":     glitch_name,
    }
    return img, traits, glitch_level

# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def token_seed(tid):
    return int(hashlib.sha256(f"{GLOBAL_SALT}::{tid}".encode()).hexdigest(), 16) % (2**31)

def img_hash(img):
    return hashlib.md5(np.array(img).tobytes()).hexdigest()

def count_pixels(img, bg_color):
    arr = np.array(img)
    bg  = np.array(bg_color)
    return int(np.sum(~np.all(arr == bg, axis=2)))

# ─────────────────────────────────────────────────────────────────────────────
# GLITCH ENGINE
# ─────────────────────────────────────────────────────────────────────────────

def glitch_32(arr32, rng):
    """Pixel-level glitch on the 32x32 array before upscale."""
    out = arr32.copy()
    H, W = out.shape[:2]
    # Row jitter: shift a few rows sideways
    for _ in range(int(rng.integers(1, 5))):
        y  = int(rng.integers(0, H))
        sh = int(rng.integers(-4, 5))
        if sh != 0:
            out[y] = np.roll(arr32[y], sh, axis=0)
    # Random colored corruption blocks
    for _ in range(int(rng.integers(1, 4))):
        bh = int(rng.integers(1, 3))
        bw = int(rng.integers(1, 6))
        by = int(rng.integers(0, max(1, H - bh)))
        bx = int(rng.integers(0, max(1, W - bw)))
        nc = tuple(int(rng.integers(0, 256)) for _ in range(3))
        out[by:by+bh, bx:bx+bw] = nc
    return out


def glitch_512(arr512, rng, intensity):
    """Fine glitch effects on the 512x512 upscaled image."""
    out = arr512.copy().astype(np.int32)
    H, W = out.shape[:2]

    # 1. Chromatic aberration — shift R right, B left
    ca = int(rng.integers(2, 10)) if intensity > 0.3 else int(rng.integers(1, 4))
    out[:, :, 0] = np.roll(out[:, :, 0],  ca, axis=1)   # red right
    out[:, :, 2] = np.roll(out[:, :, 2], -ca, axis=1)   # blue left

    # 2. Scanlines — darken every 2nd row at 512 scale
    if intensity > 0.2:
        out[::2, :] = (out[::2, :] * 0.78).astype(np.int32)

    # 3. Large row shifts (pixel-block level at 512)
    block = OUTPUT_SCALE  # 16px = one 32px pixel
    for _ in range(int(rng.integers(1, 6))):
        y   = int(rng.integers(0, H // block)) * block
        sh  = int(rng.integers(-W // 8, W // 8))
        rows = min(int(rng.integers(1, 4)) * block, H - y)
        if sh != 0:
            out[y:y+rows] = np.roll(arr512[y:y+rows].astype(np.int32), sh, axis=1)

    # 4. Corruption stripe: one full-width band of color noise
    if rng.random() < 0.6:
        sy  = int(rng.integers(0, H))
        sh2 = int(rng.integers(1, 3)) * block
        nc  = np.array([int(rng.integers(0, 256)) for _ in range(3)], dtype=np.int32)
        blend = float(rng.uniform(0.2, 0.7))
        out[sy:sy+sh2] = (out[sy:sy+sh2] * (1-blend) + nc * blend).astype(np.int32)

    # 5. Dark vignette
    Y_v, X_v = np.mgrid[0:H, 0:W]
    cx_v, cy_v = W/2, H/2
    vign = 1.0 - 0.55 * np.clip(((X_v-cx_v)/(W*0.55))**2 + ((Y_v-cy_v)/(H*0.55))**2, 0, 1)
    out = (out * vign[:, :, np.newaxis]).astype(np.int32)

    # 6. Pixel noise — random bright neon specks
    n_specks = int(rng.integers(10, 50))
    neon = [(255,0,80),(0,255,80),(255,255,0),(0,200,255),(255,80,0)]
    for _ in range(n_specks):
        ny = int(rng.integers(0, H))
        nx = int(rng.integers(0, W))
        c  = neon[int(rng.integers(0, len(neon)))]
        out[ny:ny+2, nx:nx+2] = c

    return np.clip(out, 0, 255).astype(np.uint8)


def skull_face(img, p, cx, hy, hw, hh):
    """Overwrite face features with skull-style hollow sockets and grin."""
    ol = p['outline']
    # Hollow eye sockets (large black ovals)
    eye_y  = hy + hh//3
    eye_ox = hw//4
    for ex in [cx - eye_ox, cx + eye_ox]:
        oval_fill(img, ex, eye_y, 3, 3, (0,0,0))
    # Cracks on face
    crack_x = cx + int(hw * 0.1)
    for dy in range(int(hh * 0.4)):
        px(img, crack_x + (dy%2), hy + hh//3 + dy, ol)
    # Wide toothy grin
    mouth_y = hy + hh - 3
    hline(img, mouth_y, cx - hw//3, cx + hw//3, ol)
    hline(img, mouth_y+1, cx - hw//3, cx + hw//3, ol)
    tooth_w = 2
    for tx in range(cx - hw//3 + 1, cx + hw//3 - 1, tooth_w+1):
        vline(img, tx, mouth_y, mouth_y+1, (200,200,200))
    # Nose cavity (two dots)
    px(img, cx-1, hy + hh//2, ol)
    px(img, cx+1, hy + hh//2, ol)


def voxel_shade(arr512, block=OUTPUT_SCALE):
    """Add highlight + shadow to each pixel block for voxel 3-D look."""
    out  = arr512.astype(np.int32).copy()
    H, W = out.shape[:2]
    hl   = 2   # highlight thickness px
    sh   = 3   # shadow thickness px
    for by in range(0, H, block):
        for bx in range(0, W, block):
            ey = min(by + block, H)
            ex = min(bx + block, W)
            # sample center color of this block
            cy2, cx2 = (by+ey)//2, (bx+ex)//2
            base = out[cy2, cx2].astype(np.float32)
            if base.sum() < 40:          # skip near-black bg blocks
                continue
            hi = np.clip(base * 1.45, 0, 255).astype(np.int32)
            sd = np.clip(base * 0.50, 0, 255).astype(np.int32)
            # highlight: top rows + left cols
            out[by:by+hl, bx:ex] = hi
            out[by:ey, bx:bx+hl] = hi
            # shadow: bottom rows + right cols
            out[ey-sh:ey, bx:ex] = sd
            out[by:ey, ex-sh:ex] = sd
    return np.clip(out, 0, 255).astype(np.uint8)


def monochrome_512(arr512):
    """Convert to high-contrast black & white with dramatic look."""
    gray = np.mean(arr512.astype(np.float32), axis=2)
    # Boost contrast: darks go darker, lights go brighter
    gray = np.clip((gray - 50) * 1.6, 0, 255)
    return np.stack([gray, gray, gray], axis=2).astype(np.uint8)


def save_image(img, path, rng, glitch_level, is_monochrome=False):
    """Apply voxel shading + glitch effects then save as 512×512 PNG."""
    arr32 = np.array(img)
    # Pixel-level glitch at 32px (keep subtle so character stays readable)
    if glitch_level > 0.3:
        arr32 = glitch_32(arr32, rng)
    # Scale up — NEAREST = crisp pixel edges
    big    = Image.fromarray(arr32).resize((S*OUTPUT_SCALE, S*OUTPUT_SCALE), Image.NEAREST)
    arr512 = np.array(big)
    # Voxel shading pass (always applied)
    arr512 = voxel_shade(arr512)
    # Fine glitch at 512px (cap intensity so face stays visible)
    if glitch_level > 0:
        arr512 = glitch_512(arr512, rng, intensity=min(glitch_level, 0.55))
    # Monochrome post-processing (ultra-rare B&W)
    if is_monochrome:
        arr512 = monochrome_512(arr512)
    Image.fromarray(arr512).save(path, "PNG", optimize=True)


def tier_for_count(px_count):
    for name, lo, hi, _ in RARITY_TIERS:
        if lo <= px_count < hi:
            return name
    return RARITY_TIERS[-1][0]

def build_metadata(tid, px_count, tier, traits):
    attrs = [{"trait_type": k, "value": v} for k, v in traits.items()]
    attrs += [
        {"trait_type": "Pixel Count", "value": px_count, "display_type": "number"},
        {"trait_type": "Rarity",      "value": tier},
    ]
    return {
        "name":         f"Pixelnaut #{tid}",
        "description":  DESCRIPTION,
        "image":        f"{BASE_URI}{tid}.png",
        "external_url": f"{EXTERNAL_URL}/{tid}",
        "attributes":   attrs,
    }

# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
def main():
    import hashlib  # already imported at top via config
    p = argparse.ArgumentParser()
    p.add_argument("--count", type=int, default=TOTAL_SUPPLY)
    p.add_argument("--start", type=int, default=1)
    args = p.parse_args()
    start, end = args.start, min(args.start + args.count - 1, TOTAL_SUPPLY)
    count = end - start + 1

    Path(IMAGES_DIR).mkdir(parents=True, exist_ok=True)
    Path(METADATA_DIR).mkdir(parents=True, exist_ok=True)

    print("\n" + "-"*56)
    print(f"  {COLLECTION_NAME}  |  #{start}-#{end}  ({count} tokens)")
    print("-"*56 + "\n")

    pal_names = PALETTE_NAMES
    rng_g     = np.random.default_rng(42)
    seen      = set()
    stats     = {t: 0 for t in TIER_NAMES}
    t0        = time.time()

    for tid in range(start, end+1):
        seed = token_seed(tid)
        rng  = np.random.default_rng(seed)
        pal  = pal_names[int(rng_g.integers(0, len(pal_names)))]

        for attempt in range(10):
            img, traits, glitch_level = generate_character(rng, pal)
            h = img_hash(img)
            if h not in seen:
                seen.add(h)
                break
            rng = np.random.default_rng(seed + attempt + 1)

        bg_col    = PALETTES.get(traits["Palette"], {"bg": (10,10,10)}).get("bg", (10,10,10))
        px_count  = count_pixels(img, bg_col)
        tier      = tier_for_count(px_count)
        stats[tier] += 1

        is_mono = traits["Palette"] == "Monochrome"
        save_image(img, os.path.join(IMAGES_DIR, f"{tid}.png"), rng, glitch_level, is_monochrome=is_mono)
        meta = build_metadata(tid, px_count, tier, traits)
        with open(os.path.join(METADATA_DIR, f"{tid}.json"), "w") as f:
            json.dump(meta, f, indent=2)

        done = tid - start + 1
        pct  = done / count
        bar  = "#"*int(pct*28) + "."*(28-int(pct*28))
        ela  = time.time() - t0
        eta  = (ela/done)*(count-done) if done else 0
        sys.stdout.write(
            f"\r  [{bar}] {done}/{count} | #{tid} {tier[:3].upper()} {px_count}px | ETA {eta:.0f}s ")
        sys.stdout.flush()

    ela = time.time() - t0
    print(f"\n\n  Done in {ela:.1f}s ({ela/count:.3f}s/token)\n")
    print(f"  {'Tier':<12} {'Count':>6}  {'%':>6}")
    print("  " + "-"*28)
    for t, c in stats.items():
        print(f"  {t:<12} {c:>6}  {c/count*100:>5.1f}%")

    summary = {"collection": COLLECTION_NAME, "total": TOTAL_SUPPLY,
               "generated": count,
               "tiers": {k: {"count": v, "pct": round(v/count*100, 2)}
                         for k, v in stats.items()}}
    Path("output").mkdir(exist_ok=True)
    with open("output/collection_summary.json", "w") as f:
        json.dump(summary, f, indent=2)
    print(f"\n  Images   -> {IMAGES_DIR}/")
    print(f"  Metadata -> {METADATA_DIR}/\n")

if __name__ == "__main__":
    import argparse, hashlib
    main()
