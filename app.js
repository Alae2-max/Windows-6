/**
 * Windows 10 Simulator v2 — Full Edition
 * WiFi Card + Display Card + Real Browser Search + Action Center
 * Single JS file, loaded by index.html
 */
(function() {
'use strict';

const S = {
  loggedIn: false, wallpaper: 'default', theme: 'light',
  windows: [], nextWid: 1, zCtr: 100, fw: null, actApp: null,
  startOpen: false, powerOpen: false, actionOpen: false, ctx: null,
  wifiEnabled: true, wifiConnected: 'Home_Network', wifiSignal: 4,
  wifiNetworks: [
    { name: 'Home_Network', signal: 4, secured: true, connected: true },
    { name: 'Office_WiFi_5G', signal: 3, secured: true, connected: false },
    { name: 'Coffee_Shop_Free', signal: 2, secured: false, connected: false },
    { name: 'Neighbor_Netgear', signal: 1, secured: true, connected: false },
    { name: 'Public_Library', signal: 3, secured: false, connected: false },
  ],
  brightness: 100, nightLight: false, resolution: '1920x1080', scale: '100%',
  battery: 85, charging: true,
  notifications: [
    { title: 'Welcome', body: 'Windows 10 Simulator v2 is ready.', time: 'Just now' },
    { title: 'Connected to WiFi', body: 'Home_Network — Signal: Excellent', time: '2 min ago' },
    { title: 'Battery', body: '85% — Charging', time: '5 min ago' },
  ],
  toggles: { wifi: true, bluetooth: false, airplane: false, nightlight: false, batterySaver: false, vpn: false, mobile: false, location: true },
  fs: {
    'C:': { t: 'folder', c: {
      'Users': { t: 'folder', c: { 'Ali': { t: 'folder', c: {
        'Desktop': { t: 'folder', c: {} },
        'Documents': { t: 'folder', c: { 'Notes.txt':{t:'file',co:'Hello!',e:'txt'}, 'Report.docx':{t:'file',co:'Report',e:'docx'}, 'Budget.xlsx':{t:'file',co:'Budget',e:'xlsx'} }},
        'Downloads': { t: 'folder', c: {} },
        'Music': { t: 'folder', c: { 's1.mp3':{t:'file',co:'',e:'mp3'}, 's2.mp3':{t:'file',co:'',e:'mp3'} }},
        'Pictures': { t: 'folder', c: { 'p1.png':{t:'file',co:'',e:'png'}, 'p2.jpg':{t:'file',co:'',e:'jpg'} }},
        'Videos': { t: 'folder', c: {} }
      }}}},
      'Windows': { t: 'folder', c: { 'System32': { t: 'folder', c: {} } }},
      'Program Files': { t: 'folder', c: { 'IE': { t: 'folder', c: {} } } }
    }}
  },
  bTabs: [{ title: 'New Tab', url: '', content: '' }], bAct: 0,
  edDoc: '',
  wps: { default:'linear-gradient(135deg, #1a6fb5 0%, #1a8fd4 50%, #0d5a9e 100%)', nature:'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', sunset:'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', night:'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', aurora:'linear-gradient(135deg, #00b4db 0%, #0083b0 50%, #00b4db 100%)', ocean:'linear-gradient(135deg, #1CB5E0 0%, #000046 100%)', forest:'linear-gradient(135deg, #134E5E 0%, #71B280 100%)', purple:'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)' },
  cp: 'C:/Users/Ali', ph: ['C:/Users/Ali'], pi: 0,
  mp: false, mpr: 0, mt: null, cs: { d: '0', f: null, o: null, w: false }
};

const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s), Q = (s, el) => (el || document).querySelector(s);
const W10 = window.W10 = {};

// ===== LOGIN =====
function initLogin() {
  const scr = $('#loginScreen'), pwd = $('#loginPassword'), btn = $('#loginBtn'), tEl = $('#loginTime'), dEl = $('#loginDate');
  function tick() {
    const d = new Date();
    tEl.textContent = d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
    dEl.textContent = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()]+', '+['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()]+' '+d.getDate();
  }
  tick(); setInterval(tick, 10000);
  btn.onclick = () => { if(pwd.value==='1234')doLogin(); else{pwd.style.borderColor='#e81123';setTimeout(()=>pwd.style.borderColor='',500);} };
  pwd.onkeydown = e => { if(e.key==='Enter')btn.click(); };
  $('#loginPower').onclick = () => { scr.style.opacity='0'; setTimeout(()=>scr.style.opacity='1',1000); };
}
function doLogin() {
  S.loggedIn = true; $('#loginScreen').classList.add('hidden');
  setTimeout(() => {
    $('#desktop').classList.add('active'); $('#taskbar').classList.add('active');
    renderDicons(); renderTbar(); renderStart(); updateClock(); updateTrayIcons();
    showN('Welcome back, Ali!','Windows 10 Simulator v2 ready.',2500);
    $('#desktop').style.background = S.wps[S.wallpaper];
    buildActionCenter(); buildWifiPanel();
  }, 500);
}
function doSignOut() {
  S.loggedIn = false; S.windows.forEach(w=>{const e=document.getElementById(w.id);if(e)e.remove();});
  S.windows=[]; if(S.mt){clearInterval(S.mt);S.mt=null;S.mp=false;}
  $('#desktop').classList.remove('active');$('#taskbar').classList.remove('active');
  $('#loginScreen').classList.remove('hidden');$('#loginPassword').value='';
  $('#startMenu').classList.remove('open');S.startOpen=false;
}

// ===== CLOCK =====
function updateClock(){const d=new Date();const t=d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');const ds=(d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();const te=$('#trayTime'),de=$('#trayDate');if(te)te.textContent=t;if(de)de.textContent=ds;}
setInterval(updateClock,15000);

// ===== TRAY ICONS =====
function updateTrayIcons() {
  const icons = document.querySelectorAll('.tray .tray-icon');
  if (icons.length >= 3) {
    icons[0].textContent = S.wifiEnabled ? (S.wifiConnected ? '📶' : '📡') : '🚫';
    icons[0].title = S.wifiEnabled ? (S.wifiConnected ? S.wifiConnected+' — Signal: '+'▮'.repeat(S.wifiSignal) : 'Not connected') : 'WiFi Off';
    icons[2].textContent = S.charging ? '🔌' : S.battery>80?'🔋':S.battery>40?'🔋':S.battery>15?'🪫':'⚠️';
    icons[2].title = S.battery+'%'+(S.charging?' — Charging':'');
  }
}

// ===== ACTION CENTER =====
function buildActionCenter() {
  let ac = $('#actionCenter');
  if (ac) return ac;
  ac = document.createElement('div'); ac.id = 'actionCenter'; ac.className = 'action-center';
  ac.innerHTML = `<div class="ac-header"><span class="ac-h-title">Notifications</span><button class="ac-h-btn" id="acClearAll">Clear all</button></div><div class="ac-notifs" id="acNotifs"></div><div class="ac-divider"></div><div class="ac-toggles-title">Quick actions</div><div class="ac-toggles" id="acToggles"></div><div class="ac-sliders"><div class="ac-slider-row"><span>☀️</span><input type="range" min="0" max="100" value="${S.brightness}" id="acBrightness" oninput="W10.setBrightness(this.value)"><span id="acBrightVal">${S.brightness}%</span></div></div><div class="ac-footer"><div class="ac-f-item" onclick="openApp('settings')">⚙️ All settings</div><div class="ac-f-item" onclick="openApp('wifi')">📶 Network</div></div>`;
  document.body.appendChild(ac);
  $('#acClearAll').onclick=()=>{S.notifications=[];renderNotifications();};
  const toggles = [{id:'wifi',icon:'📶',label:'WiFi'},{id:'bluetooth',icon:'📱',label:'Bluetooth'},{id:'airplane',icon:'✈️',label:'Airplane'},{id:'nightlight',icon:'🌙',label:'Night'},{id:'batterySaver',icon:'🔋',label:'Battery'},{id:'vpn',icon:'🔒',label:'VPN'},{id:'mobile',icon:'📡',label:'Hotspot'},{id:'location',icon:'📍',label:'Location'}];
  const tgDiv = $('#acToggles');
  tgDiv.innerHTML = toggles.map(tg=>`<div class="ac-toggle${S.toggles[tg.id]?' active':''}" id="acTg_${tg.id}" onclick="W10.tgToggle('${tg.id}')"><span class="ac-tg-icon">${tg.icon}</span><span class="ac-tg-label">${tg.label}</span></div>`).join('');
  return ac;
}
function renderNotifications() {
  const ct = $('#acNotifs'); if (!ct) return;
  if (!S.notifications.length) { ct.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-secondary);font-size:12px">No new notifications</div>'; return; }
  ct.innerHTML = S.notifications.map(n=>`<div class="ac-notif"><div class="ac-n-title">${n.title}</div><div class="ac-n-body">${n.body}</div><div class="ac-n-time">${n.time}</div></div>`).join('');
}
function toggleActionCenter() {
  S.actionOpen = !S.actionOpen;
  const ac = buildActionCenter(); ac.classList.toggle('show', S.actionOpen);
  renderNotifications();
  if (S.actionOpen) { toggleStart(false); const wp=$('#wifiPanel'); if(wp)wp.style.display='none'; }
}

W10.tgToggle = function(id) {
  S.toggles[id] = !S.toggles[id];
  const el = $('#acTg_'+id); if(el) el.classList.toggle('active', S.toggles[id]);
  if (id==='wifi') { S.wifiEnabled = S.toggles[id]; if(!S.wifiEnabled)S.wifiConnected=null; updateTrayIcons(); }
  if (id==='nightlight') { S.nightLight=S.toggles[id]; document.body.style.filter = S.nightLight ? `brightness(${S.brightness/100}) sepia(0.3) hue-rotate(-15deg)` : `brightness(${S.brightness/100})`; }
  if (id==='bluetooth') showN('Bluetooth', S.toggles[id]?'On':'Off', 2000);
  if (id==='airplane') showN('Airplane mode', S.toggles[id]?'On':'Off', 2000);
};

W10.setBrightness = function(val) {
  S.brightness = parseInt(val);
  const v = $('#acBrightVal'); if(v) v.textContent = val+'%';
  document.body.style.filter = S.nightLight ? `brightness(${val/100}) sepia(0.3) hue-rotate(-15deg)` : `brightness(${val/100})`;
};

// ===== WIFI PANEL =====
function buildWifiPanel() {
  let wp = $('#wifiPanel'); if (wp) return wp;
  wp = document.createElement('div'); wp.id = 'wifiPanel'; wp.className = 'wifi-panel';
  wp.innerHTML = `<div class="wifi-header"><span>Network</span><button class="wifi-toggle-btn" id="wifiToggleBtn">${S.wifiEnabled?'On':'Off'}</button></div><div class="wifi-list" id="wifiList"></div>`;
  document.body.appendChild(wp);
  $('#wifiToggleBtn').onclick = e => { e.stopPropagation(); S.wifiEnabled=!S.wifiEnabled; $('#wifiToggleBtn').textContent=S.wifiEnabled?'On':'Off'; if(!S.wifiEnabled)S.wifiConnected=null; updateTrayIcons(); renderWifiList(); };
  return wp;
}
function renderWifiList() {
  const list = $('#wifiList'); if (!list) return;
  if (!S.wifiEnabled) { list.innerHTML = '<div class="wifi-item" style="color:var(--text-secondary)"><span>WiFi is turned off</span></div>'; return; }
  list.innerHTML = S.wifiNetworks.map((n,i)=>`<div class="wifi-item${n.connected?' connected':''}" onclick="W10.connectWifi(${i})"><span class="wifi-signal">${'▮'.repeat(n.signal)}${'▯'.repeat(4-n.signal)}</span><span class="wifi-name">${n.name}</span><span class="wifi-secure">${n.secured?'🔒':'🔓'}</span><span class="wifi-status">${n.connected?'Connected':''}</span></div>`).join('');
}
W10.connectWifi = function(idx) {
  if (!S.wifiEnabled) return;
  S.wifiNetworks.forEach((n,i)=>n.connected=(i===idx));
  S.wifiConnected = S.wifiNetworks[idx].name; S.wifiSignal = S.wifiNetworks[idx].signal;
  S.notifications.unshift({title:'WiFi Connected',body:S.wifiConnected+' — Signal: '+'▮'.repeat(S.wifiSignal),time:'Just now'});
  updateTrayIcons(); renderWifiList();
  setTimeout(()=>{const wp=$('#wifiPanel');if(wp)wp.style.display='none';},1000);
};

// ===== NOTIFICATION =====
function showN(title,body,dur=3000){const old=$('.notif');if(old)old.remove();const n=document.createElement('div');n.className='notif show';n.innerHTML=`<div class="notif-title">${title}</div>${body?`<div class="notif-body">${body}</div>`:''}`;document.body.appendChild(n);setTimeout(()=>{n.classList.remove('show');setTimeout(()=>n.remove(),300);},dur);}

// ===== DESKTOP ICONS =====
const DICONS = [
  { n:'Recycle Bin',i:'🗑️',act:'recycle' },{ n:'File Explorer',i:'📁',app:'explorer' },
  { n:'Edge Browser',i:'🌐',app:'browser' },{ n:'Notepad',i:'📝',app:'editor' },
  { n:'Calculator',i:'🔢',app:'calculator' },{ n:'Settings',i:'⚙️',app:'settings' },
  { n:'Media Player',i:'🎵',app:'media' }
];
function renderDicons() {
  const di = $('#desktopIcons');
  di.innerHTML = DICONS.map(ic=>`<div class="d-icon" data-app="${ic.app||''}" data-act="${ic.act||''}"><div class="di">${ic.i}</div><div class="dl">${ic.n}</div></div>`).join('');
  di.querySelectorAll('.d-icon').forEach(el=>{el.ondblclick=()=>{if(el.dataset.app)openApp(el.dataset.app);else if(el.dataset.act==='recycle')showN('Recycle Bin','Empty.',1500);};});
}

// ===== TASKBAR =====
const TBAR = [{ n:'File Explorer',i:'📁',app:'explorer' },{ n:'Edge',i:'🌐',app:'browser' },{ n:'Notepad',i:'📝',app:'editor' },{ n:'Calculator',i:'🔢',app:'calculator' }];
function renderTbar() {
  const ta = $('#taskbarApps');
  ta.innerHTML = TBAR.map(a=>`<button class="tb-app" data-app="${a.app}" title="${a.n}"><span>${a.i}</span></button>`).join('');
  ta.querySelectorAll('.tb-app').forEach(b=>b.onclick=()=>openApp(b.dataset.app));
  $('#startBtn').onclick=()=>toggleStart();
  $('#showDesktopBtn').onclick=()=>S.windows.forEach(w=>{if(!w.minimized)minimizeWin(w.id);});
  // Tray clock click → action center
  $('#trayClock').onclick = () => toggleActionCenter();
  // WiFi tray icon click
  $$('.tray-icon')[0].onclick = () => {
    const wp = buildWifiPanel(); renderWifiList();
    const show = wp.style.display === 'block';
    wp.style.display = show ? 'none' : 'block';
  };
}
function updTb(){$$('#taskbarApps .tb-app').forEach(b=>b.classList.toggle('active',b.dataset.app===S.actApp));}

// ===== START MENU =====
const SAPPS = [
  { n:'File Explorer',i:'📁',app:'explorer' },{ n:'Microsoft Edge',i:'🌐',app:'browser' },
  { n:'Notepad',i:'📝',app:'editor' },{ n:'Calculator',i:'🔢',app:'calculator' },
  { n:'Settings',i:'⚙️',app:'settings' },{ n:'Media Player',i:'🎵',app:'media' },
  { n:'Command Prompt',i:'⬛',app:'cmd' },{ n:'Task Manager',i:'📊',app:'taskmgr' },
  { n:'Display Settings',i:'🖥️',app:'display' },{ n:'WiFi Settings',i:'📶',app:'wifi' }
];
function renderStart() {
  const list = $('#startAppList');
  list.innerHTML = SAPPS.map(a=>`<li class="start-app-item" data-app="${a.app}"><span class="sa-icon">${a.i}</span><span class="app-name">${a.n}</span><span class="app-arrow">›</span></li>`).join('');
  list.querySelectorAll('.start-app-item').forEach(el=>el.onclick=()=>{openApp(el.dataset.app);toggleStart(false);});
  $('#startTiles').innerHTML = `<div class="start-tile wide" data-app="browser"><span class="st-icon">🌐</span>Edge</div><div class="start-tile" data-app="explorer"><span class="st-icon">📁</span>Explorer</div><div class="start-tile" data-app="editor"><span class="st-icon">📝</span>Notepad</div><div class="start-tile" data-app="calculator"><span class="st-icon">🔢</span>Calc</div><div class="start-tile" data-app="display"><span class="st-icon">🖥️</span>Display</div><div class="start-tile" data-app="wifi"><span class="st-icon">📶</span>WiFi</div>`;
  $$('#startTiles .start-tile').forEach(el=>el.onclick=()=>{openApp(el.dataset.app);toggleStart(false);});
  $('#startSettingsBtn').onclick=()=>{openApp('settings');toggleStart(false);};
  $('#startPowerBtn').onclick=e=>{e.stopPropagation();togglePower();};
  const sb = $('#tbSearch');
  sb.oninput=()=>{const q=sb.value.toLowerCase();if(S.startOpen)list.querySelectorAll('.start-app-item').forEach(el=>el.style.display=(!q||el.dataset.app.includes(q)||el.textContent.toLowerCase().includes(q))?'':'none');};
  sb.onkeydown=e=>{if(e.key==='Enter'&&sb.value.trim()){const q=sb.value.toLowerCase().trim();const m=SAPPS.find(a=>a.n.toLowerCase().includes(q)||a.app.includes(q));if(m){openApp(m.app);toggleStart(false);sb.value='';}}};
}
function toggleStart(force){S.startOpen=force!==undefined?force:!S.startOpen;$('#startMenu').classList.toggle('open',S.startOpen);$('#startBtn').classList.toggle('active',S.startOpen);if(!S.startOpen)$('#tbSearch').value='';if(S.actionOpen&&S.startOpen)toggleActionCenter();}
function togglePower(){
  S.powerOpen=!S.powerOpen;let pm=$('#powerMenu');
  if(!pm){pm=document.createElement('div');pm.id='powerMenu';pm.className='power-menu';pm.innerHTML=`<button class="pwr-item" data-a="sleep">😴 Sleep</button><button class="pwr-item" data-a="restart">🔄 Restart</button><button class="pwr-item" data-a="shutdown">⏻ Shut down</button><button class="pwr-item" data-a="signout">🚪 Sign out</button>`;document.body.appendChild(pm);pm.querySelectorAll('.pwr-item').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='signout')doSignOut();else if(a==='shutdown'){showN('Shutting down...','',1500);setTimeout(doSignOut,1500);}else if(a==='restart'){showN('Restarting...','',1200);setTimeout(doSignOut,1200);}else showN('Sleep','ZZZ...',1200);S.powerOpen=false;pm.classList.remove('show');});}
  pm.classList.toggle('show',S.powerOpen);if(S.powerOpen)toggleStart(false);
}

