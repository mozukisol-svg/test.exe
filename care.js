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
  function tick(){cx+=(mx-cx)*.35;cy+=(my-cy)*.35;dot.style.left=cx+'px';dot.style.top=cy+'px';requestAnimationFrame(tick)}
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
const pn=Object.keys(PALS);
let rs=entity.seed;
function rng(){rs^=rs<<13;rs^=rs>>17;rs^=rs<<5;return(rs>>>0)/4294967296}
function ri(a,b){return a+Math.floor(rng()*(b-a))}
function rc(a){return a[Math.floor(rng()*a.length)]}
const img=new Uint8Array(S*S*3);
function px(x,y,c){if(x>=0&&x<S&&y>=0&&y<S){const i=(y*S+x)*3;img[i]=c[0];img[i+1]=c[1];img[i+2]=c[2]}}
function rect(x1,y1,x2,y2,c,o){for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(c)px(x,y,c);if(o){for(let x=x1;x<=x2;x++){px(x,y1,o);px(x,y2,o)}for(let y=y1;y<=y2;y++){px(x1,y,o);px(x2,y,o)}}}
function hl(y,x1,x2,c){for(let x=x1;x<=x2;x++)px(x,y,c)}
function vl(x,y1,y2,c){for(let y=y1;y<=y2;y++)px(x,y,c)}
function ov(a,b,rx,ry,c,o){for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d<=1)px(x,y,c)};if(o)for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d>=.85&&d<=1.15)px(x,y,o)}}

