// ===== CUSTOM CURSOR (smooth lerp) =====
(function(){
  const dot = document.getElementById('cursorDot');
  if(!dot) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function tick(){
    cx += (mx - cx) * 0.35;
    cy += (my - cy) * 0.35;
    dot.style.left = cx + 'px';
    dot.style.top = cy + 'px';
    requestAnimationFrame(tick);
  }
  tick();
})();

// ===== CLICK PARTICLES (Minecraft break effect) =====
(function(){
  const container = document.getElementById('particleContainer');
  if(!container) return;
  const colors = ['#00ff41','#00cc33','#006622','#00ff80','#003311','#88ffaa','#004415','#ffffff'];
  document.addEventListener('mousedown', e => {
    const count = 6 + Math.floor(Math.random()*5);
    for(let i = 0; i < count; i++){
      const p = document.createElement('div');
      p.className = 'click-particle';
      const size = 3 + Math.floor(Math.random()*5);
      p.style.width = size+'px'; p.style.height = size+'px';
      p.style.left = e.clientX+'px'; p.style.top = e.clientY+'px';
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      container.appendChild(p);
      const vx = (Math.random()-0.5)*12;
      const vy = -Math.random()*8 - 2;
      const gravity = 0.4;
      let x=0, y=0, vyC=vy, opacity=1;
      function animate(){
        x += vx; vyC += gravity; y += vyC; opacity -= 0.025;
        if(opacity <= 0){ p.remove(); return; }
        p.style.transform = `translate(${x}px,${y}px)`;
        p.style.opacity = opacity;
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  });
})();

// ===== STATIC BACKGROUND =====
(function(){
  const sBg=document.getElementById('staticBg');if(!sBg)return;
  const sCtx=sBg.getContext('2d');
  function resize(){sBg.width=window.innerWidth;sBg.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);
  function draw(){const w=sBg.width,h=sBg.height,id=sCtx.createImageData(w,h),d=id.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255;d[i]=v*.15;d[i+1]=v*.5;d[i+2]=v*.1;d[i+3]=255}sCtx.putImageData(id,0,0);requestAnimationFrame(draw)}
  draw();
})();

// ===== GLITCH EFFECT =====
(function(){
  const ov=document.getElementById('glitchOverlay');if(!ov)return;
  function trigger(){ov.innerHTML='';const n=3+Math.floor(Math.random()*5);for(let i=0;i<n;i++){const bar=document.createElement('div'),top=Math.random()*100,h=1+Math.random()*8,s=(Math.random()-.5)*30;bar.style.cssText=`position:absolute;top:${top}%;left:0;right:0;height:${h}px;background:rgba(0,255,65,0.06);transform:translateX(${s}px);box-shadow:2px 0 4px rgba(255,0,80,0.2),-2px 0 4px rgba(0,255,200,0.2)`;ov.appendChild(bar)}ov.classList.add('active');setTimeout(()=>{ov.classList.remove('active');ov.innerHTML=''},80+Math.random()*120);setTimeout(trigger,3000+Math.random()*8000)}
  setTimeout(trigger,2000);
})();

// ===== SCROLL REVEAL =====
(function(){
  const obs=new IntersectionObserver(e=>{e.forEach(el=>{if(el.isIntersecting){el.target.style.opacity='1';el.target.style.transform='translateY(0)'}})},{threshold:.08});
  document.querySelectorAll('.content-block,.milestone-card,.gen-intro,.sneak-card,.mint-terminal,.game-container').forEach(el=>{
    el.style.opacity='0';el.style.transform='translateY(20px)';el.style.transition='opacity .5s ease,transform .5s ease';obs.observe(el);
  });
})();

// ===== SNEAK PEEK GENERATION =====
(function(){
  const grid = document.getElementById('sneakGrid');
  if(!grid) return;

  const S=32, SC=8, O=S*SC;
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
  let rs=42;
  function rng(){rs^=rs<<13;rs^=rs>>17;rs^=rs<<5;return(rs>>>0)/4294967296}
  function ri(a,b){return a+Math.floor(rng()*(b-a))}
  function rc(a){return a[Math.floor(rng()*a.length)]}
  const img=new Uint8Array(S*S*3);
  function px(x,y,c){if(x>=0&&x<S&&y>=0&&y<S){const i=(y*S+x)*3;img[i]=c[0];img[i+1]=c[1];img[i+2]=c[2]}}
  function rect(x1,y1,x2,y2,c,o){for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(c)px(x,y,c);if(o){for(let x=x1;x<=x2;x++){px(x,y1,o);px(x,y2,o)}for(let y=y1;y<=y2;y++){px(x1,y,o);px(x2,y,o)}}}
  function hl(y,x1,x2,c){for(let x=x1;x<=x2;x++)px(x,y,c)}
  function vl(x,y1,y2,c){for(let y=y1;y<=y2;y++)px(x,y,c)}
  function ov(a,b,rx,ry,c,o){for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d<=1)px(x,y,c)};if(o)for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d>=.85&&d<=1.15)px(x,y,o)}}

  const names=['DATA FIEND','NEON WRAITH','PIXEL PHANTOM','TOXIC SHADE','CRIMSON DRIFTER','GHOST BYTE','CYBER HUSK','GLITCH BORN'];
  const subs=['Feeds on corrupted files.','Cries when left alone.','Won\'t stop staring.','Eats everything.','Sleeps too much.','Afraid of the dark.','Hates water.','Talks to walls.'];

  for(let idx=0;idx<8;idx++){
    rs = (idx === 0 ? 420 : 100+idx*777);
    img.fill(0);
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
    const my=hy+hh-3,mw=Math.floor(hw/3),mx=cx2-Math.floor(mw/2);
    hl(my,mx,mx+mw,p.outline);
    const ny=hy+hh+1,nw=Math.floor(hw/4);rect(cx2-nw,ny,cx2+nw,ny+2,p.skin,p.outline);
    rect(cx2-7,ny+2,cx2+7,S-1,p.clothing,p.outline);

    const c=document.createElement('canvas');c.width=O;c.height=O;
    const cCtx=c.getContext('2d');
    const id=cCtx.createImageData(O,O);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=img[si],g=img[si+1],b=img[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
    cCtx.putImageData(id,0,0);

    const card = document.createElement('a');
    card.className = 'sneak-card';
    card.href = 'care.html?id='+idx;
    card.style.textDecoration='none';card.style.cursor='none';
    card.appendChild(c);
    const info = document.createElement('div');
    info.className = 'sneak-card-info';
    info.innerHTML = `<div class="sneak-card-name">${names[idx]}</div><div class="sneak-card-sub">${subs[idx]}</div>`;
    card.appendChild(info);
    grid.appendChild(card);
  }
})();