// ===== WINDOW MANAGEMENT =====
function openApp(app){
  if(!app)return;
  const tM={explorer:'File Explorer',browser:'Microsoft Edge',editor:'Notepad',calculator:'Calculator',settings:'Settings',media:'Windows Media Player',cmd:'Command Prompt',taskmgr:'Task Manager',display:'Display Settings',wifi:'Network & Internet'};
  const iM={explorer:'📁',browser:'🌐',editor:'📝',calculator:'🔢',settings:'⚙️',media:'🎵',cmd:'⬛',taskmgr:'📊',display:'🖥️',wifi:'📶'};
  const title=tM[app]||app,icon=iM[app]||'📄';
  let w=S.windows.find(w=>w.app===app&&w.minimized);
  if(w){w.minimized=false;const e=document.getElementById(w.id);if(e)e.style.display='';focusWin(w.id);updTb();return;}
  w=S.windows.find(w=>w.app===app&&!w.minimized);if(w){focusWin(w.id);return;}
  let ww=800,wh=500;
  if(app==='calculator'){ww=270;wh=400;}else if(app==='settings'||app==='display'||app==='wifi'){ww=750;wh=520;}else if(app==='media'){ww=480;wh=380;}else if(app==='cmd'||app==='taskmgr'){ww=620;wh=380;}
  const off=S.windows.length*30,x=Math.min(80+off,innerWidth-ww-20),y=Math.min(40+off,innerHeight-wh-80);
  const nd={id:'w'+(S.nextWid++),app,title,icon,x:Math.max(10,x),y:Math.max(0,y),w:ww,h:wh,minimized:false,maximized:false,prev:null,z:++S.zCtr};
  S.windows.push(nd);buildWin(nd);focusWin(nd.id);S.actApp=app;updTb();
}
function buildWin(wd){
  const old=document.getElementById(wd.id);if(old)old.remove();
  const c=document.createElement('div');c.className='window-container';c.id=wd.id;
  c.style.cssText=`left:${wd.x}px;top:${wd.y}px;width:${wd.w}px;height:${wd.h}px;z-index:${wd.z}`;
  c.innerHTML=`<div class="window" id="${wd.id}-win"><div class="win-titlebar"><span class="wt-icon">${wd.icon}</span><span class="wt-title">${wd.title}</span><div class="win-ctrls"><button class="win-ctrl minimize">─</button><button class="win-ctrl maximize">□</button><button class="win-ctrl close">✕</button></div></div><div class="win-body">${getBody(wd.app)}</div></div>`;
  $('#desktop').appendChild(c);
  Q('.minimize',c).onclick=e=>{e.stopPropagation();minimizeWin(wd.id);};
  Q('.maximize',c).onclick=e=>{e.stopPropagation();maximizeWin(wd.id);};
  Q('.close',c).onclick=e=>{e.stopPropagation();closeWin(wd.id);};
  let drag=false,dx=0,dy=0;
  Q('.win-titlebar',c).onmousedown=e=>{if(e.target.closest('.win-ctrl')||wd.maximized)return;drag=true;const r=c.getBoundingClientRect();dx=e.clientX-r.left;dy=e.clientY-r.top;focusWin(wd.id);e.preventDefault();};
  document.addEventListener('mousemove',e=>{if(!drag||wd.maximized)return;wd.x=Math.max(-200,e.clientX-dx);wd.y=Math.max(0,e.clientY-dy);c.style.left=wd.x+'px';c.style.top=wd.y+'px';});
  document.addEventListener('mouseup',()=>{drag=false;});
  c.onmousedown=()=>focusWin(wd.id);
  addRH(c);
  setTimeout(()=>{if(wd.app==='explorer')renderEx();else if(wd.app==='settings')renderSet();else if(wd.app==='display')renderDisplaySettings();else if(wd.app==='wifi')renderWifiSettings();},60);
}
(function(){let rs=null;document.addEventListener('mousedown',e=>{const h=e.target.closest('.rs-handle');if(!h)return;const ct=h.closest('.window-container');if(!ct)return;const wd=S.windows.find(w=>w.id===ct.id);if(!wd||wd.maximized)return;rs={wd,ct,dir:h.dataset.dir,sx:e.clientX,sy:e.clientY,sw:wd.w,sh:wd.h,sl:wd.x,st:wd.y};e.preventDefault();e.stopPropagation();});document.addEventListener('mousemove',e=>{if(!rs)return;const{wd,ct,dir,sx,sy,sw,sh,sl,st}=rs;const dx=e.clientX-sx,dy=e.clientY-sy;let nw=sw,nh=sh,nl=sl,nt=st;if(dir.includes('e'))nw=Math.max(270,sw+dx);if(dir.includes('w')){nw=Math.max(270,sw-dx);nl=sl+sw-nw;}if(dir.includes('s'))nh=Math.max(160,sh+dy);if(dir.includes('n')){nh=Math.max(160,sh-dy);nt=st+sh-nh;}wd.w=nw;wd.h=nh;wd.x=nl;wd.y=nt;ct.style.width=nw+'px';ct.style.height=nh+'px';ct.style.left=nl+'px';ct.style.top=nt+'px';});document.addEventListener('mouseup',()=>{rs=null;});})();
function addRH(ct){const css={n:'top:0;left:4px;right:4px;height:5px;cursor:n-resize',s:'bottom:0;left:4px;right:4px;height:5px;cursor:s-resize',e:'top:4px;right:0;bottom:4px;width:5px;cursor:e-resize',w:'top:4px;left:0;bottom:4px;width:5px;cursor:w-resize',ne:'top:0;right:0;width:10px;height:10px;cursor:ne-resize',nw:'top:0;left:0;width:10px;height:10px;cursor:nw-resize',se:'bottom:0;right:0;width:10px;height:10px;cursor:se-resize',sw:'bottom:0;left:0;width:10px;height:10px;cursor:sw-resize'};Object.entries(css).forEach(([d,cs])=>{const h=document.createElement('div');h.className='rs-handle';h.dataset.dir=d;h.style.cssText='position:absolute;z-index:5;'+cs;ct.appendChild(h);});}
function focusWin(id){const wd=S.windows.find(w=>w.id===id);if(!wd)return;wd.z=++S.zCtr;wd.minimized=false;const ct=document.getElementById(id);if(ct){ct.style.zIndex=wd.z;ct.style.display='';Q('.window',ct).classList.add('focused');}S.fw=id;S.actApp=wd.app;updTb();$$('.window-container').forEach(el=>{if(el.id!==id){const w=Q('.window',el);if(w)w.classList.remove('focused');}});}
function minimizeWin(id){const ct=document.getElementById(id);if(ct)ct.style.display='none';const wd=S.windows.find(w=>w.id===id);if(wd)wd.minimized=true;if(S.fw===id)S.fw=null;if(S.actApp===wd?.app){const nx=[...S.windows].reverse().find(w=>!w.minimized);S.actApp=nx?nx.app:null;}updTb();}
function maximizeWin(id){const wd=S.windows.find(w=>w.id===id),ct=document.getElementById(id);if(!wd||!ct)return;if(wd.maximized){if(wd.prev){wd.x=wd.prev.x;wd.y=wd.prev.y;wd.w=wd.prev.w;wd.h=wd.prev.h;}wd.maximized=false;ct.style.left=wd.x+'px';ct.style.top=wd.y+'px';ct.style.width=wd.w+'px';ct.style.height=wd.h+'px';Q('.window',ct).classList.remove('maximized');}else{wd.prev={x:wd.x,y:wd.y,w:wd.w,h:wd.h};wd.x=0;wd.y=0;wd.w=innerWidth;wd.h=innerHeight-48;wd.maximized=true;ct.style.left='0';ct.style.top='0';ct.style.width=wd.w+'px';ct.style.height=wd.h+'px';Q('.window',ct).classList.add('maximized');}}
function closeWin(id){const ct=document.getElementById(id);if(ct){ct.style.opacity='0';ct.style.transform='scale(.95)';setTimeout(()=>ct.remove(),150);}const wd=S.windows.find(w=>w.id===id);S.windows=S.windows.filter(w=>w.id!==id);if(S.fw===id)S.fw=null;if(S.actApp===wd?.app){const nx=[...S.windows].reverse().find(w=>!w.minimized);S.actApp=nx?nx.app:null;}if(wd?.app==='media'&&S.mt){clearInterval(S.mt);S.mt=null;S.mp=false;}updTb();}

