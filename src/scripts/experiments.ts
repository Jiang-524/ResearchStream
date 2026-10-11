import type { Curve } from './experiment-chart';
import { parseCsv, metricPoints, curveKey, comparisonGroup } from '../lib/experiment-data.mjs';

const root=document.querySelector<HTMLElement>('[data-experiment-results]');
if(root) {
  const element=root;
  const select=(name:string)=>element.querySelector<HTMLSelectElement>(`[data-source-${name}]`)!;
  const projectSelect=select('project'),runSelect=select('run'),csvSelect=select('csv'),metricSelect=select('metric');
  const search=element.querySelector<HTMLInputElement>('[data-source-search]')!;
  const add=element.querySelector<HTMLButtonElement>('[data-add-curve]')!;
  const status=element.querySelector<HTMLElement>('[data-comparison-status]')!;
  const selected=element.querySelector<HTMLElement>('[data-selected-curves]')!;
  const smoothing=element.querySelector<HTMLInputElement>('[data-smoothing]')!;
  const showRaw=element.querySelector<HTMLInputElement>('[data-show-raw]')!;
  const panelsContainer=element.querySelector<HTMLElement>('[data-chart-panels]')!;
  const page=document.querySelector<HTMLElement>('[data-experiment-page]')!;
  const notes=document.querySelector<HTMLElement>('[data-experiment-notes]')!;
  const tabs=[...document.querySelectorAll<HTMLAnchorElement>('[data-experiment-tab]')];
  const curves=new Map<string,Curve>();
  const panels=new Map<string,ReturnType<typeof import('./experiment-chart').createChartPanel>>();
  const csvCache=new Map<string,Promise<ReturnType<typeof parseCsv>>>();
  const pending=new Set<string>();let selectionEpoch=0;
  let projects:any[]=[],initialized:Promise<void>|undefined,chartModule:typeof import('./experiment-chart');
  const colors=['#c8763f','#4f89a1','#84964b','#a071ab','#d4a343','#bb6475','#548f78'];
  const curveColors=new Map<string,string>();
  const text=(en:string,zh:string)=>document.documentElement.dataset.lang==='en'?en:zh;
  const number=(value:number,size=3)=>String(value).padStart(size,'0');
  const chosen=()=>{
    const project=projects.find(p=>p.id===projectSelect.value),run=project?.experiments.find((r:any)=>r.id===runSelect.value),csv=run?.csvs.find((c:any)=>c.id===csvSelect.value),metric=csv?.metrics.find((m:any)=>m.id===metricSelect.value);
    return {project,run,csv,metric};
  };
  const projectLabel=(p:any)=>`${p.title}${projects.filter(other=>other.title===p.title).length>1?` [${p.id}]`:''}`;
  const label=(p:any,r:any,c:any,m:any)=>`${projectLabel(p)} · ${text('Run','实验')} ${number(r.number)}「${r.title}」 · CSV ${number(c.number,2)}「${c.title}」 · ${m.label}`;
  function fill(target:HTMLSelectElement,items:any[],name:(item:any)=>string) {
    const old=target.value;target.replaceChildren(...items.map(item=>new Option(name(item),item.id)));
    if(items.some(item=>item.id===old))target.value=old;
    target.disabled=items.length===0;
  }
  function matches(p:any,r?:any,c?:any,m?:any) {
    const words=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const haystack=[p.title,p.id,r?.title,r?.id,r&&number(r.number),c?.title,c?.id,c&&number(c.number,2),m?.label,m?.id].join(' ').toLocaleLowerCase();
    return words.every(word=>haystack.includes(word));
  }
  const matchingMetrics=(p:any,r:any,c:any)=>c.metrics.filter((m:any)=>matches(p,r,c,m));
  const matchingCsvs=(p:any,r:any)=>r.csvs.filter((c:any)=>matchingMetrics(p,r,c).length);
  const matchingRuns=(p:any)=>p.experiments.filter((r:any)=>matchingCsvs(p,r).length);
  function populate(level=0) {
    if(level===0)fill(projectSelect,projects.filter(p=>matchingRuns(p).length),p=>projectLabel(p)+(p.demo?text(' [demo]',' [示例]'):''));
    let {project,run,csv}=chosen();
    if(level<=1)fill(runSelect,project?matchingRuns(project):[],r=>`${number(r.number)} · ${r.title}`);
    ({project,run}=chosen());
    if(level<=2)fill(csvSelect,run?matchingCsvs(project,run):[],c=>`CSV ${number(c.number,2)} · ${c.title}`);
    ({project,run,csv}=chosen());
    fill(metricSelect,csv?matchingMetrics(project,run,csv):[],m=>m.label+(m.unit?` (${m.unit})`:''));
    add.disabled=!chosen().metric;
  }
  function report(message:string,error=false){status.textContent=message;status.classList.toggle('error',error);}
  function draw() {
    if(!chartModule)return;
    const groups=new Map<string,Curve[]>();
    for(const curve of curves.values()){const key=comparisonGroup(curve.csv,curve.metric);groups.set(key,[...(groups.get(key)||[]),curve]);}
    for(const [key,panel] of panels)if(!groups.has(key)){panel.dispose();panels.delete(key);}
    for(const [key,group] of groups){if(!panels.has(key))panels.set(key,chartModule.createChartPanel(panelsContainer));panels.get(key)!.update(group,Number(smoothing.value),showRaw.checked);}
    report(curves.size?text(`${curves.size} curves · ${groups.size} axis group(s).`,`${curves.size} 条曲线 · ${groups.size} 组坐标。`):text('Choose a CSV and metric to add a curve.','选择 CSV 和指标，添加要比较的曲线。'));
  }
  function renderSelection() {
    selected.replaceChildren(...[...curves.values()].map(curve=>{
      const row=document.createElement('div');row.className='curve-chip';
      const swatch=document.createElement('span');swatch.className='curve-swatch';swatch.style.background=curve.color;
      const toggle=document.createElement('input');toggle.type='checkbox';toggle.checked=curve.visible;toggle.setAttribute('aria-label',text('Show curve: ','显示曲线：')+curve.name);toggle.addEventListener('change',()=>{curve.visible=toggle.checked;draw();});
      const caption=document.createElement('span');caption.className='curve-label';caption.textContent=curve.name;
      const note=document.createElement('small');note.textContent=`X: ${curve.csv.x.label} · Y: ${curve.metric.label} · ${curve.points.length} ${text('points','个点')}`;caption.append(note);
      const download=document.createElement('a');download.href=curve.csv.url;download.download='';download.textContent='CSV ↓';download.setAttribute('aria-label',text('Download ','下载 ')+curve.name);
      const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.setAttribute('aria-label',text('Remove ','移除 ')+curve.name);remove.addEventListener('click',()=>{curves.delete(curve.key);renderSelection();draw();});
      row.append(swatch,toggle,caption,download,remove);return row;
    }));
  }
  async function addCurve(project:any,run:any,csv:any,metric:any) {
    if(!metric)return;const key=curveKey(project,run,csv,metric);if(curves.has(key)||pending.has(key))return;
    const epoch=selectionEpoch;pending.add(key);report(text('Loading CSV…','正在加载 CSV…'));
    try {
      chartModule ||= await import('./experiment-chart');
      const cacheAfterReady=import.meta.env.PROD && 'serviceWorker' in navigator && !navigator.serviceWorker.controller;
      if(!csvCache.has(csv.url))csvCache.set(csv.url,fetch(csv.url).then(async response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return parseCsv(await response.text(),csv);}).catch(error=>{csvCache.delete(csv.url);throw error;}));
      const parsed=await csvCache.get(csv.url)!;
      if(cacheAfterReady)void navigator.serviceWorker.ready.then(registration=>registration.active?.postMessage({type:'CACHE_READING',urls:[csv.url]}));
      if(epoch!==selectionEpoch)return;
      const data=metricPoints(parsed,csv,metric);
      let hash=0;for(const char of key)hash=(hash*31+char.charCodeAt(0))>>>0;
      if(!curveColors.has(key)){const used=new Set(curveColors.values());const available=colors.map((_,i)=>colors[(hash+i)%colors.length]).find(color=>!used.has(color));curveColors.set(key,available||`hsl(${(curveColors.size*137.508)%360} 55% 55%)`);}
      curves.set(key,{key,name:label(project,run,csv,metric),color:curveColors.get(key)!,csv,metric,visible:true,...data});
      renderSelection();draw();
    }catch(error){if(epoch===selectionEpoch)report(`${project.title} / ${run.title} / ${csv.title}: ${(error as Error).message}`,true);}
    finally {pending.delete(key);}
  }
  function init() {
    if(!initialized)initialized=(async()=>{
      const epoch=selectionEpoch;
      try{
        const response=await fetch(`${document.body.dataset.base}experiments.json`);if(!response.ok)throw new Error(`HTTP ${response.status}`);projects=await response.json();
        populate();projectSelect.value=element.dataset.project||'';populate(1);
        const project=projects.find(p=>p.id===element.dataset.project);
        for(const run of project?.experiments.slice(0,2)||[]){if(epoch!==selectionEpoch)break;const csv=run.csvs[0];if(csv)await addCurve(project,run,csv,csv.metrics[0]);}
        if(!curves.size)report(text('Choose sources to compare.','选择数据源以开始对比。'));
      }catch(error){report(text('Cannot load sources: ','无法加载数据源：')+(error as Error).message,true);initialized=undefined;}
    })();
    return initialized;
  }
  async function activate() {
    const results=location.hash==='#results'||location.hash==='#compare'||location.hash.startsWith('#run-');
    element.hidden=!results;notes.hidden=results;page.classList.toggle('results-open',results);
    tabs.forEach(tab=>{const active=(tab.dataset.experimentTab==='results')===results;tab.setAttribute('aria-selected',String(active));tab.setAttribute('role','tab');tab.setAttribute('aria-controls',tab.dataset.experimentTab!);});
    if(results){await init();panels.forEach(panel=>panel.resize());}
  }
  projectSelect.addEventListener('change',()=>populate(1));runSelect.addEventListener('change',()=>populate(2));csvSelect.addEventListener('change',()=>populate(3));
  search.addEventListener('input',()=>populate());add.addEventListener('click',()=>{const {project,run,csv,metric}=chosen();void addCurve(project,run,csv,metric);});
  smoothing.addEventListener('input',()=>{element.querySelector('output')!.value=Number(smoothing.value).toFixed(2);draw();});showRaw.addEventListener('change',draw);
  element.querySelector('[data-reset-zoom]')!.addEventListener('click',()=>panels.forEach(panel=>panel.reset()));
  element.querySelector('[data-clear-curves]')!.addEventListener('click',()=>{selectionEpoch++;curves.clear();renderSelection();draw();});
  element.querySelectorAll<HTMLButtonElement>('[data-compare-run]').forEach(button=>button.addEventListener('click',async()=>{
    location.hash='compare';await init();const project=projects.find(p=>p.id===element.dataset.project),run=project?.experiments.find((r:any)=>r.id===button.dataset.compareRun),csv=run?.csvs.find((c:any)=>c.id===button.dataset.compareCsv);
    if(csv){search.value='';populate();projectSelect.value=project.id;populate(1);runSelect.value=run.id;populate(2);csvSelect.value=csv.id;populate(3);await addCurve(project,run,csv,csv.metrics[0]);}
  }));
  tabs.forEach((tab,index)=>{tab.id=`experiment-tab-${index}`;tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=tabs[event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+1)%tabs.length];next.focus();next.click();}});});
  notes.setAttribute('aria-labelledby',tabs[0].id);element.setAttribute('aria-labelledby',tabs[1].id);
  tabs[0]?.parentElement?.setAttribute('role','tablist');notes.setAttribute('role','tabpanel');element.setAttribute('role','tabpanel');
  addEventListener('hashchange',()=>void activate());void activate();
  document.addEventListener('languagechange',()=>{
    if(projects.length)populate();
    for(const curve of curves.values()){const [projectId,runId]=JSON.parse(curve.key);const project=projects.find(p=>p.id===projectId),run=project.experiments.find((r:any)=>r.id===runId);curve.name=label(project,run,curve.csv,curve.metric);}
    renderSelection();draw();
  });
  new MutationObserver(()=>{if(!element.hidden)draw();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
}
