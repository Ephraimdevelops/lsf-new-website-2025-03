export type MetaChannel = 'whatsapp' | 'messenger' | 'instagram';
export function inboundMessages(body: any, allowed: Partial<Record<MetaChannel,string>>) {
  const result: Array<{channel:MetaChannel; account:string; sender:string; eventId:string; text:string; sentAt:number; inputType?:'audio';mediaId?:string}>=[];
  const add=(channel:MetaChannel,account:string,sender:string,eventId:string,text:string,sentAt:number,inputType?:'audio',mediaId?:string)=>{
    if(allowed[channel]===account && sender && sender!==account && eventId && text?.trim() && text.length<=4000 && Number.isFinite(sentAt) && sentAt>Date.now()-24*60*60*1000 && sentAt<Date.now()+60000) result.push({channel,account,sender,eventId,text:text.trim(),sentAt,...(inputType?{inputType}:{}),...(mediaId&&/^\d{5,40}$/.test(mediaId)?{mediaId}:{})});
  };
  for(const entry of (body?.entry??[]).slice(0,100)) {
    if(body.object==='whatsapp_business_account') for(const change of entry.changes??[]) {
      const value=change.value;
      for(const m of value?.messages??[]) {if(m.type==='text') add('whatsapp',value.metadata?.phone_number_id,m.from,m.id,m.text?.body,Number(m.timestamp)*1000);else if(m.type==='audio')add('whatsapp',value.metadata?.phone_number_id,m.from,m.id,'[Voice note received — not transcribed]',Number(m.timestamp)*1000,'audio',m.audio?.id);}
    }
    if(body.object==='page'||body.object==='instagram') for(const event of entry.messaging??[]) {
      if(!event.message?.is_echo){const voice=!event.message?.text&&event.message?.attachments?.some((a:any)=>a.type==='audio');add(body.object==='page'?'messenger':'instagram',String(entry.id),event.sender?.id,event.message?.mid,voice?'[Voice note received — not transcribed]':event.message?.text,Number(event.timestamp),voice?'audio':undefined);}
    }
  }
  return result;
}
export async function validMetaSignature(secret:string, body:string, signature:string|null) {
  if(!secret||!signature||!/^sha256=[0-9a-f]{64}$/.test(signature)) return false;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  const bytes=Uint8Array.from(signature.slice(7).match(/../g)!,x=>parseInt(x,16));
  return crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(body));
}

export function metaMessagingHost(channel:MetaChannel,instagramMode?:string){
 if(channel!=='instagram')return 'graph.facebook.com';
 if(!instagramMode||instagramMode==='instagram_login')return 'graph.instagram.com';
 if(instagramMode==='unified'||instagramMode==='facebook_login')return 'graph.facebook.com';
 throw new Error('Unsupported Instagram authorization mode');
}
