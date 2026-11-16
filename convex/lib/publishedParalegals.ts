import {matchesParalegalArea,normalizeDirectoryArea} from './paralegalSearch';
export const LSF_PUBLIC_DIRECTORY_URL='https://lsftz.org/legal-help';
const endpoint='https://dusty-ox-781.convex.cloud/api/query';
export type PublishedParalegal={sourceId:string;fullName:string;phone:string;region:string;district:string;ward?:string;sourceUrl:string;availability:'unconfirmed';platformVerified:false};
const clean=(x:unknown)=>typeof x==='string'?x.trim().replace(/\s+/g,' '):'';
export function preparePublishedParalegals(input:unknown){
 if(!Array.isArray(input)||input.length>20000)throw Error('Invalid published directory');
 const candidates:PublishedParalegal[]=[],stats={published:input.length,invalid:0,duplicates:0,ambiguous:0,usable:0};
 const byKey=new Map<string,PublishedParalegal[]>(),phoneNames=new Map<string,Set<string>>();
 for(const row of input){
  const fullName=clean(row?.fullName),region=clean(row?.region),district=clean(row?.district),digits=clean(row?.phone).replace(/[^\d]/g,'');
  const phone=/^0[67]\d{8}$/.test(digits)?'+255'+digits.slice(1):/^255[67]\d{8}$/.test(digits)?'+'+digits:'';
  if(!fullName||fullName.length>160||!region||!district||!phone||typeof row?._id!=='string'){stats.invalid++;continue;}
  const person={sourceId:row._id,fullName,phone,region,district,...(clean(row.ward)?{ward:clean(row.ward)}:{}),sourceUrl:LSF_PUBLIC_DIRECTORY_URL,availability:'unconfirmed' as const,platformVerified:false as const};
  const name=fullName.toLowerCase(),key=name+'|'+phone;
  byKey.set(key,[...(byKey.get(key)??[]),person]);
  const names=phoneNames.get(phone)??new Set<string>();names.add(name);phoneNames.set(phone,names);
 }
 for(const people of byKey.values()){
  const areas=new Set(people.map(p=>[p.region,p.district,p.ward??''].map(normalizeDirectoryArea).join('|')));
  if(areas.size>1||(phoneNames.get(people[0].phone)?.size??0)>1){stats.ambiguous+=people.length;continue;}
  candidates.push(people[0]);stats.duplicates+=people.length-1;
 }
 stats.usable=candidates.length;return {contacts:candidates,stats};
}
export function publishedParalegalMatches(rows:PublishedParalegal[],region?:string,district?:string){return rows.filter(x=>matchesParalegalArea(x,region,district)).slice(0,3);}
// Fixed, read-only public query. Never forward a beneficiary's message/location,
// credentials, cookies or private fields to the website's production backend.
export async function readPublishedParalegals(){
 if(process.env.LSF_PUBLIC_PARALEGAL_DIRECTORY_ENABLED!=='true')return {contacts:[] as PublishedParalegal[],available:false};
 try{
  const response=await fetch(endpoint,{method:'POST',credentials:'omit',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:'paralegals:listApprovedParalegals',format:'convex_encoded_json',args:[{}]}),signal:AbortSignal.timeout(8000)});
  if(!response.ok||!response.body)return {contacts:[] as PublishedParalegal[],available:false};
  const reader=response.body.getReader(),chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4_000_000){await reader.cancel();throw Error('Published directory size limit');}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  const body=JSON.parse(new TextDecoder().decode(bytes));if(body.status!=='success')throw Error('Published directory unavailable');
  return {...preparePublishedParalegals(body.value),available:true};
 }catch{return {contacts:[] as PublishedParalegal[],available:false};}
}