function renderEntity(){
  rs=entity.seed;img.fill(0);
  let p={...PALS[rc(pn)]};
  for(let y=0;y<S;y++)for(let x=0;x<S;x++)px(x,y,p.bg);
  const cx2=S/2+ri(-2,3),hy=ri(9,14),hw=ri(10,14),hh=ri(10,14);
  ov(cx2,hy+Math.floor(hh/2),Math.floor(hw/2),Math.floor(hh/2),p.skin,p.outline);
  const hx=cx2-Math.floor(hw/2),hi2=ri(0,6);
  if(hi2===0)rect(hx,hy-3,hx+hw-1,hy,p.hair,p.outline);
  else if(hi2===1){rect(hx,hy-4,hx+hw-1,hy,p.hair,p.outline);vl(hx-1,hy,hy+6,p.hair);vl(hx+hw,hy,hy+6,p.hair)}
  else if(hi2===2){for(let i=0;i<ri(3,6);i++){const sx=hx+i*Math.floor(hw/4)+2;for(let dy=0;dy<ri(3,7);dy++)px(sx,hy-dy,p.hair)}rect(hx,hy-1,hx+hw-1,hy,p.hair)}
  const ey=hy+Math.floor(hh/3),elx=cx2-Math.floor(hw/4)-1,erx=cx2+Math.floor(hw/4)-1;
  for(let ex of[elx,erx]){rect(ex,ey,ex+1,ey+1,p.eyes);px(ex,ey,p.outline)}
  hl(hy+hh-3,cx2-Math.floor(Math.floor(hw/3)/2),cx2-Math.floor(Math.floor(hw/3)/2)+Math.floor(hw/3),p.outline);
  const ny=hy+hh+1,nw=Math.floor(hw/4);rect(cx2-nw,ny,cx2+nw,ny+2,p.skin,p.outline);
  rect(cx2-7,ny+2,cx2+7,S-1,p.clothing,p.outline);
  // Render
  const id=ctx.createImageData(O,O);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=img[si],g=img[si+1],b=img[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
  ctx.putImageData(id,0,0);
}
renderEntity();

// ===== UI =====
document.getElementById('careName').textContent='['+entity.name+']';
document.getElementById('careNameSm').textContent=entity.name;
document.getElementById('careDesc').textContent=entity.desc;

// ===== STATS =====
const SAVE_KEY = 'testexe_care_'+entityId;

// Generate different starting stats per entity using seed
function defaultStats(){
  let s=entity.seed*31;
  function sr(){s^=s<<13;s^=s>>17;s^=s<<5;return(s>>>0)/4294967296}
  return{
    hunger:Math.floor(30+sr()*40),
    thirst:Math.floor(25+sr()*45),
    insanity:Math.floor(40+sr()*30),
    cleanliness:Math.floor(35+sr()*35),
    energy:Math.floor(30+sr()*40),
    reward:0
  };
}

let stats = defaultStats();
if(stats.reward === undefined) stats.reward = 0;
let sleepStart = 0;
let sleeping = false;
let log = [];

function save(){
  // No persistence — stats reset on reload
}

function clamp(v){return Math.max(0,Math.min(100,Math.round(v)))}

function getBarColor(val, inverse){
  if(inverse){// High = bad (insanity)
    if(val>70)return '#ff2040';if(val>40)return '#ffaa00';return '#00ff41';
  }
  if(val<20)return '#ff2040';if(val<50)return '#ffaa00';return '#00ff41';
}

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
  // Check sleep
  if(sleeping || sleepStart > 0){
    checkSleep();
  }
  // Reward bar
  const rBar=document.getElementById('rewardBar');
  const rVal=document.getElementById('rewardVal');
  const rBtn=document.getElementById('btnClaim');
  if(rBar){rBar.style.width=stats.reward+'%';rBar.style.background=stats.reward>=100?'linear-gradient(90deg,#ffd700,#ffee80)':'linear-gradient(90deg,#ffd700,#ffaa00)'}
  if(rVal)rVal.textContent=stats.reward;
  if(rBtn)rBtn.style.display=stats.reward>=100?'block':'none';
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
function doAction(type){
  if(sleeping){addLog(entity.name+' is sleeping. Wait for them to wake up.');return}
  switch(type){
    case 'eat':
      if(stats.hunger>=100){addLog('HUNGER is already full.');return}
      stats.hunger=clamp(stats.hunger+20);
      addLog(entity.name+' ate. HUNGER +20');
      break;
    case 'drink':
      if(stats.thirst>=100){addLog('THIRST is already full.');return}
      stats.thirst=clamp(stats.thirst+20);
      addLog(entity.name+' drank. THIRST +20');
      break;
    case 'clean':
      if(stats.cleanliness>=100){addLog('Already spotless.');return}
      stats.cleanliness=clamp(stats.cleanliness+25);
      addLog(entity.name+' was bathed. CLEANLINESS +25');
      break;
    case 'sleep':
      if(sleeping||sleepStart>0){addLog('Already sleeping...');return}
      if(stats.energy>=100){addLog('ENERGY is already full.');return}
      sleeping=true;
      sleepStart=Date.now();
      addLog(entity.name+' fell asleep. ENERGY will recover over time. (5 min = +1)');
      break;
  }
  updateUI();save();
}
window.doAction = doAction;

function checkSleep(){
  if(!sleepStart) return;
  const elapsed = Date.now() - sleepStart;
  const gained = Math.floor(elapsed / (5*60*1000)); // 5 min per 1 energy
  const timerEl = document.getElementById('sleepTimer');
  if(gained > 0){
    stats.energy = clamp(stats.energy + gained);
    sleepStart = Date.now();
    if(stats.energy >= 100){
      sleeping = false; sleepStart = 0;
      timerEl.textContent = '';
      addLog(entity.name+' woke up. ENERGY is full!');
    }
  }
  if(sleeping){
    const nextIn = (5*60*1000) - (elapsed % (5*60*1000));
    const mins = Math.floor(nextIn/60000);
    const secs = Math.floor((nextIn%60000)/1000);
    timerEl.textContent = 'SLEEPING... NEXT +1 ENERGY IN '+mins+'m '+secs+'s';
  }
  save();
}

// ===== PET / PAT =====
const petMsg = document.getElementById('petMsg');
let petTimeout;
cv.addEventListener('mousedown', function(){
  if(sleeping){addLog(entity.name+' is sleeping... don\'t wake them.');return}
  stats.insanity = clamp(stats.insanity - 5);
  petMsg.textContent = ['♥ THEY FEEL CALMER ♥','♥ PURRING... ♥','♥ INSANITY -5 ♥','♥ THEY LIKE YOU ♥','♥ SOOTHING... ♥'][Math.floor(Math.random()*5)];
  petMsg.classList.add('show');
  clearTimeout(petTimeout);
  petTimeout = setTimeout(()=>petMsg.classList.remove('show'), 1500);
  addLog('You petted '+entity.name+'. INSANITY -5');
  updateUI();save();
});

// ===== DECAY OVER TIME =====
function decay(){
  stats.hunger = clamp(stats.hunger - 5);
  stats.thirst = clamp(stats.thirst - 5);
  stats.cleanliness = clamp(stats.cleanliness - 5);
  stats.insanity = clamp(stats.insanity + 5);
  if(!sleeping) stats.energy = clamp(stats.energy - 5);
  const hasRed = stats.hunger<20 || stats.thirst<20 || stats.cleanliness<20 || stats.energy<20 || stats.insanity>70;
  const hasYellow = stats.hunger<50 || stats.thirst<50 || stats.cleanliness<50 || stats.energy<50 || stats.insanity>40;

  if(hasRed){
    stats.reward = clamp(stats.reward - 5);
  } else if(hasYellow){
    stats.reward = clamp(stats.reward - 2);
  } else {
    // All green
    if(stats.reward < 100) stats.reward = clamp(stats.reward + 1);
  }
  updateUI();save();
}
setInterval(decay, 30000);

// ===== INIT =====
updateUI();
setInterval(()=>{if(sleeping)updateUI()},1000); // update sleep timer
addLog('Loaded ['+entity.name+']. Take care of them.');

// Render log
const el=document.getElementById('careLog');
el.innerHTML=log.map(l=>'> '+l).join('<br>');
el.scrollTop=el.scrollHeight;

// ===== CLAIM REWARD =====
function claimReward(){
  if(stats.reward < 100){ addLog('[REWARD] is not ready yet.'); return; }
  stats.reward = 0;
  addLog('🏆 [REWARD] CLAIMED! '+entity.name+' is grateful. Reward has been reset.');
  updateUI();save();

  const text = encodeURIComponent("I just claimed a reward from taking care of my Best Friend! 🏆\n\nTake care of your own entity at:\nhttps://opensea.io/collection/test-exe-collection/overview\n\n#testexe #NFT #cursedNFT #web3");
  window.open('https://twitter.com/intent/tweet?text=' + text, '_blank');
}
window.claimReward = claimReward;