// ===== HERO PREVIEW =====
(function(){
  const hc=document.getElementById('heroCanvas');if(!hc)return;
  const hcx=hc.getContext('2d');
  const S=32,SC=16,O=S*SC,img2=new Uint8Array(S*S*3);
  let rs2=Date.now();
  function rng2(){rs2^=rs2<<13;rs2^=rs2>>17;rs2^=rs2<<5;return(rs2>>>0)/4294967296}
  function ri2(a,b){return a+Math.floor(rng2()*(b-a))}
  function rc2(a){return a[Math.floor(rng2()*a.length)]}
  function px2(x,y,c){if(x>=0&&x<S&&y>=0&&y<S){const i=(y*S+x)*3;img2[i]=c[0];img2[i+1]=c[1];img2[i+2]=c[2]}}
  function rect2(x1,y1,x2,y2,c,o){for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(c)px2(x,y,c);if(o){for(let x=x1;x<=x2;x++){px2(x,y1,o);px2(x,y2,o)}for(let y=y1;y<=y2;y++){px2(x1,y,o);px2(x2,y,o)}}}
  function hl2(y,x1,x2,c){for(let x=x1;x<=x2;x++)px2(x,y,c)}
  function vl2(x,y1,y2,c){for(let y=y1;y<=y2;y++)px2(x,y,c)}
  function ov2(a,b,rx,ry,c,o){for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d<=1)px2(x,y,c)};if(o)for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=((x-a)/rx)**2+((y-b)/ry)**2;if(d>=.85&&d<=1.15)px2(x,y,o)}}
  const PALS2={Cosmic:{bg:[18,10,40],skin:[180,100,220],outline:[0,0,0],hair:[0,220,255],eyes:[255,50,180],clothing:[60,20,100],accent:[255,200,50]},Forest:{bg:[20,40,20],skin:[210,175,120],outline:[0,0,0],hair:[80,40,10],eyes:[50,200,80],clothing:[30,80,30],accent:[200,160,40]},Toxic:{bg:[10,50,0],skin:[100,255,50],outline:[0,0,0],hair:[180,0,255],eyes:[255,255,0],clothing:[0,150,0],accent:[0,255,100]},Cyberpunk:{bg:[15,15,30],skin:[200,180,255],outline:[0,0,0],hair:[0,255,180],eyes:[255,0,100],clothing:[50,0,100],accent:[0,200,255]},Terminal:{bg:[0,10,0],skin:[0,180,0],outline:[0,0,0],hair:[0,255,0],eyes:[0,255,100],clothing:[0,80,0],accent:[0,255,50]}};
  const pn2=Object.keys(PALS2);
  function gen(){
    rs2=Date.now()^(Math.random()*0xFFFFFFFF>>>0);img2.fill(0);
    let p={...PALS2[rc2(pn2)]};
    for(let y=0;y<S;y++)for(let x=0;x<S;x++)px2(x,y,p.bg);
    const cx2=S/2+ri2(-2,3),hy=ri2(9,14),hw=ri2(10,14),hh=ri2(10,14);
    ov2(cx2,hy+Math.floor(hh/2),Math.floor(hw/2),Math.floor(hh/2),p.skin,p.outline);
    const hx=cx2-Math.floor(hw/2),hi2=ri2(0,4);
    if(hi2===0)rect2(hx,hy-3,hx+hw-1,hy,p.hair,p.outline);
    else if(hi2===1){rect2(hx,hy-4,hx+hw-1,hy,p.hair,p.outline);vl2(hx-1,hy,hy+6,p.hair)}
    else if(hi2===2){for(let i=0;i<ri2(3,5);i++){const sx=hx+i*Math.floor(hw/4)+2;for(let dy=0;dy<ri2(3,6);dy++)px2(sx,hy-dy,p.hair)}}
    const ey=hy+Math.floor(hh/3),elx=cx2-Math.floor(hw/4)-1,erx=cx2+Math.floor(hw/4)-1;
    for(let ex of[elx,erx]){rect2(ex,ey,ex+1,ey+1,p.eyes);px2(ex,ey,p.outline)}
    const my=hy+hh-3,mw=Math.floor(hw/3),mx=cx2-Math.floor(mw/2);
    hl2(my,mx,mx+mw,p.outline);
    const ny=hy+hh+1,nw=Math.floor(hw/4);rect2(cx2-nw,ny,cx2+nw,ny+2,p.skin,p.outline);
    rect2(cx2-7,ny+2,cx2+7,S-1,p.clothing,p.outline);
    const id=hcx.createImageData(O,O);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=img2[si],g=img2[si+1],b=img2[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
    hcx.putImageData(id,0,0);
  }
  gen();setInterval(gen,6000);
})();

// ===== MINT PROGRESS (OpenSea) =====
(function(){
  const countEl = document.getElementById('mintCount');
  const fillEl = document.getElementById('mintFill');
  if(!countEl || !fillEl) return;
  // Try OpenSea API
  fetch('https://api.opensea.io/api/v2/collections/test-exe-collection/stats', {
    headers: { 'accept': 'application/json' }
  }).then(r => r.json()).then(data => {
    const count = data.total?.count || data.total_supply || 0;
    countEl.textContent = count;
    fillEl.style.width = Math.min(100, (count/5000)*100) + '%';
  }).catch(() => {
    // Fallback: show 0
    countEl.textContent = '0';
    fillEl.style.width = '0%';
  });
})();

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
    if(e.target.id === 'gameCanvas') return;
    playClick();
  });
})();
