export type SourceUploadStage='uploading'|'checking'|'extracting'|'indexing'|'review'|'failed';
export default function SourceUploadProgress({title,stage,transferPercent,completed,total,error,approvalStatus,onReview}:{title:string;stage:SourceUploadStage;transferPercent:number|null;completed?:number;total?:number;error?:string;approvalStatus?:string;onReview:()=>void}){
 const indexed=total&&total>0?Math.min(100,Math.floor((completed??0)/total*100)):null;
 const percent=stage==='uploading'?transferPercent:stage==='indexing'?indexed:stage==='review'?100:null;
 const text={uploading:'Uploading your PDF',checking:'File sent — checking security',extracting:'Security check passed — reading the document',indexing:'Preparing searchable information',review:approvalStatus==='approved'?'Preparation complete — source approved':approvalStatus==='rejected'?'Review complete — source rejected':approvalStatus==='withdrawn'?'Source withdrawn from AI use':'Preparation complete — awaiting approval',failed:'Upload or preparation needs attention'}[stage];
 const phases=['File transfer','Security check','Read & prepare','Approval'];
 const active={uploading:0,checking:1,extracting:2,indexing:2,review:3,failed:-1}[stage];
 return <section className="mb-6 rounded-xl border bg-white p-5" aria-label="Document upload progress" aria-busy={stage!=='review'&&stage!=='failed'}>
  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-gray-500">{title}</p><h3 className="mt-1 text-base font-semibold" role="status" aria-live="polite">{text}</h3></div>{percent!==null&&<strong className="text-xl tabular-nums">{percent}%</strong>}</div>
  {stage!=='failed'&&<progress aria-label={stage==='uploading'?'File transfer progress':stage==='review'?'Document preparation complete':'Document preparation progress'} max={100} value={percent??undefined} className="mt-4 h-2 w-full accent-[#8a1538]"/>}
  <ol className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">{phases.map((p,i)=><li key={p} aria-current={i===active?'step':undefined} className={i===active?'font-semibold text-primary':i<active?'text-green-800':'text-gray-500'}>{i<active?'✓ ':`${i+1}. `}{p}</li>)}</ol>
  {stage==='uploading'&&<p className="mt-3 text-xs text-gray-500">This percentage measures the file transfer, not AI readiness.</p>}
  {stage==='checking'&&<p className="mt-3 text-xs text-gray-500">All file bytes have been sent. Security checking has no reliable percentage; please keep this page open.</p>}
  {stage==='indexing'&&<p className="mt-3 text-xs text-gray-500">{total?`${completed??0} of ${total} parts indexed.`:'Waiting for the document part count…'} The document stays out of AI answers until approved.</p>}
  {stage==='review'&&<div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-950"><strong>{approvalStatus==='approved'?'Source approved · review dates and scope still apply':approvalStatus==='rejected'?'Rejected · not available to AI':approvalStatus==='withdrawn'?'Withdrawn · not available to AI':'Approval pending · not available to AI yet'}</strong><p className="mt-1">A different administrator must review the source, its publication status and any transcription issues. Uploading does not approve it.</p><button type="button" className="mt-3 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold" onClick={onReview}>Open document in Needs review</button></div>}
  {stage==='failed'&&<p role="alert" className="mt-3 text-sm text-red-700">{error||'Check the saved upload and source list before retrying.'}</p>}
 </section>;
}
