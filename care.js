// ===== CARE HANDLER JS =====

// Static bg + glitch + cursor (shared)
(function(){
  const sBg=document.getElementById('staticBg');if(!sBg)return;
  const sCtx=sBg.getContext('2d');
  function resize(){sBg.width=window.innerWidth;sBg.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);
  function draw(){const w=sBg.width,h=sBg.height,id=sCtx.createImageData(w,h),d=id.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255;d[i]=v*.15;d[i+1]=v*.5;d[i+2]=v*.1;d[i+3]=255}sCtx.putImageData(id,0,0);requestAnimationFrame(draw)}
  draw();
})();
(function(){
  const ov=document.getElementById('glitchOverlay');if(!ov)return;
  function trigger(){ov.innerHTML='';const n=3+Math.floor(Math.random()*5);for(let i=0;i<n;i++){const bar=document.createElement('div'),top=Math.random()*100,h=1+Math.random()*8,s=(Math.random()-.5)*30;bar.style.cssText=`position:absolute;top:${top}%;left:0;right:0;height:${h}px;background:rgba(0,255,65,0.06);transform:translateX(${s}px)`;ov.appendChild(bar)}ov.classList.add('active');setTimeout(()=>{ov.classList.remove('active');ov.innerHTML=''},100);setTimeout(trigger,3000+Math.random()*8000)}
  setTimeout(trigger,2000);
})();
(function(){
  const dot=document.getElementById('cursorDot');if(!dot)return;
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  function tick(){cx+=(mx-cx)*.85;cy+=(my-cy)*.85;dot.style.left=cx+'px';dot.style.top=cy+'px';requestAnimationFrame(tick)}
  tick();
})();
// Particles
(function(){
  const container=document.getElementById('particleContainer');if(!container)return;
  const colors=['#00ff41','#00cc33','#006622','#00ff80','#003311','#88ffaa'];
  document.addEventListener('mousedown',e=>{
    const count=6+Math.floor(Math.random()*4);
    for(let i=0;i<count;i++){const p=document.createElement('div');p.className='click-particle';const sz=3+Math.floor(Math.random()*5);p.style.width=sz+'px';p.style.height=sz+'px';p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];container.appendChild(p);const vx=(Math.random()-.5)*12,vy0=-Math.random()*8-2;let x=0,y=0,vyC=vy0,op=1;function anim(){x+=vx;vyC+=.4;y+=vyC;op-=.025;if(op<=0){p.remove();return}p.style.transform=`translate(${x}px,${y}px)`;p.style.opacity=op;requestAnimationFrame(anim)}requestAnimationFrame(anim)}
  });
})();

// ===== ENTITY DATA =====
const ENTITIES = [
  {name:'DATA FIEND',desc:'Feeds on corrupted files.',seed:420},
  {name:'NEON WRAITH',desc:'Cries when left alone.',seed:877},
  {name:'PIXEL PHANTOM',desc:'Won\'t stop staring.',seed:1654},
  {name:'TOXIC SHADE',desc:'Eats everything.',seed:2431},
  {name:'CRIMSON DRIFTER',desc:'Sleeps too much.',seed:3208},
  {name:'GHOST BYTE',desc:'Afraid of the dark.',seed:3985},
  {name:'CYBER HUSK',desc:'Hates water.',seed:4762},
  {name:'GLITCH BORN',desc:'Talks to walls.',seed:5539}
];

const params = new URLSearchParams(window.location.search);
const entityId = parseInt(params.get('id')) || 0;
const entity = ENTITIES[entityId] || ENTITIES[0];

