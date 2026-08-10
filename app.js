const BUILD="7";
/* ADPA Governance Portal — structure mirrors the measured Figma nodes. */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const I=(n,f)=>`<i class="ph${f?'-fill':''} ph-${n}"></i>`;
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const aed=n=>'AED '+n.toLocaleString('en-US');
const pc=v=>v>0?'up':v<0?'down':'flat';
const pt=v=>(v>0?'+':'')+v.toFixed(1)+'%';
const nm=v=>`<span class="num-${pc(v)} tnum">${pt(v)}</span>`;
const sb=s=>`<span class="badge badge-${s}">${s[0].toUpperCase()+s.slice(1)}</span>`;

const NAV=[{id:'home',l:'Home',i:'house'},{id:'c1',l:'Dashboards',i:'chart-line'},
{id:'queue',l:'Recommendations',i:'list-checks'},{id:'rules',l:'Rules',i:'sliders-horizontal',d:1},
{id:'reports',l:'Reports',i:'file-text',d:1},{id:'admin',l:'Admin',i:'user-gear',d:1}];
const TABS=[['c1','Pricing performance'],['c2','Competitor intelligence'],['c3','Forecast accuracy'],
['c4','Revenue impact'],['c5','Customer behaviour']];
const CYCLE=[['Wed','05','past'],['Thu','06','today'],['Fri','07',''],['Sat','08',''],['Sun','09',''],
['Mon','10',''],['Tue','11','']];
const ALERTS=[['critical','warning-octagon','Stale data from CSS source > 6h','35 minutes ago'],
['warning','warning','Competitor cut price by 12%','1 h 12 minutes ago'],
['warning','warning','Competitor cut price by 12%','1 h 12 minutes ago'],
['success','check-circle','Batch cycle completed successfully','2 h 5 minutes ago']];
const QUEUE=[
['iPhone 15 Pro 256GB','↓ Competitor A −4%',3899,3749,-3.8,'Competitor price lower','flagged'],
['Samsung Galaxy S24','',3299,3299,0.0,'Demand stable','pending'],
['AirPods Pro 2','Promotional clearance',999,929,-7.0,'Competitor promotion','pending'],
['Xiaomi 14 128GB','',1799,1699,-5.6,'High stock on hand','pending'],
['Galaxy Watch 6','',1099,1149,4.5,'Low stock, rising demand','pending'],
['iPad Air 11 256GB','↓ Competitor B −6%',2599,2399,-7.7,'Seasonal dip + competitor','flagged']];
const COMBO=[['W1',80,20,410],['W2',84,18,421],['W3',90,15,426],['W4',95,12,438],
['W5',101,10,452],['W6',108,8,462],['W7',112,7,471],['W8',118,6,495]];
const COMP=[['Smartphones',3750,3600,3650],['Accessories',450,460,430],
['Wearables',1100,1140,1160],['Tablets',2400,2240,2290]];
const FACT=[['Competitor position',-46],['Stock on hand',-28],['Demand / seasonality',16],['Margin constraint',-10]];
const HIST=[['Jul 29, 2026','Aligned with competitor position','approved',1],
['Jul 22, 2026','Margin protection guardrail','approved',0],
['Jul 15, 2026','Manually overridden — below target','rejected',1],
['Jul 08, 2026','Price floor constraint applied','approved',0],
['Jul 01, 2026','Competitor price spike detected','approved',1]];
const SESS=[['LLM / RAG analyst','Today','Deviation from recommendation this week',1],
['Compare revenue by category','Aug 03','Last month comparison across Electronics and Home',0],
['Overrides by SKU','Aug 01','Which SKUs are overridden most often?',0],
['Forecast accuracy Q3','Jul 28','Chart forecast accuracy for the quarter',0],
['Competitor price cuts','Jul 24','Competitor B price cut impact on iPad Air 11',0],
['Seasonal demand dip','Jul 18','Seasonal demand dip and recommendation delta',0]];


/* ---------- Decision history: full audit log ---------- */
const LOG=[
['Aug 06, 2026','09:12','iPhone 15 Pro 256GB','AED 3,899','AED 3,749','Aligned with competitor position','Aisha K.','approved',1],
['Aug 06, 2026','09:08','AirPods Pro 2','AED 999','AED 929','Promotional clearance','Aisha K.','approved',0],
['Aug 05, 2026','17:41','iPad Air 11 256GB','AED 2,599','AED 2,399','Below margin floor','Aisha K.','rejected',1],
['Aug 05, 2026','16:20','Galaxy Watch 6','AED 1,099','AED 1,149','Low stock, rising demand','Omar H.','approved',0],
['Aug 05, 2026','14:03','Xiaomi 14 128GB','AED 1,799','AED 1,749','Manual override — kept above floor','Omar H.','overridden',1],
['Aug 04, 2026','11:55','Samsung Galaxy S24','AED 3,299','AED 3,299','Demand stable, no change','System','approved',0],
['Aug 04, 2026','10:31','MacBook Air M3','AED 4,799','AED 4,599','Competitor price cut 5%','Aisha K.','approved',1],
['Aug 03, 2026','18:12','Pixel 8 Pro','AED 2,899','AED 2,999','Stock shortage guardrail','System','rejected',0]];

/* ---------- Notifications drawer ---------- */
const NOTIF=[
['Today',[
 ['critical','warning-octagon','Stale data from CSS source > 6h','Competitor feed has not refreshed since 03:10. Recommendations may be based on old prices.','35 minutes ago',1],
 ['warning','warning','Competitor cut price by 12% — Smartphones','Competitor A dropped iPhone 15 Pro by 12%. 14 SKUs affected.','1 h 12 minutes ago',1],
 ['success','check-circle','Batch cycle completed successfully','128 recommendations generated for cycle Aug 05–11.','2 h 5 minutes ago',0]]],
['Yesterday',[
 ['info','info','Update ready','Pricing engine v2.4 is available with improved elasticity modelling.','1 day ago',0],
 ['warning','warning','Licensed feed is 5 h stale','Source freshness dropped below the 4 h threshold.','1 day ago',0]]],
['Earlier',[
 ['success','check-circle','Guardrails updated','Margin floor raised to 18% for Accessories.','Aug 03',0],
 ['info','info','New reason code added','“Seasonal clearance” is now available in the decision panel.','Aug 01',0]]]];

