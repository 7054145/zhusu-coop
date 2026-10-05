// ===== shared state, cursor, toast, sugar meter =====
(function(){
  const KEY='zhusu-coop-v1:'+location.pathname.replace(/\/index\.html$/, '/');
  const def={sugar:0,ach:{},likes:{},dex:{},seen:{},pity:0,pulls:0,outfit:{z:0,s:0},tried:{}};
  let S;
  try{S=Object.assign({},def,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S={...def}}
  const save=()=>localStorage.setItem(KEY,JSON.stringify(S));

  const ACH={
    poke:['初次见面','戳了一下立绘'],
    string:['牵线人','拉动了中间那根玫色的线'],
    match:['同款达成','两人换上了同一场的造型'],
    closet:['衣橱管理员','试遍所有造型'],
    stages:['全关卡通关','12 个双人舞台全部看完'],
    like10:['心动十连','给 10 张照片点了心'],
    ssr:['欧气爆棚','抽到了 SSR · 玫'],
    dex50:['图鉴过半','收集超过一半的卡'],
    sugar:['糖分超标','甜度条拉满 100%'],
    secret:['暗号对上了','你输入了 zhusu'],
    birthday:['记得生日','在档案页看了生日倒计时']
  };

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function toast(title,desc,tag='ACHIEVEMENT'){
    const box=$('.toasts');
    const t=document.createElement('div');t.className='toast';
    t.innerHTML=`<div class="medal"><span>♥</span></div><div><small>${tag}</small><b>${title}</b><p>${desc}</p></div>`;
    box.appendChild(t);
    setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),450)},3200);
  }
  function unlock(id){
    if(S.ach[id]) return;
    S.ach[id]=Date.now();save();
    toast(ACH[id][0],ACH[id][1]);
    window.dispatchEvent(new CustomEvent('zs:ach'));
  }
  function sugar(n,x,y){
    S.sugar=Math.min(100,S.sugar+n);save();renderSugar(true);
    if(S.sugar>=100) unlock('sugar');
    if(x!=null) floatFx(x,y,'+'+n+'糖');
  }
  function renderSugar(b){
    $('.sugar .meter i').style.width=S.sugar+'%';
    $('.sugar .num').textContent=S.sugar+'%';
    if(b){const el=$('.sugar');el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}
  }
  function floatFx(x,y,txt,color){
    const e=document.createElement('div');e.className='fx';
    e.textContent=txt;e.style.left=x+'px';e.style.top=y+'px';
    e.style.fontFamily='var(--f-zh)';e.style.color=color||'var(--r4)';e.style.fontSize='22px';
    e.style.textShadow='0 2px 0 #fff, 0 -2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff';
    document.body.appendChild(e);
    e.animate([{transform:'translate(-50%,-50%) scale(.6)',opacity:0},{transform:'translate(-50%,-120%) scale(1.1)',opacity:1,offset:.3},{transform:'translate(-50%,-260%) scale(1)',opacity:0}],{duration:1100,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>e.remove();
  }
  function hearts(x,y,n=10){
    const cols=['var(--zhu)','var(--su)','var(--r3)','var(--r2)','var(--r4)'];
    for(let i=0;i<n;i++){
      const e=document.createElement('div');e.className='fx';e.textContent='♥';
      e.style.left=x+'px';e.style.top=y+'px';e.style.color=cols[i%cols.length];e.style.fontSize=(14+Math.random()*18)+'px';
      document.body.appendChild(e);
      const a=Math.random()*Math.PI*2,d=60+Math.random()*90;
      e.animate([{transform:'translate(-50%,-50%) scale(.2)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d-40}px)) scale(1) rotate(${(Math.random()-.5)*60}deg)`,opacity:0}],{duration:900+Math.random()*400,easing:'cubic-bezier(.1,.8,.3,1)'}).onfinish=()=>e.remove();
    }
  }
  function rain(){
    const cols=['var(--zhu)','var(--su)','var(--r3)','var(--r2)','var(--r4)','var(--r1)'];
    for(let i=0;i<70;i++){
      const e=document.createElement('div');e.className='fx';e.textContent=['♥','✦','●'][i%3];
      e.style.left=Math.random()*100+'vw';e.style.top='-30px';e.style.color=cols[i%cols.length];e.style.fontSize=(12+Math.random()*26)+'px';
      document.body.appendChild(e);
      e.animate([{transform:'translateY(0) rotate(0)'},{transform:`translateY(${innerHeight+80}px) rotate(${Math.random()*720-360}deg)`}],{duration:2200+Math.random()*2200,delay:Math.random()*1200,easing:'cubic-bezier(.4,0,.8,1)',fill:'backwards'}).onfinish=()=>e.remove();
    }
  }

  // cursor — dot is yellow on left half (朱), red on right half (苏)
  function initCursor(){
    if(matchMedia('(pointer:coarse)').matches){document.body.classList.add('touch');return}
    const c=document.createElement('div');c.className='cur z';
    const h=document.createElement('div');h.className='cur-heart';
    h.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.2 0 3.6 1.3 4.3 2.5h2c.7-1.2 2.1-2.5 4.3-2.5 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill="#F4628C" stroke="#3A0719" stroke-width="1.6"/></svg>';
    document.body.append(c,h);
    let tx=0,ty=0,hx=0,hy=0;
    addEventListener('pointermove',e=>{
      tx=e.clientX;ty=e.clientY;
      c.style.transform=`translate(${tx}px,${ty}px)`;
      c.className='cur '+(tx<innerWidth/2?'z':'s');
      const t=e.target.closest('a,button,.ph,.gcard,.node,.char .hit,.knot,.mix-track,.pf');
      document.body.classList.toggle('hovering',!!t);
      h.classList.toggle('on',!!t);
    },{passive:true});
    (function loop(){hx+=(tx-hx)*.18;hy+=(ty-hy)*.18;h.style.transform=`translate(${hx+18}px,${hy-18}px) ${h.classList.contains('on')?'':'scale(.3)'}`;requestAnimationFrame(loop)})();
  }

  // secret: type z-h-u-s-u
  let buf='';
  addEventListener('keydown',e=>{
    if(e.target.matches('input,textarea'))return;
    buf=(buf+e.key.toLowerCase()).slice(-5);
    if(buf==='zhusu'){rain();unlock('secret');sugar(10)}
  });

  // nav highlight
  function initNav(){
    const links=$$('.hud nav a');
    const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+en.target.id))}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(a=>{const s=$(a.getAttribute('href'));if(s)io.observe(s)});
    let n=0;$('.hud .logo').addEventListener('click',e=>{if(++n%5===0){rain();sugar(5)} hearts(e.clientX,e.clientY,6)});
  }

  function loader(){
    const L=$('#loader');let p=0;
    const tips=['正在把黄色和红色调成玫色…','正在给立绘描边…','正在铺 12 个关卡…','正在洗牌…'];
    const iv=setInterval(()=>{
      p=Math.min(50,p+4+Math.random()*7);
      $('.ld-bar .lz').style.width=p+'%';$('.ld-bar .ls').style.width=p+'%';
      $('.ld-tip').textContent=tips[Math.min(3,Math.floor(p/13))];
      if(p>=50){clearInterval(iv);$('.ld-bar .lm').style.width='100%';$('.ld-tip').textContent='合体完成 ♥ 黄 + 红 = 玫';
        setTimeout(()=>{L.classList.add('gone');window.dispatchEvent(new Event('zs:ready'))},700)}
    },90);
  }

  window.ZS={STORAGE_KEY:KEY,S,save,unlock,sugar,toast,hearts,rain,floatFx,$,$$,ACH};
  document.addEventListener('DOMContentLoaded',()=>{initCursor();initNav();renderSugar();loader()});
})();
