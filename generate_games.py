#!/usr/bin/env python3
"""
PIXELNAUTS — Playable Game NFT Generator
=========================================
Generates 10 unique standalone HTML game NFTs.
Each is a creepy retro arcade maze where the player must find a key.
Levels get progressively harder (larger mazes, less visibility).
"""
import json, os
from pathlib import Path

GAMES_DIR  = "output/games"
META_DIR   = "output/game_metadata"
TOTAL_GAMES = 10

# ── Level configs: (maze_cols, maze_rows, vision_radius, wall_density_name) ──
LEVEL_CONFIGS = [
    (7,  7,  5, "Abandoned Lobby"),
    (9,  7,  5, "Flickering Corridor"),
    (9,  9,  4, "Server Room"),
    (11, 9,  4, "Boiler Basement"),
    (11, 11, 4, "Forgotten Archive"),
    (13, 11, 3, "Rotting Lab"),
    (13, 13, 3, "Crypt Tunnels"),
    (15, 13, 3, "Reactor Core"),
    (15, 15, 2, "The Hive"),
    (17, 15, 2, "Void Chamber"),
]

GAME_HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>PIXELNAUTS — Level {{LEVEL}} : {{LEVEL_NAME}}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;display:flex;flex-direction:column;align-items:center;
     justify-content:center;height:100vh;overflow:hidden;font-family:'Courier New',monospace}
#wrap{position:relative;image-rendering:pixelated}
canvas{display:block;image-rendering:pixelated;image-rendering:crisp-edges}
#scanlines{position:absolute;top:0;left:0;width:100%;height:100%;
  background:repeating-linear-gradient(0deg,rgba(0,0,0,.15) 0px,rgba(0,0,0,.15) 1px,transparent 1px,transparent 3px);
  pointer-events:none;z-index:2}
#crt{position:absolute;top:0;left:0;width:100%;height:100%;
  box-shadow:inset 0 0 80px rgba(0,255,60,.08);border-radius:12px;pointer-events:none;z-index:3}
#hud{color:#0f0;font-size:14px;margin-top:12px;text-align:center;text-shadow:0 0 6px #0f0;z-index:4;opacity:.85}
#title{color:#0a0;font-size:11px;margin-bottom:8px;text-shadow:0 0 4px #0a0;letter-spacing:2px;opacity:.7}
#msg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  color:#0f0;font-size:28px;text-shadow:0 0 20px #0f0,0 0 40px #0a0;
  z-index:10;display:none;text-align:center;letter-spacing:3px}
#touch{display:none;margin-top:10px;z-index:5}
#touch button{width:56px;height:56px;margin:3px;background:rgba(0,255,60,.1);
  color:#0f0;border:1px solid rgba(0,255,60,.3);border-radius:6px;font-size:22px;
  cursor:pointer;touch-action:manipulation}
