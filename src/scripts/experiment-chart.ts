import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, ToolboxComponent, AriaComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { smoothPoints } from '../lib/experiment-data.mjs';

echarts.use([LineChart,GridComponent,TooltipComponent,LegendComponent,DataZoomComponent,ToolboxComponent,AriaComponent,CanvasRenderer]);
export interface Curve {
  key: string; name: string; color: string; csv: any; metric: any;
  points: (number | null)[][]; visible: boolean; skippedX: number; missingY: number;
}
const t = (en:string,zh:string) => document.documentElement.dataset.lang==='en'?en:zh;
const axisLabel = (axis:any) => axis.label + (axis.unit ? ` (${axis.unit})` : '');

export function createChartPanel(container:HTMLElement) {
  const panel=document.createElement('section');panel.className='chart-panel';
  const header=document.createElement('div');header.className='chart-panel-header';
  const titleBox=document.createElement('div'),title=document.createElement('h3'),subtitle=document.createElement('small');titleBox.append(title,subtitle);
  const actions=document.createElement('div');actions.className='chart-panel-actions';
  const expand=document.createElement('button'),save=document.createElement('button'),download=document.createElement('a');expand.type=save.type='button';download.hidden=true;download.download='experiment-comparison.png';actions.append(expand,save,download);header.append(titleBox,actions);
  const host=document.createElement('div');host.className='experiment-chart';host.setAttribute('role','img');host.tabIndex=0;
  const sources=document.createElement('div');sources.className='chart-sources';
  const warning=document.createElement('p');warning.className='chart-warning';
  panel.append(header,host,sources,warning);container.append(panel);
  const chart=echarts.init(host,undefined,{renderer:'canvas'});
  const observer=new ResizeObserver(()=>chart.resize());observer.observe(host);
  let current:Curve[]=[],weight=0,exportUrl='';
  function update(curves:Curve[],smoothing:number,showRaw:boolean) {
    current=curves;weight=smoothing;
    download.hidden=true;
    const first=curves[0], dark=document.documentElement.dataset.theme==='dark';
    const ink=dark?'#eee8e0':'#37303a',muted=dark?'#a69d93':'#77717a',border=dark?'#3a3430':'#eee8df';
    title.textContent=axisLabel(first.metric);subtitle.textContent=`X: ${axisLabel(first.csv.x)} · ${curves.length} ${t('curves','条曲线')}`;
    expand.textContent=panel.classList.contains('expanded')?t('Close','收起'):t('Expand','放大');save.textContent=t('Export PNG','导出 PNG');
    host.setAttribute('aria-label',`${title.textContent}; ${curves.map(c=>c.name).join('; ')}`);
    sources.replaceChildren(...curves.map(curve=>{const p=document.createElement('p');p.textContent=curve.name;return p;}));
    const missing=curves.reduce((n,c)=>n+c.skippedX+c.missingY,0);
    warning.textContent=missing?t(`${missing} invalid or missing values are omitted / shown as gaps.`,`${missing} 个无效或缺失值已跳过或显示为断点。`):'';
    if(curves.some(c=>c.points.length>10000 && !c.missingY))warning.textContent+=' '+t('Dense curves show per-pixel extrema; smoothing and CSV downloads retain all points.','密集曲线按像素保留极值显示；平滑计算和 CSV 下载保留全部原始点。');
    const zoom=(chart.getOption() as any)?.dataZoom?.[0];
    const series:any[]=[];
    for(const curve of curves.filter(c=>c.visible)) {
      // Avoid sampling gaps: a missing value must remain a visible break.
      const sampling=curve.points.length>10000 && !curve.missingY?'minmax':'none';
      if(smoothing>0 && showRaw) series.push({id:curve.key+':raw',name:curve.key,type:'line',sampling,data:curve.points,lineStyle:{color:curve.color,opacity:.2,width:1},itemStyle:{color:curve.color},showSymbol:false,connectNulls:false,silent:false});
      const values:(number|null)[][]=smoothing?smoothPoints(curve.points,smoothing):curve.points;
      series.push({id:curve.key,name:curve.key,type:'line',sampling,data:values.map((point,i)=>[point[0],point[1],curve.points[i][1]]),encode:{x:0,y:1},lineStyle:{color:curve.color,width:2},itemStyle:{color:curve.color},showSymbol:false,connectNulls:false,emphasis:{focus:'series'}});
    }
    chart.setOption({animation:false,aria:{enabled:true,label:{description:host.getAttribute('aria-label')||''}},backgroundColor:'transparent',textStyle:{fontFamily:'Inter, sans-serif',color:ink},
      grid:{top:70,right:25,bottom:82,left:75},
      legend:{type:'scroll',selectedMode:false,formatter:(key:string)=>curves.find(c=>c.key===key)?.name||key,top:5,left:0,right:10,textStyle:{color:muted,fontSize:10},data:curves.filter(c=>c.visible).map(c=>c.key)},
      tooltip:{trigger:'axis',renderMode:'richText',confine:true,backgroundColor:dark?'#24211e':'#fff',borderColor:border,textStyle:{color:ink,fontSize:11},
        formatter:(items:any[])=>items.filter(p=>!String(p.seriesId).endsWith(':raw')).map(p=>`${curves.find(c=>c.key===p.seriesName)?.name}\n${first.csv.x.label}: ${p.value[0]}\n${t('Raw','原始')}: ${p.value[2] ?? '—'}${weight?` · EMA(${weight.toFixed(2)}): ${p.value[1] ?? '—'}`:''}`).join('\n\n')},
      toolbox:{right:8,top:29,iconStyle:{borderColor:muted},feature:{dataZoom:{yAxisIndex:'none',title:{zoom:t('Box zoom','框选缩放'),back:t('Undo zoom','撤销缩放')}},restore:{title:t('Reset','重置')}}},
      xAxis:{type:'value',name:axisLabel(first.csv.x),nameLocation:'middle',nameGap:28,scale:true,axisLabel:{color:muted,fontSize:10},axisLine:{lineStyle:{color:border}},splitLine:{show:false},nameTextStyle:{color:muted,fontSize:11}},
      yAxis:{type:'value',name:axisLabel(first.metric),scale:true,axisLabel:{color:muted,fontSize:10},splitLine:{lineStyle:{color:border}},nameTextStyle:{color:muted,fontSize:11}},
      dataZoom:[{type:'slider',xAxisIndex:0,bottom:8,height:22,start:zoom?.start??0,end:zoom?.end??100,filterMode:'none',borderColor:border,fillerColor:dark?'#69432955':'#e4b08044',textStyle:{color:muted}},{type:'inside',xAxisIndex:0,start:zoom?.start??0,end:zoom?.end??100,filterMode:'none'}],series
    },{replaceMerge:['series'],lazyUpdate:false});
    chart.resize();
  }
  function closeExpanded(){panel.classList.remove('expanded');expand.textContent=t('Expand','放大');chart.resize();}
  expand.addEventListener('click',()=>{panel.classList.toggle('expanded');expand.textContent=panel.classList.contains('expanded')?t('Close','收起'):t('Expand','放大');chart.resize();});
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')closeExpanded();};document.addEventListener('keydown',escape);
  save.addEventListener('click',async()=>{
    save.disabled=true;save.textContent=t('Generating…','正在生成…');
    try {
    const image=new Image();image.src=chart.getDataURL({pixelRatio:2,backgroundColor:document.documentElement.dataset.theme==='dark'?'#24211e':'#ffffff'});await image.decode();
    // Export a caption strip so every source is retained even when the on-screen legend scrolls.
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;
    canvas.width=image.width;const lines=[title.textContent||'',...current.map(c=>c.name),`EMA: ${weight.toFixed(2)} · ${t('Original CSV files are unchanged','原始 CSV 文件未改变')}`];
    ctx.font='22px sans-serif';
    const wrapped:string[]=[];
    for(const line of lines){let part='';for(const char of line){if(ctx.measureText(part+char).width>canvas.width-60){wrapped.push(part);part='';}part+=char;}wrapped.push(part);}
    const captionHeight=wrapped.length*32+45;canvas.height=image.height+captionHeight;
    ctx.fillStyle=document.documentElement.dataset.theme==='dark'?'#24211e':'#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=document.documentElement.dataset.theme==='dark'?'#eee8e0':'#37303a';ctx.font='22px sans-serif';wrapped.forEach((line,i)=>ctx.fillText(line,25,32+i*32));ctx.drawImage(image,0,captionHeight);
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('PNG encoding failed'))));
    if(exportUrl)URL.revokeObjectURL(exportUrl);exportUrl=URL.createObjectURL(blob);download.href=exportUrl;download.textContent=t('Download PNG ↓','下载 PNG ↓');download.hidden=false;download.click();
    } catch(error) {warning.textContent=t('PNG export failed: ','PNG 导出失败：')+(error as Error).message;}
    finally {save.disabled=false;save.textContent=t('Export PNG','导出 PNG');}
  });
  return {update,reset:()=>chart.dispatchAction({type:'dataZoom',start:0,end:100}),resize:()=>chart.resize(),dispose:()=>{if(exportUrl)URL.revokeObjectURL(exportUrl);observer.disconnect();document.removeEventListener('keydown',escape);chart.dispose();panel.remove();}};
}