// ===== GENERATE ENTITY ART =====
const S=32,SC=16,O=S*SC;
const cv=document.getElementById('careCanvas'),ctx=cv.getContext('2d');
// Horror palettes (Uncommon)
const PALS={
  Cosmic:{bg:[18,10,40],skin:[180,100,220],outline:[0,0,0],hair:[0,220,255],eyes:[255,50,180],clothing:[60,20,100],accent:[255,200,50]},
  Forest:{bg:[20,40,20],skin:[210,175,120],outline:[0,0,0],hair:[80,40,10],eyes:[50,200,80],clothing:[30,80,30],accent:[200,160,40]},
  Lava:{bg:[40,10,0],skin:[255,180,100],outline:[0,0,0],hair:[200,50,0],eyes:[255,220,0],clothing:[180,30,0],accent:[255,120,0]},
  Ocean:{bg:[5,20,50],skin:[150,220,240],outline:[0,0,0],hair:[0,80,180],eyes:[0,200,255],clothing:[10,60,120],accent:[200,240,255]},
  Toxic:{bg:[10,50,0],skin:[100,255,50],outline:[0,0,0],hair:[180,0,255],eyes:[255,255,0],clothing:[0,150,0],accent:[0,255,100]},
  Cyberpunk:{bg:[15,15,30],skin:[200,180,255],outline:[0,0,0],hair:[0,255,180],eyes:[255,0,100],clothing:[50,0,100],accent:[0,200,255]},
  Glitch:{bg:[0,0,0],skin:[0,255,80],outline:[0,0,0],hair:[255,0,180],eyes:[255,255,0],clothing:[0,100,0],accent:[255,0,80]},
  Terminal:{bg:[0,10,0],skin:[0,180,0],outline:[0,0,0],hair:[0,255,0],eyes:[0,255,100],clothing:[0,80,0],accent:[0,255,50]},
  Corrupted:{bg:[10,0,0],skin:[180,60,60],outline:[0,0,0],hair:[100,0,40],eyes:[255,40,40],clothing:[60,0,0],accent:[200,0,100]},
  Ghost:{bg:[5,5,20],skin:[180,200,230],outline:[20,20,60],hair:[100,120,180],eyes:[200,220,255],clothing:[40,50,80],accent:[150,180,255]},
};
// Vivid palettes — NES egg-character style (Common)
const VPALS={
  // Mario-style: red cap, orange skin, red+brown checker
  Scarlet:{bg:[248,248,248],skin:[220,140,60],outline:[40,0,0],hair:[200,20,20],eyes:[20,0,0],clothing:[200,20,20],accent:[160,60,0]},
  // Link-style: green cap, tan skin, green+tan checker
  Verdant:{bg:[240,252,220],skin:[220,185,110],outline:[0,50,0],hair:[20,120,20],eyes:[0,30,0],clothing:[20,120,20],accent:[160,140,60]},
  // Blue knight: blue cap, tan skin, blue+light checker
  Azure:{bg:[230,240,255],skin:[220,185,110],outline:[0,0,60],hair:[20,80,200],eyes:[0,20,80],clothing:[20,100,210],accent:[80,140,230]},
  // Gold hero: yellow cap, tan skin, gold+amber checker
  Goldenrod:{bg:[255,252,210],skin:[230,190,120],outline:[60,30,0],hair:[200,140,0],eyes:[40,20,0],clothing:[200,140,0],accent:[240,200,60]},
  // Purple mage: purple cap, light skin, purple+lavender checker
  Amethyst:{bg:[240,230,255],skin:[220,180,120],outline:[40,0,60],hair:[120,20,180],eyes:[40,0,60],clothing:[120,20,180],accent:[180,100,230]},
  // Teal ranger: teal cap, tan skin, teal+cyan checker
  Teal:{bg:[220,248,248],skin:[220,180,120],outline:[0,50,50],hair:[0,140,140],eyes:[0,40,40],clothing:[0,140,140],accent:[80,210,210]},
  // Rose: pink cap, peach skin, pink+light checker
  Rose:{bg:[255,235,240],skin:[240,195,170],outline:[80,0,40],hair:[220,50,100],eyes:[70,0,30],clothing:[220,50,100],accent:[255,150,180]},
  // Earth: brown cap, dark skin, brown+tan checker
  Earthen:{bg:[240,230,210],skin:[200,155,90],outline:[50,25,0],hair:[100,55,15],eyes:[40,20,0],clothing:[110,60,15],accent:[180,130,65]},
};
const MONO_P={bg:[10,10,10],skin:[200,200,200],outline:[0,0,0],hair:[150,150,150],eyes:[255,255,255],clothing:[80,80,80],accent:[180,180,180]};
// Type weights: BUDDY=60% BESTFRIEND=30% MONSTER=10%
const ART_STYLES=['BUDDY','BUDDY','BUDDY','BUDDY','BUDDY','BUDDY','BESTFRIEND','BESTFRIEND','BESTFRIEND','MONSTER'];

const vpn=Object.keys(VPALS),pn=Object.keys(PALS);
let rs=entity.seed;
function rng(){rs^=rs<<13;rs^=rs>>17;rs^=rs<<5;return(rs>>>0)/4294967296}
function ri(a,b){return a+Math.floor(rng()*(b-a))}
function rc(a){return a[Math.floor(rng()*a.length)]}

// Pick art style seeded per entity
let rsSave=rs;
// Force BESTFRIEND art style so anyone can test the care handler
const artStyle = 'BESTFRIEND';
rs=rsSave;


