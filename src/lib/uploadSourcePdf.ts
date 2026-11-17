export type PdfTransfer = { phase: 'uploading' | 'checking'; loaded: number; total: number; percent: number | null };
// Browser byte progress measures transfer only. The server may still be scanning
// the file after the final byte, so 100% never means approved or ready for AI.
export function uploadSourcePdf(url: string, file: Blob, onProgress: (state: PdfTransfer) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', url);
    request.setRequestHeader('Content-Type', 'application/pdf');
    request.timeout = 180_000;
    request.upload.onprogress = event => onProgress({phase:'uploading',loaded:event.loaded,total:event.lengthComputable?event.total:file.size,percent:event.lengthComputable&&event.total>0?Math.min(100,Math.floor(event.loaded/event.total*100)):null});
    request.upload.onload = () => onProgress({phase:'checking',loaded:file.size,total:file.size,percent:100});
    request.onerror = () => reject(new Error('The file transfer could not be confirmed. Check the recovery list before retrying.'));
    request.ontimeout = () => reject(new Error('The secure upload timed out. Check the recovery list before retrying.'));
    request.onabort = () => reject(new Error('The file upload was cancelled.'));
    request.onload = () => {
      if(request.status<200||request.status>=300){reject(new Error(`Secure upload failed (${request.status}). The file was not accepted for indexing.`));return;}
      try{const result=JSON.parse(request.responseText);if(typeof result.storageId!=='string'||!result.storageId)throw new Error('No storage reference');resolve(result.storageId);}catch{reject(new Error('The upload response was incomplete. Check the recovery list before retrying.'));}
    };
    onProgress({phase:'uploading',loaded:0,total:file.size,percent:0});
    request.send(file);
  });
}
