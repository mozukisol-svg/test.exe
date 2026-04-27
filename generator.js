// ===== STATIC BACKGROUND =====
(function(){
  const sBg=document.getElementById('staticBg');if(!sBg)return;
  const sCtx=sBg.getContext('2d');
  function resize(){sBg.width=window.innerWidth;sBg.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);
  function draw(){const w=sBg.width,h=sBg.height,id=sCtx.createImageData(w,h),d=id.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255;d[i]=v*.3;d[i+1]=v*.8;d[i+2]=v*.2;d[i+3]=255}sCtx.putImageData(id,0,0);requestAnimationFrame(draw)}
  draw();
})();
// ===== GLITCH =====
(function(){
  const ov=document.getElementById('glitchOverlay');if(!ov)return;
  function trigger(){ov.innerHTML='';const n=3+Math.floor(Math.random()*5);for(let i=0;i<n;i++){const bar=document.createElement('div'),top=Math.random()*100,h=1+Math.random()*8,s=(Math.random()-.5)*30;bar.style.cssText=`position:absolute;top:${top}%;left:0;right:0;height:${h}px;background:rgba(0,255,65,0.08);transform:translateX(${s}px);box-shadow:2px 0 4px rgba(255,0,80,0.3),-2px 0 4px rgba(0,255,200,0.3)`;ov.appendChild(bar)}ov.classList.add('active');setTimeout(()=>{ov.classList.remove('active');ov.innerHTML=''},80+Math.random()*120);setTimeout(trigger,3000+Math.random()*8000)}
  setTimeout(trigger,2000);
})();

// ===== CUSTOM CURSOR & PARTICLES =====
(function(){
  const dot=document.getElementById('cursorDot');if(!dot)return;
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  function tick(){cx+=(mx-cx)*.85;cy+=(my-cy)*.85;dot.style.left=cx+'px';dot.style.top=cy+'px';requestAnimationFrame(tick)}
  tick();
})();
(function(){
  const container=document.getElementById('particleContainer');if(!container)return;
  const colors=['#00ff41','#00cc33','#006622','#00ff80','#003311','#88ffaa'];
  document.addEventListener('mousedown',e=>{
    const count=6+Math.floor(Math.random()*4);
    for(let i=0;i<count;i++){const p=document.createElement('div');p.className='click-particle';const sz=3+Math.floor(Math.random()*5);p.style.width=sz+'px';p.style.height=sz+'px';p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];container.appendChild(p);const vx=(Math.random()-.5)*12,vy0=-Math.random()*8-2;let x=0,y=0,vyC=vy0,op=1;function anim(){x+=vx;vyC+=.4;y+=vyC;op-=.025;if(op<=0){p.remove();return}p.style.transform=`translate(${x}px,${y}px)`;p.style.opacity=op;requestAnimationFrame(anim)}requestAnimationFrame(anim)}
  });
})();

// ===== GENERATOR =====
const S=32,SC=16,O=S*SC;
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
const PALS={
  Cosmic:{bg:[18,10,40],skin:[180,100,220],outline:[0,0,0],hair:[0,220,255],eyes:[255,50,180],clothing:[60,20,100],accent:[255,200,50]},
  Forest:{bg:[20,40,20],skin:[210,175,120],outline:[0,0,0],hair:[80,40,10],eyes:[50,200,80],clothing:[30,80,30],accent:[200,160,40]},
  Lava:{bg:[40,10,0],skin:[255,180,100],outline:[0,0,0],hair:[200,50,0],eyes:[255,220,0],clothing:[180,30,0],accent:[255,120,0]},
  Ocean:{bg:[5,20,50],skin:[150,220,240],outline:[0,0,0],hair:[0,80,180],eyes:[0,200,255],clothing:[10,60,120],accent:[200,240,255]},
  Void:{bg:[10,10,10],skin:[200,200,200],outline:[50,50,50],hair:[150,150,150],eyes:[255,255,255],clothing:[60,60,60],accent:[180,180,180]},
  Toxic:{bg:[10,50,0],skin:[100,255,50],outline:[0,0,0],hair:[180,0,255],eyes:[255,255,0],clothing:[0,150,0],accent:[0,255,100]},
  Cyberpunk:{bg:[15,15,30],skin:[200,180,255],outline:[0,0,0],hair:[0,255,180],eyes:[255,0,100],clothing:[50,0,100],accent:[0,200,255]},
  Glitch:{bg:[0,0,0],skin:[0,255,80],outline:[0,0,0],hair:[255,0,180],eyes:[255,255,0],clothing:[0,100,0],accent:[255,0,80]},
  Ghost:{bg:[5,5,20],skin:[180,200,230],outline:[20,20,60],hair:[100,120,180],eyes:[200,220,255],clothing:[40,50,80],accent:[150,180,255]},
  Terminal:{bg:[0,10,0],skin:[0,180,0],outline:[0,0,0],hair:[0,255,0],eyes:[0,255,100],clothing:[0,80,0],accent:[0,255,50]},
  Static:{bg:[15,15,15],skin:[160,160,160],outline:[0,0,0],hair:[80,80,80],eyes:[220,220,220],clothing:[50,50,50],accent:[200,200,200]},
  Corrupted:{bg:[10,0,0],skin:[180,60,60],outline:[0,0,0],hair:[100,0,40],eyes:[255,40,40],clothing:[60,0,0],accent:[200,0,100]},
};
const MONO={bg:[10,10,10],skin:[200,200,200],outline:[0,0,0],hair:[150,150,150],eyes:[255,255,255],clothing:[80,80,80],accent:[180,180,180]};
const VPALS={
  Scarlet:{bg:[248,248,248],skin:[220,140,60],outline:[40,0,0],hair:[200,20,20],eyes:[20,0,0],clothing:[200,20,20],accent:[160,60,0]},
  Verdant:{bg:[240,252,220],skin:[220,185,110],outline:[0,50,0],hair:[20,120,20],eyes:[0,30,0],clothing:[20,120,20],accent:[160,140,60]},
  Azure:{bg:[230,240,255],skin:[220,185,110],outline:[0,0,60],hair:[20,80,200],eyes:[0,20,80],clothing:[20,100,210],accent:[80,140,230]},
  Goldenrod:{bg:[255,252,210],skin:[230,190,120],outline:[60,30,0],hair:[200,140,0],eyes:[40,20,0],clothing:[200,140,0],accent:[240,200,60]},
  Amethyst:{bg:[240,230,255],skin:[220,180,120],outline:[40,0,60],hair:[120,20,180],eyes:[40,0,60],clothing:[120,20,180],accent:[180,100,230]},
  Teal:{bg:[220,248,248],skin:[220,180,120],outline:[0,50,50],hair:[0,140,140],eyes:[0,40,40],clothing:[0,140,140],accent:[80,210,210]},
  Rose:{bg:[255,235,240],skin:[240,195,170],outline:[80,0,40],hair:[220,50,100],eyes:[70,0,30],clothing:[220,50,100],accent:[255,150,180]},
  Earthen:{bg:[240,230,210],skin:[200,155,90],outline:[50,25,0],hair:[100,55,15],eyes:[40,20,0],clothing:[110,60,15],accent:[180,130,65]},
};
const vpn=Object.keys(VPALS),pn=Object.keys(PALS);
// BUDDY=60% BESTFRIEND=30% MONSTER=10%
const ASTYLES=['BUDDY','BUDDY','BUDDY','BUDDY','BUDDY','BUDDY','BESTFRIEND','BESTFRIEND','BESTFRIEND','MONSTER'];

