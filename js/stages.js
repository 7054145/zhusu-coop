// ===== STAGES: 12 关卡地图 =====
(function(){
  const {S,save,unlock,sugar,$}=ZS;
  const D=[
    ['2019-05-04','重庆','TF少年进化论—第25小时','Baby don’t stop + Teaser 2'],
    ['2019-10-19','重庆','TF少年进化论—单向放映厅','Be Natural'],
    ['2020-11-14','重庆','TF少年进化论—圈','猫鼠游戏'],
    ['2021-04-03','','少年ON FIRE第二季','巴比伦'],
    ['2021-04-03','','少年ON FIRE第二季','特务J'],
    ['2022-02-03','重庆','2022新年音乐会《未完成的约定》','夜的第七章'],
    ['2023-01-26','重庆','2023新年音乐会《瞬间》','Nobody'],
    ['2024-08-26','马来西亚吉隆坡','出道战《登陆时刻》Day2','返老还童 + Last Night'],
    ['2025-05-01','泉州晋江','首唱会《无所畏计划》Day1','只看着我'],
    ['2025-08-29','海南海口','一周年《ONE有引力》Day1','We Don’t Talk Anymore'],
    ['2026-01-31','中国澳门','荣耀之战Day1','Blow'],
    ['2026-04-12','中国澳门','浪漫主义Day2','罗生门']
  ];
  const isZh=s=>/[\u4e00-\u9fa5]/.test(s);
  const VIDEOS=['BV1u4411a7pg','BV1x741177WR','BV1dr4y1F7tR','BV1S5411w7Xo','BV1mA411574T','BV1Er4y1Y7aZ','BV1rM411q7M1','BV1QLnfe8Eg5','BV1ozVJzeEik','BV1Q1aYzkEMk','BV1uaFszBErc','BV1oi98BmEkL'];
  const videoUrl=i=>'https://www.bilibili.com/video/'+VIDEOS[i]+'/';
  const GAP=250,PAD=180,H=680;
  let cur=0;
  const pos=i=>({x:PAD+i*GAP,y:H/2+(i%2?70:-70)});

  function build(){
    const sec=$('#stages');
    sec.innerHTML=`
      <div class="sec-head"><span class="sec-no">STAGE SELECT</span><h2 class="sec-title">双人舞台 · 关卡</h2><span class="sec-sub">12 LEVELS · 2019 → 2026</span></div>
      <div class="lvl-meta">
        <div class="lvl-stat"><b>12</b><span>个双人舞台</span></div>
        <div class="lvl-stat"><b>7<em>年</em></b><span>从重庆到澳门</span></div>
        <div class="lvl-stat"><b id="lvSpan">0</b><span>天 · 第一关到最新一关</span></div>
        <div class="lvl-prog"><span>已解锁 <b id="lvSeen">0</b>/12 · 点亮全部节点可通关</span><div class="bar"><i></i></div></div>
      </div>
      <div class="track-wrap"><div class="track"><svg></svg></div></div>
      <div class="lvl-detail"><div class="big">01</div><div><h3></h3><p></p><a class="stage-watch" target="_blank" rel="noopener noreferrer">▶ 在 B 站观看舞台</a></div><div class="ago"><b></b><span></span><div class="lvl-nav"><button data-d="-1" aria-label="上一关">←</button><button data-d="1" aria-label="下一关">→</button></div></div></div>`;
    const track=$('.track',sec),svg=$('svg',track);
    const w=PAD*2+(D.length-1)*GAP;track.style.width=w+'px';track.style.height=H+'px';svg.setAttribute('width',w);svg.setAttribute('height',H);
    // path
    let d=`M${pos(0).x},${pos(0).y}`;
    for(let i=1;i<D.length;i++){const a=pos(i-1),b=pos(i);d+=` C${a.x+GAP/2},${a.y} ${b.x-GAP/2},${b.y} ${b.x},${b.y}`}
    svg.innerHTML=`<path d="${d}" fill="none" stroke="#ffffff22" stroke-width="6" stroke-dasharray="2 12" stroke-linecap="round"/><path class="lit" d="${d}" fill="none" stroke="url(#gZS)" stroke-width="6" stroke-linecap="round"/>
      <defs><linearGradient id="gZS" x1="0" x2="1"><stop offset="0" stop-color="#FFC61A"/><stop offset=".5" stop-color="#F4628C"/><stop offset="1" stop-color="#E3162B"/></linearGradient></defs>`;
    let lastYr='';
    D.forEach((r,i)=>{
      const p=pos(i),yr=r[0].slice(0,4);
      if(yr!==lastYr){const y=document.createElement('div');y.className='yearmark';y.style.left=(p.x-60)+'px';y.textContent=yr;track.appendChild(y);lastYr=yr}
      const n=document.createElement('div');n.className='node '+(i%2?'down':'up');n.style.left=p.x+'px';n.style.top=p.y+'px';
      n.innerHTML=`<div class="dot">${String(i+1).padStart(2,'0')}</div><div class="card"><span class="lock">LV.${String(i+1).padStart(2,'0')}</span><div class="yr">${r[0].replaceAll('-','.')}${r[1]?' · '+r[1]:''}</div><div class="song ${isZh(r[3])&&!/[A-Za-z]/.test(r[3])?'zh':''}">${r[3]}</div><div class="ev">${r[2]}</div></div>`;
      n.addEventListener('click',()=>select(i,true));
      const watch=document.createElement('a');watch.className='stage-watch';watch.href=videoUrl(i);watch.target='_blank';watch.rel='noopener noreferrer';watch.textContent='▶ 观看舞台';watch.setAttribute('aria-label','在 B 站观看 '+r[3]);watch.addEventListener('click',e=>{e.stopPropagation();select(i,true)});n.querySelector('.card').appendChild(watch);
      track.appendChild(n);
    });
    const lit=$('.lit',svg);const L=lit.getTotalLength();lit.style.strokeDasharray=L;lit.style.strokeDashoffset=L;lit.style.transition='stroke-dashoffset .8s cubic-bezier(.3,1,.4,1)';lit.dataset.L=L;
    sec.querySelectorAll('.lvl-nav button').forEach(b=>b.addEventListener('click',()=>select(Math.max(0,Math.min(11,cur+ +b.dataset.d)),true)));
    const span=Math.round((new Date(D[11][0])-new Date(D[0][0]))/864e5);$('#lvSpan').textContent=span.toLocaleString();
    // drag to scroll
    const wrap=$('.track-wrap',sec);let dn=false,sx=0,sl=0,moved=0;
    wrap.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dn=true;sx=e.clientX;sl=wrap.scrollLeft;moved=0});
    addEventListener('pointermove',e=>{if(!dn)return;moved=Math.abs(e.clientX-sx);wrap.scrollLeft=sl-(e.clientX-sx)});
    addEventListener('pointerup',()=>dn=false);
    wrap.addEventListener('click',e=>{if(moved>6){e.stopPropagation();e.preventDefault()}},true);
    wrap.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){const before=wrap.scrollLeft;wrap.scrollLeft+=e.deltaY;if(wrap.scrollLeft!==before)e.preventDefault()}},{passive:false});
    addEventListener('keydown',e=>{
      const r=sec.getBoundingClientRect();if(r.top>innerHeight*.5||r.bottom<innerHeight*.5)return;
      if(e.key==='ArrowRight'){select(Math.min(11,cur+1),true);e.preventDefault()}
      if(e.key==='ArrowLeft'){select(Math.max(0,cur-1),true);e.preventDefault()}
    });
    select(0,false);
  }
  function select(i,user){
    cur=i;const sec=$('#stages');
    if(user){S.seen[i]=1;save();sugar(1)}
    sec.querySelectorAll('.node').forEach((n,j)=>{n.classList.toggle('cur',j===i);n.classList.toggle('seen',!!S.seen[j])});
    const lit=$('.lit',sec),L=+lit.dataset.L;lit.style.strokeDashoffset=L*(1-i/11);
    const r=D[i];
    $('.lvl-detail .big',sec).textContent=String(i+1).padStart(2,'0');
    $('.lvl-detail h3',sec).textContent=r[3];
    $('.lvl-detail p',sec).textContent=`${r[2]}${r[1]?' · '+r[1]:''}`;
    $('.lvl-detail .stage-watch',sec).href=videoUrl(i);
    $('.lvl-detail .stage-watch',sec).setAttribute('aria-label','在 B 站观看 '+r[3]);
    const days=Math.floor((new Date('2026-10-05')-new Date(r[0]))/864e5);
    $('.lvl-detail .ago b',sec).textContent=r[0].replaceAll('-','.');
    $('.lvl-detail .ago span',sec).textContent=`距今 ${days.toLocaleString()} 天`;
    const seen=Object.keys(S.seen).length;$('#lvSeen').textContent=seen;$('.lvl-prog .bar i',sec).style.width=(seen/12*100)+'%';
    if(seen>=12)unlock('stages');
    if(user){const wrap=$('.track-wrap',sec);wrap.scrollTo({left:pos(i).x-wrap.clientWidth/2,behavior:'smooth'})}
  }
  document.addEventListener('DOMContentLoaded',build);
})();
