// ===== MONSTER ARENA JS =====

// Static bg + glitch + cursor (shared)
(function(){
  const sBg=document.getElementById('staticBg');if(!sBg)return;
  const sCtx=sBg.getContext('2d');
  function resize(){sBg.width=window.innerWidth;sBg.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);
  function draw(){const w=sBg.width,h=sBg.height,id=sCtx.createImageData(w,h),d=id.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255;d[i]=v*.15;d[i+1]=v*.1;d[i+2]=v*.1;d[i+3]=255}sCtx.putImageData(id,0,0);requestAnimationFrame(draw)}
  draw();
})();
(function(){
  const ov=document.getElementById('glitchOverlay');if(!ov)return;
  function trigger(){ov.innerHTML='';const n=3+Math.floor(Math.random()*5);for(let i=0;i<n;i++){const bar=document.createElement('div'),top=Math.random()*100,h=1+Math.random()*8,s=(Math.random()-.5)*30;bar.style.cssText=`position:absolute;top:${top}%;left:0;right:0;height:${h}px;background:rgba(255,32,64,0.06);transform:translateX(${s}px)`;ov.appendChild(bar)}ov.classList.add('active');setTimeout(()=>{ov.classList.remove('active');ov.innerHTML=''},100);setTimeout(trigger,3000+Math.random()*8000)}
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
  const colors=['#ff2040','#cc1a33','#ff5060','#990011'];
  document.addEventListener('mousedown',e=>{
    const count=6+Math.floor(Math.random()*4);
    for(let i=0;i<count;i++){const p=document.createElement('div');p.className='click-particle';const sz=3+Math.floor(Math.random()*5);p.style.width=sz+'px';p.style.height=sz+'px';p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];container.appendChild(p);const vx=(Math.random()-.5)*12,vy0=-Math.random()*8-2;let x=0,y=0,vyC=vy0,op=1;function anim(){x+=vx;vyC+=.4;y+=vyC;op-=.025;if(op<=0){p.remove();return}p.style.transform=`translate(${x}px,${y}px)`;p.style.opacity=op;requestAnimationFrame(anim)}requestAnimationFrame(anim)}
  });
})();

// ===== ENTITY DATA =====
const ENTITIES = [
  {name:'SHADOW KNIGHT',desc:'Forged in dark data.',seed:420},
  {name:'ABYSS WARRIOR',desc:'Relentless combatant.',seed:877},
  {name:'DOOM BRINGER',desc:'Leaves no survivors.',seed:1654},
  {name:'NIGHTMARE FIEND',desc:'Feeds on fear.',seed:2431},
  {name:'GRIM REAPER',desc:'Harvests enemy tokens.',seed:3208},
  {name:'VOID GLADIATOR',desc:'Unbeatable in the arena.',seed:3985},
  {name:'CHAOS BRINGER',desc:'Thrives in destruction.',seed:4762},
  {name:'PHANTOM ASSASSIN',desc:'Strikes unseen.',seed:5539}
];

const params = new URLSearchParams(window.location.search);
const entityId = parseInt(params.get('id')) || 0;
const entity = ENTITIES[entityId] || ENTITIES[0];

// ===== GENERATOR ENGINE =====
const S=32,SC=16,O=S*SC;
const MONO_P={bg:[10,10,10],skin:[200,200,200],outline:[0,0,0],hair:[150,150,150],eyes:[255,255,255],clothing:[80,80,80],accent:[180,180,180]};

let rs=0;
function rng(){rs^=rs<<13;rs^=rs>>17;rs^=rs<<5;return(rs>>>0)/4294967296}
function ri(a,b){return a+Math.floor(rng()*(b-a))}