// ── NES egg-character (Vivid / Common) ───────────────────────────────────────
function buildVividEntity(p){
  rs=entity.seed; // reset so traits are consistent per entity
  const buf=new Uint8Array(S*S*3);
  function bpx(x,y,c){if(x>=0&&x<S&&y>=0&&y<S){const i=(y*S+x)*3;buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2]}}
  const CX=16,CY=18,RX=12,RY=13,CAP_Y=14,FACE_Y=21;
  const hat=ri(0,5),eye=ri(0,5),mouth=ri(0,5),pat=ri(0,4),acc=ri(0,5),bgPat=ri(0,6);
  function drawBg(x,y){if(bgPat===1){const t=y/S;return p.bg.map(v=>Math.min(255,Math.floor(v*(1-t*.5)+255*t*.15)));}
    if(bgPat===2){return Math.sin(x*13.7+y*7.3)>.97?[255,240,180]:p.bg;}
    if(bgPat===3){return ((x+y)%6<3)?p.bg:p.bg.map(v=>Math.max(0,v-35));}
    if(bgPat===4){return (x%5<1&&y%5<1)?p.bg.map(v=>Math.min(255,v+80)):p.bg;}
    if(bgPat===5){return ((Math.floor(x/4)+Math.floor(y/4))%2)?p.bg:p.bg.map(v=>Math.max(0,v-25));}
    return p.bg;}
  // Main egg
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const dx=x-CX,dy=y-CY,d=(dx/RX)**2+(dy/RY)**2;
    if(d>1){bpx(x,y,drawBg(x,y));continue}
    if(d>=0.87){bpx(x,y,p.outline);continue}
    if(y<CAP_Y){bpx(x,y,(hat===1||hat===4)?p.skin:p.hair);continue}
    if(y<FACE_Y){bpx(x,y,p.skin);continue}
    const ck=pat===0?(Math.floor((x-CX+RX)/3)+Math.floor((y-FACE_Y)/3))%2:pat===1?Math.floor((x-CX+RX)/3)%2:pat===2?Math.floor((y-FACE_Y)/3)%2:0;
    bpx(x,y,ck?p.clothing:p.accent);
  }
  // Hat extras
  const dyB=CAP_Y-CY,bW=Math.round(RX*Math.sqrt(Math.max(0,1-(dyB/RY)**2)));
  if(hat===0){for(let x=CX-bW-2;x<=CX+bW+2;x++)bpx(x,CAP_Y,p.hair);bpx(CX-bW-3,CAP_Y,p.outline);bpx(CX+bW+3,CAP_Y,p.outline);}// Cap brim
  else if(hat===1){for(const sx of[CX-4,CX,CX+4])for(let dy=5;dy<=7;dy++)bpx(sx,dy,p.hair);for(let x=CX-5;x<=CX+5;x++)bpx(x,8,p.hair);}// Crown
  else if(hat===2){bpx(CX,3,p.hair);for(let i=1;i<=3;i++){bpx(CX-i,3+i,p.hair);bpx(CX+i,3+i,p.hair);}for(let x=CX-bW-2;x<=CX+bW+2;x++)bpx(x,CAP_Y,p.hair);}// Wizard
  else if(hat===3){for(let x=CX-bW;x<=CX+bW;x++)bpx(x,CAP_Y,p.hair);}// Helmet(no brim)
  else{bpx(CX,5,p.hair);bpx(CX-1,6,p.hair);bpx(CX+1,6,p.hair);}// Bare tuft
  // Eyes
  const eY=17,eLX=CX-5,eRX=CX+2;
  if(eye===0){for(const ex of[eLX,eRX]){for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)bpx(ex+dx,eY+dy,p.outline);bpx(ex+1,eY,p.bg);}}
  else if(eye===1){for(const ex of[eLX,eRX]){for(let dy=-1;dy<3;dy++)for(let dx=-1;dx<3;dx++)bpx(ex+dx,eY+dy,p.outline);bpx(ex,eY,p.bg);bpx(ex,eY+1,p.bg);}}
  else if(eye===2){for(const ex of[eLX,eRX]){for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)bpx(ex+dx,eY+dy,p.outline);}bpx(eLX,eY-1,p.outline);bpx(eLX+1,eY-2,p.outline);bpx(eRX+1,eY-1,p.outline);bpx(eRX,eY-2,p.outline);}
  else if(eye===3){for(const ex of[eLX+1,eRX+1]){for(const [dx,dy] of[[0,-1],[0,1],[-1,0],[1,0],[0,0]])bpx(ex+dx,eY+dy,p.accent);}}
  else{for(const ex of[eLX,eRX])for(let dx=0;dx<2;dx++)bpx(ex+dx,eY+1,p.outline);}
  // Nose
  bpx(CX,18,p.outline);
  // Mouth
  const mY=FACE_Y-1;
  if(mouth===0){for(let x=CX-2;x<=CX+2;x++)bpx(x,mY,p.outline);bpx(CX-3,mY-1,p.outline);bpx(CX+3,mY-1,p.outline);}// Smile
  else if(mouth===1){for(let x=CX-2;x<=CX+2;x++)bpx(x,mY-1,p.outline);bpx(CX-3,mY,p.outline);bpx(CX+3,mY,p.outline);}// Frown
  else if(mouth===2){for(let x=CX-2;x<=CX+2;x++){bpx(x,mY,p.outline);bpx(x,mY-2,p.outline);}bpx(CX-2,mY-1,p.outline);bpx(CX+2,mY-1,p.outline);for(let x=CX-1;x<=CX+1;x++)bpx(x,mY-1,p.accent);}// Open
  else if(mouth===3){for(let x=CX-3;x<=CX+3;x++)bpx(x,mY,p.outline);for(let x=CX-2;x<=CX+2;x++)bpx(x,mY-1,[240,240,240]);bpx(CX-1,mY-1,p.outline);bpx(CX+1,mY-1,p.outline);}// Grin
  else{for(let x=CX-2;x<=CX+2;x++)bpx(x,mY,p.outline);}// Line
  // Accessory
  if(acc===1){for(const ex of[eLX,eRX]){bpx(ex-1,eY-1,p.outline);bpx(ex+2,eY-1,p.outline);bpx(ex-1,eY+2,p.outline);bpx(ex+2,eY+2,p.outline);bpx(ex-1,eY,p.outline);bpx(ex-1,eY+1,p.outline);bpx(ex+2,eY,p.outline);bpx(ex+2,eY+1,p.outline);}bpx(eLX+2,eY,p.outline);bpx(eLX+2,eY+1,p.outline);}// Glasses
  else if(acc===2){for(let x=CX-3;x<=CX+3;x++)bpx(x,19,p.outline);bpx(CX-4,18,p.outline);bpx(CX+4,18,p.outline);}// Mustache
  else if(acc===3){bpx(eLX-1,eY+3,p.outline);bpx(eLX,eY+4,p.outline);bpx(eRX+2,eY+3,p.outline);bpx(eRX+1,eY+4,p.outline);}// Freckles
  else if(acc===4){bpx(eRX+3,eY+2,p.accent);bpx(eRX+4,eY+1,p.accent);bpx(eRX+4,eY+3,p.accent);}// Star cheek
  // Upscale + voxel shade (same texture as Uncommon)
  const id=new ImageData(O,O);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=buf[si],g=buf[si+1],b=buf[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
  // Voxel shading: highlight top+left, shadow bottom+right of each pixel block
  for(let by=0;by<O;by+=SC)for(let bx=0;bx<O;bx+=SC){const c2=((by+SC/2)*O+(bx+SC/2))*4;const br=id.data[c2],bg2=id.data[c2+1],bb=id.data[c2+2];if(br+bg2+bb<30)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=0;dy<SC;dy++)for(let dx=0;dx<2;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=SC-3;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}for(let dy=0;dy<SC;dy++)for(let dx=SC-3;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}}
  const off=document.createElement('canvas');off.width=O;off.height=O;
  off.getContext('2d').putImageData(id,0,0);return off;
}

