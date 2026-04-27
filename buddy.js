// ===== BUDDY EXPEDITION JS =====

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

// ===== ENTITY DATA (BUDDY ONLY) =====
const ENTITIES = [
  {name:'PIXEL PAL',desc:'Always happy to see you.',seed:420},
  {name:'NEON NIPPER',desc:'Bites wires playfully.',seed:877},
  {name:'GLITCH GOBLIN',desc:'Steals your cookies.',seed:1654},
  {name:'SPARK SPRITE',desc:'Glows in the dark.',seed:2431},
  {name:'CYBER CUB',desc:'Loves to explore the network.',seed:3208},
  {name:'DATA DUCKLING',desc:'Follows your cursor.',seed:3985},
  {name:'CHIP CHUM',desc:'Your little motherboard friend.',seed:4762},
  {name:'BYTE BUDDY',desc:'A tiny packet of joy.',seed:5539}
];

const params = new URLSearchParams(window.location.search);
const entityId = parseInt(params.get('id')) || 0;
// We must ensure the user has selected a BUDDY. Our grid alternates (isBuddy = idx%2===1).
// Let's just use the selected entity.
const entity = ENTITIES[entityId] || ENTITIES[0];

// ===== GENERATE ENTITY ART (BUDDY) =====
const S=32,SC=16,O=S*SC;
const cv=document.getElementById('buddyCanvas'),ctx=cv.getContext('2d');
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
const vpn=Object.keys(VPALS);
let rs=entity.seed;
function rng(){rs^=rs<<13;rs^=rs>>17;rs^=rs<<5;return(rs>>>0)/4294967296}
function ri(a,b){return a+Math.floor(rng()*(b-a))}

function buildVividEntity(p){
  rs=entity.seed; 
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
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
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
  else if(eye===3){for(const ex of[eLX+1,eRX+1]){for(const [dx,dy] of[[0,-1],[0,1],[-1,0],[1,0],[0,0]])bpx(ex+dx,eY+dy,p.accent);}}
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
  const id=new ImageData(O,O);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=buf[si],g=buf[si+1],b=buf[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
  for(let by=0;by<O;by+=SC)for(let bx=0;bx<O;bx+=SC){const c2=((by+SC/2)*O+(bx+SC/2))*4;const br=id.data[c2],bg2=id.data[c2+1],bb=id.data[c2+2];if(br+bg2+bb<30)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=0;dy<SC;dy++)for(let dx=0;dx<2;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=SC-3;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}for(let dy=0;dy<SC;dy++)for(let dx=SC-3;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}}
  const off=document.createElement('canvas');off.width=O;off.height=O;
  off.getContext('2d').putImageData(id,0,0);return off;
}

const entityPalette = {...VPALS[vpn[entity.seed%vpn.length]]};
const offscreen = buildVividEntity(entityPalette);

// ===== ANIMATION =====
let animT=0;
// We add a walking animation if the buddy is on expedition
let isWalking = false;

function animateBuddy(){
  animT+= isWalking ? 0.08 : 0.04;
  const bobY=Math.sin(animT)*6;
  const bobX= isWalking ? Math.sin(animT*0.5)*10 : Math.sin(animT*0.5)*2;
  const sc=1+Math.sin(animT*2)*0.01;
  ctx.clearRect(0,0,O,O);
  ctx.save();
  ctx.translate(O/2+bobX,O/2+bobY);
  ctx.scale(sc,sc);
  
  if(isWalking) {
     // Waddle effect
     ctx.rotate(Math.sin(animT) * 0.1);
  }
  
  ctx.drawImage(offscreen,-O/2,-O/2);
  
  if(!isWalking && Math.sin(animT*3)>0.92){
    ctx.fillStyle='rgba(255,220,0,0.7)';
    for(let i=0;i<3;i++){const a=animT*2+i*2.1,r=O*0.4;ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,4,0,Math.PI*2);ctx.fill();}
  }
  ctx.restore();
  requestAnimationFrame(animateBuddy);
}
animateBuddy();

// ===== UI & LOGIC =====
document.getElementById('buddyName').textContent='['+entity.name+']';
document.getElementById('buddyNameSm').textContent=entity.name;
document.getElementById('buddyDesc').textContent=entity.desc;

// Expedition State
const DB_EXP_KEY = 'testexe_expedition_' + entityId;
const DB_GLOBAL_KEY = 'testexe_global_inventory';

let expStart = 0;
let expMaxLp = 0;
let expMaxCp = 0;
let expFood = 0;
let log = [];