// Next: app bodies in part 2
// See below for getBody, explorer, browser, settings, display, wifi, media, etc.
// (file continues — this line prevents truncation)

// ===== APP BODIES =====
function getBody(app){
  switch(app){
    case 'explorer': return '<div class="explorer"><div class="ex-ribbon"><button class="rib-btn" onclick="W10.eA(\'nf\')">📁+ New Folder</button><button class="rib-btn" onclick="W10.eA(\'rn\')">✏️ Rename</button><button class="rib-btn danger" onclick="W10.eA(\'dl\')">🗑️ Delete</button><button class="rib-btn" onclick="W10.eA(\'nfl\')">📄 New File</button></div><div class="ex-addr"><button class="addr-btn" id="exBack" onclick="W10.eN(-1)">⬅</button><button class="addr-btn" id="exFwd" onclick="W10.eN(1)">➡</button><button class="addr-btn" onclick="W10.eN(\'up\')">⬆</button><input class="addr-bar" id="exAddr" value="'+S.cp+'" onkeydown="if(event.key===\'Enter\')W10.eG(this.value)"></div><div class="ex-body"><div class="ex-sidebar" id="exSidebar"></div><div class="ex-content" id="exContent"></div></div></div>';
    case 'browser': return '<div class="browser"><div class="br-tabs" id="brTabs">'+S.bTabs.map((t,i)=>'<div class="br-tab'+(i===S.bAct?' active':'')+'" data-idx="'+i+'"><span>🌐</span>'+(t.title||'New Tab')+(S.bTabs.length>1?'<button class="tc" data-idx="'+i+'">✕</button>':'')+'</div>').join('')+'<button class="br-tab" id="brNewTab" style="padding:5px 12px">+</button></div><div class="br-nav"><button class="br-nav-btn" onclick="W10.bN(\'back\')">⬅</button><button class="br-nav-btn" onclick="W10.bN(\'fwd\')">➡</button><button class="br-nav-btn" onclick="W10.bN(\'ref\')">🔄</button><input class="br-url" id="brUrl" value="'+(S.bTabs[S.bAct]?.url||'')+'" placeholder="Search or enter web address" onkeydown="if(event.key===\'Enter\')W10.bG()"><button class="br-nav-btn" onclick="W10.bG()">➤</button></div><div class="br-content" id="brContent"><div class="br-home"><div class="br-logo">🌐</div><h2 style="color:var(--text);margin-bottom:16px;font-weight:300">Microsoft Edge</h2><input class="br-search" id="brSearch" placeholder="Search the web" onkeydown="if(event.key===\'Enter\')W10.bS(this.value)"></div></div></div>';
    case 'editor': return '<div class="text-editor"><div class="ed-toolbar"><button class="ed-btn" onclick="W10.edA(\'new\')">📄</button><button class="ed-btn" onclick="W10.edA(\'save\')">💾</button><button class="ed-btn"><b>B</b></button><button class="ed-btn"><i>I</i></button><button class="ed-btn"><u>U</u></button></div><textarea class="ed-textarea" id="edTextarea" placeholder="Start typing...">'+S.edDoc+'</textarea><div class="ed-status"><span>Line 1, Col 1</span><span>UTF-8</span></div></div>';
    case 'calculator': return '<div class="calculator"><div class="calc-display" id="calcDisp">0</div><div class="calc-buttons"><button class="calc-btn" onclick="W10.cI(\'C\')">C</button><button class="calc-btn" onclick="W10.cI(\'(\')">(</button><button class="calc-btn" onclick="W10.cI(\')\')">)</button><button class="calc-btn op" onclick="W10.cI(\'/\')">÷</button><button class="calc-btn" onclick="W10.cI(\'7\')">7</button><button class="calc-btn" onclick="W10.cI(\'8\')">8</button><button class="calc-btn" onclick="W10.cI(\'9\')">9</button><button class="calc-btn op" onclick="W10.cI(\'*\')">×</button><button class="calc-btn" onclick="W10.cI(\'4\')">4</button><button class="calc-btn" onclick="W10.cI(\'5\')">5</button><button class="calc-btn" onclick="W10.cI(\'6\')">6</button><button class="calc-btn op" onclick="W10.cI(\'-\')">−</button><button class="calc-btn" onclick="W10.cI(\'1\')">1</button><button class="calc-btn" onclick="W10.cI(\'2\')">2</button><button class="calc-btn" onclick="W10.cI(\'3\')">3</button><button class="calc-btn op" onclick="W10.cI(\'+\')">+</button><button class="calc-btn" onclick="W10.cI(\'0\')">0</button><button class="calc-btn" onclick="W10.cI(\'.\')">.</button><button class="calc-btn" onclick="W10.cI(\'Back\')">⌫</button><button class="calc-btn eq" onclick="W10.cI(\'=\')">=</button></div></div>';
    case 'settings': return '<div class="settings"><div class="set-header">Settings</div><div class="set-body"><div class="set-nav"><div class="set-nav-item active" data-sec="pers">🎨 Personalization</div><div class="set-nav-item" data-sec="theme">🌓 Themes</div><div class="set-nav-item" data-sec="apps">📱 Apps</div><div class="set-nav-item" data-sec="about">ℹ️ About</div></div><div class="set-content" id="setContent"></div></div></div>';
    case 'display': return '<div class="settings"><div class="set-header">🖥️ Display Settings</div><div class="set-body"><div class="set-nav"><div class="set-nav-item active" data-sec="display">🖥️ Display</div><div class="set-nav-item" data-sec="brightness">☀️ Brightness</div><div class="set-nav-item" data-sec="night">🌙 Night light</div><div class="set-nav-item" data-sec="scale">🔍 Scale</div></div><div class="set-content" id="setContent"></div></div></div>';
    case 'wifi': return '<div class="settings"><div class="set-header">📶 Network & Internet</div><div class="set-body"><div class="set-nav"><div class="set-nav-item active" data-sec="status">📡 Status</div><div class="set-nav-item" data-sec="wifi">📶 WiFi</div><div class="set-nav-item" data-sec="ethernet">🔌 Ethernet</div><div class="set-nav-item" data-sec="vpn">🔒 VPN</div></div><div class="set-content" id="setContent"></div></div></div>';
    case 'media': return '<div class="media-player"><div class="mp-display" id="mpDisp">🎵</div><div class="mp-controls"><div class="mp-track" id="mpTrack">No track playing</div><div class="mp-progress" id="mpProg"><div class="mp-progress-fill" id="mpFill"></div></div><div class="mp-time"><span id="mpCur">0:00</span><span id="mpTot">3:45</span></div><div class="mp-btns"><button class="mp-btn" onclick="W10.mA(\'prev\')">⏮</button><button class="mp-btn play" id="mpPlay" onclick="W10.mA(\'play\')">▶</button><button class="mp-btn" onclick="W10.mA(\'next\')">⏭</button><button class="mp-btn" onclick="W10.mA(\'stop\')">⏹</button></div><div class="mp-vol"><span>🔊</span><input type="range" min="0" max="100" value="70" id="mpVol"></div></div></div>';
    case 'cmd': return '<div style="background:#0c0c0c;color:#ccc;height:100%;padding:12px;font-family:Consolas,monospace;font-size:13px;overflow-y:auto" id="cmdOut"><div>Microsoft Windows [Version 10.0.19045]</div><div>(c) Windows 10 Simulator v2</div><div style="margin-top:8px">C:\\Users\\Ali&gt; <span style="color:#4cc2ff">Welcome!</span></div><div style="margin-top:4px">C:\\Users\\Ali&gt; <input id="cmdIn" style="background:transparent;border:none;color:#0f0;font-family:Consolas,monospace;font-size:13px;outline:none;width:60%" placeholder="Type a command..." onkeydown="if(event.key===\'Enter\')W10.rC(this.value)"></div></div>';
    case 'taskmgr': return '<div style="height:100%;display:flex;flex-direction:column"><div style="padding:10px;border-bottom:1px solid var(--border);font-size:14px;color:var(--text)">Task Manager</div><div style="flex:1;overflow-y:auto;padding:10px"><table style="width:100%;font-size:12px;color:var(--text);border-collapse:collapse"><tr style="border-bottom:1px solid var(--border)"><th style="text-align:left;padding:4px">Name</th><th>Status</th><th>CPU</th><th>Memory</th></tr><tr><td style="padding:4px">System</td><td>Running</td><td style="text-align:center">2%</td><td style="text-align:center">45 MB</td></tr><tr><td style="padding:4px">File Explorer</td><td>Running</td><td style="text-align:center">0%</td><td style="text-align:center">32 MB</td></tr><tr><td style="padding:4px">Edge</td><td>Running</td><td style="text-align:center">5%</td><td style="text-align:center">128 MB</td></tr><tr><td style="padding:4px">WiFi Service</td><td>Running</td><td style="text-align:center">1%</td><td style="text-align:center">12 MB</td></tr></table></div><div style="padding:8px;border-top:1px solid var(--border);font-size:11px;color:var(--text-secondary)">Processes: 4 | CPU: 8% | Memory: 217 MB</div></div>';
    default: return '<div style="padding:20px;color:var(--text)">App content</div>';
  }
}

