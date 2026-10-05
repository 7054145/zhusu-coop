// ===== ALBUM: 调色盘筛选 + 拍立得墙 + 灯箱 =====
(function(){
  const {S,save,unlock,sugar,hearts,$,$$}=ZS;
  const P=window.ZS_PHOTOS,SRC=window.ZS_PHOTO_SRC;
  const WHO={zhu:'朱志鑫',su:'苏新皓',duo:'朱苏'};
  const COL={zhu:'var(--zhu)',su:'var(--su)',duo:'var(--r3)'};
  const STOPS=[{k:'zhu',x:.17,t:'只看黄 · 朱志鑫',c:'var(--zhu-deep)'},{k:'duo',x:.5,t:'调成玫 · 双人同框',c:'var(--r3)'},{k:'su',x:.83,t:'只看红 · 苏新皓',c:'var(--su)'}];
  let filter='all',likedOnly=false,list=[],idx=0;
  // stable pseudo-random per id
  const rnd=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return ((h>>>0)%1000)/1000};

  function build(){
    const sec=$('#album');
    sec.innerHTML=`
      <div class="sec-head"><span class="sec-no">GALLERY</span><h2 class="sec-title">调色盘 · 图鉴墙</h2><span class="sec-sub">${P.length} PHOTOS · YELLOW + RED = ROSE</span></div>
      <div class="mixer">
        <div class="mix-track"><span class="lab" style="left:17%">朱</span><span class="lab" style="left:50%;color:#fff">朱苏</span><span class="lab" style="left:83%;color:#fff">苏</span><div class="mix-knob"><i>玫</i></div></div>
        <div class="mix-info"><b class="mi-n">${P.length}</b><span class="mi-t">拖动色块调色 · 当前：全部</span></div>
        <div class="mix-btns"><button class="pill on" data-f="all">全部</button><button class="pill" data-f="liked">♥ 我心动的 <span class="lc"></span></button></div>
      </div>
      <p class="album-hint">点开大图；双击照片 = 心动。照片署名按资料包记录保留。</p>
      <div class="wall"></div>`;
    const wall=$('.wall',sec);
    P.forEach(p=>{
      const d=document.createElement('div');d.className='ph';d.dataset.id=p.id;d.dataset.who=p.who;
      d.style.setProperty('--rot',((rnd(p.id)-.5)*5).toFixed(2)+'deg');
      d.style.setProperty('--trot',((rnd(p.id+'t')-.5)*14).toFixed(1)+'deg');
      d.style.setProperty('--c',COL[p.who]);
      d.innerHTML=`<span class="tape"></span><img loading="lazy" src="${SRC[p.id]}" width="${p.w}" height="${p.h}" alt="${WHO[p.who]}"><div class="cap"><span class="who">${WHO[p.who]}</span><button class="lk" aria-label="心动">♥ <span>${S.likes[p.id]?'1':''}</span></button></div>`;
      if(S.likes[p.id])d.classList.add('liked');
      let t;
      d.addEventListener('click',e=>{
        if(e.target.closest('.lk')){toggleLike(p.id,e);return}
        clearTimeout(t);t=setTimeout(()=>open(p.id),240);
      });
      d.addEventListener('dblclick',e=>{clearTimeout(t);if(!S.likes[p.id])toggleLike(p.id,e);else burst(d)});
      wall.appendChild(d);
    });
    $$('.mix-btns .pill',sec).forEach(b=>b.addEventListener('click',()=>{
      if(b.dataset.f==='all'){filter='all';likedOnly=false;setKnob(.5,true)}
      else likedOnly=!likedOnly;
      apply();
    }));
    initKnob();apply();buildLB();
  }

  function initKnob(){
    const tr=$('.mix-track'),kn=$('.mix-knob');let drag=false;
    const toX=e=>{const r=tr.getBoundingClientRect();return Math.max(.05,Math.min(.95,(e.clientX-r.left)/r.width))};
    tr.addEventListener('pointerdown',e=>{drag=true;tr.setPointerCapture(e.pointerId);kn.classList.add('drag');setKnob(toX(e))});
    tr.addEventListener('pointermove',e=>{if(drag)setKnob(toX(e))});
    const up=e=>{if(!drag)return;drag=false;kn.classList.remove('drag');
      const x=toX(e);const s=STOPS.reduce((a,b)=>Math.abs(b.x-x)<Math.abs(a.x-x)?b:a);
      setKnob(s.x);filter=s.k;apply();};
    tr.addEventListener('pointerup',up);tr.addEventListener('pointercancel',up);
    setKnob(.5);
  }
  function mix(x){ // interpolate yellow→rose→red visually
    const y=[255,198,26],r=[244,98,140],d=[227,22,43];
    const a=x<.5?y:r,b=x<.5?r:d,t=x<.5?x/.5:(x-.5)/.5;
    return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')})`;
  }
  function setKnob(x){
    const kn=$('.mix-knob');kn.style.left=(x*100)+'%';
    kn.style.setProperty('--kc',mix(x));
    kn.querySelector('i').textContent=x<.33?'黄':x>.67?'红':'玫';
  }
  function apply(){
    let n=0;list=[];
    $$('.ph').forEach(d=>{
      const ok=(filter==='all'||d.dataset.who===filter)&&(!likedOnly||S.likes[d.dataset.id]);
      d.classList.toggle('hide',!ok);if(ok){n++;list.push(d.dataset.id)}
    });
    $('.mi-n').textContent=n;
    const st=STOPS.find(s=>s.k===filter);
    $('.mi-t').textContent='拖动色块调色 · 当前：'+(st?st.t:'全部')+(likedOnly?' · 仅心动':'');
    $$('.mix-btns .pill').forEach(b=>b.classList.toggle('on',b.dataset.f==='all'?filter==='all'&&!likedOnly:likedOnly));
    $('.mix-btns .lc').textContent=Object.keys(S.likes).length||'';
  }
  function burst(d){const h=document.createElement('div');h.className='burst';h.textContent='♥';d.appendChild(h);setTimeout(()=>h.remove(),800)}
  function toggleLike(id,e){
    const d=$(`.ph[data-id="${id}"]`);
    if(S.likes[id]){delete S.likes[id]}else{S.likes[id]=1;burst(d);hearts(e.clientX,e.clientY,8);sugar(1)}
    save();d.classList.toggle('liked',!!S.likes[id]);d.querySelector('.lk span').textContent=S.likes[id]?'1':'';
    if(Object.keys(S.likes).length>=10)unlock('like10');
    apply();syncLB();
  }

  // lightbox
  function buildLB(){
    const lb=document.createElement('div');lb.className='lb';
    lb.innerHTML=`<span class="count"></span><button class="x" aria-label="关闭">✕</button><button class="pv" aria-label="上一张">←</button><button class="nx" aria-label="下一张">→</button><figure><img alt=""><figcaption><span class="t"></span><span class="cr"></span><button class="pill lbk">♥ 心动</button></figcaption></figure>`;
    document.body.appendChild(lb);
    lb.addEventListener('click',e=>{if(e.target===lb)close()});
    $('.x',lb).onclick=close;$('.pv',lb).onclick=()=>step(-1);$('.nx',lb).onclick=()=>step(1);
    $('.lbk',lb).onclick=e=>toggleLike(list[idx],e);
    addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;
      if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);if(e.key.toLowerCase()==='l')toggleLike(list[idx],{clientX:innerWidth/2,clientY:innerHeight/2})});
  }
  function open(id){idx=list.indexOf(id);$('.lb').classList.add('on');syncLB(true)}
  function close(){$('.lb').classList.remove('on')}
  function step(d){idx=(idx+d+list.length)%list.length;syncLB(true)}
  function syncLB(re){
    const lb=$('.lb');if(!lb||!lb.classList.contains('on'))return;
    const p=P.find(x=>x.id===list[idx]);if(!p)return;
    const img=$('img',lb);
    if(re){img.style.animation='none';void img.offsetWidth;img.style.animation='';img.src=SRC[p.id]}
    $('.t',lb).textContent=p.title||WHO[p.who];
    $('.cr',lb).textContent=p.credit?('图 · '+p.credit):'图 · 资料包用户收藏';
    $('.count',lb).textContent=`${String(idx+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}  ·  ← → 翻页  L 心动`;
    $('.lbk',lb).classList.toggle('on',!!S.likes[p.id]);
  }
  document.addEventListener('DOMContentLoaded',build);
})();