// ── Grim-Reaper / Rare (Monochrome) ──────────────────────────────────────────
function buildRareEntity(p){
  rs=entity.seed;
  const buf=new Uint8Array(S*S*3);
  function bpx(x,y,c){if(x>=0&&x<S&&y>=0&&y<S){const i=(y*S+x)*3;buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2]}}
  const DK=[8,8,8],MD=[80,80,80],LT=[170,170,170],WH=[230,230,230],CX=16;
  const hood=ri(0,5),skull=ri(0,5),robe=ri(0,4),weapon=ri(0,5),sigil=ri(0,5);
  // BG: dark with starfield or fog
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const v=8+Math.floor(Math.sin(x*.7+y*.5)*4);bpx(x,y,[v,v,v]);}
  if(skull<3)for(let y=0;y<S;y+=4)for(let x=0;x<S;x+=5){const sv=Math.sin(x*7.3+y*13.7);if(sv>.82){const bv=30+Math.floor(sv*50);bpx(x,y,[bv,bv,bv]);}}
  // Hood
  for(let y=0;y<13;y++)for(let x=0;x<S;x++){const dx=x-CX,dy=y-8,d=(dx/9)**2+(dy/7)**2;if(d<1)bpx(x,y,DK);else if(d<1.18)bpx(x,y,MD);}
  if(hood===0){bpx(CX,1,MD);bpx(CX,2,DK);} // pointed
  else if(hood===2){for(let x=8;x<24;x+=3)bpx(x,12,DK);} // tattered bottom
  else if(hood===3){for(const cx2 of[CX-3,CX,CX+3])for(let dy=0;dy<3;dy++)bpx(cx2,dy+1,MD);} // crown
  else if(hood===4){bpx(CX-3,1,MD);bpx(CX+3,1,MD);bpx(CX-3,2,DK);bpx(CX+3,2,DK);} // twin-peak
  // Skull face (y 11-18)
  const fY=11;
  for(let y=fY;y<fY+8;y++)for(let x=0;x<S;x++){const dx=x-CX,dy=y-fY-4,d=(dx/5)**2+(dy/4)**2;if(d<1)bpx(x,y,WH);else if(d<1.2)bpx(x,y,LT);}
  for(const ex of[CX-2,CX+2])for(let dy=0;dy<2;dy++)for(let dx=-1;dx<=1;dx++)bpx(ex+dx,fY+2+dy,DK); // eye sockets
  bpx(CX-1,fY+5,DK);bpx(CX+1,fY+5,DK); // nose
  for(let x=CX-3;x<=CX+3;x++)bpx(x,fY+6,DK); // teeth line
  for(let x=CX-2;x<=CX+2;x+=2)bpx(x,fY+7,WH); // tooth whites
  if(skull===1){bpx(CX+1,fY,DK);bpx(CX+2,fY+1,DK);bpx(CX+1,fY+2,DK);} // crack
  else if(skull===3){for(let i=0;i<4;i++){bpx(CX-4-i,fY-i,MD);bpx(CX+4+i,fY-i,MD);}} // horns
  else if(skull===4){for(let i=-3;i<=3;i++)bpx(CX+i,fY-1,MD);for(const cx2 of[CX-2,CX,CX+2])bpx(cx2,fY-2,WH);} // crown
  // Robe body
  for(let y=19;y<S;y++){const sp=Math.floor((y-19)*.55),x1=Math.max(0,8-sp),x2=Math.min(S-1,23+sp);for(let x=x1;x<=x2;x++)bpx(x,y,DK);if(robe===0){bpx(x1,y,MD);bpx(x2,y,MD);}else if(robe===1&&y%3===0){bpx(x1+2,y,MD);bpx(x2-2,y,MD);}else if(robe===3&&(y-19)%3===0)for(let x=x1+2;x<=x2-2;x+=3)bpx(x,y,MD);}
  // Weapon
  if(weapon===1){for(let y=8;y<28;y++)bpx(25,y,MD);for(let i=0;i<5;i++){bpx(25-i,8+i,LT);bpx(24-i,8+i,MD);}} // scythe
  else if(weapon===2){for(let y=19;y<25;y++)for(let x=6;x<10;x++)bpx(x,y,MD);bpx(8,18,MD);bpx(8,19,WH);bpx(8,20,WH);} // lantern
  else if(weapon===3){for(let y=18;y<25;y++){const w=Math.abs(y-21);for(let x=6-w;x<=9+w;x++)bpx(x,y,MD);}} // hourglass
  else if(weapon===4){for(let y=5;y<28;y++)bpx(24,y,MD);for(const dx of[-1,0,1])bpx(24+dx,5,WH);} // staff
  // Sigil on robe
  const siX=CX,siY=24;
  if(sigil===1){for(const[dx,dy]of[[0,0],[0,-1],[0,1],[-1,0],[1,0]])bpx(siX+dx,siY+dy,MD);bpx(siX,siY,WH);} // eye
  else if(sigil===2){bpx(siX,siY-1,MD);bpx(siX,siY,MD);bpx(siX,siY+1,MD);bpx(siX-1,siY,MD);bpx(siX+1,siY,MD);} // cross rune
  else if(sigil===3){for(let d=0;d<3;d++){bpx(siX-1+d,siY-1+d,LT);bpx(siX+1-d,siY-1+d,LT);}} // X
  else if(sigil===4){for(const[dx,dy]of[[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]])bpx(siX+dx,siY+dy,LT);bpx(siX,siY,WH);} // star
  // Upscale + high-contrast B&W + voxel shade
  const id=new ImageData(O,O);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=buf[si],g=buf[si+1],b=buf[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
  for(let i=0;i<id.data.length;i+=4){const v=Math.min(255,Math.max(0,((id.data[i]+id.data[i+1]+id.data[i+2])/3-30)*1.9));id.data[i]=id.data[i+1]=id.data[i+2]=v}
  for(let by=0;by<O;by+=SC)for(let bx=0;bx<O;bx+=SC){const c2=((by+SC/2)*O+(bx+SC/2))*4;const br=id.data[c2];if(br<10)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=id.data[i+1]=id.data[i+2]=Math.min(255,br*1.5)}for(let dy=SC-3;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=id.data[i+1]=id.data[i+2]=br*.4}}
  const off=document.createElement('canvas');off.width=O;off.height=O;
  off.getContext('2d').putImageData(id,0,0);return off;
}