@media(pointer:coarse){#touch{display:grid;grid-template-columns:1fr 1fr 1fr;justify-items:center}}
</style>
</head>
<body>
<div id="title">PIXELNAUTS /// LEVEL {{LEVEL}} — {{LEVEL_NAME}}</div>
<div id="wrap">
  <canvas id="c"></canvas>
  <div id="scanlines"></div>
  <div id="crt"></div>
  <div id="msg"></div>
</div>
<div id="hud">ARROW KEYS TO MOVE · FIND THE 🔑</div>
<div id="touch">
  <div></div><button id="bu">▲</button><div></div>
  <button id="bl">◄</button><button id="bd">▼</button><button id="br">►</button>
</div>
<script>
(function(){
// ── Seeded PRNG (mulberry32) ──
function prng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);
t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const seed={{SEED}};
const rand=prng(seed);

// ── Level config ──
const COLS={{COLS}},ROWS={{ROWS}},VIS={{VIS}};
const CELL=20;
const W=COLS*CELL,H=ROWS*CELL;
const cv=document.getElementById('c');
cv.width=W;cv.height=H;
const ctx=cv.getContext('2d');

// ── Maze generation (recursive backtracker) ──
const grid=[];
for(let y=0;y<ROWS;y++){grid[y]=[];for(let x=0;x<COLS;x++)grid[y][x]={v:false,w:[true,true,true,true]}}
const dirs=[[0,-1,0],[1,0,1],[0,1,2],[-1,0,3]];
const opp=[2,3,0,1];
function carve(cx,cy){
  grid[cy][cx].v=true;
  const d=[0,1,2,3];
  for(let i=3;i>0;i--){const j=Math.floor(rand()*(i+1));[d[i],d[j]]=[d[j],d[i]]}
  for(const di of d){
    const nx=cx+dirs[di][0],ny=cy+dirs[di][1];
    if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS&&!grid[ny][nx].v){
      grid[cy][cx].w[dirs[di][2]]=false;
      grid[ny][nx].w[opp[dirs[di][2]]]=false;
      carve(nx,ny);
    }
  }
}
carve(0,0);

// ── Place key in farthest cell from start using BFS ──
const dist=[];
for(let y=0;y<ROWS;y++){dist[y]=[];for(let x=0;x<COLS;x++)dist[y][x]=-1}
dist[0][0]=0;
const q=[[0,0]];
let far=[0,0],maxD=0;
while(q.length){
  const[cx,cy]=q.shift();
  for(let di=0;di<4;di++){
    if(grid[cy][cx].w[di])continue;
    const nx=cx+dirs[di][0],ny=cy+dirs[di][1];
    if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS&&dist[ny][nx]===-1){
      dist[ny][nx]=dist[cy][cx]+1;
      if(dist[ny][nx]>maxD){maxD=dist[ny][nx];far=[nx,ny]}
      q.push([nx,ny]);
    }
  }
}
const keyX=far[0],keyY=far[1];

// ── Player state ──
let px=0,py=0,won=false,steps=0;
let flickerT=0;

// ── Eerie decorations (random skulls, cracks, stains) ──
const decor=[];
for(let i=0;i<Math.floor(COLS*ROWS*0.15);i++){
  const dx=Math.floor(rand()*COLS),dy=Math.floor(rand()*ROWS);
  const dt=Math.floor(rand()*4); // 0=skull,1=crack,2=stain,3=eye
  if(!(dx===0&&dy===0)&&!(dx===keyX&&dy===keyY))
    decor.push({x:dx,y:dy,t:dt});
}

