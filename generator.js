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
  function tick(){cx+=(mx-cx)*.35;cy+=(my-cy)*.35;dot.style.left=cx+'px';dot.style.top=cy+'px';requestAnimationFrame(tick)}
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
const pn=Object.keys(PALS);
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
  const mono=rng()<0.001;let pName=rc(pn);let p=mono?{...MONO}:{...PALS[pName]};if(mono)pName='Monochrome';
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
  // render
  const id=cx.createImageData(O,O);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=img[si],g=img[si+1],b=img[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
  for(let by=0;by<O;by+=SC)for(let bx=0;bx<O;bx+=SC){const c2=((by+SC/2)*O+(bx+SC/2))*4;const br=id.data[c2],bg2=id.data[c2+1],bb=id.data[c2+2];if(br+bg2+bb<40)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.4);id.data[i+1]=Math.min(255,bg2*1.4);id.data[i+2]=Math.min(255,bb*1.4)}for(let dy=0;dy<SC;dy++)for(let dx=0;dx<2;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.4);id.data[i+1]=Math.min(255,bg2*1.4);id.data[i+2]=Math.min(255,bb*1.4)}for(let dy=SC-3;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}for(let dy=0;dy<SC;dy++)for(let dx=SC-3;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}}
  if(mono)for(let i=0;i<id.data.length;i+=4){const g=Math.min(255,Math.max(0,((id.data[i]+id.data[i+1]+id.data[i+2])/3-50)*1.6));id.data[i]=id.data[i+1]=id.data[i+2]=g}
  cx.putImageData(id,0,0);
  // traits
  curT={Palette:pName,Background:bgN,Face:face,Skin:skN,Hair:hs[hi2],Eyes:eyN,Mouth:moN,Clothing:cs[ci],Accessory:as2[ai]};
  const td=document.getElementById('traits');
  td.innerHTML=Object.entries(curT).map(([k,v],i)=>`<div class="tr" style="animation-delay:${i*.06}s"><span class="tr-k">${k}</span><span class="tr-v${mono?' rare':''}">${v}</span></div>`).join('');
  if(mono)td.innerHTML+=`<div class="tr" style="animation-delay:.6s"><span class="tr-k">RARITY</span><span class="tr-v rare">&#9888; ULTRA RARE</span></div>`;
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