// ── Horror / Mono floating-head character ─────────────────────────────────────
function buildHorrorEntity(p){
  const buf=new Uint8Array(S*S*3);
  function bpx(x,y,c){if(x>=0&&x<S&&y>=0&&y<S){const i=(y*S+x)*3;buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2]}}
  function brect(x1,y1,x2,y2,c,o){for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(c)bpx(x,y,c);if(o){for(let x=x1;x<=x2;x++){bpx(x,y1,o);bpx(x,y2,o)}for(let y=y1;y<=y2;y++){bpx(x1,y,o);bpx(x2,y,o)}}}
  function bhl(y,x1,x2,c){for(let x=x1;x<=x2;x++)bpx(x,y,c)}
  function bvl(x,y1,y2,c){for(let y=y1;y<=y2;y++)bpx(x,y,c)}
  function bov(a,b,rx,ry,c,o){for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d<=1)bpx(x,y,c)};if(o)for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d>=.85&&d<=1.15)bpx(x,y,o)}}
  rs=entity.seed;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++)bpx(x,y,p.bg);
  const cx2=S/2+ri(-2,3),hy=ri(9,14),hw=ri(10,14),hh=ri(10,14);
  bov(cx2,hy+Math.floor(hh/2),Math.floor(hw/2),Math.floor(hh/2),p.skin,p.outline);
  const hx=cx2-Math.floor(hw/2),hi2=ri(0,6);
  if(hi2===0)brect(hx,hy-3,hx+hw-1,hy,p.hair,p.outline);
  else if(hi2===1){brect(hx,hy-4,hx+hw-1,hy,p.hair,p.outline);bvl(hx-1,hy,hy+6,p.hair);bvl(hx+hw,hy,hy+6,p.hair)}
  else if(hi2===2){for(let i=0;i<ri(3,6);i++){const sx=hx+i*Math.floor(hw/4)+2;for(let dy=0;dy<ri(3,7);dy++)bpx(sx,hy-dy,p.hair)}brect(hx,hy-1,hx+hw-1,hy,p.hair)}
  else if(hi2===3){const mx2=hx+Math.floor(hw/2);for(let dy=0;dy<ri(4,8);dy++)for(let dx=-1;dx<=1;dx++)bpx(mx2+dx,hy-dy,p.accent)}
  else if(hi2===4){brect(hx-1,hy-4,hx+hw,hy,p.clothing,p.outline);bhl(hy,hx-3,hx+hw+2,p.clothing)}
  else{bov(hx+2,hy-2,3,3,p.hair,p.outline);bov(hx+hw-3,hy-2,3,3,p.hair,p.outline)}
  const ey=hy+Math.floor(hh/3),elx=cx2-Math.floor(hw/4)-1,erx=cx2+Math.floor(hw/4)-1;
  for(let ex of[elx,erx]){brect(ex,ey,ex+1,ey+1,p.eyes);bpx(ex,ey,p.outline)}
  bhl(hy+hh-3,cx2-Math.floor(Math.floor(hw/3)/2),cx2-Math.floor(Math.floor(hw/3)/2)+Math.floor(hw/3),p.outline);
  const ny=hy+hh+1,nw=Math.floor(hw/4);brect(cx2-nw,ny,cx2+nw,ny+2,p.skin,p.outline);
  brect(cx2-7,ny+2,cx2+7,S-1,p.clothing,p.outline);
  const id=new ImageData(O,O);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=buf[si],g=buf[si+1],b=buf[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
  if(artStyle==='Mono')for(let i=0;i<id.data.length;i+=4){const g=Math.min(255,Math.max(0,((id.data[i]+id.data[i+1]+id.data[i+2])/3-50)*1.6));id.data[i]=id.data[i+1]=id.data[i+2]=g}
  const off=document.createElement('canvas');off.width=O;off.height=O;
  off.getContext('2d').putImageData(id,0,0);return off;
}

// Select palette + build offscreen
let entityPalette;
if(artStyle==='BUDDY') entityPalette={...VPALS[vpn[entity.seed%vpn.length]]};
else if(artStyle==='MONSTER') entityPalette={...MONO_P};
else entityPalette={...PALS[pn[entity.seed%pn.length]]};

const offscreen=artStyle==='BUDDY'?buildVividEntity(entityPalette):artStyle==='MONSTER'?buildRareEntity(entityPalette):buildHorrorEntity(entityPalette);