/* ---------- charts ---------- */
function spark(dir){
  const u=[14,17,15,20,18,23,21,26,24,29,27,33],d=[30,26,28,23,25,20,22,17,19,15,17,12];
  const v=dir==='down'?d:u,c=dir==='down'?'var(--bad)':'var(--ok40)';
  const w=220,h=40,mn=Math.min(...v),mx=Math.max(...v),sp=mx-mn||1;
  const p=v.map((x,i)=>[i*(w/(v.length-1)),h-((x-mn)/sp)*(h-8)-4]);
  const dd=p.map((q,i)=>`${i?'L':'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
<path d="${dd} L ${w} ${h} L 0 ${h} Z" fill="${c}" class="spark-area"/>
<path d="${dd}" class="spark-line" stroke="${c}"/></svg>`;
}
function lineC({series,labels,fmt=v=>v,h=150}){
  const w=960,pl=40,pr=8,pt_=6,pb=4,iW=w-pl-pr,iH=h-pt_-pb;
  const all=series.flatMap(s=>s.d),mn=Math.min(...all),mx=Math.max(...all);
  const lo=mn-(mx-mn)*.15,hi=mx+(mx-mn)*.15;
  const X=i=>pl+(i/(labels.length-1))*iW,Y=v=>pt_+iH-((v-lo)/(hi-lo))*iH;
  let g='';
  for(let i=0;i<=3;i++){const val=lo+(hi-lo)*(i/3),y=Y(val);
    g+=`<line class="grid-line" x1="${pl}" x2="${pl+iW}" y1="${y}" y2="${y}"/>
<text class="axis-text" x="${pl-6}" y="${y+3}" text-anchor="end">${fmt(val)}</text>`;}
  labels.forEach((l,i)=>{g+=`<line class="grid-line" x1="${X(i)}" x2="${X(i)}" y1="${pt_}" y2="${pt_+iH}" opacity=".5"/>`;});
  let p='';
  series.forEach((s,si)=>{
    const dd=s.d.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
    if(s.area)p+=`<path d="${dd} L ${X(s.d.length-1)} ${pt_+iH} L ${pl} ${pt_+iH} Z" fill="${s.c}" class="series-area" data-s="${si}"/>`;
    p+=`<path d="${dd}" class="series-line" stroke="${s.c}" style="--len:${Math.round(iW*1.4)};animation-delay:${si*120}ms" data-s="${si}"/>`;
    s.d.forEach((v,i)=>{p+=`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" fill="#fff" stroke="${s.c}" stroke-width="2" class="series-dot" data-s="${si}" style="animation-delay:${600+si*120+i*45}ms"><title>${s.n}: ${fmt(v)}</title></circle>`;});
  });
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img">${g}${p}</svg>`;
}
function comboC(){
  const w=960,h=224,pl=40,pr=40,pt_=6,pb=18,iW=w-pl-pr,iH=h-pt_-pb;
  const maxD=140,mnR=410,mxR=500,slot=iW/COMBO.length,bw=slot*.42;
  const yD=v=>pt_+iH-(v/maxD)*iH,yR=v=>pt_+iH-((v-mnR)/(mxR-mnR))*iH;
  let g='';
  for(let v=0;v<=maxD;v+=20){const y=yD(v);
    g+=`<line class="grid-line" x1="${pl}" x2="${pl+iW}" y1="${y}" y2="${y}"/>
<text class="axis-text" x="${pl-6}" y="${y+3}" text-anchor="end">${v}</text>
<text class="axis-text" x="${pl+iW+6}" y="${y+3}">${Math.round(mnR+(v/maxD)*(mxR-mnR))}</text>`;}
  let b='';
  COMBO.forEach(([lab,a,r],i)=>{const cx=pl+slot*i+slot/2;
    b+=`<rect class="bar" x="${cx-bw/2}" y="${yD(a)}" width="${bw}" height="${(a/maxD)*iH}" fill="url(#gApp)" data-s="0" style="animation-delay:${i*55}ms"><title>${lab} · Approved ${a}</title></rect>
<rect class="bar" x="${cx-bw/2}" y="${yD(a+r)}" width="${bw}" height="${(r/maxD)*iH}" fill="var(--dv-rej)" data-s="1" style="animation-delay:${i*55+40}ms"><title>${lab} · Rejected ${r}</title></rect>
<text class="cat-label" x="${cx}" y="${h-4}" text-anchor="middle">${lab}</text>`;});
  const p=COMBO.map(([,,,rv],i)=>[pl+slot*i+slot/2,yR(rv)]);
  const ln=p.map((q,i)=>`${i?'L':'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  const dots=p.map((q,i)=>`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.5" fill="#fff" stroke="var(--dv-rev-line)" stroke-width="2.5" class="series-dot" data-s="2" style="animation-delay:${900+i*50}ms"><title>${COMBO[i][0]} · AED ${COMBO[i][3]}K</title></circle>`).join('');
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img"><defs><linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--dv-app)" stop-opacity="1"/><stop offset=".85" stop-color="var(--dv-app)" stop-opacity="0"/></linearGradient></defs>${g}${b}
<path d="${ln}" class="series-line" stroke="var(--dv-rev-line)" style="--len:1200;animation-delay:420ms" data-s="2"/>${dots}
<text class="axis-title" x="10" y="${pt_+iH/2}" transform="rotate(-90 10 ${pt_+iH/2})" text-anchor="middle">Decisions</text>
<text class="axis-title" x="${w-6}" y="${pt_+iH/2}" transform="rotate(90 ${w-6} ${pt_+iH/2})" text-anchor="middle">AED K</text></svg>`;
}
function groupC(){
  const w=960,h=200,pl=56,pr=8,pt_=6,pb=18,iW=w-pl-pr,iH=h-pt_-pb,mx=3000;
  const grp=iW/COMP.length,bw=grp*.16,gap=bw*.18;
  const Y=v=>pt_+iH-(Math.min(v,mx)/mx)*iH;
  let g='';
  for(let v=0;v<=mx;v+=500){g+=`<line class="grid-line" x1="${pl}" x2="${pl+iW}" y1="${Y(v)}" y2="${Y(v)}"/>
<text class="axis-text" x="${pl-6}" y="${Y(v)+3}" text-anchor="end">AED ${v}</text>`;}
  let b='';
  const cols=[['#950124','e&'],['#EA6C29','Competitor A'],['#0D9488','Competitor B']];
  COMP.forEach(([cat,e,a,bb],i)=>{
    const st=pl+grp*i+(grp-(bw*3+gap*2))/2;
    [e,a,bb].forEach((v,j)=>{b+=`<rect class="bar" x="${st+j*(bw+gap)}" y="${Y(v)}" width="${bw}" height="${(Math.min(v,mx)/mx)*iH}" fill="url(#gG${j})" data-s="${j}" style="animation-delay:${i*70+j*35}ms"><title>${cat} · ${cols[j][1]} ${aed(v)}</title></rect>`;});
    b+=`<text class="cat-label" x="${pl+grp*i+grp/2}" y="${h-4}" text-anchor="middle">${cat}</text>`;});
  const defs=cols.map((c,j)=>`<linearGradient id="gG${j}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}" stop-opacity="1"/><stop offset="1" stop-color="${c[0]}" stop-opacity=".10"/></linearGradient>`).join('');
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img"><defs>${defs}</defs>${g}${b}</svg>`;
}
function barsC(items){
  const w=960,h=170,pl=36,pr=8,pt_=22,pb=18,iW=w-pl-pr,iH=h-pt_-pb;
  const mx=Math.max(...items.map(i=>i[1]))*1.15,slot=iW/items.length,bw=slot*.4;
  const Y=v=>pt_+iH-(v/mx)*iH;
  let g='';for(let i=0;i<=3;i++){const y=pt_+iH-(i/3)*iH;g+=`<line class="grid-line" x1="${pl}" x2="${pl+iW}" y1="${y}" y2="${y}"/>`;}
  let b='';
  items.forEach(([lab,v,disp,c],i)=>{const cx=pl+slot*i+slot/2;
    b+=`<rect class="bar" x="${cx-bw/2}" y="${Y(v)}" width="${bw}" height="${(v/mx)*iH}" fill="url(#gS${i})" style="animation-delay:${i*70}ms"><title>${lab}: ${disp}</title></rect>
<text class="axis-text" x="${cx}" y="${Y(v)-8}" text-anchor="middle">${disp}</text>
<text class="cat-label" x="${cx}" y="${h-4}" text-anchor="middle">${lab}</text>`;});
  const defs=items.map((it,i)=>`<linearGradient id="gS${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${it[3]}" stop-opacity="1"/><stop offset="1" stop-color="${it[3]}" stop-opacity=".10"/></linearGradient>`).join('');
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img"><defs>${defs}</defs>${g}${b}</svg>`;
}
function gaugeC(val,fl,ce){
  const w=320,h=172,cx=160,cy=148,rO=116,rI=84,t=Math.max(0,Math.min(1,(val-fl)/(ce-fl)));
  const arc=(f,to,c)=>{const a0=Math.PI+Math.PI*f,a1=Math.PI+Math.PI*to,P=(a,r)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
    const[x0,y0]=P(a0,rO),[x1,y1]=P(a1,rO),[x2,y2]=P(a1,rI),[x3,y3]=P(a0,rI),lg=(to-f)>.5?1:0;
    return `<path d="M${x0} ${y0} A${rO} ${rO} 0 ${lg} 1 ${x1} ${y1} L${x2} ${y2} A${rI} ${rI} 0 ${lg} 0 ${x3} ${y3} Z" fill="${c}"/>`;};
  const ang=Math.PI+Math.PI*t,rM=(rO+rI)/2,mx=cx+rM*Math.cos(ang),my=cy+rM*Math.sin(ang);
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img" style="max-width:340px;margin:0 auto">
${arc(0,1,'var(--n10)')}${arc(0,.4,'#3DCC87')}${arc(.4,.76,'#EDA12F')}${arc(.76,1,'#E62E2E')}
<circle class="gauge-marker" cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="8" fill="var(--maroon)" stroke="#fff" stroke-width="3"/>
<text x="${cx}" y="${cy-14}" text-anchor="middle" font-size="19" font-weight="600" fill="var(--maroon)" style="font-variant-numeric:tabular-nums">${aed(val)}</text>
<text class="axis-text" x="${cx-rO}" y="${cy+18}">Floor ${fl.toLocaleString()}</text>
<text class="axis-text" x="${cx+rO}" y="${cy+18}" text-anchor="end">Ceiling ${ce.toLocaleString()}</text></svg>`;
}
const legend=items=>`<div class="chart-legend" data-legend><span class="legend-lead">Show:</span>${
items.map((x,i)=>`<button class="legend-item is-on" data-t="${x[2]!==undefined?x[2]:i}">
<span class="lg-box" style="background:${x[1]}">${I('check','')}</span>
<span class="lg-label" style="color:${x[1]}">${E(x[0])}</span></button>`).join('')}</div>`;

/* ---------- blocks ---------- */
const kpi=(label,value,delta,dir,graph,tone)=>`<article class="kpi-card">
<div class="kpi-head"><span class="kpi-label">${E(label)}</span><span class="kpi-menu">${I('dots-three-vertical')}</span></div>
<div class="kpi-value tnum ${tone||''}" data-count data-v="${E(value)}">${E(value)}</div>
${delta?`<div class="scorecard"><div class="score-row"><span class="score-label">Since last week</span>
<span class="score-badge ${dir}"><span class="score-icon">${I(dir==='up'?'trend-up':'trend-down')}</span>
<span class="score-value tnum">${E(delta)}</span></span></div>
${graph?`<div class="score-graph">${spark(dir)}</div>`:''}</div>`:''}
${graph?`<div class="kpi-foot tnum">Last updated: 16:53 05-08-2026</div>`:''}</article>`;

const chartHead=(t,s,pad,key)=>`<div class="chart-head" ${pad?`style="padding-left:${pad}px"`:''}>
<div class="chart-head-t"><h2 class="sec-title">${E(t)}</h2>${s?`<p class="sec-sub">${E(s)}</p>`:''}</div>
<button class="expand-btn" aria-label="Open full view" ${key?`data-chartd="${key}"`:''}>${I('arrow-square-out')}</button></div>`;

const tabsRow=a=>`<nav class="tabs">${TABS.map(([id,l])=>
`<button class="tab ${id===a?'is-active':''}" data-go="${id}">${l}<span class="u"></span></button>`).join('')}</nav>`;

const dashHead=(t,s)=>`<div class="dash-head">
<div class="title-block"><h1 class="page-title">${E(t)}</h1><p class="page-sub">${E(s)}</p></div>
<div class="dash-actions">
<button class="btn" data-toast="Export started">${I('export')} Export</button>
<div class="segmented" data-seg><button>1W</button><button>4W</button><button class="is-active">8W</button><button>ALL</button></div>
</div></div>`;

const tRow=(cells,head)=>`<div class="trow ${head?'head':'body'}">${cells}</div>`;

/* ---------- screens ---------- */
const S={};

S.home=()=>({sec:null,page:'Home',w:892,html:`
<div class="home-header">
<div class="greeting"><h1>Good morning, Aisha</h1>
<p>Repricing cycle <strong>Aug 05 – Aug 11</strong> completed</p></div>
<div class="cycle-week"><div class="cycle-days">${CYCLE.map(([d,n,st])=>
`<div class="cycle-day ${st}"><span class="cycle-dow">${d}</span><button class="item-day tnum">${n}</button></div>`).join('')}</div></div>
</div>
<div class="grid-2">
<div class="g2-col">
<div class="next-action"><div class="prog-head"><span class="t">Cycle review progress</span>
<span class="v tnum">42 of 128</span></div>
<div class="bar-track"><div class="bar-fill" data-prog="33"></div></div></div>
<div class="cards-row">
<button class="plan-card" data-go="queue" data-press><span class="plan-top"><span class="sweep"></span>
<span class="plan-icon">${I('list-checks')}</span><span class="plan-title">Recommendations</span></span>
<span class="plan-bottom"><span class="plan-sub">128 pending approval</span>
<span class="plan-go">${I('caret-right')}</span></span></button>
<button class="plan-card" data-go="c1" data-press><span class="plan-top"><span class="sweep"></span>
<span class="plan-icon">${I('chart-line')}</span><span class="plan-title">Dashboards</span></span>
<span class="plan-bottom"><span class="plan-sub">Pricing &amp; Forecast</span>
<span class="plan-go">${I('caret-right')}</span></span></button>
</div></div>
<div class="g2-col"><div class="panel">
<div class="panel-head"><span class="panel-title">Alerts (3)</span><button class="panel-link" data-notif>See all</button></div>
<div class="notif-list">${ALERTS.map(([s,ic,t,tm],i)=>
`<div class="notification ${s}" style="animation-delay:${120+i*70}ms"><span class="notif-icon">${I(ic,1)}</span>
<span class="notif-text"><span class="notif-title">${E(t)}</span><span class="notif-time">${tm}</span></span></div>`).join('')}</div>
</div></div></div>
<div class="kpi-row">
${kpi('Pending approval','128','+9.3%','up',1)}
${kpi('Overdue','6','-2','up',1)}
${kpi('Anomaly flags','14','+5','down',1)}
${kpi('Revenue uplift, week','+3.4%','+0.8pp','up',1)}
</div>`});

S.queue=()=>({sec:'Recommendations',page:'Recommendations review queue',w:892,html:`
<div class="q-head">
<div class="q-title"><h1 class="page-title">Recommendations</h1>
<span class="chip-sm">Cycle Aug 05–11</span></div>
<button class="btn" data-toast="Export started">${I('export')} Export</button>
<button class="btn btn-approve" data-bulk="approve">Approve selected</button>
<button class="btn btn-danger" data-bulk="reject">Reject selected</button>
</div>
<div class="q-filters">
<div class="q-search-row"><label class="input-field grow">${I('magnifying-glass')}
<input type="search" placeholder="Search by SKU, brand or factor" aria-label="Search"/></label>
<button class="icon-sq" aria-label="More filters" data-filters>${I('funnel')}</button></div>
<div class="filters-results"><div class="applied" data-chips>
<span class="chip is-active">Category: Electronics <button aria-label="Remove">${I('x')}</button></span>
<span class="chip is-active">Status: Pending <button aria-label="Remove">${I('x')}</button></span>
<span class="chip is-active">Delta: Negative <button aria-label="Remove">${I('x')}</button></span>
</div><span class="vdiv"></span><span class="results-count tnum">6 of 128 results</span></div>
</div>
<div class="tbl"><div class="tbl-scroll">
${tRow(`<span class="tc-check"><input type="checkbox" class="checkbox" data-all aria-label="Select all"></span>
<span class="tc">SKU</span><span class="tc-85">Current</span><span class="tc-110">Recommended</span>
<span class="tc-50">Δ%</span><span class="tc-215">Top factor</span><span class="tc-60">Status</span>`,1)}
${QUEUE.map(([sku,note,cur,rec,d,fac,st],i)=>tRow(
`<span class="tc-check"><input type="checkbox" class="checkbox" data-row aria-label="Select ${E(sku)}"></span>
<span class="tc"><a href="#/detail" data-go="detail">${E(sku)}</a>${note?`<span class="tnote">${E(note)}</span>`:''}</span>
<span class="tc-85 tnum">${aed(cur)}</span><span class="tc-110 tnum">${aed(rec)}</span>
<span class="tc-50">${nm(d)}</span>
<span class="tc-215">${E(fac)}</span><span class="tc-60">${sb(st)}</span>`).replace('class="trow body"',`class="trow body" style="animation-delay:${i*45}ms"`)).join('')}
</div></div>
<nav class="pagination">
<button class="pg">${I('caret-left')} Previous</button>
<button class="pg">1</button><button class="pg">2</button><button class="pg is-active">3</button>
<button class="pg">4</button><button class="pg">5</button><span class="pg dots">...</span>
<button class="pg">17</button><button class="pg">Next ${I('caret-right')}</button></nav>`});

S.detail=()=>({sec:'Recommendations',page:'Recommendation detail',w:1060,html:`
<div class="card d-header">
<span class="thumb">${I('device-mobile')}</span>
<div class="grow"><h1 class="d-title">iPhone 15 Pro 256GB</h1>
<div class="d-meta"><span class="chip-sm">Smartphones</span><span class="chip-sm">Apple</span>
<span class="chip-sm tnum">SKU-114872</span></div></div>
<div class="price-display">
<div class="p-cur"><div class="price-label">Current price</div><div class="price-value tnum">AED 3,899</div></div>
<span class="muted">${I('arrow-right')}</span>
<div class="p-rec"><div class="price-label">Recommended</div><div class="price-value tnum">AED 3,749</div></div>
<span class="pct down tnum">−3.8%</span></div>
</div>

<div class="chart-card" data-chart>
${chartHead('Price history','e& vs tracked competitors over the last 8 weeks',40,'b2-price')}
${lineC({labels:['W1','W2','W3','W4','W5','W6','W7','W8'],fmt:v=>'AED '+Math.round(v).toLocaleString(),
series:[{n:'e&',c:'var(--dv1)',area:1,d:[3980,3960,3940,3900,3880,3860,3820,3749]},
{n:'Competitor A',c:'var(--dv2)',d:[3900,3890,3880,3860,3840,3810,3790,3600]},
{n:'Competitor B',c:'var(--dv3)',d:[3950,3930,3920,3900,3890,3870,3850,3650]}]})}
<div class="x-axis">${['W1','W2','W3','W4','W5','W6','W7','W8'].map(x=>`<span>${x}</span>`).join('')}</div>
${legend([['e&','var(--dv1)'],['Competitor A','var(--dv2)'],['Competitor B','var(--dv3)']])}
</div>

<div class="d-cols">
<div class="d-col">
<button class="sim-card" data-go="sim"><span class="sim-icon">${I('flask')}</span>
<span class="grow"><span class="sec-title" style="display:block">Run scenario simulation</span>
<span class="sec-sub" style="display:block">Test alternative prices and see the predicted revenue impact</span></span>
<span class="plan-go">${I('caret-right')}</span></button>
<div class="card pad">
<h2 class="sec-title" style="margin-bottom:var(--s12)">Position within price guardrails</h2>
${gaugeC(3749,3400,4100)}
<div class="chart-legend" style="justify-content:center;padding-top:0">
<span class="legend-pill is-on"><span class="sw" style="background:#3DCC87"></span>Safe</span>
<span class="legend-pill is-on"><span class="sw" style="background:#EDA12F"></span>Caution</span>
<span class="legend-pill is-on"><span class="sw" style="background:#E62E2E"></span>Near ceiling</span></div></div>
<div class="card pad">
<h2 class="sec-title" style="margin-bottom:var(--s4)">Factor contribution</h2>
${FACT.map(([n,v])=>`<div class="factor"><div class="factor-head"><span>${E(n)}</span>
<span class="pct ${pc(v)} tnum">${v>0?'+':''}${v}%</span></div>
<div class="factor-bar"><div class="factor-fill" data-fill="${Math.abs(v)}"></div></div></div>`).join('')}</div>
</div>
<div class="d-col">
<div class="card pad">
<h2 class="sec-title" style="margin-bottom:var(--s12)">Decision</h2>
<label class="field-label" for="rc">Reason code</label>
<select class="select" id="rc" style="margin-bottom:var(--s12)">
<option>Aligned with competitor position</option><option>Margin protection guardrail</option>
<option>Stock clearance</option><option>Manual override</option></select>
<label class="field-label" for="cm">Comment</label>
<textarea class="textarea" id="cm" placeholder="Optional comment on this decision" style="margin-bottom:var(--s16)"></textarea>
<div class="d-actions">
<button class="btn btn-approve" data-toast="Recommendation accepted">Accept</button>
<button class="btn btn-danger" data-toast="Recommendation rejected">Reject</button>
<button class="btn" data-toast="Override opened">Override</button></div></div>
<div class="card pad">
<div class="chart-head"><div class="chart-head-t row" style="flex-wrap:wrap">
<h2 class="sec-title">Decision history</h2><span class="badge badge-neutral tnum">24 total · showing last 5</span></div>
<button class="expand-btn" aria-label="Open full history" data-go="history">${I('arrow-square-out')}</button></div>
${HIST.map(([d,r,s,c])=>`<div class="hist"><div class="grow">
<div class="hist-date tnum">${d}</div><div class="hist-reason">${E(r)}</div></div>
${sb(s)}${c?`<span class="muted">${I('chat-circle')}</span>`:''}<span class="muted">${I('caret-right')}</span></div>`).join('')}
</div></div></div>`});

const dash=(id,t,s,body)=>({sec:'Dashboards',page:t,w:892,html:tabsRow(id)+dashHead(t,s)+body});

S.c1=()=>dash('c1','Pricing performance','Deviation, volume and revenue · approved decisions impact',`
<div class="kpi-row">
${kpi('Avg price vs baseline','-4.1%','-0.5pp','down',0,'neg')}
${kpi('Sales volume','+7.8%','+1.2pp','up',0,'pos')}
${kpi('Revenue','+3.4%','+0.4pp','up',0,'pos')}
${kpi('Margin','-0.6%','-0.2pp','down',0,'neg')}</div>
<div class="chart-card" data-chart>
${chartHead('Approved decisions vs actual revenue','Approval volume rose 48% over 8 weeks while revenue climbed from AED 410K to 495K',40,'c1-combo')}
${comboC()}
${legend([['Rejected','var(--dv-rej)',1],['Approved','var(--dv-app-lbl)',0],['Revenue','var(--dv-rev)',2]])}</div>
<div class="tbl"><div class="tbl-scroll">
${tRow('<span class="tc">Category</span><span class="tc">Price vs baseline</span><span class="tc">Revenue</span><span class="tc">Conversion</span>',1)}
${[['Smartphones',-5.2,4.1,'3.8%'],['Accessories',-2.1,6.7,'5.2%'],['Wearables',1.4,1.9,'4.4%'],['Tablets',-6.8,-1.2,'2.9%']]
.map(([c,p,r,cv],i)=>tRow(`<span class="tc">${c}</span>
<span class="tc">${nm(p)}</span>
<span class="tc">${nm(r)}</span>
<span class="tc tnum">${cv}</span>`).replace('class="trow body"',`class="trow body" style="animation-delay:${i*45}ms"`)).join('')}
</div></div>`);

S.c2=()=>dash('c2','Competitor intelligence','Live pricing vs e& across tracked categories',`
<div class="chart-card" data-chart>
${chartHead('e& price vs competitors by category','e& holds a price premium in Smartphones and Tablets; near parity in Accessories and Wearables',40,'c2-grouped')}
${groupC()}
${legend([['e&','#950124'],['Competitor A','#EA6C29'],['Competitor B','#0D9488']])}</div>
<div class="c2-cols">
<div class="c2-col"><div class="card pad">
<div class="chart-head"><div class="chart-head-t"><h2 class="sec-title">Competitor price movements feed</h2></div>
<button class="expand-btn" aria-label="Open">${I('arrow-square-out')}</button></div>
${[['Competitor A cut iPhone 15 Pro price by 4%','Today, 06:40'],
['Competitor B launched a promo on AirPods Pro 2','Today, 04:15'],
['Competitor A raised Galaxy Watch 6 price by 2%','Yesterday, 21:02'],
["Anomaly: Competitor B's iPad Air price is below cost",'Yesterday, 18:47']]
.map(([t,tm])=>`<div class="feed-item"><div class="feed-title">${E(t)}</div><div class="feed-time tnum">${tm}</div></div>`).join('')}
</div></div>
<div class="c2-col">
<h2 class="sec-title">Source freshness</h2>
<div class="card" style="padding:4px var(--s16)">
${[['Competitor A — website','12 min ago','var(--ok)'],['Competitor B — website','34 min ago','var(--ok)'],
['Licensed feed','5h ago','var(--warn)']].map(([n,t,c])=>
`<div class="kv"><span>${n}</span><span class="tnum" style="color:${c}"><span class="dot" style="background:${c}"></span>${t}</span></div>`).join('')}</div>
<h2 class="sec-title" style="margin-top:var(--s8)">Gap analysis</h2>
<div class="card" style="padding:4px var(--s16)">
${[['Smartphones',4.1],['Accessories',-1.2],['Wearables',-3.4],['Tablets',6.9]].map(([n,v])=>
`<div class="kv"><span>${n}</span><span class="pct ${pc(v)} tnum">${pt(v)}</span></div>`).join('')}</div>
</div></div>`);

S.c3=()=>dash('c3','Forecast accuracy','MAPE and bias metrics for demand and revenue models',`
<div class="kpi-row">
${kpi('MAPE (demand)','6.8%',null)}
${kpi('MAPE (revenue)','5.1%',null)}
${kpi('Confidence interval','4.2%',null)}</div>
<div class="chart-card" data-chart>
${chartHead('Forecast vs actual weekly demand','Model output tracked against realised units per week',40,'c3-forecast')}
${lineC({labels:['W1','W2','W3','W4','W5','W6','W7','W8'],fmt:v=>Math.round(v).toLocaleString(),
series:[{n:'Forecast',c:'var(--dv2)',d:[1180,1240,1210,1330,1290,1420,1460,1520]},
{n:'Actual',c:'var(--dv1)',area:1,d:[1120,1190,1250,1280,1330,1380,1490,1560]}]})}
<div class="x-axis">${['W1','W2','W3','W4','W5','W6','W7','W8'].map(x=>`<span>${x}</span>`).join('')}</div>
${legend([['Forecast','var(--dv2)'],['Actual','var(--dv1)']])}</div>
<div class="tbl"><div class="tbl-scroll">
${tRow('<span class="tc">Category</span><span class="tc">MAPE</span><span class="tc">Bias</span><span class="tc">Quality</span>',1)}
${[['Accessories','3.9%','-0.6%','approved'],['Wearables','5.2%','+1.1%','approved'],
['Smartphones','7.4%','+2.3%','pending'],['Tablets','10.1%','-3.8%','flagged']]
.map(([c,m,b,s],i)=>tRow(`<span class="tc">${c}</span><span class="tc tnum">${m}</span>
<span class="tc tnum">${b}</span><span class="tc">${sb(s)}</span>`)
.replace('class="trow body"',`class="trow body" style="animation-delay:${i*45}ms"`)).join('')}
</div></div>`);

S.c4=()=>dash('c4','Revenue impact','Cumulative AED uplift vs the no-ADPA baseline',`
<div class="kpi-row">
${kpi('Revenue uplift','+AED 612K','+8.4%','up',0,'pos')}
${kpi('Markdown cost','-AED 84K','planned','down',0,'neg')}
${kpi('Incremental units','1,240','+310','up',0)}
${kpi('Margin delta','+2.1%','+0.3pp','up',0,'pos')}</div>
<div class="chart-card" data-chart>
${chartHead('Cumulative effect since cycle start: with ADPA vs baseline','With ADPA the cycle closed AED 612K ahead of the counterfactual baseline',48,'c4-impact')}
${lineC({labels:['W1','W2','W3','W4','W5','W6','W7','W8'],fmt:v=>'AED '+Math.round(v)+'K',
series:[{n:'With ADPA',c:'var(--dv1)',area:1,d:[60,140,215,300,390,470,545,612]},
{n:'Baseline',c:'var(--n40)',d:[40,88,140,186,232,280,320,360]}]})}
<div class="x-axis">${['W1','W2','W3','W4','W5','W6','W7','W8'].map(x=>`<span>${x}</span>`).join('')}</div>
${legend([['With ADPA','var(--dv1)'],['Baseline without ADPA','var(--n40)']])}</div>`);

S.c5=()=>dash('c5','Customer behaviour','Personalised offer response · UM segments only',`
<div class="chart-card" data-chart>
${chartHead('Demand elasticity by segment','Conversion response per customer segment',0,'c5-elasticity')}
${barsC([['Premium',4.1,'+4.1%','var(--dv2)'],['Value-seekers',9.4,'+9.4%','var(--dv3)'],
['Occasional',3.8,'+3.8%','var(--dv-vi)'],['New customers',2.1,'+2.1%','#EDA12F']])}</div>
<div class="notification warning"><span class="notif-icon">${I('warning',1)}</span>
<span class="notif-text"><span class="notif-title">Approved, privacy-compliant use cases only. Data is aggregated by UM segment.</span></span></div>
<div class="tbl"><div class="tbl-scroll">
${tRow('<span class="tc">Segment</span><span class="tc">Reach</span><span class="tc">Conversion</span><span class="tc">Δ vs base price</span>',1)}
${[['Premium','18,400','6.1%',1.2],['Value-seekers','42,100','9.4%',3.8],
['Occasional','27,900','4.2%',0.9],['New customers','9,650','3.0%',0.0]]
.map(([s,r,c,d],i)=>tRow(`<span class="tc">${s}</span><span class="tc tnum">${r}</span>
<span class="tc tnum">${c}</span><span class="tc">${nm(d)}</span>`)
.replace('class="trow body"',`class="trow body" style="animation-delay:${i*45}ms"`)).join('')}
</div></div>`);

const SL=[['Price change',-15,15,-4],['Promo depth',0,30,5],['Competitor move',-20,20,-2],['Stock level',-10,10,0]];

S.sim=()=>({sec:'Recommendations',page:'What-if simulator',w:892,html:`
<div class="q-head">
<div class="q-title"><h1 class="d-title">Scenario simulation</h1>
<span class="chip-sm">iPhone 15 Pro 256GB</span></div>
<button class="btn btn-soft" data-toast="Scenario submitted as alternative recommendation">
${I('check-circle')} Submit as alternative</button></div>
<div class="sim-cols">
<div class="sim-col"><h2 class="sec-title-16">Scenario inputs</h2>
<div class="card slider-card">${SL.map(([n,mn,mx,v])=>{
const z=((0-mn)/(mx-mn))*100;
return `<div class="slider-block" data-slider data-min="${mn}" data-max="${mx}">
<div class="slider-head"><span class="slider-name">${E(n)}</span>
<span class="pct ${pc(v)} tnum" data-out>${pt(v)}</span></div>
<div class="slider-wrap"><div class="slider-track"><div class="slider-zero" style="left:${z}%"></div>
<div class="slider-fill" data-fill></div></div>
<input class="slider-input" type="range" min="${mn}" max="${mx}" step="0.1" value="${v}" aria-label="${E(n)}"/></div>
</div>`;}).join('')}</div></div>
<div class="sim-col"><h2 class="sec-title-16">Forecast impact</h2>
<div class="kpi-grid4">
${kpi('Sales volume','+9.2%','+9.2%','up',0,'pos')}
${kpi('Revenue','+2.1%','+2.1%','up',0,'pos')}
${kpi('Margin','-1.4%','-1.4%','down',0,'neg')}
${kpi('Market share','+0.6pp','+0.6pp','up',0,'pos')}</div></div>
</div>
<h2 class="sec-title-16">Comparison with your scenario</h2>
<div class="tbl"><div class="tbl-scroll">
${tRow('<span class="tc">Metric</span><span class="tc">Current price</span><span class="tc">AI recommendation</span><span class="tc">Your scenario</span>',1)}
${[['Price','AED 3,899','AED 3,749','AED 3,743','',''],
['Sales volume','baseline','+7.8%','+9.2%','pos','pos'],
['Revenue','baseline','+3.4%','+2.1%','pos','pos'],
['Margin','baseline','-0.6%','-1.4%','neg','neg']]
.map(([m,a,b,c,t1,t2],i)=>tRow(`<span class="tc">${m}</span><span class="tc tnum">${a}</span>
<span class="tc tnum" style="font-weight:${t1?600:400};color:${t1==='pos'?'var(--ok)':t1==='neg'?'var(--bad)':'var(--n80)'}">${b}</span>
<span class="tc tnum" style="font-weight:${t2?600:400};color:${t2==='pos'?'var(--ok)':t2==='neg'?'var(--bad)':'var(--n80)'}">${c}</span>`)
.replace('class="trow body"',`class="trow body" style="animation-delay:${i*45}ms"`)).join('')}
</div></div>`});

S.chat=()=>({sec:null,page:'AI analyst',w:788,chatSb:1,bottom:1,html:`
<div class="thread" data-thread>
<div class="msg-row user"><div class="msg user">
<div>Show me the SKUs with the largest deviation from the recommendation this week</div>
<div class="msg-time tnum">10:42 AM</div></div></div>
<div class="msg-row bot"><div class="msg bot">
<p>For the Aug 05–11 cycle, the largest deviation is <strong>iPad Air 11 256GB</strong>: the recommendation is
7% below the current price, driven by a seasonal demand dip and price cut from Competitor B.</p>
<div class="tbl compact"><div class="tbl-scroll">
${tRow('<span class="tc">SKU</span><span class="tc">Δ%</span>',1)}
${[['iPad Air 11 256GB',-7.7],['AirPods Pro 2',-7.0],['Xiaomi 14 128GB',-5.6]].map(([s,d],i)=>
tRow(`<span class="tc">${s}</span><span class="tc">${nm(d)}</span>`)
.replace('class="trow body"',`class="trow body" style="animation-delay:${300+i*60}ms"`)).join('')}
</div></div>
<div class="chat-actions">
<button class="btn" data-toast="Excel export started">${I('microsoft-excel-logo')} Export to Excel</button>
<button class="btn" data-toast="Chart opened">${I('chart-line')} Show as chart</button>
<button class="btn" data-toast="PDF export started">${I('file-pdf')} Export to PDF</button></div>
<div class="msg-src">Source: Pricing Data Platform, cycle Aug 05–11</div>
</div></div></div>
<div class="prompt-row">
<button class="btn" data-prompt>Compare revenue by category, last month</button>
<button class="btn" data-prompt>Which SKUs get overridden most often?</button>
<button class="btn" data-prompt>Chart forecast accuracy for the quarter</button></div>
<form class="composer" data-composer>
<input class="input grow" placeholder="Ask a question about a SKU or category" aria-label="Message"/>
<button class="send-btn" type="submit" aria-label="Send">${I('paper-plane-tilt')}</button></form>`});


S.history=()=>({sec:'Recommendations',page:'Decision history',w:1060,html:`
<div class="q-head">
<div class="q-title"><h1 class="page-title">Decision history</h1>
<span class="chip-sm">Full audit log · cycle Aug 05–11</span></div>
<button class="btn" data-toast="Audit log exported">${I('export')} Export log</button>
</div>

<div class="kpi-row">
${kpi('Decisions logged','1,284','+118','up',0)}
${kpi('Approved','86.4%','+2.1pp','up',0,'pos')}
${kpi('Rejected','9.2%','-1.4pp','up',0,'neg')}
${kpi('Overridden','4.4%','-0.7pp','up',0)}
</div>

<div class="q-filters">
<div class="q-search-row"><label class="input-field grow">${I('magnifying-glass')}
<input type="search" placeholder="Search by SKU, reason code or reviewer" aria-label="Search log"/></label>
<div class="segmented" data-seg><button class="is-active">All</button><button>Approved</button>
<button>Rejected</button><button>Overridden</button></div>
<button class="icon-sq" aria-label="More filters" data-filters>${I('funnel')}</button></div>
<div class="filters-results"><div class="applied" data-chips>
<span class="chip is-active">Reviewer: Aisha K. <button aria-label="Remove">${I('x')}</button></span>
<span class="chip is-active">Cycle: Aug 05–11 <button aria-label="Remove">${I('x')}</button></span>
</div><span class="vdiv"></span><span class="results-count tnum">8 of 1,284 entries</span></div>
</div>

<div class="tbl"><div class="tbl-scroll">
${tRow(`<span class="tc-110">Date</span><span class="tc">SKU</span>
<span class="tc-85">From</span><span class="tc-85">To</span>
<span class="tc-215">Reason code</span><span class="tc-110">Reviewer</span>
<span class="tc-110">Status</span><span class="tc-60"></span>`,1)}
${LOG.map(([d,t,sku,from,to,reason,who,st,cm],i)=>tRow(
`<span class="tc-110"><span class="tnum">${d}</span><span class="tnote tnum">${t}</span></span>
<span class="tc">${E(sku)}</span>
<span class="tc-85 tnum muted">${from}</span>
<span class="tc-85 tnum">${to}</span>
<span class="tc-215">${E(reason)}</span>
<span class="tc-110">${E(who)}</span>
<span class="tc-110">${sb(st)}</span>
<span class="tc-60 row" style="gap:8px;justify-content:flex-end">
${cm?`<span class="muted" title="Has comment">${I('chat-circle')}</span>`:''}
<span class="muted">${I('caret-right')}</span></span>`)
.replace('class="trow body"',`class="trow body" style="animation-delay:${i*40}ms"`)).join('')}
</div></div>
<nav class="pagination">
<button class="pg">${I('caret-left')} Previous</button>
<button class="pg is-active">1</button><button class="pg">2</button><button class="pg">3</button>
<span class="pg dots">...</span><button class="pg">161</button>
<button class="pg">Next ${I('caret-right')}</button></nav>`});


/* ---------- Chart detail pages ---------- */
const CHARTS={
 'c1-combo':{sec:'Dashboards',t:'Approved decisions vs actual revenue',
  s:'Approval volume rose 48% over 8 weeks while revenue climbed from AED 410K to 495K',back:'c1',
  stats:[['Total decisions','788','+48%','up'],['Approved','688','87.3%','up'],
         ['Rejected','100','12.7%','down'],['Revenue, cycle end','AED 495K','+20.7%','up']],
  render:()=>comboC(),
  legend:[['Rejected','var(--dv-rej)',1],['Approved','var(--dv-app-lbl)',0],['Revenue','var(--dv-rev)',2]],
  cols:['Week','Approved','Rejected','Approval rate','Revenue, AED K'],
  rows:COMBO.map(([w,a,r,rev])=>[w,a,r,((a/(a+r))*100).toFixed(1)+'%',rev]),
  notes:['Approval rate climbed from 80.0% in W1 to 95.2% in W8 as competitor signals stabilised.',
         'Rejections fell every week after W3, when the margin floor was raised for Accessories.',
         'Revenue tracks approvals with roughly a one-week lag.']},
 'c2-grouped':{sec:'Dashboards',t:'e& price vs competitors by category',
  s:'e& holds a price premium in Smartphones and Tablets; near parity in Accessories and Wearables',back:'c2',
  stats:[['Categories tracked','4','live','up'],['Avg premium vs A','+2.8%','','up'],
         ['Avg premium vs B','+1.4%','','up'],['Feed freshness','12 min','ok','up']],
  render:()=>groupC(),
  legend:[['e&','#950124'],['Competitor A','#EA6C29'],['Competitor B','#0D9488']],
  cols:['Category','e&','Competitor A','Competitor B','Gap vs A','Gap vs B'],
  rows:COMP.map(([c,e,a,b])=>[c,aed(e),aed(a),aed(b),
    ((e-a)/a*100>0?'+':'')+((e-a)/a*100).toFixed(1)+'%',((e-b)/b*100>0?'+':'')+((e-b)/b*100).toFixed(1)+'%']),
  notes:['Smartphones carry the largest premium at +4.2% over Competitor A.',
         'Accessories sit below both competitors — a candidate for a price increase.',
         'Wearables are the most tightly matched category across all three retailers.']},
 'c3-forecast':{sec:'Dashboards',t:'Forecast vs actual weekly demand',
  s:'Model output tracked against realised units per week',back:'c3',
  stats:[['MAPE, demand','6.8%','-0.4pp','up'],['MAPE, revenue','5.1%','-0.2pp','up'],
         ['Bias','+1.2%','','down'],['Weeks within target','6 of 8','','up']],
  render:()=>lineC({labels:['W1','W2','W3','W4','W5','W6','W7','W8'],fmt:v=>Math.round(v).toLocaleString(),h:260,
    series:[{n:'Forecast',c:'var(--dv2)',d:[1180,1240,1210,1330,1290,1420,1460,1520]},
            {n:'Actual',c:'var(--dv1)',area:1,d:[1120,1190,1250,1280,1330,1380,1490,1560]}]}),
  legend:[['Forecast','var(--dv2)'],['Actual','var(--dv1)']],
  cols:['Week','Forecast, units','Actual, units','Error','Error %'],
  rows:[['W1',1180,1120],['W2',1240,1190],['W3',1210,1250],['W4',1330,1280],['W5',1290,1330],
        ['W6',1420,1380],['W7',1460,1490],['W8',1520,1560]]
    .map(([w,f,a])=>[w,f.toLocaleString(),a.toLocaleString(),(a-f>0?'+':'')+(a-f),
      ((a-f)/f*100>0?'+':'')+((a-f)/f*100).toFixed(1)+'%']),
  notes:['The model under-forecast demand in the final three weeks as the seasonal dip reversed.',
         'W3 shows the largest positive error at +3.3%.',
         'Bias stays inside the ±2% tolerance agreed with Finance.']},
 'c4-impact':{sec:'Dashboards',t:'Cumulative effect since cycle start: with ADPA vs baseline',
  s:'With ADPA the cycle closed AED 612K ahead of the counterfactual baseline',back:'c4',
  stats:[['Uplift','+AED 612K','+8.4%','up'],['Baseline','AED 360K','','down'],
         ['Markdown cost','-AED 84K','planned','down'],['Net effect','+AED 528K','','up']],
  render:()=>lineC({labels:['W1','W2','W3','W4','W5','W6','W7','W8'],fmt:v=>'AED '+Math.round(v)+'K',h:260,
    series:[{n:'With ADPA',c:'var(--dv1)',area:1,d:[60,140,215,300,390,470,545,612]},
            {n:'Baseline',c:'var(--n40)',d:[40,88,140,186,232,280,320,360]}]}),
  legend:[['With ADPA','var(--dv1)'],['Baseline without ADPA','var(--n40)']],
  cols:['Week','With ADPA','Baseline','Delta','Cumulative delta'],
  rows:(()=>{const A=[60,140,215,300,390,470,545,612],B=[40,88,140,186,232,280,320,360];
    return A.map((a,i)=>['W'+(i+1),'AED '+a+'K','AED '+B[i]+'K','+AED '+(a-B[i])+'K','+AED '+(a-B[i])+'K']);})(),
  notes:['The gap widens every week — compounding, not a one-off.',
         'Markdown cost stays inside the approved AED 90K envelope.',
         'W6 onwards the uplift alone covers the full programme run cost.']},
 'c5-elasticity':{sec:'Dashboards',t:'Demand elasticity by segment',
  s:'Conversion response per customer segment',back:'c5',
  stats:[['Segments','4','UM approved','up'],['Best responder','Value-seekers','+9.4%','up'],
         ['Weakest','New customers','+2.1%','down'],['Total reach','98,050','','up']],
  render:()=>barsC([['Premium',4.1,'+4.1%','var(--dv2)'],['Value-seekers',9.4,'+9.4%','var(--dv3)'],
                    ['Occasional',3.8,'+3.8%','var(--dv-vi)'],['New customers',2.1,'+2.1%','#EDA12F']]),
  legend:null,
  cols:['Segment','Reach','Conversion','Elasticity','Δ vs base price'],
  rows:[['Premium','18,400','6.1%','+4.1%','+1.2%'],['Value-seekers','42,100','9.4%','+9.4%','+3.8%'],
        ['Occasional','27,900','4.2%','+3.8%','+0.9%'],['New customers','9,650','3.0%','+2.1%','0.0%']],
  notes:['Value-seekers respond nearly 2.5x more strongly than Premium.',
         'New customers barely react to price — messaging matters more than discount depth.',
         'All figures are aggregated by UM segment; no individual-level data is used.']},
 'b2-price':{sec:'Recommendations',t:'Price history',
  s:'e& vs tracked competitors over the last 8 weeks',back:'detail',
  stats:[['Current','AED 3,899','','down'],['Recommended','AED 3,749','-3.8%','down'],
         ['8-week low','AED 3,749','','down'],['8-week high','AED 3,980','','up']],
  render:()=>lineC({labels:['W1','W2','W3','W4','W5','W6','W7','W8'],
    fmt:v=>'AED '+Math.round(v).toLocaleString(),h:260,
    series:[{n:'e&',c:'var(--dv1)',area:1,d:[3980,3960,3940,3900,3880,3860,3820,3749]},
            {n:'Competitor A',c:'var(--dv2)',d:[3900,3890,3880,3860,3840,3810,3790,3600]},
            {n:'Competitor B',c:'var(--dv3)',d:[3950,3930,3920,3900,3890,3870,3850,3650]}]}),
  legend:[['e&','var(--dv1)'],['Competitor A','var(--dv2)'],['Competitor B','var(--dv3)']],
  cols:['Week','e&','Competitor A','Competitor B','Gap vs A'],
  rows:(()=>{const E_=[3980,3960,3940,3900,3880,3860,3820,3749],A=[3900,3890,3880,3860,3840,3810,3790,3600],
    B=[3950,3930,3920,3900,3890,3870,3850,3650];
    return E_.map((e,i)=>['W'+(i+1),aed(e),aed(A[i]),aed(B[i]),
      ((e-A[i])/A[i]*100>0?'+':'')+((e-A[i])/A[i]*100).toFixed(1)+'%']);})(),
  notes:['Competitor A cut hardest in W8, opening a 4.1% gap against e&.',
         'e& has drifted down steadily rather than in steps — no promo spikes.',
         'The recommendation closes most of the gap without breaching the margin floor.']}
};
let chartKey='c1-combo';

S.chartd=()=>{const c=CHARTS[chartKey]||CHARTS['c1-combo'];
return {sec:c.sec,page:c.t,w:1180,html:`
<div class="cd-head">
<button class="cd-back" data-go="${c.back}" aria-label="Back to ${E(c.sec)}">${I('arrow-left')}</button>
<div class="q-title grow"><h1 class="page-title">${E(c.t)}</h1><p class="page-sub">${E(c.s)}</p></div>
<div class="dash-actions">
<div class="segmented" data-seg><button>4W</button><button class="is-active">8W</button>
<button>13W</button><button>ALL</button></div>
<button class="btn" data-toast="Chart data exported">${I('export')} Export data</button></div></div>

<div class="kpi-row">${c.stats.map(([l,v,d,dir])=>kpi(l,v,d||null,dir,0,dir==='up'?'pos':'neg')).join('')}</div>

<div class="chart-card cd-chart" data-chart>${c.render()}
${c.legend?legend(c.legend):''}</div>

<div class="cd-cols">
<div>
<h2 class="sec-title-16" style="margin-bottom:var(--s8)">Underlying data</h2>
<div class="tbl"><div class="tbl-scroll">
${tRow(c.cols.map((h,i)=>`<span class="${i===0?'tc-110':'tc'}">${E(h)}</span>`).join(''),1)}
${c.rows.map((r,i)=>tRow(r.map((v,j)=>`<span class="${j===0?'tc-110':'tc'} ${j?'tnum':''}">${E(v)}</span>`).join(''))
 .replace('class="trow body"',`class="trow body" style="animation-delay:${i*35}ms"`)).join('')}
</div></div></div>
<div>
<h2 class="sec-title-16" style="margin-bottom:var(--s8)">What the data shows</h2>
<div class="card pad cd-notes">${c.notes.map(n=>`<div class="cd-note">
<span class="cd-bullet">${I('lightbulb')}</span><p>${E(n)}</p></div>`).join('')}</div>
</div></div>`};};


/* ---------- Profile ---------- */
const PERMS=[['Recommendations','Review, approve and reject','allowed'],
 ['Dashboards','Read-only across all five boards','allowed'],
 ['Pricing rules','Configure guardrails and floors','denied'],
 ['Reports','Schedule and export','denied'],
 ['Admin','User and role management','denied']];
const PREFS=[['Critical alerts','Stale data, feed failures, breached guardrails',1],
 ['Competitor movements','Price cuts above 5% in tracked categories',1],
 ['Cycle summaries','Digest when a repricing cycle completes',1],
 ['Model updates','New engine versions and reason codes',0],
 ['Weekly report','Every Monday at 08:00 GST',0]];
const DEVICES=[['laptop','MacBook Pro · Chrome','Dubai, UAE · current session','Active now',1],
 ['device-mobile','iPhone 15 · Safari','Dubai, UAE','2 hours ago',0],
 ['desktop-tower','Windows · Edge','Abu Dhabi, UAE','Aug 04, 09:12',0]];

S.profile=()=>({sec:null,page:'Profile',w:1060,html:`
<div class="pf-hero card">
<span class="pf-avatar">AK</span>
<div class="grow">
<h1 class="page-title">Aisha Al-Khayyat</h1>
<p class="page-sub">Finance · Senior Analyst · Pricing governance</p>
<div class="pf-tags">
<span class="chip-sm">aisha.alkhayyat@eand.com</span>
<span class="chip-sm">Employee ID 40 128</span>
<span class="chip-sm">Dubai, GST +4</span></div>
</div>
<div class="row" style="gap:8px;align-self:flex-start">
<button class="btn" data-toast="Profile editor opened">${I('pencil-simple')} Edit profile</button>
<button class="btn" data-toast="Signed out">${I('sign-out')} Sign out</button></div>
</div>

<div class="kpi-row">
${kpi('Decisions this cycle','42','+18','up',0)}
${kpi('Approval rate','88.1%','+1.4pp','up',0,'pos')}
${kpi('Avg review time','2m 14s','-22s','up',0)}
${kpi('Overrides used','3','-1','up',0)}
</div>

<div class="pf-cols">
<div class="pf-col">
<div class="card pad">
<h2 class="sec-title" style="margin-bottom:var(--s12)">Personal details</h2>
<div class="pf-fields">
<label><span class="field-label">Full name</span><input class="input" value="Aisha Al-Khayyat"/></label>
<label><span class="field-label">Job title</span><input class="input" value="Senior Analyst"/></label>
<label><span class="field-label">Department</span><input class="input" value="Finance"/></label>
<label><span class="field-label">Work email</span><input class="input" value="aisha.alkhayyat@eand.com"/></label>
<label><span class="field-label">Time zone</span>
<select class="select"><option>Gulf Standard Time (GST, +4)</option><option>UTC</option></select></label>
<label><span class="field-label">Language</span>
<select class="select"><option>English</option><option>العربية — not in scope this phase</option></select></label>
</div>
<div class="row" style="justify-content:flex-end;margin-top:var(--s16)">
<button class="btn btn-primary" data-toast="Profile details saved">Save changes</button></div>
</div>

<div class="card pad">
<h2 class="sec-title" style="margin-bottom:var(--s4)">Notification preferences</h2>
<p class="sec-sub" style="margin-bottom:var(--s12)">Applies to the bell in the top bar and to email digests.</p>
${PREFS.map(([t,s,on])=>`<label class="pf-toggle-row">
<span class="grow"><span class="pf-toggle-t">${E(t)}</span><span class="pf-toggle-s">${E(s)}</span></span>
<span class="switch"><input type="checkbox" ${on?'checked':''}/><span class="switch-track"></span></span></label>`).join('')}
</div>
</div>

<div class="pf-col">
<div class="card pad">
<h2 class="sec-title" style="margin-bottom:var(--s4)">Role and permissions</h2>
<p class="sec-sub" style="margin-bottom:var(--s12)">Granted by the DLA governance matrix. Contact Admin to change.</p>
${PERMS.map(([t,s,st])=>`<div class="pf-perm">
<span class="pf-perm-ic ${st}">${I(st==='allowed'?'check':'lock-simple')}</span>
<span class="grow"><span class="pf-toggle-t">${E(t)}</span><span class="pf-toggle-s">${E(s)}</span></span>
<span class="badge ${st==='allowed'?'badge-approved':'badge-neutral'}">${st==='allowed'?'Allowed':'No access'}</span>
</div>`).join('')}
</div>

<div class="card pad">
<h2 class="sec-title" style="margin-bottom:var(--s12)">Active sessions</h2>
${DEVICES.map(([ic,t,s,when,cur])=>`<div class="pf-perm">
<span class="pf-perm-ic ${cur?'allowed':''}">${I(ic)}</span>
<span class="grow"><span class="pf-toggle-t">${E(t)}</span><span class="pf-toggle-s">${E(s)}</span></span>
<span class="pf-when tnum">${E(when)}</span>
${cur?'':`<button class="pf-revoke" data-toast="Session revoked">Revoke</button>`}</div>`).join('')}
<div class="row" style="justify-content:flex-end;margin-top:var(--s12)">
<button class="btn" data-toast="All other sessions signed out">Sign out everywhere else</button></div>
</div>
</div>
</div>`});

S.rules=()=>({sec:null,page:'Rules',w:892,html:`
<div class="card pad" style="text-align:center;padding:var(--s48)">
<h1 class="page-title" style="margin-bottom:var(--s8)">Pricing rules</h1>
<p class="page-sub" style="max-width:440px;margin:0 auto var(--s16)">Guardrails, floors and ceilings live here.
The Finance role has read-only access this cycle.</p>
<button class="btn" data-go="home">Back to home</button></div>`});


/* ---------- Notifications drawer ---------- */
function openNotif(){
  const d=$('#notifDrawer');
  if(!d.dataset.b){
    d.innerHTML=`<div class="nd-head">
<div><h2 class="nd-title">Notifications</h2><p class="nd-sub tnum">3 unread · 7 total</p></div>
<div class="row" style="gap:8px">
<button class="btn" data-toast="All notifications marked as read">${I('checks')} Mark all read</button>
<button class="icon-sq" id="notifClose" aria-label="Close">${I('x')}</button></div></div>
<div class="nd-tabs" data-seg2>
<button class="nd-tab is-active">All</button><button class="nd-tab">Critical</button>
<button class="nd-tab">Warnings</button><button class="nd-tab">Updates</button></div>
<div class="nd-body">${NOTIF.map(([grp,items])=>`
<div class="nd-group"><div class="nd-group-label">${grp}</div>
${items.map(([sev,ic,title,body,time,unread],i)=>`
<article class="nd-item ${sev} ${unread?'is-unread':''}" style="animation-delay:${60+i*50}ms">
<span class="nd-icon">${I(ic,1)}</span>
<div class="grow"><div class="nd-item-head"><span class="nd-item-title">${E(title)}</span>
${unread?'<span class="nd-dot"></span>':''}</div>
<p class="nd-item-body">${E(body)}</p>
<div class="nd-meta"><span class="nd-time">${time}</span>
<button class="nd-link" data-toast="Opening related screen">View details ${I('arrow-right')}</button></div></div>
</article>`).join('')}</div>`).join('')}</div>
`;
    d.dataset.b='1';
  }
  $('#scrim').classList.add('is-on');
  d.classList.add('is-open');
  document.body.style.overflow='hidden';
}
function closeNotif(){
  $('#scrim').classList.remove('is-on');
  $('#notifDrawer').classList.remove('is-open');
  document.body.style.overflow='';
}


/* ---------- Filter popover ---------- */
const FILTERS=[
 ['Category',[['Smartphones',1],['Accessories',1],['Wearables',0],['Tablets',0],['Laptops',0]]],
 ['Status',[['Pending',1],['Flagged',0],['Approved',0],['Rejected',0]]],
 ['Brand',[['Apple',0],['Samsung',0],['Xiaomi',0],['Google',0]]]];

function filterPanel(){
  return `<div class="fp-head"><span class="fp-title">Filters</span>
<button class="icon-sq sm" data-fp-close aria-label="Close">${I('x')}</button></div>
<div class="fp-body">
${FILTERS.map(([grp,items])=>`<div class="fp-group">
<div class="fp-label">${grp}</div>
${items.map(([n,on])=>`<label class="fp-row">
<input type="checkbox" class="checkbox" ${on?'checked':''}/><span>${E(n)}</span></label>`).join('')}
</div>`).join('')}
<div class="fp-group"><div class="fp-label">Deviation from recommendation</div>
<div class="fp-range">
<div class="slider-block" data-slider data-min="-20" data-max="20">
<div class="slider-head"><span class="slider-name">Minimum Δ%</span>
<span class="pct down tnum" data-out>-8.0%</span></div>
<div class="slider-wrap"><div class="slider-track"><div class="slider-zero" style="left:50%"></div>
<div class="slider-fill" data-fill></div></div>
<input class="slider-input" type="range" min="-20" max="20" step="0.5" value="-8" aria-label="Minimum deviation"/>
</div></div></div></div>
<div class="fp-group"><div class="fp-label">Cycle</div>
<div class="segmented" data-seg style="width:100%">
<button class="is-active" style="flex:1">Current</button><button style="flex:1">Previous</button>
<button style="flex:1">All</button></div></div>
</div>
<div class="fp-foot">
<button class="btn" data-fp-reset>Reset</button>
<button class="btn btn-primary grow" data-fp-apply>Apply filters</button></div>`;
}
function openFilters(anchor){
  const p=$('#filterPop');
  if(!p.dataset.b){ p.innerHTML=filterPanel(); p.dataset.b='1'; $$('[data-slider]',p).forEach(initSlider); }
  p.style.maxHeight='';                       // measure at natural height first
  p.classList.add('is-measuring');
  const r=anchor.getBoundingClientRect();
  const vh=window.innerHeight, vw=window.innerWidth, M=16, W=340;
  const h=Math.min(p.scrollHeight, vh-M*2);
  const below=vh-r.bottom-M, above=r.top-M;
  const flip=below<h&&above>below;             // open upwards when that gives more room
  const avail=flip?above:below;
  p.style.maxHeight=Math.min(h,avail)+'px';
  p.style.left=Math.max(M,Math.min(r.right-W,vw-W-M))+'px';
  p.style.top=flip?'':(r.bottom+8)+'px';
  p.style.bottom=flip?(vh-r.top+8)+'px':'';
  p.classList.toggle('is-flipped',flip);
  p.classList.remove('is-measuring');
  p.classList.add('is-open');
  $('#popScrim').classList.add('is-on');
}
function closeFilters(){ $('#filterPop').classList.remove('is-open'); $('#popScrim').classList.remove('is-on'); }

/* ---------- Global search (top navigation) ---------- */
const SEARCH=[
 ['Recent',[['clock-counter-clockwise','iPhone 15 Pro 256GB','SKU-114872','detail'],
            ['clock-counter-clockwise','Competitor intelligence','Dashboard','c2']]],
 ['SKUs',[['device-mobile','iPhone 15 Pro 256GB','Smartphones · AED 3,749','detail'],
          ['device-mobile','Samsung Galaxy S24','Smartphones · AED 3,299','detail'],
          ['headphones','AirPods Pro 2','Accessories · AED 929','detail'],
          ['device-tablet','iPad Air 11 256GB','Tablets · AED 2,399','detail']]],
 ['Dashboards',[['chart-line','Pricing performance','Deviation, volume and revenue','c1'],
                ['chart-line','Forecast accuracy','MAPE and bias metrics','c3'],
                ['chart-line','Revenue impact','Cumulative uplift vs baseline','c4']]],
 ['Actions',[['list-checks','Review recommendations queue','128 pending','queue'],
             ['flask','Run scenario simulation','What-if simulator','sim'],
             ['clock-counter-clockwise','Open decision history','Full audit log','history'],
             ['chats','Ask the AI analyst','LLM / RAG analyst','chat']]]];

function searchMarkup(q){
  const t=q.trim().toLowerCase();
  const groups=SEARCH.map(([g,items])=>[g,items.filter(([,l,m])=>!t||l.toLowerCase().includes(t)||m.toLowerCase().includes(t))])
    .filter(([,items])=>items.length);
  if(!groups.length) return `<div class="sr-empty">${I('magnifying-glass')}<p>Nothing matches “${E(q)}”</p>
<span>Try a SKU code, a category or a dashboard name</span></div>`;
  let idx=-1;
  return groups.map(([g,items])=>`<div class="sr-group"><div class="sr-label">${g}</div>
${items.map(([ic,l,m,go])=>{idx++;return `<button class="sr-item${idx===0?' is-active':''}" data-go="${go}" data-i="${idx}">
<span class="sr-icon">${I(ic)}</span>
<span class="grow"><span class="sr-title">${E(l)}</span><span class="sr-meta">${E(m)}</span></span>
<span class="sr-enter">${I('arrow-elbow-down-left')}</span></button>`;}).join('')}</div>`).join('');
}
function openSearch(){
  const o=$('#searchOverlay');
  if(!o.dataset.b){
    o.innerHTML=`<div class="sr-panel" role="dialog" aria-label="Search">
<div class="sr-field">${I('magnifying-glass')}
<input id="srInput" type="search" placeholder="Search SKUs, dashboards or actions" aria-label="Search" autocomplete="off"/>
<kbd class="sr-kbd">Esc</kbd></div>
<div class="sr-results" id="srResults">${searchMarkup('')}</div>
<div class="sr-foot"><span><kbd class="sr-kbd">↑</kbd><kbd class="sr-kbd">↓</kbd> navigate</span>
<span><kbd class="sr-kbd">↵</kbd> open</span><span class="grow"></span>
<span class="tnum">Indexed 2,500 SKUs</span></div></div>`;
    o.dataset.b='1';
    $('#srInput').addEventListener('input',e=>{
      $('#srResults').innerHTML=searchMarkup(e.target.value);});
  }
  o.classList.add('is-open');
  document.body.style.overflow='hidden';
  setTimeout(()=>$('#srInput').focus(),40);
}
function closeSearch(){ $('#searchOverlay').classList.remove('is-open'); document.body.style.overflow=''; }
function moveSearch(dir){
  const items=$$('#srResults .sr-item'); if(!items.length)return;
  let i=items.findIndex(x=>x.classList.contains('is-active'));
  items.forEach(x=>x.classList.remove('is-active'));
  i=(i+dir+items.length)%items.length;
  items[i].classList.add('is-active');
  items[i].scrollIntoView({block:'nearest'});
}

/* ---------- router ---------- */
const hist=[];
function render(r){
  if(!S[r]){
    if(r&&r!=='home'){renderMissing(r);return;}
    r='home';
  }
  const s=S[r]();
  $('#breadcrumb').innerHTML=s.sec
    ?`<span class="crumb-section">${E(s.sec)}</span><span class="crumb-sep">${I('caret-right')}</span><span class="crumb-page">${E(s.page)}</span>`
    :`<span class="crumb-page">${E(s.page)}</span>`;
  const na=['c1','c2','c3','c4','c5'].includes(r)?'c1':['queue','detail','sim'].includes(r)?'queue':r;
  $$('#navGroup .nav-item').forEach(n=>n.classList.toggle('is-active',n.dataset.go===na));
  const sb_=$('#chatSb');
  sb_.hidden=!s.chatSb;
  if(s.chatSb&&!sb_.dataset.b){
    sb_.innerHTML=`<div class="sb-head"><div class="sb-title-row"><h2 class="sb-h">Chat history</h2>
<button class="btn-new" data-toast="New conversation started">${I('plus')} New</button></div>
<label class="input-field">${I('magnifying-glass')}<input type="search" placeholder="Search" aria-label="Search"/></label></div>
<div class="sessions" data-convos>${SESS.map(([t,d,su,a])=>
`<button class="session ${a?'is-active':''}"><span class="session-top">
<span class="session-title">${E(t)}</span><span class="session-date tnum">${d}</span></span>
<span class="session-sub">${E(su)}</span></button>`).join('')}</div>`;
    sb_.dataset.b='1';
  }
  const v=$('#view');
  v.style.setProperty('--cmax',s.w+'px');
  v.classList.toggle('is-bottom',!!s.bottom);
  v.innerHTML=s.html;
  v.focus({preventScroll:true});
  scrollTo({top:0,behavior:RM?'auto':'smooth'});
  after(v);
}
function renderMissing(r){
  $('#breadcrumb').innerHTML='<span class="crumb-page">Screen not found</span>';
  $('#chatSb').hidden=true;
  const v=$('#view');
  v.classList.remove('is-bottom');
  v.style.setProperty('--cmax','892px');
  v.innerHTML=`<div class="card pad" style="text-align:center;padding:var(--s48)">
<h1 class="page-title" style="margin-bottom:var(--s8)">Screen “${E(r)}” is not in this build</h1>
<p class="page-sub" style="max-width:520px;margin:0 auto var(--s16)">
Build <strong class="tnum">${BUILD}</strong> does not contain this route. If you expected it, the browser is
serving a cached <code>app.js</code> — reload with cache disabled, or bump the <code>?v=</code> query.</p>
<div class="row" style="justify-content:center;gap:8px">
<button class="btn btn-primary" data-go="home">Go to Home</button>
<button class="btn" id="hardReload">Reload without cache</button></div></div>`;
  $('#hardReload').addEventListener('click',()=>location.reload(true));
}

function after(root){
  $$('[data-count]',root).forEach((el,i)=>setTimeout(()=>count(el),120+i*70));
  $$('[data-prog]',root).forEach((el,i)=>setTimeout(()=>el.style.width=el.dataset.prog+'%',200+i*200));
  $$('[data-fill]',root).forEach((el,i)=>{if(el.closest('[data-slider]'))return;
    setTimeout(()=>el.style.width=Math.min(100,+el.dataset.fill*1.6)+'%',260+i*70);});
  $$('[data-slider]',root).forEach(initSlider);
  labelCells(root);
}

/* on narrow screens each table row stacks; cells need their column name */
function labelCells(root){
  $$('.tbl',root).forEach(tbl=>{
    const head=$('.trow.head',tbl); if(!head)return;
    const names=[...head.children].map(c=>c.textContent.trim());
    $$('.trow.body',tbl).forEach(row=>{
      [...row.children].forEach((cell,i)=>{ if(names[i])cell.setAttribute('data-label',names[i]); });
    });
  });
}
function count(el){
  const raw=el.dataset.v,m=raw.match(/-?[\d.,]+/);
  if(!m||RM){el.textContent=raw;return;}
  const tg=parseFloat(m[0].replace(/,/g,'')),pre=raw.slice(0,m.index),suf=raw.slice(m.index+m[0].length);
  const dec=(m[0].split('.')[1]||'').length,t0=performance.now();
  const step=now=>{const p=Math.min(1,(now-t0)/850),v=tg*(1-Math.pow(1-p,3));
    el.textContent=pre+v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;
    if(p<1)requestAnimationFrame(step);else el.textContent=raw;};
  requestAnimationFrame(step);
}
function initSlider(b){
  const inp=$('.slider-input',b),f=$('[data-fill]',b),o=$('[data-out]',b);
  const mn=+b.dataset.min,mx=+b.dataset.max,pos=v=>((v-mn)/(mx-mn))*100;
  const paint=()=>{const v=+inp.value,z=pos(0),n=pos(v);
    f.style.left=Math.min(z,n)+'%';f.style.width=Math.abs(n-z)+'%';
    f.style.background=v<0?'var(--bad)':v>0?'var(--ok)':'var(--n40)';
    o.textContent=(v>0?'+':'')+v.toFixed(1)+'%';o.className='pct '+pc(v)+' tnum';};
  inp.addEventListener('input',paint);paint();
}
function toast(m){
  const el=document.createElement('div');el.className='toast';
  el.innerHTML=`${I('check-circle',1)}<span>${E(m)}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(()=>{el.classList.add('leaving');setTimeout(()=>el.remove(),220);},2600);
}

$('#navGroup').innerHTML=NAV.map(n=>`<button class="nav-item ${n.d?'is-disabled':''}" data-go="${n.id}" ${n.d?'disabled':''}>
<span class="nav-icon">${I(n.i)}</span><span class="nav-label">${n.l}</span></button>`).join('');

document.addEventListener('click',e=>{
  const p=e.target.closest('[data-press]');
  if(p){p.classList.add('pressed');setTimeout(()=>p.classList.remove('pressed'),80);}
  const g=e.target.closest('[data-go]');
  if(g&&!g.disabled){e.preventDefault();hist.push(location.hash);location.hash='#/'+g.dataset.go;
    if($('#app').classList.contains('nav-open')){$('#app').classList.remove('nav-open');
      $('#navToggle').setAttribute('aria-expanded','false');document.body.style.overflow='';}
    return;}
  const cd=e.target.closest('[data-chartd]');
  if(cd){chartKey=cd.dataset.chartd;hist.push(location.hash);location.hash='#/chartd';return;}
  if(e.target.closest('[data-notif]')){openNotif();return;}
  if(e.target.closest('[data-filters]')){openFilters(e.target.closest('[data-filters]'));return;}
  if(e.target.closest('[data-fp-close]')){closeFilters();return;}
  if(e.target.closest('[data-fp-apply]')){closeFilters();toast('Filters applied');return;}
  if(e.target.closest('[data-fp-reset]')){
    $$('#filterPop input[type=checkbox]').forEach(c=>c.checked=false);toast('Filters reset');return;}
  if(e.target.closest('#searchBtn')){openSearch();return;}
  if(e.target.closest('.sr-item')){closeSearch();}
  if(e.target.closest('#notifClose')){closeNotif();return;}
  const nt=e.target.closest('[data-seg2] .nd-tab');
  if(nt){$$('[data-seg2] .nd-tab').forEach(b=>b.classList.remove('is-active'));nt.classList.add('is-active');return;}
  const t=e.target.closest('[data-toast]');if(t){toast(t.dataset.toast);return;}
  const cx=e.target.closest('[data-chips] .chip button');
  if(cx){const c=cx.closest('.chip');c.classList.add('removing');setTimeout(()=>c.remove(),200);return;}
  const lp=e.target.closest('[data-legend] .legend-item,[data-legend] .legend-pill');
  if(lp){const on=lp.classList.toggle('is-on');
    $$(`[data-s="${lp.dataset.t}"]`,lp.closest('[data-chart]')).forEach(n=>n.classList.toggle('series-hidden',!on));return;}
  const sg=e.target.closest('[data-seg] button');
  if(sg){$$('button',sg.parentElement).forEach(b=>b.classList.remove('is-active'));sg.classList.add('is-active');return;}
  const cv=e.target.closest('[data-convos] .session');
  if(cv){$$('[data-convos] .session').forEach(c=>c.classList.remove('is-active'));cv.classList.add('is-active');return;}
  const bk=e.target.closest('[data-bulk]');
  if(bk){const n=$$('[data-row]:checked').length;
    toast(n?`${n} recommendation${n>1?'s':''} ${bk.dataset.bulk==='approve'?'approved':'rejected'}`:'Select at least one row first');return;}
  const pr=e.target.closest('[data-prompt]');if(pr){send(pr.textContent.trim());return;}
  const dy=e.target.closest('.cycle-day .item-day');
  if(dy){$$('.cycle-day').forEach(d=>d.classList.remove('today'));dy.closest('.cycle-day').classList.add('today');return;}
});
document.addEventListener('change',e=>{
  if(e.target.matches('[data-all]'))$$('[data-row]').forEach(c=>c.checked=e.target.checked);});
document.addEventListener('submit',e=>{
  if(!e.target.matches('[data-composer]'))return;e.preventDefault();
  const i=$('input',e.target),t=i.value.trim();if(!t)return;i.value='';send(t);});
function send(text){
  const th=$('[data-thread]');if(!th){location.hash='#/chat';return;}
  const now=new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
  const r=document.createElement('div');r.className='msg-row user';
  r.innerHTML=`<div class="msg user"><div>${E(text)}</div><div class="msg-time tnum">${now}</div></div>`;
  th.appendChild(r);
  const ty=document.createElement('div');ty.className='msg-row bot';
  ty.innerHTML='<div class="msg bot"><span class="typing"><span></span><span></span><span></span></span></div>';
  th.appendChild(ty);ty.scrollIntoView({block:'end',behavior:RM?'auto':'smooth'});
  setTimeout(()=>{ty.remove();
    const b=document.createElement('div');b.className='msg-row bot';
    b.innerHTML=`<div class="msg bot"><p>Pulling that from the pricing data platform for cycle Aug 05–11.
The strongest signal is competitor movement in Smartphones, which drove 46% of this week's recommendations.</p>
<div class="msg-src">Source: Pricing Data Platform · generated from indexed cycle data</div></div>`;
    th.appendChild(b);b.scrollIntoView({block:'end',behavior:RM?'auto':'smooth'});},RM?0:1100);
}
$('#collapseBtn').addEventListener('click',()=>$('#app').classList.toggle('is-collapsed'));
const navToggle=()=>{const a=$('#app');const on=a.classList.toggle('nav-open');
  $('#navToggle').setAttribute('aria-expanded',on?'true':'false');
  document.body.style.overflow=on?'hidden':'';};
$('#navToggle').addEventListener('click',navToggle);
$('#navScrim').addEventListener('click',navToggle);
$('#backBtn').addEventListener('click',()=>{if(hist.length)location.hash=hist.pop();else history.back();});
$('#bellBtn').addEventListener('click',()=>{const d=$('#bellDot');
  d.classList.remove('is-pulsing');void d.offsetWidth;d.classList.add('is-pulsing');openNotif();});
$('#scrim').addEventListener('click',closeNotif);
addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeNotif();closeFilters();closeSearch();}
  if((e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey)){e.preventDefault();openSearch();}
  if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){e.preventDefault();openSearch();}
  if($('#searchOverlay').classList.contains('is-open')){
    if(e.key==='ArrowDown'){e.preventDefault();moveSearch(1);}
    if(e.key==='ArrowUp'){e.preventDefault();moveSearch(-1);}
    if(e.key==='Enter'){const a=$('#srResults .sr-item.is-active');if(a){closeSearch();location.hash='#/'+a.dataset.go;}}
  }});
$('#popScrim').addEventListener('click',closeFilters);
$('#searchOverlay').addEventListener('click',e=>{if(e.target.id==='searchOverlay')closeSearch();});
setInterval(()=>{const d=$('#bellDot');d.classList.remove('is-pulsing');void d.offsetWidth;d.classList.add('is-pulsing');},12000);
addEventListener('hashchange',()=>render(location.hash.replace(/^#\/?/,'')||'home'));
render(location.hash.replace(/^#\/?/,'')||'home');