// NES egg-character builder for Vivid/Common style
function buildVividGen(p){
  const S2=32,SC2=16,O2=S2*SC2;
  const buf=new Uint8Array(S2*S2*3);
  function bpx(x,y,c){if(x>=0&&x<S2&&y>=0&&y<S2){const i=(y*S2+x)*3;buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2]}}
  const CX=16,CY=18,RX=12,RY=13,CAP_Y=14,FACE_Y=21;
  const HN=['Cap','Crown','Wizard','Helmet','Bare'],EN=['Normal','Wide','Angry','Star','Closed'],MN=['Smile','Frown','Open','Grin','Line'],PN=['Checkered','V-Stripes','H-Stripes','Solid'],AN=['None','Glasses','Mustache','Freckles','Star'],BGN=['Solid','Gradient','Stars','Diagonal','Dots','Checker'];
  const hat=ri(0,5),eye=ri(0,5),mouth=ri(0,5),pat=ri(0,4),acc=ri(0,5),bgPat=ri(0,6);
  function drawBg(x,y){if(bgPat===1){const t=y/S2;return p.bg.map(v=>Math.min(255,Math.floor(v*(1-t*.5)+255*t*.15)));}
    if(bgPat===2){return Math.sin(x*13.7+y*7.3)>.97?[255,240,180]:p.bg;}
    if(bgPat===3){return ((x+y)%6<3)?p.bg:p.bg.map(v=>Math.max(0,v-35));}
    if(bgPat===4){return (x%5<1&&y%5<1)?p.bg.map(v=>Math.min(255,v+80)):p.bg;}
    if(bgPat===5){return ((Math.floor(x/4)+Math.floor(y/4))%2)?p.bg:p.bg.map(v=>Math.max(0,v-25));}
    return p.bg;}
  for(let y=0;y<S2;y++)for(let x=0;x<S2;x++){
    const dx=x-CX,dy=y-CY,d=(dx/RX)**2+(dy/RY)**2;
    if(d>1){bpx(x,y,drawBg(x,y));continue}
    if(d>=0.87){bpx(x,y,p.outline);continue}
    if(y<CAP_Y){bpx(x,y,(hat===1||hat===4)?p.skin:p.hair);continue}
    if(y<FACE_Y){bpx(x,y,p.skin);continue}
    const ck=pat===0?(Math.floor((x-CX+RX)/3)+Math.floor((y-FACE_Y)/3))%2:pat===1?Math.floor((x-CX+RX)/3)%2:pat===2?Math.floor((y-FACE_Y)/3)%2:0;
    bpx(x,y,ck?p.clothing:p.accent);
  }
  const dyB=CAP_Y-CY,bW=Math.round(RX*Math.sqrt(Math.max(0,1-(dyB/RY)**2)));
  if(hat===0){for(let x=CX-bW-2;x<=CX+bW+2;x++)bpx(x,CAP_Y,p.hair);bpx(CX-bW-3,CAP_Y,p.outline);bpx(CX+bW+3,CAP_Y,p.outline);}
  else if(hat===1){for(const sx of[CX-4,CX,CX+4])for(let dy=5;dy<=7;dy++)bpx(sx,dy,p.hair);for(let x=CX-5;x<=CX+5;x++)bpx(x,8,p.hair);}
  else if(hat===2){bpx(CX,3,p.hair);for(let i=1;i<=3;i++){bpx(CX-i,3+i,p.hair);bpx(CX+i,3+i,p.hair);}for(let x=CX-bW-2;x<=CX+bW+2;x++)bpx(x,CAP_Y,p.hair);}
  else if(hat===3){for(let x=CX-bW;x<=CX+bW;x++)bpx(x,CAP_Y,p.hair);}
  else{bpx(CX,5,p.hair);bpx(CX-1,6,p.hair);bpx(CX+1,6,p.hair);}
  const eY=17,eLX=CX-5,eRX=CX+2;
  if(eye===0){for(const ex of[eLX,eRX]){for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)bpx(ex+dx,eY+dy,p.outline);bpx(ex+1,eY,p.bg);}}
  else if(eye===1){for(const ex of[eLX,eRX]){for(let dy=-1;dy<3;dy++)for(let dx=-1;dx<3;dx++)bpx(ex+dx,eY+dy,p.outline);bpx(ex,eY,p.bg);bpx(ex,eY+1,p.bg);}}
  else if(eye===2){for(const ex of[eLX,eRX]){for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)bpx(ex+dx,eY+dy,p.outline);}bpx(eLX,eY-1,p.outline);bpx(eLX+1,eY-2,p.outline);bpx(eRX+1,eY-1,p.outline);bpx(eRX,eY-2,p.outline);}
  else if(eye===3){for(const ex of[eLX+1,eRX+1])for(const[dx,dy]of[[0,-1],[0,1],[-1,0],[1,0],[0,0]])bpx(ex+dx,eY+dy,p.accent);}
  else{for(const ex of[eLX,eRX])for(let dx=0;dx<2;dx++)bpx(ex+dx,eY+1,p.outline);}
  bpx(CX,18,p.outline);
  const mY=FACE_Y-1;
  if(mouth===0){for(let x=CX-2;x<=CX+2;x++)bpx(x,mY,p.outline);bpx(CX-3,mY-1,p.outline);bpx(CX+3,mY-1,p.outline);}
  else if(mouth===1){for(let x=CX-2;x<=CX+2;x++)bpx(x,mY-1,p.outline);bpx(CX-3,mY,p.outline);bpx(CX+3,mY,p.outline);}
  else if(mouth===2){for(let x=CX-2;x<=CX+2;x++){bpx(x,mY,p.outline);bpx(x,mY-2,p.outline);}bpx(CX-2,mY-1,p.outline);bpx(CX+2,mY-1,p.outline);for(let x=CX-1;x<=CX+1;x++)bpx(x,mY-1,p.accent);}
  else if(mouth===3){for(let x=CX-3;x<=CX+3;x++)bpx(x,mY,p.outline);for(let x=CX-2;x<=CX+2;x++)bpx(x,mY-1,[240,240,240]);bpx(CX-1,mY-1,p.outline);bpx(CX+1,mY-1,p.outline);}
  else{for(let x=CX-2;x<=CX+2;x++)bpx(x,mY,p.outline);}
  if(acc===1){for(const ex of[eLX,eRX]){bpx(ex-1,eY-1,p.outline);bpx(ex+2,eY-1,p.outline);bpx(ex-1,eY+2,p.outline);bpx(ex+2,eY+2,p.outline);bpx(ex-1,eY,p.outline);bpx(ex-1,eY+1,p.outline);bpx(ex+2,eY,p.outline);bpx(ex+2,eY+1,p.outline);}bpx(eLX+2,eY,p.outline);bpx(eLX+2,eY+1,p.outline);}
  else if(acc===2){for(let x=CX-3;x<=CX+3;x++)bpx(x,19,p.outline);bpx(CX-4,18,p.outline);bpx(CX+4,18,p.outline);}
  else if(acc===3){bpx(eLX-1,eY+3,p.outline);bpx(eLX,eY+4,p.outline);bpx(eRX+2,eY+3,p.outline);bpx(eRX+1,eY+4,p.outline);}
  else if(acc===4){bpx(eRX+3,eY+2,p.accent);bpx(eRX+4,eY+1,p.accent);bpx(eRX+4,eY+3,p.accent);}
  const id=new ImageData(O2,O2);
  for(let y=0;y<S2;y++)for(let x=0;x<S2;x++){const si=(y*S2+x)*3,r=buf[si],g=buf[si+1],b=buf[si+2];for(let dy=0;dy<SC2;dy++)for(let dx=0;dx<SC2;dx++){const di=((y*SC2+dy)*O2+(x*SC2+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255;}}
  // Voxel shading: same highlight+shadow texture as Uncommon/Horror
  for(let by=0;by<O2;by+=SC2)for(let bx=0;bx<O2;bx+=SC2){const c2=((by+SC2/2)*O2+(bx+SC2/2))*4;const br=id.data[c2],bg2=id.data[c2+1],bb=id.data[c2+2];if(br+bg2+bb<30)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC2;dx++){const i=((by+dy)*O2+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=0;dy<SC2;dy++)for(let dx=0;dx<2;dx++){const i=((by+dy)*O2+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=SC2-3;dy<SC2;dy++)for(let dx=0;dx<SC2;dx++){const i=((by+dy)*O2+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}for(let dy=0;dy<SC2;dy++)for(let dx=SC2-3;dx<SC2;dx++){const i=((by+dy)*O2+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}}
  const off=document.createElement('canvas');off.width=O2;off.height=O2;off.getContext('2d').putImageData(id,0,0);
  return{off,traits:{Hat:HN[hat],Eyes:EN[eye],Mouth:MN[mouth],Pattern:PN[pat],Accessory:AN[acc],Background:BGN[bgPat]}};
}

// Grim-Reaper builder for Rare/Mono
function buildRareGen(p){
  const S2=32,SC2=16,O2=S2*SC2;
  const buf=new Uint8Array(S2*S2*3);
  function bpx(x,y,c){if(x>=0&&x<S2&&y>=0&&y<S2){const i=(y*S2+x)*3;buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2]}}
  const DK=[8,8,8],MD=[80,80,80],LT=[170,170,170],WH=[230,230,230],CX=16;
  const HN2=['Pointed','Round','Tattered','Crown','Twin-Peak'],SN=['Hollow','Cracked','Ancient','Demonic','Royal'],RN=['Flowing','Armored','Torn','Skeletal'],WN2=['None','Scythe','Lantern','Hourglass','Staff'],GN=['None','Eye','Rune','X-Mark','Star'];
  const hood=ri(0,5),skull=ri(0,5),robe=ri(0,4),weapon=ri(0,5),sigil=ri(0,5);
  for(let y=0;y<S2;y++)for(let x=0;x<S2;x++){const v=8+Math.floor(Math.sin(x*.7+y*.5)*4);bpx(x,y,[v,v,v]);}
  if(skull<3)for(let y=0;y<S2;y+=4)for(let x=0;x<S2;x+=5){const sv=Math.sin(x*7.3+y*13.7);if(sv>.82){const bv=30+Math.floor(sv*50);bpx(x,y,[bv,bv,bv]);}}
  for(let y=0;y<13;y++)for(let x=0;x<S2;x++){const dx=x-CX,dy=y-8,d=(dx/9)**2+(dy/7)**2;if(d<1)bpx(x,y,DK);else if(d<1.18)bpx(x,y,MD);}
  if(hood===0){bpx(CX,1,MD);bpx(CX,2,DK);}else if(hood===2){for(let x=8;x<24;x+=3)bpx(x,12,DK);}else if(hood===3){for(const cx2 of[CX-3,CX,CX+3])for(let dy=0;dy<3;dy++)bpx(cx2,dy+1,MD);}else if(hood===4){bpx(CX-3,1,MD);bpx(CX+3,1,MD);bpx(CX-3,2,DK);bpx(CX+3,2,DK);}
  const fY=11;
  for(let y=fY;y<fY+8;y++)for(let x=0;x<S2;x++){const dx=x-CX,dy=y-fY-4,d=(dx/5)**2+(dy/4)**2;if(d<1)bpx(x,y,WH);else if(d<1.2)bpx(x,y,LT);}
  for(const ex of[CX-2,CX+2])for(let dy=0;dy<2;dy++)for(let dx=-1;dx<=1;dx++)bpx(ex+dx,fY+2+dy,DK);
  bpx(CX-1,fY+5,DK);bpx(CX+1,fY+5,DK);
  for(let x=CX-3;x<=CX+3;x++)bpx(x,fY+6,DK);
  for(let x=CX-2;x<=CX+2;x+=2)bpx(x,fY+7,WH);
  if(skull===1){bpx(CX+1,fY,DK);bpx(CX+2,fY+1,DK);bpx(CX+1,fY+2,DK);}else if(skull===3){for(let i=0;i<4;i++){bpx(CX-4-i,fY-i,MD);bpx(CX+4+i,fY-i,MD);}}else if(skull===4){for(let i=-3;i<=3;i++)bpx(CX+i,fY-1,MD);for(const cx2 of[CX-2,CX,CX+2])bpx(cx2,fY-2,WH);}
  for(let y=19;y<S2;y++){const sp=Math.floor((y-19)*.55),x1=Math.max(0,8-sp),x2=Math.min(S2-1,23+sp);for(let x=x1;x<=x2;x++)bpx(x,y,DK);if(robe===0){bpx(x1,y,MD);bpx(x2,y,MD);}else if(robe===1&&y%3===0){bpx(x1+2,y,MD);bpx(x2-2,y,MD);}else if(robe===3&&(y-19)%3===0)for(let x=x1+2;x<=x2-2;x+=3)bpx(x,y,MD);}
  if(weapon===1){for(let y=8;y<28;y++)bpx(25,y,MD);for(let i=0;i<5;i++){bpx(25-i,8+i,LT);bpx(24-i,8+i,MD);}}else if(weapon===2){for(let y=19;y<25;y++)for(let x=6;x<10;x++)bpx(x,y,MD);bpx(8,18,MD);bpx(8,19,WH);}else if(weapon===3){for(let y=18;y<25;y++){const w=Math.abs(y-21);for(let x=6-w;x<=9+w;x++)bpx(x,y,MD);}}else if(weapon===4){for(let y=5;y<28;y++)bpx(24,y,MD);for(const dx of[-1,0,1])bpx(24+dx,5,WH);}
  const siX=CX,siY=24;
  if(sigil===1){for(const[dx,dy]of[[0,0],[0,-1],[0,1],[-1,0],[1,0]])bpx(siX+dx,siY+dy,MD);bpx(siX,siY,WH);}else if(sigil===2){for(const[dx,dy]of[[0,-1],[0,0],[0,1],[-1,0],[1,0]])bpx(siX+dx,siY+dy,MD);}else if(sigil===3){for(let d=0;d<3;d++){bpx(siX-1+d,siY-1+d,LT);bpx(siX+1-d,siY-1+d,LT);}}else if(sigil===4){for(const[dx,dy]of[[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]])bpx(siX+dx,siY+dy,LT);bpx(siX,siY,WH);}
  const id=new ImageData(O2,O2);
  for(let y=0;y<S2;y++)for(let x=0;x<S2;x++){const si=(y*S2+x)*3,r=buf[si],g=buf[si+1],b=buf[si+2];for(let dy=0;dy<SC2;dy++)for(let dx=0;dx<SC2;dx++){const di=((y*SC2+dy)*O2+(x*SC2+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255;}}
  for(let i=0;i<id.data.length;i+=4){const v=Math.min(255,Math.max(0,((id.data[i]+id.data[i+1]+id.data[i+2])/3-30)*1.9));id.data[i]=id.data[i+1]=id.data[i+2]=v}
  for(let by=0;by<O2;by+=SC2)for(let bx=0;bx<O2;bx+=SC2){const c2=((by+SC2/2)*O2+(bx+SC2/2))*4;const br=id.data[c2];if(br<10)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC2;dx++){const i=((by+dy)*O2+(bx+dx))*4;id.data[i]=id.data[i+1]=id.data[i+2]=Math.min(255,br*1.5)}for(let dy=SC2-3;dy<SC2;dy++)for(let dx=0;dx<SC2;dx++){const i=((by+dy)*O2+(bx+dx))*4;id.data[i]=id.data[i+1]=id.data[i+2]=br*.4}}
  const off=document.createElement('canvas');off.width=O2;off.height=O2;off.getContext('2d').putImageData(id,0,0);
  return{off,traits:{Hood:HN2[hood],Skull:SN[skull],Robe:RN[robe],Weapon:WN2[weapon],Sigil:GN[sigil]}};
}
let rs=Date.now();
function rng(){rs^=rs<<13;rs^=rs>>17;rs^=rs<<5;return(rs>>>0)/4294967296}
function ri(a,b){return a+Math.floor(rng()*(b-a))}
function rc(a){return a[Math.floor(rng()*a.length)]}
const img=new Uint8Array(S*S*3);
function px(x,y,c){if(x>=0&&x<S&&y>=0&&y<S){const i=(y*S+x)*3;img[i]=c[0];img[i+1]=c[1];img[i+2]=c[2]}}
function rect(x1,y1,x2,y2,c,o){for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(c)px(x,y,c);if(o){for(let x=x1;x<=x2;x++){px(x,y1,o);px(x,y2,o)}for(let y=y1;y<=y2;y++){px(x1,y,o);px(x2,y,o)}}}
function hl(y,x1,x2,c){for(let x=x1;x<=x2;x++)px(x,y,c)}
function vl(x,y1,y2,c){for(let y=y1;y<=y2;y++)px(x,y,c)}
function ov(a,b,rx,ry,c,o){for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d<=1)px(x,y,c)};if(o)for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d>=.85&&d<=1.15)px(x,y,o)}}

