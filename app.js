// ===== CUSTOM CURSOR (smooth lerp) =====
(function(){
  const dot = document.getElementById('cursorDot');
  if(!dot) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function tick(){
    cx += (mx - cx) * 0.85;
    cy += (my - cy) * 0.85;
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
  const pn=Object.keys(PALS), vpn=Object.keys(VPALS);
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

  for(let idx=0;idx<3;idx++){
    rs = (idx === 0 ? 420 : 100+idx*777);
    img.fill(0);
    const type = (idx % 3 === 0) ? 'BUDDY' : (idx % 3 === 1) ? 'BESTFRIEND' : 'MONSTER';
    
    if(type === 'BUDDY') {
      let p={...VPALS[rc(vpn)]};
      const CX=16,CY=18,RX=12,RY=13,CAP_Y=14,FACE_Y=21;
      const hat=ri(0,5),eye=ri(0,5),mouth=ri(0,5),pat=ri(0,4),bgPat=ri(0,6);
      function drawBg(x,y){
        if(bgPat===1){const t=y/S;return p.bg.map(v=>Math.min(255,Math.floor(v*(1-t*.5)+255*t*.15)));}
        if(bgPat===2)return Math.sin(x*13.7+y*7.3)>.97?[255,240,180]:p.bg;
        if(bgPat===3)return ((x+y)%6<3)?p.bg:p.bg.map(v=>Math.max(0,v-35));
        if(bgPat===4)return (x%5<1&&y%5<1)?p.bg.map(v=>Math.min(255,v+80)):p.bg;
        if(bgPat===5)return ((Math.floor(x/4)+Math.floor(y/4))%2)?p.bg:p.bg.map(v=>Math.max(0,v-25));
        return p.bg;
      }
      for(let y=0;y<S;y++)for(let x=0;x<S;x++){
        const dx=x-CX,dy=y-CY,d=(dx/RX)**2+(dy/RY)**2;
        if(d>1){px(x,y,drawBg(x,y));continue}
        if(d>=0.87){px(x,y,p.outline);continue}
        if(y<CAP_Y){px(x,y,(hat===1||hat===4)?p.skin:p.hair);continue}
        if(y<FACE_Y){px(x,y,p.skin);continue}
        const ck=pat===0?(Math.floor((x-CX+RX)/3)+Math.floor((y-FACE_Y)/3))%2:pat===1?Math.floor((x-CX+RX)/3)%2:pat===2?Math.floor((y-FACE_Y)/3)%2:0;
        px(x,y,ck?p.clothing:p.accent);
      }
      const dyB=CAP_Y-CY,bW=Math.round(RX*Math.sqrt(Math.max(0,1-(dyB/RY)**2)));
      if(hat===0){hl(CAP_Y,CX-bW-2,CX+bW+2,p.hair);px(CX-bW-3,CAP_Y,p.outline);px(CX+bW+3,CAP_Y,p.outline);}
      else if(hat===1){for(const sx of[CX-4,CX,CX+4])vl(sx,5,7,p.hair);hl(8,CX-5,CX+5,p.hair);}
      else if(hat===2){px(CX,3,p.hair);for(let i=1;i<=3;i++){px(CX-i,3+i,p.hair);px(CX+i,3+i,p.hair);}hl(CAP_Y,CX-bW-2,CX+bW+2,p.hair);}
      else if(hat===3){hl(CAP_Y,CX-bW,CX+bW,p.hair);}
      else{px(CX,5,p.hair);px(CX-1,6,p.hair);px(CX+1,6,p.hair);}
      const eY=17,eLX=CX-5,eRX=CX+2;
      for(const ex of[eLX,eRX]){rect(ex,eY,ex+1,eY+1,p.outline);px(ex+(eye===3?1:0),eY,eye===3?p.accent:p.bg);}
      px(CX,18,p.outline);
      const mY=FACE_Y-1;
      if(mouth===0||mouth===2){hl(mY,CX-2,CX+2,p.outline);px(CX-3,mY-1,p.outline);px(CX+3,mY-1,p.outline);}
      else{hl(mY,CX-2,CX+2,p.outline);}
    } else if (type === 'BESTFRIEND') {
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
      rect(cx2-nw,ny,cx2+nw,ny+2,p.skin,p.outline);
      rect(cx2-7,ny+2,cx2+7,S-1,p.clothing,p.outline);
    } else {
      // MONSTER (Rare)
      const p = {bg:[10,10,10],skin:[200,200,200],outline:[0,0,0],hair:[150,150,150],eyes:[255,255,255],clothing:[80,80,80],accent:[180,180,180]};
      const DK=[8,8,8],MD=[80,80,80],LT=[170,170,170],WH=[230,230,230],CX=16;
      const hood=ri(0,5),skull=ri(0,5),robe=ri(0,4),weapon=ri(0,5),sigil=ri(0,5);
      for(let y=0;y<S;y++)for(let x=0;x<S;x++){const v=8+Math.floor(Math.sin(x*.7+y*.5)*4);px(x,y,[v,v,v]);}
      if(skull<3)for(let y=0;y<S;y+=4)for(let x=0;x<S;x+=5){const sv=Math.sin(x*7.3+y*13.7);if(sv>.82){const bv=30+Math.floor(sv*50);px(x,y,[bv,bv,bv]);}}
      for(let y=0;y<13;y++)for(let x=0;x<S;x++){const dx=x-CX,dy=y-8,d=(dx/9)**2+(dy/7)**2;if(d<1)px(x,y,DK);else if(d<1.18)px(x,y,MD);}
      if(hood===0){px(CX,1,MD);px(CX,2,DK);} else if(hood===2){for(let x=8;x<24;x+=3)px(x,12,DK);} else if(hood===3){for(const cx2 of[CX-3,CX,CX+3])for(let dy=0;dy<3;dy++)px(cx2,dy+1,MD);} else if(hood===4){px(CX-3,1,MD);px(CX+3,1,MD);px(CX-3,2,DK);px(CX+3,2,DK);}
      const fY=11;
      for(let y=fY;y<fY+8;y++)for(let x=0;x<S;x++){const dx=x-CX,dy=y-fY-4,d=(dx/5)**2+(dy/4)**2;if(d<1)px(x,y,WH);else if(d<1.2)px(x,y,LT);}
      for(const ex of[CX-2,CX+2])for(let dy=0;dy<2;dy++)for(let dx=-1;dx<=1;dx++)px(ex+dx,fY+2+dy,DK); 
      px(CX-1,fY+5,DK);px(CX+1,fY+5,DK); 
      for(let x=CX-3;x<=CX+3;x++)px(x,fY+6,DK); 
      for(let x=CX-2;x<=CX+2;x+=2)px(x,fY+7,WH); 
      if(skull===1){px(CX+1,fY,DK);px(CX+2,fY+1,DK);px(CX+1,fY+2,DK);} else if(skull===3){for(let i=0;i<4;i++){px(CX-4-i,fY-i,MD);px(CX+4+i,fY-i,MD);}} else if(skull===4){for(let i=-3;i<=3;i++)px(CX+i,fY-1,MD);for(const cx2 of[CX-2,CX,CX+2])px(cx2,fY-2,WH);}
      for(let y=19;y<S;y++){const sp=Math.floor((y-19)*.55),x1=Math.max(0,8-sp),x2=Math.min(S-1,23+sp);for(let x=x1;x<=x2;x++)px(x,y,DK);if(robe===0){px(x1,y,MD);px(x2,y,MD);}else if(robe===1&&y%3===0){px(x1+2,y,MD);px(x2-2,y,MD);}else if(robe===3&&(y-19)%3===0)for(let x=x1+2;x<=x2-2;x+=3)px(x,y,MD);}
      if(weapon===1){for(let y=8;y<28;y++)px(25,y,MD);for(let i=0;i<5;i++){px(25-i,8+i,LT);px(24-i,8+i,MD);}} else if(weapon===2){for(let y=19;y<25;y++)for(let x=6;x<10;x++)px(x,y,MD);px(8,18,MD);px(8,19,WH);px(8,20,WH);} else if(weapon===3){for(let y=18;y<25;y++){const w=Math.abs(y-21);for(let x=6-w;x<=9+w;x++)px(x,y,MD);}} else if(weapon===4){for(let y=5;y<28;y++)px(24,y,MD);for(const dx of[-1,0,1])px(24+dx,5,WH);}
      const siX=CX,siY=24;
      if(sigil===1){for(const[dx,dy]of[[0,0],[0,-1],[0,1],[-1,0],[1,0]])px(siX+dx,siY+dy,MD);px(siX,siY,WH);} else if(sigil===2){px(siX,siY-1,MD);px(siX,siY,MD);px(siX,siY+1,MD);px(siX-1,siY,MD);px(siX+1,siY,MD);} else if(sigil===3){for(let d=0;d<3;d++){px(siX-1+d,siY-1+d,LT);px(siX+1-d,siY-1+d,LT);}} else if(sigil===4){for(const[dx,dy]of[[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]])px(siX+dx,siY+dy,LT);px(siX,siY,WH);}
    }

    const c=document.createElement('canvas');c.width=O;c.height=O;
    const cCtx=c.getContext('2d');
    const id=cCtx.createImageData(O,O);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=img[si],g=img[si+1],b=img[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
    
    // Add Voxel shading
    for(let by=0;by<O;by+=SC)for(let bx=0;bx<O;bx+=SC){const c2=((by+SC/2)*O+(bx+SC/2))*4;const br=id.data[c2],bg2=id.data[c2+1],bb=id.data[c2+2];if(br+bg2+bb<30)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=0;dy<SC;dy++)for(let dx=0;dx<2;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=SC-3;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}for(let dy=0;dy<SC;dy++)for(let dx=SC-3;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}}

    cCtx.putImageData(id,0,0);

    const card = document.createElement('a');
    card.className = 'sneak-card';
    card.href = type === 'BUDDY' ? 'buddy.html?id='+idx : type === 'BESTFRIEND' ? 'care.html?id='+idx : 'monster.html?id='+idx;
    card.style.textDecoration='none';card.style.cursor='none';
    card.appendChild(c);
    const info = document.createElement('div');
    info.className = 'sneak-card-info';
    info.style.textAlign = 'center';
    info.style.padding = '15px';
    info.style.background = type === 'MONSTER' ? 'rgba(255,32,64,0.1)' : 'rgba(0,255,65,0.1)';
    info.style.borderTop = '1px solid var(--g3)';
    let desc = '';
    if(type === 'BUDDY') desc = 'Dispatch on a 12HR expedition to gather resources.';
    if(type === 'BESTFRIEND') desc = 'Maintain survival to harvest valuable SOULs.';
    if(type === 'MONSTER') desc = 'Consume SOULs to wager tokens in the Arena.';

    info.innerHTML = `<div style="font-family:var(--px); font-size:12px; color:${type==='MONSTER'?'#ff2040':'var(--g)'}; margin-bottom:10px; line-height:1.4;">${desc}</div><div style="font-family:var(--px); font-size:12px; color:${type==='MONSTER'?'#ff2040':'var(--g)'}; letter-spacing:2px; animation:pulse 2s infinite;">▶ ENTER [${type}]</div>`;
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
  const VPALS2={
    Scarlet:{bg:[248,248,248],skin:[220,140,60],outline:[40,0,0],hair:[200,20,20],eyes:[20,0,0],clothing:[200,20,20],accent:[160,60,0]},
    Verdant:{bg:[240,252,220],skin:[220,185,110],outline:[0,50,0],hair:[20,120,20],eyes:[0,30,0],clothing:[20,120,20],accent:[160,140,60]},
    Azure:{bg:[230,240,255],skin:[220,185,110],outline:[0,0,60],hair:[20,80,200],eyes:[0,20,80],clothing:[20,100,210],accent:[80,140,230]},
    Goldenrod:{bg:[255,252,210],skin:[230,190,120],outline:[60,30,0],hair:[200,140,0],eyes:[40,20,0],clothing:[200,140,0],accent:[240,200,60]},
    Amethyst:{bg:[240,230,255],skin:[220,180,120],outline:[40,0,60],hair:[120,20,180],eyes:[40,0,60],clothing:[120,20,180],accent:[180,100,230]},
    Teal:{bg:[220,248,248],skin:[220,180,120],outline:[0,50,50],hair:[0,140,140],eyes:[0,40,40],clothing:[0,140,140],accent:[80,210,210]},
    Rose:{bg:[255,235,240],skin:[240,195,170],outline:[80,0,40],hair:[220,50,100],eyes:[70,0,30],clothing:[220,50,100],accent:[255,150,180]},
    Earthen:{bg:[240,230,210],skin:[200,155,90],outline:[50,25,0],hair:[100,55,15],eyes:[40,20,0],clothing:[110,60,15],accent:[180,130,65]},
  };
  const pn2=Object.keys(PALS2), vpn2=Object.keys(VPALS2);
  window.generateHeroPreview = function(type){
    rs2=Date.now()^(Math.random()*0xFFFFFFFF>>>0);img2.fill(0);

    if(type === 'BUDDY') {
      let p={...VPALS2[rc2(vpn2)]};
      const CX=16,CY=18,RX=12,RY=13,CAP_Y=14,FACE_Y=21;
      const hat=ri2(0,5),eye=ri2(0,5),mouth=ri2(0,5),pat=ri2(0,4),bgPat=ri2(0,6);
      function drawBg(x,y){
        if(bgPat===1){const t=y/S;return p.bg.map(v=>Math.min(255,Math.floor(v*(1-t*.5)+255*t*.15)));}
        if(bgPat===2)return Math.sin(x*13.7+y*7.3)>.97?[255,240,180]:p.bg;
        if(bgPat===3)return ((x+y)%6<3)?p.bg:p.bg.map(v=>Math.max(0,v-35));
        if(bgPat===4)return (x%5<1&&y%5<1)?p.bg.map(v=>Math.min(255,v+80)):p.bg;
        if(bgPat===5)return ((Math.floor(x/4)+Math.floor(y/4))%2)?p.bg:p.bg.map(v=>Math.max(0,v-25));
        return p.bg;
      }
      for(let y=0;y<S;y++)for(let x=0;x<S;x++){
        const dx=x-CX,dy=y-CY,d=(dx/RX)**2+(dy/RY)**2;
        if(d>1){px2(x,y,drawBg(x,y));continue}
        if(d>=0.87){px2(x,y,p.outline);continue}
        if(y<CAP_Y){px2(x,y,(hat===1||hat===4)?p.skin:p.hair);continue}
        if(y<FACE_Y){px2(x,y,p.skin);continue}
        const ck=pat===0?(Math.floor((x-CX+RX)/3)+Math.floor((y-FACE_Y)/3))%2:pat===1?Math.floor((x-CX+RX)/3)%2:pat===2?Math.floor((y-FACE_Y)/3)%2:0;
        px2(x,y,ck?p.clothing:p.accent);
      }
      const dyB=CAP_Y-CY,bW=Math.round(RX*Math.sqrt(Math.max(0,1-(dyB/RY)**2)));
      if(hat===0){hl2(CAP_Y,CX-bW-2,CX+bW+2,p.hair);px2(CX-bW-3,CAP_Y,p.outline);px2(CX+bW+3,CAP_Y,p.outline);}
      else if(hat===1){for(const sx of[CX-4,CX,CX+4])vl2(sx,5,7,p.hair);hl2(8,CX-5,CX+5,p.hair);}
      else if(hat===2){px2(CX,3,p.hair);for(let i=1;i<=3;i++){px2(CX-i,3+i,p.hair);px2(CX+i,3+i,p.hair);}hl2(CAP_Y,CX-bW-2,CX+bW+2,p.hair);}
      else if(hat===3){hl2(CAP_Y,CX-bW,CX+bW,p.hair);}
      else{px2(CX,5,p.hair);px2(CX-1,6,p.hair);px2(CX+1,6,p.hair);}
      const eY=17,eLX=CX-5,eRX=CX+2;
      for(const ex of[eLX,eRX]){rect2(ex,eY,ex+1,eY+1,p.outline);px2(ex+(eye===3?1:0),eY,eye===3?p.accent:p.bg);}
      px2(CX,18,p.outline);
      const mY=FACE_Y-1;
      if(mouth===0||mouth===2){hl2(mY,CX-2,CX+2,p.outline);px2(CX-3,mY-1,p.outline);px2(CX+3,mY-1,p.outline);}
      else{hl2(mY,CX-2,CX+2,p.outline);}
    } else if(type === 'BEST FRIEND') {
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
    } else {
      // MONSTER (Rare)
      const p = {bg:[10,10,10],skin:[200,200,200],outline:[0,0,0],hair:[150,150,150],eyes:[255,255,255],clothing:[80,80,80],accent:[180,180,180]};
      const DK=[8,8,8],MD=[80,80,80],LT=[170,170,170],WH=[230,230,230],CX=16;
      const hood=ri2(0,5),skull=ri2(0,5),robe=ri2(0,4),weapon=ri2(0,5),sigil=ri2(0,5);
      for(let y=0;y<S;y++)for(let x=0;x<S;x++){const v=8+Math.floor(Math.sin(x*.7+y*.5)*4);px2(x,y,[v,v,v]);}
      if(skull<3)for(let y=0;y<S;y+=4)for(let x=0;x<S;x+=5){const sv=Math.sin(x*7.3+y*13.7);if(sv>.82){const bv=30+Math.floor(sv*50);px2(x,y,[bv,bv,bv]);}}
      for(let y=0;y<13;y++)for(let x=0;x<S;x++){const dx=x-CX,dy=y-8,d=(dx/9)**2+(dy/7)**2;if(d<1)px2(x,y,DK);else if(d<1.18)px2(x,y,MD);}
      if(hood===0){px2(CX,1,MD);px2(CX,2,DK);} else if(hood===2){for(let x=8;x<24;x+=3)px2(x,12,DK);} else if(hood===3){for(const cx2 of[CX-3,CX,CX+3])for(let dy=0;dy<3;dy++)px2(cx2,dy+1,MD);} else if(hood===4){px2(CX-3,1,MD);px2(CX+3,1,MD);px2(CX-3,2,DK);px2(CX+3,2,DK);}
      const fY=11;
      for(let y=fY;y<fY+8;y++)for(let x=0;x<S;x++){const dx=x-CX,dy=y-fY-4,d=(dx/5)**2+(dy/4)**2;if(d<1)px2(x,y,WH);else if(d<1.2)px2(x,y,LT);}
      for(const ex of[CX-2,CX+2])for(let dy=0;dy<2;dy++)for(let dx=-1;dx<=1;dx++)px2(ex+dx,fY+2+dy,DK); 
      px2(CX-1,fY+5,DK);px2(CX+1,fY+5,DK); 
      for(let x=CX-3;x<=CX+3;x++)px2(x,fY+6,DK); 
      for(let x=CX-2;x<=CX+2;x+=2)px2(x,fY+7,WH); 
      if(skull===1){px2(CX+1,fY,DK);px2(CX+2,fY+1,DK);px2(CX+1,fY+2,DK);} else if(skull===3){for(let i=0;i<4;i++){px2(CX-4-i,fY-i,MD);px2(CX+4+i,fY-i,MD);}} else if(skull===4){for(let i=-3;i<=3;i++)px2(CX+i,fY-1,MD);for(const cx2 of[CX-2,CX,CX+2])px2(cx2,fY-2,WH);}
      for(let y=19;y<S;y++){const sp=Math.floor((y-19)*.55),x1=Math.max(0,8-sp),x2=Math.min(S-1,23+sp);for(let x=x1;x<=x2;x++)px2(x,y,DK);if(robe===0){px2(x1,y,MD);px2(x2,y,MD);}else if(robe===1&&y%3===0){px2(x1+2,y,MD);px2(x2-2,y,MD);}else if(robe===3&&(y-19)%3===0)for(let x=x1+2;x<=x2-2;x+=3)px2(x,y,MD);}
      if(weapon===1){for(let y=8;y<28;y++)px2(25,y,MD);for(let i=0;i<5;i++){px2(25-i,8+i,LT);px2(24-i,8+i,MD);}} else if(weapon===2){for(let y=19;y<25;y++)for(let x=6;x<10;x++)px2(x,y,MD);px2(8,18,MD);px2(8,19,WH);px2(8,20,WH);} else if(weapon===3){for(let y=18;y<25;y++){const w=Math.abs(y-21);for(let x=6-w;x<=9+w;x++)px2(x,y,MD);}} else if(weapon===4){for(let y=5;y<28;y++)px2(24,y,MD);for(const dx of[-1,0,1])px2(24+dx,5,WH);}
      const siX=CX,siY=24;
      if(sigil===1){for(const[dx,dy]of[[0,0],[0,-1],[0,1],[-1,0],[1,0]])px2(siX+dx,siY+dy,MD);px2(siX,siY,WH);} else if(sigil===2){px2(siX,siY-1,MD);px2(siX,siY,MD);px2(siX,siY+1,MD);px2(siX-1,siY,MD);px2(siX+1,siY,MD);} else if(sigil===3){for(let d=0;d<3;d++){px2(siX-1+d,siY-1+d,LT);px2(siX+1-d,siY-1+d,LT);}} else if(sigil===4){for(const[dx,dy]of[[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]])px2(siX+dx,siY+dy,LT);px2(siX,siY,WH);}
    }

    const id=hcx.createImageData(O,O);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const si=(y*S+x)*3,r=img2[si],g=img2[si+1],b=img2[si+2];for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const di=((y*SC+dy)*O+(x*SC+dx))*4;id.data[di]=r;id.data[di+1]=g;id.data[di+2]=b;id.data[di+3]=255}}
    
    // Add Voxel shading
    for(let by=0;by<O;by+=SC)for(let bx=0;bx<O;bx+=SC){const c2=((by+SC/2)*O+(bx+SC/2))*4;const br=id.data[c2],bg2=id.data[c2+1],bb=id.data[c2+2];if(br+bg2+bb<30)continue;for(let dy=0;dy<2;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=0;dy<SC;dy++)for(let dx=0;dx<2;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=Math.min(255,br*1.45);id.data[i+1]=Math.min(255,bg2*1.45);id.data[i+2]=Math.min(255,bb*1.45)}for(let dy=SC-3;dy<SC;dy++)for(let dx=0;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}for(let dy=0;dy<SC;dy++)for(let dx=SC-3;dx<SC;dx++){const i=((by+dy)*O+(bx+dx))*4;id.data[i]=br*.5;id.data[i+1]=bg2*.5;id.data[i+2]=bb*.5}}

    hcx.putImageData(id,0,0);
  }
  window.generateHeroPreview('BUDDY'); // initial call
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

// ===== DYNAMIC TEXT CYCLER =====
(function(){
  const heroText = document.getElementById('dynamicHeroText');
  const heroTitle = document.getElementById('dynamicHeroTitle');
  if(!heroText && !heroTitle) return;
  const types = ['BUDDY', 'BEST FRIEND', 'MONSTER'];
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % types.length;
    if(heroText) heroText.style.opacity = 0;
    if(heroTitle) heroTitle.style.opacity = 0;
    setTimeout(() => {
        if(window.generateHeroPreview) window.generateHeroPreview(types[idx]);
      if(heroText) {
          heroText.textContent = '[' + types[idx] + ']';
          if(types[idx] === 'MONSTER') {
              heroText.style.color = '#ff2040';
              heroText.style.textShadow = '0 0 10px rgba(255,0,0,0.5)';
          } else {
              heroText.style.color = 'var(--g)';
              heroText.style.textShadow = 'none';
          }
          heroText.style.opacity = 1;
      }
      if(heroTitle) {
          heroTitle.textContent = '[' + types[idx] + ']';
          if(types[idx] === 'MONSTER') {
              heroTitle.style.color = '#ff2040';
              heroTitle.style.textShadow = '0 0 10px rgba(255,0,0,0.5)';
          } else {
              heroTitle.style.color = 'var(--g)';
              heroTitle.style.textShadow = 'none';
          }
          heroTitle.style.opacity = 1;
      }
    }, 200); // Wait for fade out
  }, 2500); // Change every 2.5 seconds
})();