function buildEntityOffscreen(seedValue){
  rs=seedValue;
  const buf=new Uint8Array(S*S*3);
  function bpx(x,y,c){if(x>=0&&x<S&&y>=0&&y<S){const i=(y*S+x)*3;buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2]}}
  const DK=[8,8,8],MD=[80,80,80],LT=[170,170,170],WH=[230,230,230],CX=16;
  const hood=ri(0,5),skull=ri(0,5),robe=ri(0,4),weapon=ri(0,5),sigil=ri(0,5);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const v=8+Math.floor(Math.sin(x*.7+y*.5)*4);bpx(x,y,[v,v,v]);}
  if(skull<3)for(let y=0;y<S;y+=4)for(let x=0;x<S;x+=5){const sv=Math.sin(x*7.3+y*13.7);if(sv>.82){const bv=30+Math.floor(sv*50);bpx(x,y,[bv,bv,bv]);}}
  for(let y=0;y<13;y++)for(let x=0;x<S;x++){const dx=x-CX,dy=y-8,d=(dx/9)**2+(dy/7)**2;if(d<1)bpx(x,y,DK);else if(d<1.18)bpx(x,y,MD);}
  if(hood===0){bpx(CX,1,MD);bpx(CX,2,DK);} 
  else if(hood===2){for(let x=8;x<24;x+=3)bpx(x,12,DK);} 
  else if(hood===3){for(const cx2 of[CX-3,CX,CX+3])for(let dy=0;dy<3;dy++)bpx(cx2,dy+1,MD);} 
  else if(hood===4){bpx(CX-3,1,MD);bpx(CX+3,1,MD);bpx(CX-3,2,DK);bpx(CX+3,2,DK);} 
  const fY=11;
  for(let y=fY;y<fY+8;y++)for(let x=0;x<S;x++){const dx=x-CX,dy=y-fY-4,d=(dx/5)**2+(dy/4)**2;if(d<1)bpx(x,y,WH);else if(d<1.2)bpx(x,y,LT);}
  for(const ex of[CX-2,CX+2])for(let dy=0;dy<2;dy++)for(let dx=-1;dx<=1;dx++)bpx(ex+dx,fY+2+dy,DK); 
  bpx(CX-1,fY+5,DK);bpx(CX+1,fY+5,DK); 
  for(let x=CX-3;x<=CX+3;x++)bpx(x,fY+6,DK); 
  for(let x=CX-2;x<=CX+2;x+=2)bpx(x,fY+7,WH); 
  if(skull===1){bpx(CX+1,fY,DK);bpx(CX+2,fY+1,DK);bpx(CX+1,fY+2,DK);} 
  else if(skull===3){for(let i=0;i<4;i++){bpx(CX-4-i,fY-i,MD);bpx(CX+4+i,fY-i,MD);}} 
  else if(skull===4){for(let i=-3;i<=3;i++)bpx(CX+i,fY-1,MD);for(const cx2 of[CX-2,CX,CX+2])bpx(cx2,fY-2,WH);} 
  for(let y=19;y<S;y++){const sp=Math.floor((y-19)*.55),x1=Math.max(0,8-sp),x2=Math.min(S-1,23+sp);for(let x=x1;x<=x2;x++)bpx(x,y,DK);if(robe===0){bpx(x1,y,MD);bpx(x2,y,MD);}else if(robe===1&&y%3===0){bpx(x1+2,y,MD);bpx(x2-2,y,MD);}else if(robe===3&&(y-19)%3===0)for(let x=x1+2;x<=x2-2;x+=3)bpx(x,y,MD);}
  if(weapon===1){for(let y=8;y<28;y++)bpx(25,y,MD);for(let i=0;i<5;i++){bpx(25-i,8+i,LT);bpx(24-i,8+i,MD);}} 
  else if(weapon===2){for(let y=19;y<25;y++)for(let x=6;x<10;x++)bpx(x,y,MD);bpx(8,18,MD);bpx(8,19,WH);bpx(8,20,WH);} 
  else if(weapon===3){for(let y=18;y<25;y++){const w=Math.abs(y-21);for(let x=6-w;x<=9+w;x++)bpx(x,y,MD);}} 
  else if(weapon===4){for(let y=5;y<28;y++)bpx(24,y,MD);for(const dx of[-1,0,1])bpx(24+dx,5,WH);} 
  const siX=CX,siY=24;
  if(sigil===1){for(const[dx,dy]of[[0,0],[0,-1],[0,1],[-1,0],[1,0]])bpx(siX+dx,siY+dy,MD);bpx(siX,siY,WH);} 
  else if(sigil===2){bpx(siX,siY-1,MD);bpx(siX,siY,MD);bpx(siX,siY+1,MD);bpx(siX-1,siY,MD);bpx(siX+1,siY,MD);} 
  else if(sigil===3){for(let d=0;d<3;d++){bpx(siX-1+d,siY-1+d,LT);bpx(siX+1-d,siY-1+d,LT);}} 
  else if(sigil===4){for(const[dx,dy]of[[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]])bpx(siX+dx,siY+dy,LT);bpx(siX,siY,WH);} 
  const id=new ImageData(O,O);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=buf[si],g=buf[si+1],b=buf[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
  for(let i=0;i<id.data.length;i+=4){const v=Math.min(255,Math.max(0,((id.data[i]+id.data[i+1]+id.data[i+2])/3-30)*1.9));id.data[i]=id.data[i+1]=id.data[i+2]=v}
  for(let by=0;by<O;by+=SC)for(let bx=0;bx<O;bx+=SC){const c2=((by+SC/2)*O+(bx+SC/2))*4;const br=id.data[c2];if(br<10)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=id.data[i+1]=id.data[i+2]=Math.min(255,br*1.5)}for(let dy=SC-3;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=id.data[i+1]=id.data[i+2]=br*.4}}
  const off=document.createElement('canvas');off.width=O;off.height=O;
  off.getContext('2d').putImageData(id,0,0);return off;
}