// EXPLORER
function fsG(p){var parts=p.replace(/\\/g,'/').split('/').filter(Boolean);var n=S.fs;for(var i=0;i<parts.length;i++){if(!n||!n.c||!n.c[parts[i]])return null;n=n.c[parts[i]];}return n;}
function fsL(p){var n=fsG(p);if(!n||n.t!=='folder')return[];return Object.keys(n.c).map(function(k){return{name:k,type:n.c[k].t,children:n.c[k].c,content:n.c[k].co,ext:n.c[k].e}});}
function renderEx(){
  var ab=$('#exAddr');if(ab)ab.value=S.cp;
  var bk=$('#exBack'),fw=$('#exFwd');if(bk)bk.style.opacity=S.pi>0?'1':'.3';if(fw)fw.style.opacity=S.pi<S.ph.length-1?'1':'.3';
  var sb=$('#exSidebar');if(sb){var dirs=[['Quick access','⭐','C:/Users/Ali'],['Desktop','🖥️','C:/Users/Ali/Desktop'],['Documents','📄','C:/Users/Ali/Documents'],['Downloads','⬇️','C:/Users/Ali/Downloads'],['Music','🎵','C:/Users/Ali/Music'],['Pictures','🖼️','C:/Users/Ali/Pictures'],['Videos','🎬','C:/Users/Ali/Videos'],['This PC','💻','C:'],['C: Drive','💾','C:']];sb.innerHTML=dirs.map(function(d){return'<div class="ex-sb-item'+(S.cp===d[2]?' active':'')+'" data-p="'+d[2]+'"><span>'+d[1]+'</span> '+d[0]+'</div>';}).join('');sb.querySelectorAll('.ex-sb-item').forEach(function(el){el.onclick=function(){eG(el.dataset.p);};});}
  var ct=$('#exContent');if(!ct)return;var items=fsL(S.cp);
  if(!items.length){ct.innerHTML='<div style="padding:30px;text-align:center;color:var(--text-secondary);font-size:12px">This folder is empty.</div>';return;}
  ct.innerHTML=items.map(function(item){var icon=item.type==='folder'?'📁':gfI(item.name);return'<div class="ex-item" data-n="'+item.name+'" data-t="'+item.type+'" data-p="'+S.cp+'/'+item.name+'"><div class="ei">'+icon+'</div><div class="en">'+item.name+'</div></div>';}).join('');
  ct.querySelectorAll('.ex-item').forEach(function(el){el.onclick=function(){ct.querySelectorAll('.ex-item').forEach(function(i){i.classList.remove('selected');});el.classList.add('selected');S.ctx={path:el.dataset.p,name:el.dataset.n,type:el.dataset.t};};el.ondblclick=function(){if(el.dataset.t==='folder')eG(el.dataset.p);else showN('File',el.dataset.n,1500);};});
}
function gfI(n){var e=n.split('.').pop().toLowerCase();var m={txt:'📝',docx:'📘',xlsx:'📊',pdf:'📕',mp3:'🎵',wav:'🎵',png:'🖼️',jpg:'🖼️',jpeg:'🖼️',gif:'🖼️',mp4:'🎬',zip:'📦',exe:'⚙️',js:'📜',html:'🌐',css:'🎨',json:'📋'};return m[e]||'📄';}
function eG(p){var n=fsG(p);if(!n||n.t!=='folder'){showN('Error','Cannot access.',1500);return;}S.cp=p;if(S.pi<S.ph.length-1)S.ph=S.ph.slice(0,S.pi+1);S.ph.push(p);S.pi=S.ph.length-1;renderEx();}
W10.eG=eG;
function eN(dir){if(dir===-1&&S.pi>0){S.pi--;S.cp=S.ph[S.pi];renderEx();}else if(dir===1&&S.pi<S.ph.length-1){S.pi++;S.cp=S.ph[S.pi];renderEx();}else if(dir==='up'){var p=S.cp.split('/');if(p.length>1){p.pop();eG(p.join('/')||'C:');}}}
W10.eN=eN;
function eA(action){var t=S.ctx;if(action==='nf'){var nm=prompt('Folder name:');if(!nm||!nm.trim())return;var n=fsG(S.cp);if(n&&n.t==='folder'){if(n.c[nm.trim()])showN('Error','Already exists.',1500);else{n.c[nm.trim()]={t:'folder',c:{}};renderEx();showN('Created',nm.trim());}}}else if(action==='nfl'){var nm2=prompt('File name:');if(!nm2||!nm2.trim())return;var n2=fsG(S.cp);if(n2&&n2.t==='folder'){n2.c[nm2.trim()]={t:'file',co:'',e:nm2.split('.').pop().toLowerCase()};renderEx();showN('Created',nm2.trim());}}else if(action==='rn'){if(!t){showN('Select an item first.','',1500);return;}var nn=prompt('Rename to:',t.name);if(!nn||!nn.trim()||nn.trim()===t.name)return;var pp=t.path.substring(0,t.path.lastIndexOf('/'));var pn=fsG(pp||'C:');if(pn&&pn.c&&pn.c[t.name]){pn.c[nn.trim()]=pn.c[t.name];delete pn.c[t.name];S.cp=pp||'C:';renderEx();showN('Renamed',nn.trim());}}else if(action==='dl'){if(!t){showN('Select an item first.','',1500);return;}if(!confirm('Delete "'+t.name+'"?'))return;var pp2=t.path.substring(0,t.path.lastIndexOf('/'));var pn2=fsG(pp2||'C:');if(pn2&&pn2.c&&pn2.c[t.name]){delete pn2.c[t.name];S.ctx=null;renderEx();showN('Deleted',t.name);}}}
W10.eA=eA;


