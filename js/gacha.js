// ===== GACHA: 应援抽卡（纯翻牌，无裂开/爬开特效）=====
(function(){
  const {S,save,unlock,sugar,hearts,$}=ZS;
  const P=window.ZS_PHOTOS,SRC=window.ZS_PHOTO_SRC;
  const SSR_IDS=new Set(['p30','p31','p33','p34','p35','p36','p37','FATALISM-01','HEY-costume-02','HEY-stage-01']);
  const rank=p=>SSR_IDS.has(p.id)?'SSR':p.who==='duo'?'SR':'R';
  const POOL={SSR:[],SR:[],R:[]};P.forEach(p=>POOL[rank(p)].push(p));
  const PITY=10;
  const NAME={zhu:'朱志鑫',su:'苏新皓',duo:'朱苏'};
  const color=p=>{const r=rank(p);if(r==='SSR')return['var(--r3)','#fff'];if(r==='SR')return['var(--r2)','var(--ink)'];return p.who==='zhu'?['var(--zhu)','var(--ink)']:['var(--su)','#fff']};

  function roll(){
    S.pulls++;S.pity++;
    let r=Math.random(),k=r<.08?'SSR':r<.38?'SR':'R';
    if(S.pity>=PITY)k='SSR';
    if(k==='SSR')S.pity=0;
    const pool=POOL[k];return pool[Math.floor(Math.random()*pool.length)];
  }
  function build(){
    const sec=$('#gacha');
    sec.innerHTML=`
      <div class="sec-head"><span class="sec-no">GACHA</span><h2 class="sec-title">玫色卡池 · 抽一张</h2><span class="sec-sub">FLIP TO REVEAL · ${P.length} CARDS</span></div>
      <div class="g-grid">
        <aside class="g-panel">
          <h4>RATE · 概率公示</h4>
          <div class="rate">
            <div><span class="gem" style="background:var(--r3);color:#fff">SSR · 玫</span><span>双人神图</span><em>8%</em></div>
            <div><span class="gem" style="background:var(--r2)">SR</span><span>双人同框</span><em>30%</em></div>
            <div><span class="gem" style="background:linear-gradient(90deg,var(--zhu) 50%,var(--su) 50%)">R</span><span>朱 / 苏 单人</span><em>62%</em></div>
          </div>
          <div class="pity"><p>再抽 <b class="pn"></b> 次必出 SSR</p><div class="pb"></div></div>
          <button class="g-btn one"><span>单抽</span><small>×1</small></button>
          <button class="g-btn ten"><span>十连 · 玫色</span><small>×10</small></button>
          <div class="g-stats"><span>累计 <b class="tp">0</b> 抽</span><span>图鉴 <b class="dp">0</b>/${P.length}</span></div>
        </aside>
        <div class="stage-area"><div class="idle"><div class="deck"></div><p>点「单抽」或「十连」</p><small>抽出来的卡会自动收进下方图鉴 · 点卡背翻面</small></div></div>
      </div>
      <div class="dex"><div class="dex-head"><h4>收集图鉴</h4><span class="p"></span><div class="bar"><i></i></div><button class="pill dx-clr" style="font-size:12px;padding:6px 12px">清除 NEW</button></div><div class="dex-grid"></div></div>`;
    // idle deck stack
    const deck=$('.deck',sec);
    for(let i=0;i<4;i++){const c=document.createElement('i');c.style.cssText=`background:var(--r6);box-shadow:0 0 0 3px #fff;transform:rotate(${(i-1.5)*6}deg) translateY(${-i*3}px)`;deck.appendChild(c)}
    const top=document.createElement('div');top.className='gcard';top.style.cssText='position:absolute;inset:0;animation:none;opacity:1;transform:none';top.innerHTML='<div class="in"><div class="b"><div class="mono"><span>朱苏</span></div></div></div>';deck.appendChild(top);
    $('.g-btn.one',sec).onclick=()=>pull(1);
    $('.g-btn.ten',sec).onclick=()=>pull(10);
    $('.dx-clr',sec).onclick=()=>{Object.keys(S.dex).forEach(k=>S.dex[k]=1);save();renderDex()};
    renderPity();renderDex();
  }
  function renderPity(){
    const left=PITY-S.pity;$('.pn').textContent=left;
    $('.pb').innerHTML=Array.from({length:PITY},(_,i)=>`<i class="${i<S.pity?'f':''}"></i>`).join('');
    $('.tp').textContent=S.pulls;
  }
  function renderDex(){
    const got=Object.keys(S.dex).length;
    $('.dp').textContent=got;$('.dex-head .p').textContent=`${got} / ${P.length}`;$('.dex-head .bar i').style.width=(got/P.length*100)+'%';
    const order=[...POOL.SSR,...POOL.SR,...POOL.R];
    $('.dex-grid').innerHTML=order.map(p=>{const g=S.dex[p.id];const[c]=color(p);return `<div class="${g?'got':''} ${g===2?'new':''}" style="--c:${c}" title="${g?rank(p)+' · '+NAME[p.who]:'未收集'}">${g?`<img src="${SRC[p.id]}" alt="">`:''}</div>`}).join('');
    if(got>=P.length/2)unlock('dex50');
  }
  function pull(n){
    const area=$('.stage-area');
    const res=Array.from({length:n},roll);save();renderPity();
    area.innerHTML=`<div class="cards ${n===1?'one':''}"></div><div class="g-actions"><button class="pill fa">全部翻开</button><button class="pill ag">再来${n===1?'一次':'十连'}</button></div>`;
    const box=$('.cards',area);
    const best=res.reduce((a,p)=>Math.max(a,{R:0,SR:1,SSR:2}[rank(p)]),0);
    res.forEach((p,i)=>{
      const r=rank(p),[c,tc]=color(p);
      const el=document.createElement('div');el.className='gcard '+r.toLowerCase();el.style.animationDelay=(i*60)+'ms';
      el.style.setProperty('--c',c);el.style.setProperty('--tc',tc);
      const isNew=!S.dex[p.id];
      el.innerHTML=`<div class="in"><div class="b"><div class="mono"><span>${r==='SSR'?'玫':'朱苏'}</span></div></div><div class="f"><img src="${SRC[p.id]}" alt=""><span class="rk">${r==='SSR'?'SSR · 玫':r}</span><div class="nm">${NAME[p.who]}${isNew?'<em>NEW</em>':''}</div></div></div>`;
      el.addEventListener('click',e=>flip(el,p,e));
      box.appendChild(el);
    });
    $('.fa',area).onclick=()=>[...box.children].forEach((el,i)=>setTimeout(()=>el.click(),i*110));
    $('.ag',area).onclick=()=>pull(n);
    if(best===2){const r=area.getBoundingClientRect();setTimeout(()=>{area.animate([{boxShadow:'inset 0 0 0 3px #ffffff40'},{boxShadow:'inset 0 0 0 10px #FFB3C8'},{boxShadow:'inset 0 0 0 3px #ffffff40'}],{duration:900})},400)}
  }
  function flip(el,p,e){
    if(el.classList.contains('flip'))return;
    el.classList.add('flip');
    const fresh=!S.dex[p.id];S.dex[p.id]=fresh?2:S.dex[p.id];save();
    if(rank(p)==='SSR'){unlock('ssr');setTimeout(()=>{const r=el.getBoundingClientRect();hearts(r.left+r.width/2,r.top+r.height/2,18)},350);sugar(3)}
    else if(fresh)sugar(1);
    renderDex();
  }
  document.addEventListener('DOMContentLoaded',build);
})();