const playerOffscreen = buildEntityOffscreen(entity.seed);
let enemyOffscreen = null;
const pCv=document.getElementById('monsterCanvas'), pCtx=pCv.getContext('2d');
const eCv=document.getElementById('enemyCanvas'), eCtx=eCv.getContext('2d');

let pAnimT=0, eAnimT=0;
let pScan=0, eScan=0;
let pAttacking=false, eAttacking=false;

function drawMonsters(){
  // Player
  pAnimT+= pAttacking ? 0.05 : 0.012;
  const pPulse=0.97+Math.sin(pAnimT)* (pAttacking ? 0.08 : 0.03);
  pCtx.clearRect(0,0,O,O);
  pCtx.save();
  pCtx.translate(O/2,O/2);
  if(pAttacking) pCtx.translate((Math.random()-.5)*15, (Math.random()-.5)*15);
  pCtx.scale(pPulse,pPulse);
  pCtx.drawImage(playerOffscreen,-O/2,-O/2);
  pCtx.restore();
  pScan=(pScan+ (pAttacking?8:2))%O;
  pCtx.fillStyle='rgba(255,255,255,0.04)';
  pCtx.fillRect(0,pScan,O,3);
  if(Math.random()<.08 || (pAttacking && Math.random()<.3)){
    pCtx.fillStyle=`rgba(0,255,65,${Math.random()*.1})`;
    pCtx.fillRect(0,0,O,O);
  }

  // Enemy
  if(enemyOffscreen) {
      eAnimT+= eAttacking ? 0.05 : 0.012;
      const ePulse=0.97+Math.sin(eAnimT)* (eAttacking ? 0.08 : 0.03);
      eCtx.clearRect(0,0,O,O);
      eCtx.save();
      eCtx.translate(O/2,O/2);
      if(eAttacking) eCtx.translate((Math.random()-.5)*15, (Math.random()-.5)*15);
      eCtx.scale(ePulse,ePulse);
      eCtx.drawImage(enemyOffscreen,-O/2,-O/2);
      eCtx.restore();
      eScan=(eScan+ (eAttacking?8:2))%O;
      eCtx.fillStyle='rgba(255,255,255,0.04)';
      eCtx.fillRect(0,eScan,O,3);
      if(Math.random()<.08 || (eAttacking && Math.random()<.3)){
        eCtx.fillStyle=`rgba(255,32,64,${Math.random()*.1})`;
        eCtx.fillRect(0,0,O,O);
      }
  } else {
      eCtx.clearRect(0,0,O,O);
  }

  requestAnimationFrame(drawMonsters);
}
drawMonsters();


// ===== DUNGEON LOGIC =====
const DB_GLOBAL_KEY = 'testexe_global_inventory';

function loadInv() {
  return JSON.parse(sessionStorage.getItem(DB_GLOBAL_KEY)) || { food:10, leaderpoints:0, chestpoints:0, souls:5, tokens:5000 };
}
function saveInv(inv) {
  sessionStorage.setItem(DB_GLOBAL_KEY, JSON.stringify(inv));
}