// BROWSER — Real Search
function bS(q){if(!q.trim())return;var query=q.trim();S.bTabs[S.bAct].title=query;S.bTabs[S.bAct].url=query;var ct=document.querySelector('#brContent');if(ct)ct.innerHTML='<iframe src="https://www.google.com/search?igu=1&q='+encodeURIComponent(query)+'" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation" style="width:100%;height:100%;border:none"></iframe>';var ub=document.querySelector('#brUrl');if(ub)ub.value='google.com/search?q='+encodeURIComponent(query);}
W10.bS=bS;


W10.bG=bG;
function bN(a){showN('Browser',a+' navigation',1000);}
W10.bN=bN;
function bR(){var tabs=$('#brTabs');if(!tabs)return;tabs.innerHTML=S.bTabs.map(function(t,i){return'<div class="br-tab'+(i===S.bAct?' active':'')+'" data-idx="'+i+'"><span>🌐</span>'+(t.title||'New Tab')+(S.bTabs.length>1?'<button class="tc" data-idx="'+i+'">✕</button>':'')+'</div>';}).join('')+'<button class="br-tab" id="brNewTab" style="padding:5px 12px">+</button>';tabs.querySelectorAll('.br-tab[data-idx]').forEach(function(tab){tab.onclick=function(e){if(e.target.classList.contains('tc')){var idx=parseInt(e.target.dataset.idx);if(S.bTabs.length>1){S.bTabs.splice(idx,1);if(S.bAct>=S.bTabs.length)S.bAct=S.bTabs.length-1;bR();}return;}S.bAct=parseInt(tab.dataset.idx);bR();var uB=$('#brUrl');if(uB)uB.value=S.bTabs[S.bAct]?S.bTabs[S.bAct].url||'':'';};});var nt=$('#brNewTab');if(nt)nt.onclick=function(){S.bTabs.push({title:'New Tab',url:'',content:''});S.bAct=S.bTabs.length-1;bR();var ct=$('#brContent');if(ct)ct.innerHTML='<div class="br-home"><div class="br-logo">🌐</div><h2 style="color:var(--text);margin-bottom:16px;font-weight:300">Microsoft Edge</h2><input class="br-search" id="brSearch" placeholder="Search the web" onkeydown="if(event.key===\'Enter\')W10.bS(this.value)"></div>';};var uB=$('#brUrl');if(uB)uB.value=S.bTabs[S.bAct]?S.bTabs[S.bAct].url||'':'';}

