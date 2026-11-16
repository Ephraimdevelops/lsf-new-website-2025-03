export const SOCIAL_AUDIO_LIMIT=10*1024*1024;
export function metaAudioUrl(value:string){
 const url=new URL(value);
 if(url.protocol!=='https:'||url.hostname!=='lookaside.fbsbx.com'||url.port||url.username||url.password||!url.pathname.startsWith('/whatsapp_business/'))throw new Error('Unsupported media host');
 return url.href;
}
export function opusDuration(bytes:Uint8Array){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let offset=0,lastGranule=0,serial:number|undefined,sequence=0,preSkip=0,identified=false,packetParts:number[]=[],decodedSamples=0,packetCount=0;
 const ascii=(at:number,n:number)=>String.fromCharCode(...bytes.slice(at,at+n));
 while(offset<bytes.length){
  if(offset+27>bytes.length||ascii(offset,4)!=='OggS'||bytes[offset+4]!==0)throw new Error('Invalid Ogg page');
  const stream=view.getUint32(offset+14,true),page=view.getUint32(offset+18,true),segments=bytes[offset+26];
  if(serial===undefined){serial=stream;sequence=page;}else if(serial!==stream||page!==++sequence)throw new Error('Unsupported Ogg stream');
  if(offset+27+segments>bytes.length)throw new Error('Incomplete Ogg page');
  let length=0;for(let i=0;i<segments;i++)length+=bytes[offset+27+i];const start=offset+27+segments,end=start+length;
  if(end>bytes.length)throw new Error('Incomplete audio data');
  if(!identified){if(length<19||ascii(start,8)!=='OpusHead'||![1,2].includes(bytes[start+9]))throw new Error('Use Opus audio');preSkip=view.getUint16(start+10,true);identified=true;}
  let packetOffset=start;
  for(let i=0;i<segments;i++){
   const size=bytes[offset+27+i];packetParts.push(...bytes.slice(packetOffset,packetOffset+size));packetOffset+=size;
   if(packetParts.length>65536)throw new Error('Audio packet too large');
   if(size<255){
    const packet=new Uint8Array(packetParts);packetParts=[];packetCount++;
    const header=String.fromCharCode(...packet.slice(0,8));
    if(header!=='OpusHead'&&header!=='OpusTags'){
     if(!packet.length)throw new Error('Empty Opus packet');const config=packet[0]>>3,mode=packet[0]&3;
     const frameMs=config<12?[10,20,40,60][config&3]:config<16?[10,20][config&1]:[2.5,5,10,20][config&3];
     const frames=mode===0?1:mode===1||mode===2?2:packet.length>1?packet[1]&63:0;
     if(!frames||frames*frameMs>120)throw new Error('Invalid Opus frame count');decodedSamples+=frames*frameMs*48;
     if(decodedSamples>120*48000)throw new Error('Voice note exceeds two minutes');
    }
   }
  }
  const high=view.getUint32(offset+10,true),low=view.getUint32(offset+6,true);
  if(high!==0xffffffff||low!==0xffffffff){const granule=high*4294967296+low;if(!Number.isSafeInteger(granule)||granule<lastGranule)throw new Error('Invalid audio duration');lastGranule=granule;}
  offset=end;
 }
 const seconds=(lastGranule-preSkip)/48000;
 if(!identified||!Number.isFinite(seconds)||seconds<=0||seconds>120)throw new Error('Invalid audio duration: record a voice question of two minutes or less');
 if(packetParts.length||packetCount<2||Math.abs(decodedSamples/48000-seconds)>0.2)throw new Error('Inconsistent audio duration');
 return Math.max(seconds,decodedSamples/48000);
}
export async function boundedAudio(response:Response){
 if(!response.ok||!response.body||Number(response.headers.get('content-length')??0)>SOCIAL_AUDIO_LIMIT)throw new Error('Media unavailable');
 const reader=response.body.getReader(),parts:Uint8Array[]=[];let size=0;
 try{while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>SOCIAL_AUDIO_LIMIT)throw new Error('Audio too large');parts.push(part.value);}}finally{await reader.cancel();}
 const out=new Uint8Array(size);let offset=0;for(const part of parts){out.set(part,offset);offset+=part.length;}return out;
}