let inv = loadInv();
let log = [];

document.getElementById('monsterNameSm').textContent = entity.name;

function updateArenaUI() {
    inv = loadInv();
    document.getElementById('invSouls').textContent = inv.souls;
    document.getElementById('invTokens').textContent = inv.tokens;
    
    document.getElementById('currentFloorText').textContent = currentFloor;
    document.getElementById('lootRiskText').textContent = accLoot.tokens + " TOKENS";
    
    // HPs
    const pHp = document.getElementById('playerHp');
    const eHp = document.getElementById('enemyHp');
    pHp.value = playerHP; pHp.max = playerMaxHP;
    document.getElementById('playerHpText').textContent = `${Math.floor(playerHP)}/${playerMaxHP}`;
    
    eHp.value = enemyHP; eHp.max = enemyMaxHP;
    document.getElementById('enemyHpText').textContent = `${Math.floor(enemyHP)}/${enemyMaxHP}`;
}

function addLog(msg, cssClass='') {
    const t=new Date().toLocaleTimeString();
    let span = `<span>[${t}] ${msg}</span>`;
    if(cssClass) {
        span = `<span class="${cssClass}">[${t}] ${msg}</span>`;
    }
    log.push(span);
    if(log.length>30)log.shift();
    const el=document.getElementById('battleLog');
    el.innerHTML=log.join('<br>');
    el.scrollTop=el.scrollHeight;
}

// State
let inDungeon = false;
let currentFloor = 1;
let riskOffering = 0;
let accLoot = { tokens: 0, food: 0, lp: 0, cp: 0 };
let playerMaxHP = 100, playerHP = 100;
let enemyMaxHP = 100, enemyHP = 100;
let currentEnemyName = "???";

function startDungeon() {
    if(inDungeon) return;
    
    inv = loadInv();
    const wagerEl = document.getElementById('wagerAmount');
    const wager = parseInt(wagerEl.value);
    
    if(isNaN(wager) || wager <= 0) {
        addLog("Invalid RISK OFFERING amount.", "log-lose");
        return;
    }
    if(inv.tokens < wager) {
        addLog("Not enough TOKENS for this offering.", "log-lose");
        return;
    }
    if(inv.souls < 1) {
        addLog("Not enough SOULS to open the Dungeon.", "log-lose");
        return;
    }
    
    // Deduct
    inv.souls -= 1;
    inv.tokens -= wager;
    saveInv(inv);
    
    inDungeon = true;
    currentFloor = 1;
    riskOffering = wager;
    accLoot = { tokens: 0, food: 0, lp: 0, cp: 0 };
    playerMaxHP = 100;
    playerHP = 100;
    
    document.getElementById('preBattleMenu').style.display = 'none';
    document.getElementById('battleMenu').style.display = 'grid';
    document.getElementById('enemySide').style.opacity = '1';
    
    addLog(`--- DUNGEON OPENED ---`, "log-win");
    addLog(`Offering: ${wager} TOKENS. Soul consumed.`);
    
    spawnEnemy();
}
window.startDungeon = startDungeon;

const ENEMY_NAMES = ["MALWARE WRAITH", "CORRUPTED HOUND", "STATIC GOLEM", "NULL POINTER", "VOID STALKER"];

function spawnEnemy() {
    const seed = Math.floor(Math.random() * 9999);
    enemyOffscreen = buildEntityOffscreen(seed);
    currentEnemyName = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)] + ` v${currentFloor}`;
    document.getElementById('enemyNameSm').textContent = currentEnemyName;
    
    // Scale difficulty
    const diffMod = 1 + ((currentFloor - 1) * 0.2) + (riskOffering / 5000); // Max tokens demo is 5000
    enemyMaxHP = Math.floor(100 * diffMod);
    enemyHP = enemyMaxHP;
    
    addLog(`Floor ${currentFloor}: Encountered ${currentEnemyName}!`, "log-dmg");
    updateArenaUI();
}

function disableActions(disable) {
    document.getElementById('btnAttack').disabled = disable;
    document.getElementById('btnHeal').disabled = disable;
}