// EDITOR
W10.edA=function(a){if(a==='new'){if(S.edDoc&&!confirm('Discard changes?'))return;S.edDoc='';var t=$('#edTextarea');if(t)t.value='';}else if(a==='save'){var t2=$('#edTextarea');S.edDoc=t2?t2.value:'';showN('Saved!','Document saved.',2000);}};
document.addEventListener('input',function(e){if(e.target.id==='edTextarea')S.edDoc=e.target.value;});

// CALCULATOR
W10.cI=function(key){var d=$('#calcDisp');if(!d)return;if(key==='C'){S.cs={d:'0',f:null,o:null,w:false};d.textContent='0';}else if(key==='Back'){S.cs.d=S.cs.d.length>1?S.cs.d.slice(0,-1):'0';d.textContent=S.cs.d;}else if(key==='='){try{var ex=S.cs.d.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');var r=Function('"use strict";return ('+ex+')')();S.cs.d=parseFloat(r.toFixed(10)).toString();d.textContent=S.cs.d;}catch(e){d.textContent='Error';S.cs.d='0';}}else{var oM={'×':'*','÷':'/','−':'-'};var dk=oM[key]||key;if(S.cs.d==='0'&&key!=='.')S.cs.d=dk;else S.cs.d+=dk;d.textContent=S.cs.d.replace(/\*/g,'×').replace(/\//g,'÷').replace(/-/g,'−');}};

// SETTINGS
function renderSet(){var nav=document.querySelector('.set-nav');var ct=$('#setContent');if(!nav||!ct)return;var as=(nav.querySelector('.set-nav-item.active')||{}).dataset.sec||'pers';nav.querySelectorAll('.set-nav-item').forEach(function(item){item.onclick=function(){nav.querySelectorAll('.set-nav-item').forEach(function(i){i.classList.remove('active');});item.classList.add('active');renderSetS(item.dataset.sec);};});renderSetS(as);}
function renderSetS(sec){var ct=$('#setContent');if(!ct)return;if(sec==='pers')ct.innerHTML='<div class="set-section"><h3>Background</h3><div class="wp-grid">'+Object.entries(S.wps).map(function(kv){var k=kv[0];return'<div class="wp-item'+(S.wallpaper===k?' selected':'')+'" style="background:'+S.wps[k]+'" data-wp="'+k+'" onclick="W10.sW(\''+k+'\')"></div>';}).join('')+'</div></div><div class="set-section"><h3>Colors</h3><p style="font-size:12px;color:var(--text-secondary)">Accent: Blue</p></div>';else if(sec==='theme')ct.innerHTML='<div class="set-section"><h3>Choose mode</h3><div class="theme-toggle"><div class="theme-opt'+(S.theme==='light'?' selected':'')+'" onclick="W10.sT(\'light\')">☀️ Light</div><div class="theme-opt'+(S.theme==='dark'?' selected':'')+'" onclick="W10.sT(\'dark\')">🌙 Dark</div></div></div>';else if(sec==='apps')ct.innerHTML='<div class="set-section"><h3>Installed Apps</h3>'+SAPPS.map(function(a){return'<p style="font-size:12px;padding:6px 0;color:var(--text)">'+a.i+' '+a.n+'</p>';}).join('')+'</div>';else if(sec==='about')ct.innerHTML='<div class="set-section"><h3>Windows 10 Simulator v2</h3><p style="font-size:12px;color:var(--text-secondary)">Version 10.0.19045</p><p style="font-size:12px;color:var(--text-secondary);margin-top:8px">WiFi · Display · Real Browser<br>HTML, CSS & JS</p></div>';}
W10.sW=function(k){S.wallpaper=k;$('#desktop').style.background=S.wps[k];showN('Wallpaper',k,1500);$$('.wp-item').forEach(function(e){e.classList.toggle('selected',e.dataset.wp===k);});};
W10.sT=function(t){S.theme=t;document.body.classList.toggle('dark',t==='dark');showN('Theme',t,1500);$$('.theme-opt').forEach(function(e){e.classList.toggle('selected',(e.textContent.indexOf('Light')>=0&&t==='light')||(e.textContent.indexOf('Dark')>=0&&t==='dark'));});};

// DISPLAY SETTINGS
function renderDisplaySettings(){var nav=document.querySelector('.set-nav');var ct=$('#setContent');if(!nav||!ct)return;var as=(nav.querySelector('.set-nav-item.active')||{}).dataset.sec||'display';nav.querySelectorAll('.set-nav-item').forEach(function(item){item.onclick=function(){nav.querySelectorAll('.set-nav-item').forEach(function(i){i.classList.remove('active');});item.classList.add('active');renderDisplaySection(item.dataset.sec);};});renderDisplaySection(as);}
function renderDisplaySection(sec){var ct=$('#setContent');if(!ct)return;
  if(sec==='display')ct.innerHTML='<div class="set-section"><h3>🖥️ Monitor Info</h3><div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;padding:20px;color:#fff;display:flex;align-items:center;gap:16px"><div style="font-size:48px">🖥️</div><div><div style="font-size:18px;font-weight:600">Generic PnP Monitor</div><div style="font-size:13px;opacity:.8">NVIDIA GeForce RTX 3060</div><div style="font-size:12px;opacity:.6">GPU 0 — Driver 551.86 — 12 GB GDDR6</div></div></div></div><div class="set-section"><h3>Resolution</h3><div style="display:flex;gap:6px;flex-wrap:wrap">'+['800×600','1024×768','1280×720','1366×768','1600×900','1920×1080','2560×1440'].map(function(r){return'<button style="padding:8px 16px;border:2px solid '+(S.resolution===r?'var(--accent)':'var(--border)')+';border-radius:6px;background:'+(S.resolution===r?'var(--accent-light)':'transparent')+';color:var(--text);cursor:pointer;font-family:var(--font);font-size:12px" onclick="W10.setRes(\''+r+'\')">'+r+'</button>';}).join('')+'</div></div><div class="set-section"><h3>Graphics Card</h3><div style="border:1px solid var(--border);border-radius:8px;padding:14px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:12px;color:var(--text)">NVIDIA GeForce RTX 3060</span><span style="font-size:11px;color:var(--accent)">Active</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:12px;color:var(--text-secondary)">Driver</span><span style="font-size:12px;color:var(--text)">551.86</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:12px;color:var(--text-secondary)">VRAM</span><span style="font-size:12px;color:var(--text)">12 GB GDDR6</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:12px;color:var(--text-secondary)">GPU Temp</span><span style="font-size:12px;color:#4caf50">42°C</span></div></div></div>';
  else if(sec==='brightness')ct.innerHTML='<div class="set-section"><h3>☀️ Screen Brightness</h3><div style="display:flex;align-items:center;gap:12px"><span style="font-size:20px">🌑</span><input type="range" min="0" max="100" value="'+S.brightness+'" style="flex:1;accent-color:var(--accent)" oninput="W10.setBrightness(this.value);this.nextElementSibling.textContent=this.value+\'%\'"><span style="font-size:14px;color:var(--text)">'+S.brightness+'%</span></div></div>';
  else if(sec==='night')ct.innerHTML='<div class="set-section"><h3>🌙 Night Light</h3><p style="font-size:12px;color:var(--text-secondary);margin-bottom:12px">Reduces blue light.</p><label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--text)"><input type="checkbox" '+(S.nightLight?'checked':'')+' style="accent-color:var(--accent)" onchange="W10.tgToggle(\'nightlight\')"> Turn on now</label></div>';
  else if(sec==='scale')ct.innerHTML='<div class="set-section"><h3>🔍 Scale & Layout</h3><div style="display:flex;gap:6px;flex-wrap:wrap">'+['100%','125%','150%','175%','200%','250%'].map(function(s){return'<button style="padding:10px 18px;border:2px solid '+(S.scale===s?'var(--accent)':'var(--border)')+';border-radius:6px;background:'+(S.scale===s?'var(--accent-light)':'transparent')+';color:var(--text);cursor:pointer;font-size:13px" onclick="W10.setScale(\''+s+'\')">'+s+'</button>';}).join('')+'</div></div>';
}
W10.setRes=function(r){S.resolution=r;showN('Resolution',r,2000);};
W10.setScale=function(s){S.scale=s;showN('Scale',s,1500);};

// WIFI SETTINGS
function renderWifiSettings(){var nav=document.querySelector('.set-nav');var ct=$('#setContent');if(!nav||!ct)return;var as=(nav.querySelector('.set-nav-item.active')||{}).dataset.sec||'status';nav.querySelectorAll('.set-nav-item').forEach(function(item){item.onclick=function(){nav.querySelectorAll('.set-nav-item').forEach(function(i){i.classList.remove('active');});item.classList.add('active');renderWifiSection(item.dataset.sec);};});renderWifiSection(as);}
function renderWifiSection(sec){var ct=$('#setContent');if(!ct)return;
  if(sec==='status')ct.innerHTML='<div class="set-section"><h3>📶 Network Status</h3><div style="background:linear-gradient(135deg,#1b5e20,#2e7d32);border-radius:12px;padding:20px;color:#fff"><div style="font-size:36px;margin-bottom:8px">📶</div><div style="font-size:18px;font-weight:600">'+(S.wifiConnected||'Not connected')+'</div><div style="font-size:13px;opacity:.8">'+(S.wifiConnected?'Connected, secured — Signal: '+Array(S.wifiSignal+1).join('▮'):'WiFi is disabled')+'</div></div></div><div class="set-section"><h3>Properties</h3><div style="border:1px solid var(--border);border-radius:8px;padding:14px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12px;color:var(--text-secondary)">SSID</span><span style="font-size:12px;color:var(--text)">'+(S.wifiConnected||'N/A')+'</span></div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12px;color:var(--text-secondary)">Protocol</span><span style="font-size:12px;color:var(--text)">WiFi 6 (802.11ax)</span></div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12px;color:var(--text-secondary)">Security</span><span style="font-size:12px;color:var(--text)">WPA3-Personal</span></div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12px;color:var(--text-secondary)">IP Address</span><span style="font-size:12px;color:var(--text)">192.168.1.42</span></div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12px;color:var(--text-secondary)">Adapter</span><span style="font-size:12px;color:var(--text)">Intel Wi-Fi 6E AX211</span></div><div style="display:flex;justify-content:space-between"><span style="font-size:12px;color:var(--text-secondary)">Link Speed</span><span style="font-size:12px;color:var(--text)">866 / 866 Mbps</span></div></div></div>';
  else if(sec==='wifi')ct.innerHTML='<div class="set-section"><div style="display:flex;align-items:center;justify-content:space-between"><h3>📶 WiFi</h3><label style="display:flex;align-items:center;gap:6px;cursor:pointer"><span style="font-size:11px;color:var(--text-secondary)">'+(S.wifiEnabled?'On':'Off')+'</span><input type="checkbox" '+(S.wifiEnabled?'checked':'')+' style="accent-color:var(--accent)" onchange="S.wifiEnabled=this.checked;updateTrayIcons();renderWifiSection(\'wifi\')"></label></div></div><div class="set-section"><h3>Available Networks</h3><div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">'+S.wifiNetworks.map(function(n,i){return'<div style="padding:12px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);cursor:pointer;'+(n.connected?'background:var(--accent-light)':'')+'" onclick="W10.connectWifi('+i+')"><span style="font-size:16px">'+Array(n.signal+1).join('▮')+Array(4-n.signal+1).join('▯')+'</span><span style="flex:1;font-size:12px;color:var(--text)">'+n.name+'</span><span style="font-size:11px">'+(n.secured?'🔒':'🔓')+'</span><span style="font-size:11px;color:var(--accent)">'+(n.connected?'Connected':'')+'</span></div>';}).join('')+'</div></div>';
  else if(sec==='ethernet')ct.innerHTML='<div class="set-section"><h3>🔌 Ethernet</h3><div style="background:var(--surface-hover);border-radius:8px;padding:14px;text-align:center"><div style="font-size:40px;margin-bottom:8px">🔌</div><div style="font-size:14px;color:var(--text)">Not connected</div><div style="font-size:12px;color:var(--text-secondary)">Plug in an Ethernet cable</div></div></div>';
  else if(sec==='vpn')ct.innerHTML='<div class="set-section"><h3>🔒 VPN</h3><button style="padding:10px 20px;border:2px solid var(--accent);border-radius:6px;background:var(--accent);color:#fff;font-size:13px;cursor:pointer;font-family:var(--font)" onclick="showN(\'VPN\',\'No VPN profiles configured\',2000)">+ Add a VPN connection</button></div>';
}

// MEDIA PLAYER
function initMedia(){var ts=['Dream Wave','Midnight Drive','Neon Lights'];var te=$('#mpTrack');if(te)te.textContent=ts[Math.floor(Math.random()*ts.length)]+' - synthwave';}
W10.mA=function(a){var pb=$('#mpPlay'),pf=$('#mpFill'),pc=$('#mpCur'),pd=$('#mpDisp');
  if(a==='play'){if(!S.mp){S.mp=true;S.mpr=S.mpr||0;if(pb)pb.textContent='⏸';if(pd)pd.textContent='🎶';S.mt=setInterval(function(){S.mpr+=0.5;if(S.mpr>=100)S.mpr=0;if(pf)pf.style.width=S.mpr+'%';var s=Math.floor(S.mpr*2.25),m=Math.floor(s/60),sec=s%60;if(pc)pc.textContent=m+':'+String(sec).padStart(2,'0');},1000);}else{S.mp=false;if(pb)pb.textContent='▶';if(pd)pd.textContent='⏸️';if(S.mt){clearInterval(S.mt);S.mt=null;}}}
  else if(a==='stop'){S.mp=false;S.mpr=0;if(pb)pb.textContent='▶';if(pf)pf.style.width='0%';if(pc)pc.textContent='0:00';if(pd)pd.textContent='⏹️';if(S.mt){clearInterval(S.mt);S.mt=null;}}
  else if(a==='prev'||a==='next'){S.mpr=0;if(pf)pf.style.width='0%';var ts=['Dream Wave','Midnight Drive','Neon Lights','Summer Vibes','Chill Beats'];var te=$('#mpTrack');if(te)te.textContent=ts[Math.floor(Math.random()*ts.length)]+' - '+(a==='prev'?'Previous':'Next');}
};

// CMD
W10.rC=function(cmd){var inp=$('#cmdIn'),out=$('#cmdOut');if(!out)return;var t=cmd.trim().toLowerCase();
  var res={help:'Commands: help, dir, cls, echo, date, time, ver, whoami, ping, ipconfig',dir:' Directory of C:\\Users\\Ali\n\n07/14/2026  12:00 PM    <DIR>          .\n07/14/2026  12:00 PM    <DIR>          ..\n07/14/2026  12:00 PM    <DIR>          Desktop\n07/14/2026  12:00 PM    <DIR>          Documents\n07/14/2026  12:00 PM    <DIR>          Downloads',cls:'',ver:'Microsoft Windows [Version 10.0.19045]',whoami:'ali',date:new Date().toDateString(),time:new Date().toTimeString().split(' ')[0],ipconfig:'Ethernet adapter:\n   IPv4: 192.168.1.42\n   Subnet: 255.255.255.0\n   Gateway: 192.168.1.1\nWiFi adapter:\n   SSID: '+(S.wifiConnected||'Disconnected')+'\n   IPv4: 192.168.1.42\n   Signal: '+S.wifiSignal+'/4'};
  if(t==='cls'){out.innerHTML='<div style="color:#ccc">C:\\Users\\Ali&gt; <input id="cmdIn" style="background:transparent;border:none;color:#0f0;font-family:Consolas,monospace;font-size:13px;outline:none;width:60%" placeholder="Type a command..." onkeydown="if(event.key===\'Enter\')W10.rC(this.value)"></div>';return;}
  if(t.startsWith('echo '))aCO(out,t.slice(5),cmd);else if(t.startsWith('ping '))aCO(out,'Pinging '+cmd.slice(5)+' with 32 bytes of data:\nReply from 127.0.0.1: bytes=32 time<1ms TTL=128\nReply from 127.0.0.1: bytes=32 time<1ms TTL=128\n\nPing statistics: Sent=2,Received=2,Lost=0 (0% loss)',cmd);else{var r=res[t]||"'"+t+"' is not recognized.";aCO(out,r,cmd);}
  if(inp)inp.value='';
};
function aCO(out,text,cmd){var ei=out.querySelector('#cmdIn');if(ei){var p=ei.parentElement;ei.remove();p.textContent='C:\\Users\\Ali> '+cmd;p.style.color='#fff';p.style.marginTop='4px';}var rd=document.createElement('div');rd.style.cssText='color:#ccc;white-space:pre-wrap;margin:2px 0';rd.textContent=text;out.appendChild(rd);var np=document.createElement('div');np.style.marginTop='4px';np.innerHTML='C:\\Users\\Ali&gt; <input id="cmdIn" style="background:transparent;border:none;color:#0f0;font-family:Consolas,monospace;font-size:13px;outline:none;width:60%" placeholder="Type a command..." onkeydown="if(event.key===\'Enter\')W10.rC(this.value)">';out.appendChild(np);var ni=np.querySelector('#cmdIn');if(ni)ni.focus();out.scrollTop=out.scrollHeight;}

// CONTEXT MENU
!function(){var m=document.createElement('div');m.className='ctx-menu';m.id='ctxMenu';m.innerHTML='<div class="ctx-item" data-a="ref">🔄 Refresh</div><div class="ctx-sep"></div><div class="ctx-item" data-a="new">📄 New</div><div class="ctx-item" data-a="disp">🖥️ Display settings</div><div class="ctx-item" data-a="net">📶 Network settings</div><div class="ctx-sep"></div><div class="ctx-item" data-a="ex">📁 Open File Explorer</div><div class="ctx-item" data-a="cmd">⬛ Open Command Prompt</div>';document.body.appendChild(m);m.querySelectorAll('.ctx-item').forEach(function(it){it.onclick=function(){var a=it.dataset.a;if(a==='ref')showN('Refreshed','',1000);else if(a==='disp')openApp('display');else if(a==='net')openApp('wifi');else if(a==='ex')openApp('explorer');else if(a==='cmd')openApp('cmd');else if(a==='new')showN('New','Create file/folder.',1500);m.classList.remove('show');};});}();

$('#desktop').oncontextmenu=function(e){if(e.target.closest('.window-container'))return;e.preventDefault();var m=$('#ctxMenu');if(m){m.style.left=e.clientX+'px';m.style.top=e.clientY+'px';m.classList.add('show');}};
document.addEventListener('click',function(e){
  if(!e.target.closest('.ctx-menu')){var m=$('#ctxMenu');if(m)m.classList.remove('show');}
  if(!e.target.closest('#startMenu')&&!e.target.closest('#startBtn')&&!e.target.closest('#startPowerBtn')&&S.startOpen)toggleStart(false);
  if(!e.target.closest('#powerMenu')&&!e.target.closest('#startPowerBtn')&&S.powerOpen)togglePower();
  if(!e.target.closest('#actionCenter')&&!e.target.closest('#trayClock')&&S.actionOpen)toggleActionCenter();
  if(!e.target.closest('#wifiPanel')&&!e.target.closest('.tray-icon')){var wp=$('#wifiPanel');if(wp)wp.style.display='none';}
});

initLogin();
})();