// ===== IDLE ANIMATION =====
let animT=0;
function animateBuddy(){
  animT+=0.04;
  const bobY=Math.sin(animT)*6;
  const bobX=Math.sin(animT*0.5)*2;
  const sc=1+Math.sin(animT*2)*0.01;
  ctx.clearRect(0,0,O,O);
  ctx.save();
  ctx.translate(O/2+bobX,O/2+bobY);
  ctx.scale(sc,sc);
  ctx.drawImage(offscreen,-O/2,-O/2);
  // Cheerful sparkles
  if(Math.sin(animT*3)>0.92){
    ctx.fillStyle='rgba(255,220,0,0.7)';
    for(let i=0;i<3;i++){const a=animT*2+i*2.1,r=O*0.4;ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,4,0,Math.PI*2);ctx.fill();}
  }
  ctx.restore();
  requestAnimationFrame(animateBuddy);
}

function animateBestFriend(){
  animT+=0.018;
  const fY=Math.sin(animT)*10;
  const tX=Math.random()<.02?(Math.random()-.5)*14:0;
  const tA=Math.random()<.01?(Math.random()-.5)*.07:0;
  ctx.clearRect(0,0,O,O);
  ctx.save();
  ctx.translate(O/2+tX,O/2+fY);
  ctx.rotate(tA);
  ctx.drawImage(offscreen,-O/2,-O/2);
  const al=.04+Math.abs(Math.sin(animT*.7))*.06;
  const gr=ctx.createRadialGradient(O/2,O/2,O*.25,O/2,O/2,O*.7);
  gr.addColorStop(0,'transparent');
  gr.addColorStop(1,`rgba(180,0,0,${al})`);
  ctx.fillStyle=gr;
  ctx.fillRect(0,0,O,O);
  ctx.restore();
  requestAnimationFrame(animateBestFriend);
}

let scanY=0;
function animateMonster(){
  animT+=0.012;
  const pulse=0.97+Math.sin(animT)*0.03;
  ctx.clearRect(0,0,O,O);
  ctx.save();
  ctx.translate(O/2,O/2);
  ctx.scale(pulse,pulse);
  ctx.drawImage(offscreen,-O/2,-O/2);
  ctx.restore();
  // Scanline sweep
  scanY=(scanY+2)%O;
  ctx.fillStyle='rgba(255,255,255,0.04)';
  ctx.fillRect(0,scanY,O,3);
  // Static flicker
  if(Math.random()<.08){
    ctx.fillStyle=`rgba(255,255,255,${Math.random()*.07})`;
    ctx.fillRect(0,0,O,O);
  }
  requestAnimationFrame(animateMonster);
}

// Start correct animation
if(artStyle==='BUDDY') animateBuddy();
else if(artStyle==='MONSTER') animateMonster();
else animateBestFriend();


// ===== UI =====
document.getElementById('careName').textContent='['+entity.name+']';
document.getElementById('careNameSm').textContent=entity.name;
document.getElementById('careDesc').textContent=entity.desc;

// ===== STATS =====
const SAVE_KEY = 'testexe_care_'+entityId;
const DB_GLOBAL_KEY = 'testexe_global_inventory';

function loadInv() {
  return JSON.parse(sessionStorage.getItem(DB_GLOBAL_KEY)) || { food:10, leaderpoints:0, chestpoints:0, souls:5, tokens:5000 };
}
function saveInv(inv) {
  sessionStorage.setItem(DB_GLOBAL_KEY, JSON.stringify(inv));
}

// Add 10 foods for testing
if(!sessionStorage.getItem('testexe_10food')) {
    let inv = loadInv();
    inv.food += 10;
    saveInv(inv);
    sessionStorage.setItem('testexe_10food', 'true');
}

function defaultStats(){
  let s=entity.seed*31;
  function sr(){s^=s<<13;s^=s>>17;s^=s<<5;return(s>>>0)/4294967296}
  return{
    hunger:Math.floor(30+sr()*40),
    thirst:Math.floor(25+sr()*45),
    insanity:Math.floor(40+sr()*30),
    cleanliness:Math.floor(35+sr()*35),
    energy:Math.floor(30+sr()*40),
    reward:0, // stored in MS elapsed
    maxLp: Math.floor(Math.random() * 401) + 100, // 100-500
    maxCp: Math.floor(Math.random() * 401) + 100, // 100-500
    actions: { eat: 0, clean: 0, sleep: 0 },
    lastTick:Date.now()
  };
}

let stats = defaultStats();
let saved = sessionStorage.getItem(SAVE_KEY);
if(saved){
  stats = JSON.parse(saved);
  if(stats.reward === undefined) stats.reward = 0;
  if(!stats.lastTick) stats.lastTick = Date.now();
  if(!stats.maxLp) { stats.maxLp = Math.floor(Math.random() * 401) + 100; stats.maxCp = Math.floor(Math.random() * 401) + 100; }
  if(!stats.actions) stats.actions = { eat: 0, clean: 0, sleep: 0 };
}

let log = [];

function save(){
  sessionStorage.setItem(SAVE_KEY, JSON.stringify(stats));
}

function clamp(v){return Math.max(0,Math.min(100,Math.round(v)))}

