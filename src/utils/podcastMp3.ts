import * as lamejs from '@breezystack/lamejs';
/** Encode the actual recording bytes to MPEG Layer III. Never relabel
 * WebM/MP4 with a .mp3 suffix; decode them first and encode real MP3 frames.
 */
export async function recordingToMp3(blob:Blob):Promise<Blob>{
 if(!blob.size)throw new Error('Empty recording');
 const Context=window.AudioContext || (window as Window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
 if(!Context)throw new Error('This browser does not support audio decoding');
 const context=new Context();
 try{
   const buffer=await context.decodeAudioData(await blob.arrayBuffer());
   const sampleRate=44100;
   const length=Math.max(1,Math.ceil(buffer.duration*sampleRate));
   const offline=new OfflineAudioContext(1,length,sampleRate);
   const src=offline.createBufferSource();src.buffer=buffer;src.connect(offline.destination);src.start();
   const result=await offline.startRendering();
   const floats=result.getChannelData(0);
   const encoder=new lamejs.Mp3Encoder(1,sampleRate,128);
   const segments:Uint8Array[]=[];
   for(let offset=0;offset<floats.length;offset+=1152){
     const slice=floats.subarray(offset,Math.min(offset+1152,floats.length));
     const samples=new Int16Array(slice.length);
     for(let i=0;i<slice.length;i++)samples[i]=Math.round(Math.max(-1,Math.min(1,slice[i]))*(slice[i]<0?32768:32767));
     const encoded=encoder.encodeBuffer(samples);
     if(encoded.length)segments.push(new Uint8Array(encoded));
   }
   const final=encoder.flush();if(final.length)segments.push(new Uint8Array(final));
   const mp3=new Blob(segments,{type:'audio/mpeg'});
   if(mp3.size<100)throw new Error('MP3 encoding produced no audio');
   return mp3;
 }finally{await context.close().catch(()=>undefined);}
}
export const safePodcastFileName=(name:string,grade:string,title:string):string=>
 [name,grade,title].map(x=>x.trim().replace(/[\\/<>:"|?*\\x00-\\x1F]/g,'-').replace(/\\s+/g,' ').slice(0,55)).join(' - ')+'.mp3';