function executeAttack() {
    if(!inDungeon) return;
    disableActions(true);
    
    pAttacking = true;
    setTimeout(() => pAttacking = false, 400);
    
    const dmg = Math.floor(15 + Math.random() * 15);
    enemyHP -= dmg;
    addLog(`${entity.name} attacks! Dealt ${dmg} damage to ${currentEnemyName}.`, "log-win");
    
    if(enemyHP <= 0) {
        enemyHP = 0;
        updateArenaUI();
        setTimeout(handleVictory, 500);
    } else {
        updateArenaUI();
        setTimeout(enemyTurn, 800);
    }
}
window.executeAttack = executeAttack;

function executeHeal() {
    if(!inDungeon) return;
    disableActions(true);
    
    const healAmt = 30;
    playerHP = Math.min(playerMaxHP, playerHP + healAmt);
    addLog(`${entity.name} restored ${healAmt} HP!`);
    updateArenaUI();
    
    setTimeout(enemyTurn, 800);
}
window.executeHeal = executeHeal;

function enemyTurn() {
    eAttacking = true;
    setTimeout(() => eAttacking = false, 400);
    
    const diffMod = 1 + (currentFloor * 0.1);
    const dmg = Math.floor((10 + Math.random() * 10) * diffMod);
    playerHP -= dmg;
    
    addLog(`${currentEnemyName} strikes back! Took ${dmg} damage.`, "log-lose");
    
    if(playerHP <= 0) {
        playerHP = 0;
        updateArenaUI();
        setTimeout(handleDeath, 500);
    } else {
        updateArenaUI();
        disableActions(false);
    }
}

function handleVictory() {
    addLog(`>>> ${currentEnemyName} DEFEATED! <<<`, "log-win");
    
    // Calc loot
    const tokenReward = Math.floor(riskOffering * 0.5 * currentFloor);
    const foodDrop = Math.random() < 0.3 ? 1 : 0;
    const lpDrop = Math.floor(Math.random() * 50);
    const cpDrop = Math.floor(Math.random() * 50);
    
    accLoot.tokens += tokenReward;
    accLoot.food += foodDrop;
    accLoot.lp += lpDrop;
    accLoot.cp += cpDrop;
    
    addLog(`Found ${tokenReward} TOKENS!`);
    if(foodDrop) addLog(`Found 1x FOOD!`);
    
    document.getElementById('battleMenu').style.display = 'none';
    document.getElementById('victoryMenu').style.display = 'grid';
    updateArenaUI();
    disableActions(false);
}

function proceedFloor() {
    currentFloor++;
    document.getElementById('victoryMenu').style.display = 'none';
    document.getElementById('battleMenu').style.display = 'grid';
    spawnEnemy();
}
window.proceedFloor = proceedFloor;

function exitDungeon() {
    addLog(`ESCAPED THE DUNGEON. Banked ${accLoot.tokens} TOKENS!`, "log-win");
    
    inv = loadInv();
    inv.tokens += accLoot.tokens;
    inv.food += accLoot.food;
    inv.leaderpoints += accLoot.lp;
    inv.chestpoints += accLoot.cp;
    saveInv(inv);
    
    const text = `I reached Floor ${currentFloor} and escaped the Monster Arena on test.exe with ${accLoot.tokens} TOKENS! ☠️ (This is still a test phase) #testexe #NFT`;
    const url = `https://opensea.io/collection/test-exe-collection/overview`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    
    endDungeon();
}
window.exitDungeon = exitDungeon;

function handleDeath() {
    addLog(`>>> ${entity.name} WAS SLAIN! <<<`, "log-lose");
    addLog(`You lost your Risk Offering and all unbanked loot.`, "log-lose");
    endDungeon();
}

function endDungeon() {
    inDungeon = false;
    document.getElementById('battleMenu').style.display = 'none';
    document.getElementById('victoryMenu').style.display = 'none';
    document.getElementById('preBattleMenu').style.display = 'block';
    document.getElementById('enemySide').style.opacity = '0.3';
    
    enemyOffscreen = null;
    document.getElementById('enemyNameSm').textContent = "???";
    
    updateArenaUI();
}

updateArenaUI();