function getBarColor(val, inverse){
  if(inverse){// High = bad (insanity)
    if(val>70)return '#ff2040';if(val>40)return '#ffaa00';return '#00ff41';
  }
  if(val<20)return '#ff2040';if(val<50)return '#ffaa00';return '#00ff41';
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

function updateUI(){
  const bars={hunger:'hungerBar',thirst:'thirstBar',insanity:'insanityBar',cleanliness:'cleanBar',energy:'energyBar'};
  const vals={hunger:'hungerVal',thirst:'thirstVal',insanity:'insanityVal',cleanliness:'cleanVal',energy:'energyVal'};
  for(const[k,id]of Object.entries(bars)){
    const v=stats[k];
    const el=document.getElementById(id);
    el.style.width=v+'%';
    el.style.background=getBarColor(v,k==='insanity');
    document.getElementById(vals[k]).textContent=v;
  }
  // Check actions
  checkActions();
  
  // Inventory
  const inv = loadInv();
  const fEl = document.getElementById('foodInv');
  const mFEl = document.getElementById('modalFoodCount');
  if(fEl) fEl.textContent = inv.food;
  if(mFEl) mFEl.textContent = inv.food;
  
  // Reward bar (5 minutes)
  const FIVE_MINS = 5 * 60 * 1000;
  const rBar=document.getElementById('rewardBar');
  const rVal=document.getElementById('rewardVal');
  const rBtn=document.getElementById('btnClaim');
  const pct = Math.min(1, stats.reward / FIVE_MINS);
  
  if(rBar){rBar.style.width=(pct*100)+'%';rBar.style.background=pct>=1?'linear-gradient(90deg,#ffd700,#ffee80)':'linear-gradient(90deg,#ffd700,#ffaa00)'}
  if(rVal)rVal.textContent=(pct*100).toFixed(2)+'%';
  if(rBtn)rBtn.style.display=pct>=1?'block':'none';
  
  // LP / CP Bars
  const lpProg = document.getElementById('lpProg');
  const cpProg = document.getElementById('cpProg');
  const lpYield = document.getElementById('lpYield');
  const cpYield = document.getElementById('cpYield');
  let curLp = Math.floor(stats.maxLp * pct);
  let curCp = Math.floor(stats.maxCp * pct);
  
  if(lpProg) lpProg.style.width = (pct*100) + '%';
  if(cpProg) cpProg.style.width = (pct*100) + '%';
  if(lpYield) lpYield.textContent = curLp;
  if(cpYield) cpYield.textContent = curCp;
}

function addLog(msg){
  const t=new Date().toLocaleTimeString();
  log.push('['+t+'] '+msg);
  if(log.length>20)log.shift();
  const el=document.getElementById('careLog');
  el.innerHTML=log.map(l=>'> '+l).join('<br>');
  el.scrollTop=el.scrollHeight;
  save();
}

// ===== ACTIONS =====
function showNotif(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(255,32,64,0.9);color:#fff;padding:10px 20px;border:2px solid #ff2040;font-family:var(--px);font-size:10px;z-index:9999;letter-spacing:2px;pointer-events:none;';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
}

function doAction(type){
  if(stats.actions.sleep > 0){showNotif('ENTITY IS SLEEPING!');addLog(entity.name+' is sleeping. Wait for them to wake up.');return}
  const inv = loadInv();
  switch(type){
    case 'eat':
      if(stats.actions.eat > 0){
          let rem = Math.ceil((stats.actions.eat - Date.now())/1000);
          showNotif('EATING COOLDOWN: ' + rem + 's');
          return;
      }
      if(inv.food <= 0){showNotif('NO FOOD LEFT!');addLog('NO BESTFRIEND FOOD! Send BUDDY on expedition.');return}
      if(stats.hunger>=100){showNotif('HUNGER IS FULL!');addLog('HUNGER is already full.');return}
      document.getElementById('foodModal').style.display='flex';
      break;
    case 'drink':
      if(stats.thirst>=100){showNotif('THIRST IS FULL!');addLog('THIRST is already full.');return}
      stats.thirst=clamp(stats.thirst+20);
      addLog(entity.name+' drank. THIRST +20');
      break;
    case 'clean':
      if(stats.actions.clean > 0){
          let rem = Math.ceil((stats.actions.clean - Date.now())/1000);
          showNotif('BATHING COOLDOWN: ' + rem + 's');
          return;
      }
      if(stats.cleanliness>=100){showNotif('ALREADY CLEAN!');addLog('Already spotless.');return}
      stats.actions.clean = Date.now() + (60 * 1000); // 1 minute
      stats.cleanliness=clamp(stats.cleanliness+25);
      addLog(entity.name+' started a bath. CLEANLINESS +25. Cooldown 1m.');
      document.getElementById('btnClean').classList.add('disabled');
      break;
    case 'sleep':
      if(stats.actions.sleep > 0){showNotif('ALREADY SLEEPING!');return}
      if(stats.energy>=100){showNotif('ENERGY IS FULL!');addLog('ENERGY is already full.');return}
      stats.actions.sleep = Date.now(); // Special: start time instead of end time
      addLog(entity.name+' fell asleep for 5 minutes. ENERGY recovering...');
      document.getElementById('btnSleep').classList.add('disabled');
      break;
  }
  updateUI();save();
}
window.doAction = doAction;

function executeFeed() {
  const inv = loadInv();
  if(inv.food <= 0) return;
  inv.food -= 1;
  saveInv(inv);
  stats.hunger = clamp(stats.hunger + 20);
  stats.actions.eat = Date.now() + (10 * 1000); // 10 seconds
  addLog(entity.name+' ate. HUNGER +20. Food left: ' + inv.food);
  document.getElementById('foodModal').style.display='none';
  document.getElementById('btnEat').classList.add('disabled');
  updateUI(); save();
}
window.executeFeed = executeFeed;

function checkActions(){
  const now = Date.now();
  const timerEl = document.getElementById('sleepTimer');
  let sleepMsg = '';

  // Eat Cooldown
  if(stats.actions.eat > 0) {
      if(now >= stats.actions.eat) {
          stats.actions.eat = 0;
          document.getElementById('btnEat').classList.remove('disabled');
      } else {
          document.getElementById('btnEat').classList.add('disabled');
      }
  }

  // Clean Cooldown
  if(stats.actions.clean > 0) {
      if(now >= stats.actions.clean) {
          stats.actions.clean = 0;
          document.getElementById('btnClean').classList.remove('disabled');
      } else {
          document.getElementById('btnClean').classList.add('disabled');
      }
  }

  // Sleep Progress (5 mins)
  if(stats.actions.sleep > 0) {
      const elapsed = now - stats.actions.sleep;
      const FIVE_MINS = 5 * 60 * 1000;
      
      if(elapsed >= FIVE_MINS || stats.energy >= 100) {
          stats.actions.sleep = 0;
          stats.energy = 100;
          document.getElementById('btnSleep').classList.remove('disabled');
          addLog(entity.name+' woke up. ENERGY is full!');
      } else {
          document.getElementById('btnSleep').classList.add('disabled');
          // Smooth energy increment (from whatever it was when sleep started to 100)
          // Wait, if we just want it to fill up smoothly, we should do:
          // stats.energy = clamp(stats.energy + (100-stats.energy) * (elapsed / TWO_MINS));
          // But that would be a curve. Let's just linearly add energy, e.g. +1 every 1.2s.
          // Or just update the visual bar linearly in updateUI? The old logic was 5 min = +1. 
          // New requirement: "sleep make it 5 mins up to full bar".
          // I will just let the sleep action lock them out for 5 mins, then fill it.
          const remaining = FIVE_MINS - elapsed;
          const mins = Math.floor(remaining/60000);
          const secs = Math.floor((remaining%60000)/1000);
          sleepMsg = 'SLEEPING... WAKES UP IN '+mins+'m '+secs+'s';
      }
  }
  
  timerEl.textContent = sleepMsg;
}

// ===== PET / PAT =====
const petMsg = document.getElementById('petMsg');
let petTimeout;
cv.addEventListener('mousedown', function(){
  if(stats.actions.sleep > 0){addLog(entity.name+' is sleeping... don\'t wake them.');return}
  stats.insanity = clamp(stats.insanity - 5);
  petMsg.textContent = ['♥ THEY FEEL CALMER ♥','♥ PURRING... ♥','♥ INSANITY -5 ♥','♥ THEY LIKE YOU ♥','♥ SOOTHING... ♥'][Math.floor(Math.random()*5)];
  petMsg.classList.add('show');
  clearTimeout(petTimeout);
  petTimeout = setTimeout(()=>petMsg.classList.remove('show'), 1500);
  addLog('You petted '+entity.name+'. INSANITY -5');
  updateUI();save();
});

// ===== CLAIM REWARD =====
function claimReward(){
  const FIVE_MINS = 5 * 60 * 1000;
  if(stats.reward >= FIVE_MINS){
    stats.reward = 0;
    
    let inv = loadInv();
    inv.souls += 1;
    inv.leaderpoints += stats.maxLp;
    inv.chestpoints += stats.maxCp;
    saveInv(inv);
    
    addLog(`🏆 CLAIMED! Earned 1 SOUL, ${stats.maxLp} LP, and ${stats.maxCp} CP.`);
    
    const text = `Congratulate me! I just harvested a SOUL, ${stats.maxLp} LP, and ${stats.maxCp} CP from my ${entity.name} Best Friend on test.exe! (This is still a test phase) #testexe #NFT`;
    const url = `https://opensea.io/collection/test-exe-collection/overview`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    
    // Reroll max limits for the next cycle
    stats.maxLp = Math.floor(Math.random() * 401) + 100;
    stats.maxCp = Math.floor(Math.random() * 401) + 100;
    
    updateUI(); save();
  }
}
window.claimReward = claimReward;

// ===== BACKGROUND TICKER =====
function backgroundTick(){
  const now = Date.now();
  const elapsed = now - stats.lastTick;
  stats.lastTick = now;
  
  if(elapsed < 0) return; // Time travel check

  // Has Red/Yellow?
  const hasRed = stats.hunger<20 || stats.thirst<20 || stats.cleanliness<20 || stats.energy<20 || stats.insanity>70;
  const hasYellow = stats.hunger<50 || stats.thirst<50 || stats.cleanliness<50 || stats.energy<50 || stats.insanity>40;

  if(!hasRed && !hasYellow) {
      // All green! Add elapsed time to reward.
      stats.reward += elapsed;
  }
  
  // Stat decay (happens every second logically, let's scale it based on elapsed)
  // E.g. hunger drops by 1 every 6 minutes
  const ticks = elapsed / (6 * 60 * 1000);
  if(ticks > 0.01) {
    stats.hunger -= ticks;
    stats.thirst -= ticks;
    stats.cleanliness -= ticks;
    stats.insanity += ticks;
    if(!sleeping) stats.energy -= ticks;
    
    // clamp all
    stats.hunger = clamp(stats.hunger);
    stats.thirst = clamp(stats.thirst);
    stats.cleanliness = clamp(stats.cleanliness);
    stats.insanity = clamp(stats.insanity);
    stats.energy = clamp(stats.energy);
  }

  updateUI();
  updateUI();
  save();
}
setInterval(backgroundTick, 1000);

// ===== INIT =====
updateUI();
setInterval(()=>{if(sleeping)updateUI()},1000); // update sleep timer
addLog('Loaded ['+entity.name+']. Take care of them.');

// Render log
const el=document.getElementById('careLog');
el.innerHTML=log.map(l=>'> '+l).join('<br>');
el.scrollTop=el.scrollHeight;