let pulls=0,curT={};
function setStatus(t){document.getElementById('status').textContent=t}

function generate(){
  rs=Date.now()^(Math.random()*0xFFFFFFFF>>>0);img.fill(0);
  const fl=document.getElementById('flash');fl.className='';void fl.offsetWidth;fl.className='pop';
  setStatus('SCANNING...');
  const artSt=ASTYLES[Math.floor(rng()*10)];
  let pName,p;
  if(artSt==='BUDDY'){pName=rc(vpn);p={...VPALS[pName]};}
  else if(artSt==='MONSTER'){pName='Monochrome';p={...MONO};}
  else{pName=rc(pn);p={...PALS[pName]};}
  const mono=artSt==='MONSTER';
  // ── MONSTER: Grim Reaper character ──
  if(artSt==='MONSTER'){
    const {off,traits:rt}=buildRareGen({});
    if(window._genRaf)cancelAnimationFrame(window._genRaf);
    let gT=0,gScanY=0;
    function gAnimMono(){gT+=0.012;const pulse=.97+Math.sin(gT)*.03;cx.clearRect(0,0,O,O);cx.save();cx.translate(O/2,O/2);cx.scale(pulse,pulse);cx.drawImage(off,-O/2,-O/2);cx.restore();gScanY=(gScanY+2)%O;cx.fillStyle='rgba(255,255,255,.04)';cx.fillRect(0,gScanY,O,3);if(Math.random()<.08){cx.fillStyle=`rgba(255,255,255,${Math.random()*.07})`;cx.fillRect(0,0,O,O);}window._genRaf=requestAnimationFrame(gAnimMono);}
    gAnimMono();
    curT={'Type':'MONSTER','Animation':'GIF',...rt};
    const td=document.getElementById('traits');
    td.innerHTML=Object.entries(curT).map(([k,v],i)=>{
      const cls=k==='Type'?'rare':'';
      return`<div class="tr" style="animation-delay:${i*.06}s"><span class="tr-k">${k}</span><span class="tr-v ${cls}">${k==='Type'?'☯ RARE — MONSTER':v}</span></div>`;
    }).join('');
    td.classList.add('show');
    document.getElementById('mood').classList.remove('show');
    document.getElementById('acts').classList.add('show');
    pulls++;document.getElementById('pulls').textContent='ENTITIES: '+pulls;
    setTimeout(()=>setStatus('ENTITY #'+pulls+' MATERIALIZED // 0x'+Math.floor(rng()*0xFFFFFF).toString(16).padStart(6,'0')),200);
    return;
  }
  // ── BUDDY: NES egg character (short-circuit inline drawing) ──
  if(artSt==='BUDDY'){
    const {off,traits:vt}=buildVividGen(p);
    if(window._genRaf)cancelAnimationFrame(window._genRaf);
    let gT=0;
    function gAnimVivid(){gT+=0.04;const bY=Math.sin(gT)*6,bX=Math.sin(gT*.5)*2,sc=1+Math.sin(gT*2)*.012;cx.clearRect(0,0,O,O);cx.save();cx.translate(O/2+bX,O/2+bY);cx.scale(sc,sc);cx.drawImage(off,-O/2,-O/2);if(Math.sin(gT*3)>.9){cx.fillStyle='rgba(255,220,0,.7)';for(let i=0;i<3;i++){const a=gT*2+i*2.1,r=O*.38;cx.beginPath();cx.arc(Math.cos(a)*r,Math.sin(a)*r,4,0,Math.PI*2);cx.fill();}}cx.restore();window._genRaf=requestAnimationFrame(gAnimVivid);}
    gAnimVivid();
    curT={'Type':'BUDDY','Animation':'GIF',Palette:pName,...vt};
    const td=document.getElementById('traits');
    td.innerHTML=Object.entries(curT).map(([k,v],i)=>{
      const cls=k==='Type'?'common':'';
      return`<div class="tr" style="animation-delay:${i*.06}s"><span class="tr-k">${k}</span><span class="tr-v ${cls}">${k==='Type'?'✦ COMMON — BUDDY':v}</span></div>`;
    }).join('');
    td.classList.add('show');
    document.getElementById('mood').classList.remove('show');
    document.getElementById('acts').classList.add('show');
    pulls++;document.getElementById('pulls').textContent='ENTITIES: '+pulls;
    setTimeout(()=>setStatus('ENTITY #'+pulls+' MATERIALIZED // 0x'+Math.floor(rng()*0xFFFFFF).toString(16).padStart(6,'0')),200);
    return;
  }
  // ── Horror / Mono: original inline drawing ──
  const bt=ri(0,5);for(let y=0;y<S;y++)for(let x=0;x<S;x++)px(x,y,p.bg);
  if(bt===1)for(let y=0;y<S;y++){const f=y/(S-1);hl(y,0,S-1,p.bg.map((v,i)=>Math.floor(v*(1-f)+p.accent[i]*f*.4)))}
  if(bt===2)for(let y=0;y<S;y+=3)for(let x=0;x<S;x+=3)px(x,y,p.bg.map(v=>Math.min(255,v+30)));
  if(bt===3)for(let y=0;y<S;y++)hl(y,0,S-1,y%4<2?p.bg:p.bg.map(v=>Math.max(0,v-20)));
  const bgN=['Solid','Gradient','Dots','Stripes','Vignette'][bt];
  let skN='Normal';const sp={Gold:[255,215,0],Alien:[80,255,120],Undead:[160,200,140]};
  if(rng()<.05){const sk=rc(Object.keys(sp));skN=sk;p.skin=sp[sk]}
  const cx2=S/2+ri(-2,3),hy=ri(9,14),hw=ri(10,14),hh=ri(10,14);
  ov(cx2,hy+Math.floor(hh/2),Math.floor(hw/2),Math.floor(hh/2),p.skin,p.outline);
  const hx=cx2-Math.floor(hw/2),hs=['Short','Long','Spiky','Mohawk','Cap','Buns'],hi2=ri(0,6);
  if(hi2===0)rect(hx,hy-3,hx+hw-1,hy,p.hair,p.outline);
  else if(hi2===1){rect(hx,hy-4,hx+hw-1,hy,p.hair,p.outline);vl(hx-1,hy,hy+6,p.hair);vl(hx+hw,hy,hy+6,p.hair)}
  else if(hi2===2){for(let i=0;i<ri(3,6);i++){const sx=hx+i*Math.floor(hw/4)+2;for(let dy=0;dy<ri(3,7);dy++)px(sx,hy-dy,p.hair)}rect(hx,hy-1,hx+hw-1,hy,p.hair)}
  else if(hi2===3){const mx2=hx+Math.floor(hw/2);for(let dy=0;dy<ri(4,8);dy++)for(let dx=-1;dx<=1;dx++)px(mx2+dx,hy-dy,p.accent)}
  else if(hi2===4){rect(hx-1,hy-4,hx+hw,hy,p.clothing,p.outline);hl(hy,hx-3,hx+hw+2,p.clothing)}
  else{ov(hx+2,hy-2,3,3,p.hair,p.outline);ov(hx+hw-3,hy-2,3,3,p.hair,p.outline)}
  const ey=hy+Math.floor(hh/3),elx=cx2-Math.floor(hw/4)-1,erx=cx2+Math.floor(hw/4)-1;
  const es=['Normal','Wide','Angry','X','Star','Closed'],ei=ri(0,6);
  if(ei===0)for(let ex of[elx,erx]){rect(ex,ey,ex+1,ey+1,p.eyes);px(ex,ey,p.outline)}
  else if(ei===1)for(let ex of[elx,erx])rect(ex-1,ey-1,ex+2,ey+2,p.eyes,p.outline);
  else if(ei===2)for(let ex of[elx,erx]){rect(ex,ey,ex+1,ey+1,p.eyes);hl(ey-1,ex,ex+1,p.outline)}
  else if(ei===3)for(let ex of[elx,erx]){px(ex,ey,p.outline);px(ex+1,ey+1,p.outline);px(ex+1,ey,p.outline);px(ex,ey+1,p.outline)}
  else if(ei===4)for(let ex of[elx,erx]){px(ex,ey,p.accent);px(ex+1,ey,p.accent)}
  else for(let ex of[elx,erx])hl(ey,ex,ex+1,p.outline);
  px(cx2,hy+Math.floor(hh*2/3)-1,p.outline);
  const my=hy+hh-3,mw=Math.floor(hw/3),mx=cx2-Math.floor(mw/2);
  const ms=['Smile','Frown','Open','Teeth','Line'],mi=ri(0,5);
  if(mi===0){hl(my,mx,mx+mw,p.outline);px(mx-1,my-1,p.outline);px(mx+mw+1,my-1,p.outline)}
  else if(mi===1){hl(my,mx,mx+mw,p.outline);px(mx-1,my+1,p.outline);px(mx+mw+1,my+1,p.outline)}
  else if(mi===2)rect(mx,my-1,mx+mw,my+1,p.accent,p.outline);
  else if(mi===3){rect(mx,my,mx+mw,my+1,[240,240,240],p.outline);for(let tx=mx;tx<mx+mw;tx+=2)vl(tx+1,my,my+1,p.outline)}
  else hl(my,mx,mx+mw,p.outline);
  const ny=hy+hh+1,nw=Math.floor(hw/4);rect(cx2-nw,ny,cx2+nw,ny+2,p.skin,p.outline);
  const cs=['T-Shirt','Suit','Hoodie','Jacket','Robe'],ci=ri(0,5);
  rect(cx2-7,ny+2,cx2+7,S-1,p.clothing,p.outline);
  if(ci===1){rect(cx2-2,ny+2,cx2+2,ny+6,[240,240,240]);px(cx2,ny+3,p.accent)}
  else if(ci===2)rect(cx2-3,ny+2,cx2+3,ny+5,p.hair);
  else if(ci===3){rect(cx2-7,ny+2,cx2-4,S-1,p.accent,p.outline);rect(cx2+4,ny+2,cx2+7,S-1,p.accent,p.outline)}
  const as2=['None','Glasses','Scar','Tears'],ai=ri(0,4);
  if(ai===1)for(let ex of[cx2-4,cx2+2]){rect(ex,ey-1,ex+3,ey+2,null,p.accent);hl(ey,cx2-1,cx2+1,p.accent)}
  else if(ai===2)vl(cx2+3,ey,ey+3,p.accent);
  else if(ai===3){px(cx2-3,ey+2,[100,180,255]);px(cx2-3,ey+3,[100,180,255])}
  const ep=new Set(['Glitch','Corrupted','Ghost','Terminal','Static']);
  const skull=(rng()<.18)||(ep.has(pName)&&rng()<.45);
  let eyN=es[ei],moN=ms[mi],face='Human';
  if(skull){const ol=p.outline,eY=hy+Math.floor(hh/3),ox=Math.floor(hw/4);for(let ex of[cx2-ox,cx2+ox])ov(ex,eY,3,3,[0,0,0]);const mY=hy+hh-3;hl(mY,cx2-Math.floor(hw/3),cx2+Math.floor(hw/3),ol);hl(mY+1,cx2-Math.floor(hw/3),cx2+Math.floor(hw/3),ol);for(let tx=cx2-Math.floor(hw/3)+1;tx<cx2+Math.floor(hw/3)-1;tx+=3)vl(tx,mY,mY+1,[200,200,200]);eyN='Hollow';moN='Skull Grin';face='Skull'}
  // render to offscreen
  const id=cx.createImageData(O,O);

  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=img[si],g=img[si+1],b=img[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
  for(let by=0;by<O;by+=SC)for(let bx=0;bx<O;bx+=SC){const c2=((by+SC/2)*O+(bx+SC/2))*4;const br=id.data[c2],bg2=id.data[c2+1],bb=id.data[c2+2];if(br+bg2+bb<40)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.4);id.data[i+1]=Math.min(255,bg2*1.4);id.data[i+2]=Math.min(255,bb*1.4)}for(let dy=SC-3;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}}
  if(mono)for(let i=0;i<id.data.length;i+=4){const g=Math.min(255,Math.max(0,((id.data[i]+id.data[i+1]+id.data[i+2])/3-50)*1.6));id.data[i]=id.data[i+1]=id.data[i+2]=g}
  const off=document.createElement('canvas');off.width=O;off.height=O;off.getContext('2d').putImageData(id,0,0);
  // cancel old anim
  if(window._genRaf)cancelAnimationFrame(window._genRaf);
  let gT=0;
  function gAnimBestFriend(){
    gT+=0.018;const fY=Math.sin(gT)*10,tX=Math.random()<.02?(Math.random()-.5)*14:0,tA=Math.random()<.01?(Math.random()-.5)*.07:0;
    cx.clearRect(0,0,O,O);cx.save();cx.translate(O/2+tX,O/2+fY);cx.rotate(tA);cx.drawImage(off,-O/2,-O/2);
    const al=.04+Math.abs(Math.sin(gT*.7))*.06,gr=cx.createRadialGradient(O/2,O/2,O*.25,O/2,O/2,O*.7);
    gr.addColorStop(0,'transparent');gr.addColorStop(1,`rgba(180,0,0,${al})`);
    cx.fillStyle=gr;cx.fillRect(0,0,O,O);cx.restore();window._genRaf=requestAnimationFrame(gAnimBestFriend);
  }
  gAnimBestFriend();
  // traits
  curT={'Type':'BESTFRIEND','Animation':'GIF',Palette:pName,Background:bgN,Face:face,Skin:skN,Hair:hs[hi2],Eyes:eyN,Mouth:moN,Clothing:cs[ci],Accessory:as2[ai]};
  const td=document.getElementById('traits');
  td.innerHTML=Object.entries(curT).map(([k,v],i)=>{
    const cls=k==='Type'?'uncommon':'';
    return`<div class="tr" style="animation-delay:${i*.06}s"><span class="tr-k">${k}</span><span class="tr-v ${cls}">${k==='Type'?'◈ UNCOMMON — BESTFRIEND':v}</span></div>`;
  }).join('');
  td.classList.add('show');
  // mood
  const moodScores={Eyes:{Normal:60,Wide:70,Angry:10,X:5,Star:80,Closed:40,Hollow:0},Mouth:{Smile:90,Frown:15,Open:50,Teeth:25,Line:45,'Skull Grin':5},Face:{Human:60,Skull:8},Skin:{Normal:55,Gold:75,Alien:40,Undead:15},Palette:{Cosmic:65,Forest:70,Lava:30,Ocean:72,Void:20,Toxic:25,Cyberpunk:55,Glitch:15,Ghost:18,Terminal:35,Static:28,Corrupted:8,Monochrome:12}};
  let moodPts=0,moodN=0;
  for(const[cat,val]of Object.entries(curT)){if(moodScores[cat]&&moodScores[cat][val]!=null){moodPts+=moodScores[cat][val];moodN++}}
  const moodPct=moodN?Math.round(moodPts/moodN):50;
  const moods=[[0,'ENRAGED','#ff1020'],[15,'FURIOUS','#ff3020'],[30,'ANGRY','#ff6030'],[45,'UNEASY','#ff9040'],[55,'NEUTRAL','#ccaa30'],[65,'CALM','#80cc30'],[75,'CONTENT','#50dd40'],[85,'HAPPY','#30ee50'],[95,'EUPHORIC','#00ff80']];
  let moodLabel='NEUTRAL',moodColor='#ccaa30';
  for(const[thresh,lbl,col]of moods){if(moodPct>=thresh){moodLabel=lbl;moodColor=col}}
  const moodEmojis={ENRAGED:'&#128544;',FURIOUS:'&#128545;',ANGRY:'&#128548;',UNEASY:'&#128528;',NEUTRAL:'&#128566;',CALM:'&#128522;',CONTENT:'&#128578;',HAPPY:'&#128512;',EUPHORIC:'&#129321;'};
  document.getElementById('moodVal').innerHTML=(moodEmojis[moodLabel]||'')+' '+moodLabel;
  document.getElementById('moodVal').style.color=moodColor;
  document.getElementById('moodFill').style.width=moodPct+'%';
  document.getElementById('moodFill').style.background=moodColor;
  document.getElementById('mood').classList.add('show');
  curT.Mood=moodLabel;
  document.getElementById('acts').classList.add('show');
  pulls++;document.getElementById('pulls').textContent='ENTITIES: '+pulls;
  setTimeout(()=>setStatus('ENTITY #'+pulls+' MATERIALIZED // 0x'+Math.floor(rng()*0xFFFFFF).toString(16).padStart(6,'0')),200);
}

