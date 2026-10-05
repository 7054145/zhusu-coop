// ===== HERO: 双人立绘 · 换装 · 红线 =====
(function(){
  const {S,save,unlock,sugar,hearts,floatFx,$}=ZS;
  const C=window.ZS_CUTS;
  const OUT=window.ZS_SELECTED;
  if(S.cutoutSet!=='confirmed-20261005-v2'){S.outfit={z:0,s:0};S.tried={};S.cutoutSet='confirmed-20261005-v2';save()}
  const LINES={
    z:['戳我干嘛 (・_・;)','今日应援色：黄','左边位是我的','要不要看看右边那位？','黄色 +1','已经被戳 {n} 次了'],
    s:['诶？','今日应援色：红','右边位是我的','左边那位在看你哦','红色 +1','已经被戳 {n} 次了']
  };
  const pokes={z:0,s:0};

  function setOutfit(who,i,anim){
    const list=OUT[who];i=(i+list.length)%list.length;S.outfit[who]=i;
    S.tried[list[i].k]=1;save();
    const img=$(`.char.${who} img`);
    const apply=()=>{const o=list[i];img.src=o.src;img.style.setProperty('--mirror',o.flip?-1:1);img.closest('.char').style.setProperty('--outfit-size',o.size);img.closest('.char').style.translate=(o.x||0)+'vw '+(o.y||0)+'vh';img.dataset.choice=o.k;img.alt=(who==='z'?'朱志鑫':'苏新皓')+' · '+o.n;img.classList.remove('swap')};
    if(anim){img.classList.add('swap');setTimeout(apply,220)}else apply();
    $(`.plate.${who} .ward span`).innerHTML=`${list[i].n}<br><em>${i+1}/${list.length}</em>`;
    if([...OUT.z,...OUT.s].every(o=>S.tried[o.k])) unlock('closet');
    checkMatch();
  }
  function checkMatch(){
    const m=OUT.z[S.outfit.z].g===OUT.s[S.outfit.s].g;
    $('.match').classList.toggle('on',m);
    if(m){unlock('match');const r=$('.match').getBoundingClientRect();hearts(r.left+r.width/2,r.top+r.height/2,16)}
  }

  let bubbleT={};
  function say(who,txt){
    const old=$(`.bubble.${who}`);if(old)old.remove();
    const b=document.createElement('div');b.className='bubble '+who;b.textContent=txt;
    const ch=$(`.char.${who}`).getBoundingClientRect(),hr=$('#start').getBoundingClientRect();
    b.style.top=(ch.top-hr.top+ch.height*.12)+'px';
    if(who==='z') b.style.left=(ch.left-hr.left+ch.width*.02)+'px';
    else{b.style.left=(ch.left-hr.left+ch.width*.62)+'px'}
    $('#start').appendChild(b);
    clearTimeout(bubbleT[who]);bubbleT[who]=setTimeout(()=>{b.classList.add('out');setTimeout(()=>b.remove(),300)},1800);
  }

  function poke(who,e){
    pokes[who]++;
    const el=$(`.char.${who}`);el.classList.remove('jump');void el.offsetWidth;el.classList.add('jump');
    const L=LINES[who];let t=L[(pokes[who]-1)%L.length].replace('{n}',pokes[who]);
    say(who,t);
    floatFx(e.clientX,e.clientY,'♥',who==='z'?'var(--zhu-deep)':'var(--su)');
    unlock('poke');
    if(pokes[who]%3===0) sugar(2,e.clientX,e.clientY-30);
    if(pokes.z>0&&pokes.s>0&&Math.abs(pokes.z-pokes.s)===0&&pokes.z%4===0){say(who==='z'?'s':'z','同步率 100%')}
  }

  // lean toward pointer
  function lean(){
    const hero=$('#start');let tx=0,cx=0;
    hero.addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)});
    hero.addEventListener('pointerleave',()=>tx=0);
    (function loop(){
      cx+=(tx-cx)*.08;
      $('.char.z').style.transform=`translateX(-100%) rotate(${cx*3+ (cx>0?cx*2:0)}deg)`;
      $('.char.s').style.transform=`rotate(${cx*3- (cx<0?-cx*2:0)}deg)`;
      $('.bigglyph.z').style.transform=`translate(${cx*-30}px,-52%)`;
      $('.bigglyph.s').style.transform=`translate(${cx*-30}px,-52%)`;
      drawString();
      requestAnimationFrame(loop);
    })();
  }

  // ---- red string with a draggable knot (verlet-ish spring) ----
  const K={x:0,y:0,vx:0,vy:0,drag:false,ox:0,oy:0};
  let A={x:0,y:0},B={x:0,y:0};
  function anchors(){
    const h=$('#start').getBoundingClientRect();
    const z=$('.char.z').getBoundingClientRect(),s=$('.char.s').getBoundingClientRect();
    A={x:z.left-h.left+z.width*.82,y:z.top-h.top+z.height*.72};
    B={x:s.left-h.left+s.width*.18,y:s.top-h.top+s.height*.72};
  }
  let pulled=0;
  function drawString(){
    anchors();
    const mx=(A.x+B.x)/2,my=(A.y+B.y)/2+40;
    if(!K.drag){
      K.vx+=(mx-K.x)*.08;K.vy+=(my-K.y)*.08;K.vx*=.86;K.vy*=.86;K.x+=K.vx;K.y+=K.vy;
    }
    const p=$('.string path');
    p.setAttribute('d',`M${A.x},${A.y} Q${K.x*2-(A.x+B.x)/2},${K.y*2-(A.y+B.y)/2+10} ${B.x},${B.y}`);
    const k=$('.knot');k.setAttribute('transform',`translate(${K.x},${K.y})`);
    const tip=$('.string-tip');tip.style.left=K.x+'px';tip.style.top=(K.y+26)+'px';
  }
  function initString(){
    anchors();K.x=(A.x+B.x)/2;K.y=(A.y+B.y)/2+40;
    const knot=$('.knot'),hero=$('#start');
    knot.addEventListener('pointerdown',e=>{K.drag=true;knot.setPointerCapture(e.pointerId);$('.string-tip').style.opacity=0});
    knot.addEventListener('pointermove',e=>{
      if(!K.drag)return;const h=hero.getBoundingClientRect();
      K.x=e.clientX-h.left;K.y=e.clientY-h.top;
    });
    const up=e=>{
      if(!K.drag)return;K.drag=false;
      const mx=(A.x+B.x)/2,my=(A.y+B.y)/2+40,d=Math.hypot(K.x-mx,K.y-my);
      if(d>80){
        pulled++;unlock('string');
        hearts(e.clientX,e.clientY,14);sugar(3,e.clientX,e.clientY-30);
        // both characters lean in on release
        ['z','s'].forEach(w=>{const el=$(`.char.${w}`);el.classList.remove('jump');void el.offsetWidth;el.classList.add('jump')});
        if(pulled===1){say('z','！');say('s','！')}
        else if(pulled%3===0){say('z','被线牵着走了');say('s','是你拉的吧')}
      }
    };
    knot.addEventListener('pointerup',up);knot.addEventListener('pointercancel',up);
  }

  function build(){
    const hero=$('#start');
    hero.innerHTML=`
      <div class="bigglyph z">朱</div><div class="bigglyph s">苏</div>
      <div class="hero-sun"></div>
      <div class="hero-center"><div class="mode">2P · CO-OP MODE</div><h1><span class="z">朱志鑫</span><i>×</i><span class="s">苏新皓</span></h1></div>
      <div class="char z"><img alt="朱志鑫 立绘"><div class="hit"></div></div>
      <div class="char s"><img alt="苏新皓 立绘"><div class="hit"></div></div>
      <svg class="string"><path fill="none" stroke="#F4628C" stroke-width="3.5" stroke-linecap="round"/>
        <g class="knot"><circle r="22" fill="transparent"/><path d="M0 9s-11-6.8-11-13.4C-11-8.3-8-10-5.6-10-3-10-1-8.3 0-6.6 1-8.3 3-10 5.6-10 8-10 11-8.3 11-4.4 11 2.2 0 9 0 9z" fill="#F4628C" stroke="#3A0719" stroke-width="2"/></g></svg>
      <div class="string-tip">拽一下这根线 ↓</div>
      <div class="match">同款达成 ♥</div>
      <div class="plate z"><span class="tag">1P · YELLOW</span><div class="nm">朱志鑫</div>
        <div class="ward"><button data-w="z" data-d="-1" aria-label="上一套">◀</button><span></span><button data-w="z" data-d="1" aria-label="下一套">▶</button></div></div>
      <div class="plate s"><span class="tag">2P · RED</span><div class="nm">苏新皓</div>
        <div class="ward"><button data-w="s" data-d="-1" aria-label="上一套">◀</button><span></span><button data-w="s" data-d="1" aria-label="下一套">▶</button></div></div>
      <a class="press" href="#stages">PRESS START ▶</a>`;
    hero.querySelectorAll('.ward button').forEach(b=>b.addEventListener('click',()=>setOutfit(b.dataset.w,S.outfit[b.dataset.w]+ +b.dataset.d,true)));
    hero.querySelectorAll('.char').forEach(c=>c.querySelector('.hit').addEventListener('click',e=>poke(c.classList.contains('z')?'z':'s',e)));
    setOutfit('z',S.outfit.z||0);setOutfit('s',S.outfit.s||0);
    $$imgReady(()=>{initString();lean()});
  }
  function $$imgReady(cb){
    const imgs=[...document.querySelectorAll('.char img')];let n=0;
    imgs.forEach(i=>{if(i.complete&&i.naturalWidth)++n;else i.onload=()=>{if(++n===imgs.length)cb()}});
    if(n===imgs.length)cb();
  }
  document.addEventListener('DOMContentLoaded',build);
})();