// ── Drawing ──
function draw(){
  flickerT++;
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,W,H);

  const flicker=0.85+Math.sin(flickerT*0.03)*0.08+Math.sin(flickerT*0.11)*0.05;

  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      const dx=x-px,dy=y-py;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d>VIS+1)continue;
      const fade=Math.max(0,1-d/(VIS+0.5));
      const alpha=fade*flicker;
      const sx=x*CELL,sy=y*CELL;

      // Floor
      const fg=Math.floor(8*alpha);
      ctx.fillStyle=`rgb(${fg},${fg+2},${fg})`;
      ctx.fillRect(sx+1,sy+1,CELL-2,CELL-2);

      // Floor tile pattern
      if((x+y)%2===0){
        const tg=Math.floor(12*alpha);
        ctx.fillStyle=`rgb(${tg},${tg+1},${tg})`;
        ctx.fillRect(sx+2,sy+2,CELL-4,CELL-4);
      }

      // Walls
      const wc=Math.floor(40*alpha);
      const wcs=`rgb(${Math.floor(wc*0.2)},${wc},${Math.floor(wc*0.3)})`;
      ctx.fillStyle=wcs;
      const c=grid[y][x];
      if(c.w[0])ctx.fillRect(sx,sy,CELL,2);   // top
      if(c.w[1])ctx.fillRect(sx+CELL-2,sy,2,CELL); // right
      if(c.w[2])ctx.fillRect(sx,sy+CELL-2,CELL,2); // bottom
      if(c.w[3])ctx.fillRect(sx,sy,2,CELL);   // left
    }
  }

  // ── Decorations ──
  for(const dc of decor){
    const dx=dc.x-px,dy=dc.y-py;
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d>VIS)continue;
    const fade=Math.max(0,1-d/(VIS+0.5))*flicker;
    const cx=dc.x*CELL+CELL/2,cy=dc.y*CELL+CELL/2;
    if(dc.t===0){ // skull
      ctx.fillStyle=`rgba(80,70,60,${fade*0.5})`;
      ctx.fillRect(cx-3,cy-2,6,5);
      ctx.fillStyle=`rgba(0,0,0,${fade*0.7})`;
      ctx.fillRect(cx-2,cy-1,2,2);ctx.fillRect(cx+1,cy-1,2,2);
    }else if(dc.t===1){ // crack
      ctx.strokeStyle=`rgba(30,40,20,${fade*0.6})`;
      ctx.beginPath();ctx.moveTo(cx-3,cy-3);ctx.lineTo(cx+2,cy+3);ctx.stroke();
    }else if(dc.t===2){ // stain
      ctx.fillStyle=`rgba(40,10,10,${fade*0.4})`;
      ctx.fillRect(cx-2,cy-1,5,3);
    }else{ // glowing eye
      const pulse=0.3+Math.sin(flickerT*0.05+dc.x*7)*0.3;
      ctx.fillStyle=`rgba(200,30,30,${fade*pulse})`;
      ctx.fillRect(cx-1,cy,3,2);
    }
  }

  // ── Key ──
  {
    const dx=keyX-px,dy=keyY-py;
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d<=VIS&&!won){
      const fade=Math.max(0,1-d/(VIS+0.5))*flicker;
      const kx=keyX*CELL+CELL/2,ky=keyY*CELL+CELL/2;
      const pulse=0.7+Math.sin(flickerT*0.08)*0.3;
      ctx.fillStyle=`rgba(255,215,0,${fade*pulse})`;
      ctx.shadowColor='rgba(255,200,0,0.6)';ctx.shadowBlur=8*fade;
      ctx.fillRect(kx-3,ky-2,3,5); // shaft
      ctx.fillRect(kx,ky-3,4,3);   // head
      ctx.fillRect(kx-3,ky+2,2,1); // teeth
      ctx.fillRect(kx-3,ky,2,1);
      ctx.shadowBlur=0;
    }
  }

  // ── Player ──
  {
    const pcx=px*CELL+CELL/2,pcy=py*CELL+CELL/2;
    // glow
    ctx.fillStyle=`rgba(0,255,80,${0.12*flicker})`;
    ctx.beginPath();ctx.arc(pcx,pcy,CELL*0.8,0,Math.PI*2);ctx.fill();
    // body
    ctx.fillStyle=`rgba(0,220,60,${0.9*flicker})`;
    ctx.fillRect(pcx-3,pcy-4,6,8);
    // head
    ctx.fillRect(pcx-2,pcy-6,4,3);
    // eyes
    ctx.fillStyle=`rgba(255,255,255,${0.9*flicker})`;
    ctx.fillRect(pcx-1,pcy-5,1,1);
    ctx.fillRect(pcx+1,pcy-5,1,1);
  }

  if(!won)requestAnimationFrame(draw);
}

// ── Input ──
function move(ddx,ddy){
  if(won)return;
  const di=ddx===0?(ddy<0?0:2):(ddx>0?1:3);
  if(!grid[py][px].w[di]){
    px+=ddx;py+=ddy;steps++;
    if(px===keyX&&py===keyY)win();
  }
}
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowUp')move(0,-1);
  else if(e.key==='ArrowDown')move(0,1);
  else if(e.key==='ArrowLeft')move(-1,0);
  else if(e.key==='ArrowRight')move(1,0);
  e.preventDefault();
});
// Touch buttons
document.getElementById('bu').onclick=()=>move(0,-1);
document.getElementById('bd').onclick=()=>move(0,1);
document.getElementById('bl').onclick=()=>move(-1,0);
document.getElementById('br').onclick=()=>move(1,0);

