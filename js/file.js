// ===== FILE: 并排档案对照 + 终章 =====
(function(){
  const {S,save,unlock,sugar,rain,$,ACH}=ZS;
  const C=window.ZS_CUTS;
  const Z={name:'朱志鑫',en:'ZHU ZHIXIN',bd:[2005,11,19],from:'重庆市',grp:'T.O.P登陆少年',co:'北京时代峰峻文化艺术发展有限公司',color:'黄色'};
  const U={name:'苏新皓',en:'SU XINHAO',bd:[2007,1,12],from:'重庆市',grp:'TOP登陆少年',co:'北京时代峰峻文化艺术发展有限公司',color:'红色'};
  const placementStyle=p=>`scale:${(p.flip?-1:1)*p.zoom/100} ${p.zoom/100};translate:${p.x}vw ${p.y}vh;transform-origin:center bottom`;
  const today=()=>new Date();
  function nextBd([y,m,d]){const t=today();let n=new Date(t.getFullYear(),m-1,d);if(n<new Date(t.getFullYear(),t.getMonth(),t.getDate()))n=new Date(t.getFullYear()+1,m-1,d);return Math.round((n-new Date(t.getFullYear(),t.getMonth(),t.getDate()))/864e5)}
  function diff(){
    const a=new Date(2005,10,19),b=new Date(2007,0,12);
    let y=b.getFullYear()-a.getFullYear(),m=b.getMonth()-a.getMonth(),d=b.getDate()-a.getDate();
    if(d<0){m--;d+=new Date(b.getFullYear(),b.getMonth(),0).getDate()}if(m<0){y--;m+=12}
    return {y,m,d,days:Math.round((b-a)/864e5)};
  }
  const card=(P,w)=>`
    <div class="pf ${w}">
      <img class="portrait" style="${placementStyle(window.ZS_SELECTED.profileLayout[w])}" src="${window.ZS_SELECTED.profile[w]}" alt="${P.name} 档案立绘">
      <div class="head"><div class="tag">${w==='z'?'1P · PLAYER FILE':'2P · PLAYER FILE'}</div><h3>${P.name}</h3><div class="en">${P.en}</div></div>
      <div class="rows">
        <div class="row"><span>生日</span><b>${P.bd[0]}.${String(P.bd[1]).padStart(2,'0')}.${String(P.bd[2]).padStart(2,'0')}</b></div>
        <div class="row"><span>出生地</span><b>${P.from}</b></div>
        <div class="row"><span>所属组合</span><b>${P.grp}</b></div>
        <div class="row"><span>经纪公司</span><b style="font-size:12px">${P.co}</b></div>
        <div class="row"><span>应援色</span><b>${P.color}</b></div>
      </div>
      <div class="cd"><span>距离生日</span><b>${nextBd(P.bd)}</b><span>天</span></div>
    </div>`;
  function build(){
    const df=diff();
    $('#file').innerHTML=`
      <div class="sec-head"><span class="sec-no">PLAYER FILE</span><h2 class="sec-title">1P / 2P 档案对照</h2><span class="sec-sub">SAME CITY · SAME TEAM</span></div>
      <div class="files">${card(Z,'z')}
        <div class="links">
          <div class="lk"><i>≠</i></div>
          <div class="lk same"><i>同</i></div>
          <div class="lk same"><i>同</i></div>
          <div class="lk same"><i>同</i></div>
          <div class="lk"><i>+</i></div>
          <div class="gap"><b>${df.y}年${df.m}个月${df.d}天</b>年龄差<br>共 ${df.days} 天</div>
        </div>${card(U,'s')}</div>`;
    const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){unlock('birthday');io.disconnect()}},{threshold:.5});
    io.observe($('.files'));
    // finale
    $('#finale').innerHTML=`
      <div class="fin">
        <img class="duo" style="${placementStyle(window.ZS_SELECTED.finaleLayout)}" src="${window.ZS_SELECTED.finale}" alt="朱志鑫与苏新皓 HEY 双人立绘">
        <div>
          <h2><span class="z">黄</span> + <span class="s">红</span><br>= <span class="r">玫</span></h2>
          <div class="credits">图片来源：资料包「用户CP照」及微博站子 <b>FATALISM丨朱苏</b>、<b>HEY囍帖街·朱苏</b>，小红书各位作者署名保留于大图说明。终章原图来自 <b>HEY囍帖街·朱苏</b>，图片已作透明立绘处理，版权归原作者。本站为粉丝向非官方页面，CP 为粉丝表达。</div>
          <div class="eggs"></div>
          <button class="reset">重置我的进度</button>
        </div>
      </div>`;
    renderEggs();addEventListener('zs:ach',renderEggs);
    $('.fin .reset').onclick=()=>{if(confirm('清空甜度、心动、图鉴和成就？')){localStorage.removeItem(ZS.STORAGE_KEY);location.reload()}};
    $('.fin .duo').addEventListener('click',e=>{rain();sugar(2,e.clientX,e.clientY)});
  }
  function renderEggs(){
    const got=Object.keys(S.ach).length,all=Object.keys(ACH).length;
    $('.fin .eggs').innerHTML=`<span style="background:none;box-shadow:none;padding-left:0">成就 ${got}/${all} ·</span>`+Object.entries(ACH).map(([k,v])=>`<span class="${S.ach[k]?'got':''}" title="${S.ach[k]?v[1]:'还没解锁'}">${S.ach[k]?v[0]:'？？？'}</span>`).join('');
  }
  document.addEventListener('DOMContentLoaded',build);
})();