function loadExpedition() {
    const data = sessionStorage.getItem(DB_EXP_KEY);
    if(data) {
        const parsed = JSON.parse(data);
        expStart = parsed.start || 0;
        expMaxLp = parsed.maxLp || 0;
        expMaxCp = parsed.maxCp || 0;
        expFood = parsed.food || 0;
    }
}

function saveExpedition() {
    if(expStart > 0) {
        sessionStorage.setItem(DB_EXP_KEY, JSON.stringify({
            start: expStart,
            maxLp: expMaxLp,
            maxCp: expMaxCp,
            food: expFood
        }));
    } else {
        sessionStorage.removeItem(DB_EXP_KEY);
    }
}

function addLog(msg){
  const t=new Date().toLocaleTimeString();
  log.push('['+t+'] '+msg);
  if(log.length>8)log.shift();
  const el=document.getElementById('buddyLog');
  el.innerHTML=log.map(l=>'> '+l).join('<br>');
  el.scrollTop=el.scrollHeight;
}

function updateExpeditionUI() {
    const st = document.getElementById('expStatus');
    const timer = document.getElementById('expTimer');
    const btnD = document.getElementById('btnDispatch');
    const btnC = document.getElementById('btnClaim');
    
    const lpProg = document.getElementById('lpProgress');
    const cpProg = document.getElementById('cpProgress');
    const lpYield = document.getElementById('lpYield');
    const cpYield = document.getElementById('cpYield');
    
    if(expStart === 0) {
        isWalking = false;
        st.textContent = "READY FOR DISPATCH";
        st.style.color = "var(--g)";
        timer.textContent = "--:--:--";
        btnD.style.display = "block";
        btnC.style.display = "none";
        lpProg.value = 0; cpProg.value = 0;
        lpYield.textContent = '0'; cpYield.textContent = '0';
    } else {
        const now = Date.now();
        const elapsed = now - expStart;
        // 5 Minutes in MS
        const FIVE_MINUTES = 5 * 60 * 1000;
        const remaining = FIVE_MINUTES - elapsed;
        
        let pct = Math.min(1, Math.max(0, elapsed / FIVE_MINUTES));
        let curLp = Math.floor(expMaxLp * pct);
        let curCp = Math.floor(expMaxCp * pct);
        
        lpProg.value = pct * 100;
        cpProg.value = pct * 100;
        lpYield.textContent = curLp;
        cpYield.textContent = curCp;
        
        if(remaining <= 0) {
            isWalking = false;
            st.textContent = "EXPEDITION COMPLETE";
            st.style.color = "#ffd700";
            timer.textContent = "00:00:00";
            btnD.style.display = "none";
            btnC.style.display = "block";
        } else {
            isWalking = true;
            st.textContent = "ON EXPEDITION...";
            st.style.color = "#00ff41";
            
            const m = Math.floor((remaining % (1000*60*60)) / (1000*60));
            const s = Math.floor((remaining % (1000*60)) / 1000);
            
            timer.textContent = `00:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            btnD.style.display = "none";
            btnC.style.display = "none";
        }
    }
}

function startExpedition() {
    expStart = Date.now();
    expMaxLp = Math.floor(Math.random() * 251) + 50; // 50-300
    expMaxCp = Math.floor(Math.random() * 251) + 50; // 50-300
    expFood = Math.floor(Math.random() * 3) + 1; // 1-3 food
    saveExpedition();
    addLog(entity.name + " departed on a 5-minute expedition.");
    updateExpeditionUI();
}
window.startExpedition = startExpedition;

function claimLoot() {
    // Generate Random Loot
    let inv = JSON.parse(sessionStorage.getItem(DB_GLOBAL_KEY)) || { food:10, leaderpoints:0, chestpoints:0, souls:5, tokens:5000 };
    
    inv.food += expFood;
    inv.leaderpoints += expMaxLp;
    inv.chestpoints += expMaxCp;
    
    sessionStorage.setItem(DB_GLOBAL_KEY, JSON.stringify(inv));
    
    addLog(`🏆 RETURNED! Found ${expFood}x BESTFRIEND Food!`);
    addLog(`Earned ${expMaxLp} LP and ${expMaxCp} CP.`);
    
    const text = `Congratulate me! My BUDDY just returned from an expedition on test.exe! Found ${expFood}x BESTFRIEND Food, ${expMaxLp} LP and ${expMaxCp} CP! (This is still a test phase) #testexe #NFT`;
    const url = `https://opensea.io/collection/test-exe-collection/overview`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    
    expStart = 0;
    saveExpedition();
    updateExpeditionUI();
}
window.claimLoot = claimLoot;

// Init
loadExpedition();
updateExpeditionUI();
setInterval(updateExpeditionUI, 1000);