function win(){
  won=true;
  const msg=document.getElementById('msg');
  msg.innerHTML='🔑 KEY FOUND 🔑<br><span style="font-size:14px;opacity:.7">'+steps+' steps · Level {{LEVEL}}</span>';
  msg.style.display='block';
  // Victory flicker
  let f=0;
  const vi=setInterval(()=>{
    ctx.fillStyle=`rgba(0,255,60,${0.05+Math.sin(f*0.3)*0.05})`;
    ctx.fillRect(0,0,W,H);
    f++;if(f>120)clearInterval(vi);
  },30);
}

draw();
})();
</script>
</body>
</html>"""


def generate_game(level_num):
    """Generate a single game HTML for the given level (1-indexed)."""
    idx = level_num - 1
    cols, rows, vis, name = LEVEL_CONFIGS[idx]
    seed = 42000 + level_num * 7919  # unique prime-spaced seed

    html = GAME_HTML_TEMPLATE
    html = html.replace("{{LEVEL}}", str(level_num))
    html = html.replace("{{LEVEL_NAME}}", name)
    html = html.replace("{{SEED}}", str(seed))
    html = html.replace("{{COLS}}", str(cols))
    html = html.replace("{{ROWS}}", str(rows))
    html = html.replace("{{VIS}}", str(vis))
    return html, name, cols, rows, vis, seed


def build_game_metadata(level_num, name, cols, rows, vis):
    """Build OpenSea-compatible metadata for a game NFT."""
    return {
        "name": f"Pixelnaut Game #{level_num} — {name}",
        "description": (
            f"Level {level_num} of 10. A playable creepy retro maze game. "
            f"Navigate the darkness and find the hidden key. "
            f"Maze: {cols}x{rows}, Vision: {vis} cells. "
            "Arrow keys / tap to move. How many steps can you beat it in?"
        ),
        "image": f"ipfs://YOUR_CID_HERE/game_{level_num}_preview.png",
        "animation_url": f"ipfs://YOUR_CID_HERE/game_{level_num}.html",
        "attributes": [
            {"trait_type": "Type",       "value": "Playable Game"},
            {"trait_type": "Level",      "value": level_num, "display_type": "number"},
            {"trait_type": "Level Name", "value": name},
            {"trait_type": "Maze Size",  "value": f"{cols}x{rows}"},
            {"trait_type": "Vision",     "value": vis, "display_type": "number"},
            {"trait_type": "Rarity",     "value": "Ultra Rare"},
        ],
    }


def main():
    Path(GAMES_DIR).mkdir(parents=True, exist_ok=True)
    Path(META_DIR).mkdir(parents=True, exist_ok=True)

    print("\n" + "-" * 56)
    print("  PIXELNAUTS - Game NFT Generator")
    print("  Generating 10 playable creepy arcade maze games")
    print("-" * 56 + "\n")

    for lvl in range(1, TOTAL_GAMES + 1):
        html, name, cols, rows, vis, seed = generate_game(lvl)

        # Save HTML game
        html_path = os.path.join(GAMES_DIR, f"game_{lvl}.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)

        # Save metadata
        meta = build_game_metadata(lvl, name, cols, rows, vis)
        meta_path = os.path.join(META_DIR, f"game_{lvl}.json")
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)

        print(f"  Level {lvl:>2}/10 | {name:<22} | {cols}x{rows} maze | vision={vis} | seed={seed}")

    print(f"\n  Games    -> {GAMES_DIR}/")
    print(f"  Metadata -> {META_DIR}/\n")


if __name__ == "__main__":
    main()