function download(){
  if(!curT.Palette)return;
  const a=document.createElement('a');a.href=cv.toDataURL('image/jpeg',.95);
  a.download='test_exe_'+Date.now()+'.jpg';a.click();
  setStatus('EXTRACTED TO LOCAL FILESYSTEM');
}

const TWEETS=["I found test.exe on my desktop. I don't remember downloading it.","Don't open test.exe. It's too late for me.","Will you be my Best Friend?","Every time I close test.exe it creates a new entity.","I ran test.exe once. Now my screen glitches at 3AM.","test.exe generated something that looks exactly like me. Except the eyes.","If you see test.exe in your downloads folder, it's already running.","The entities from test.exe aren't generated. They were always there.","WARNING: test.exe has been classified as anomalous.","Someone sent me test.exe. Now I can't stop."];
const TAGS='\n\nhttps://opensea.io/collection/test-exe-collection\n\n#testexe #NFT #cursedNFT #pixelart #web3 #glitchart #horror';
function tweet(){if(!curT.Palette)return;window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(rc(TWEETS)+TAGS),'_blank');setStatus('TRANSMISSION INITIATED')}

generate();

// ===== AUDIO — click only =====
(function(){
  let audioCtx;
  function playClick(){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.start(t); osc.stop(t + 0.08);
  }
  window.addEventListener('mousedown', e => {
    playClick();
  });
})();

// ===== DYNAMIC TEXT CYCLER =====
(function(){
  const genText = document.getElementById('dynamicGenText');
  if(!genText) return;
  const types = ['BUDDY', 'BEST FRIEND', 'MONSTER'];
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % types.length;
    genText.style.opacity = 0;
    setTimeout(() => {
      genText.textContent = '[' + types[idx] + ']';
      if(types[idx] === 'MONSTER') {
          genText.style.color = '#ff2040';
          genText.style.textShadow = '0 0 10px rgba(255,0,0,0.5)';
      } else {
          genText.style.color = 'var(--g)';
          genText.style.textShadow = 'none';
      }
      genText.style.opacity = 1;
    }, 200);
  }, 2500);
})();
