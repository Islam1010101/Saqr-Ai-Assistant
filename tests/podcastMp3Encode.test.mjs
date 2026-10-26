import assert from 'node:assert/strict';
import lamejs from 'lamejs';
const e=new lamejs.Mp3Encoder(1,44100,128);
const samples=new Int16Array(44100);
for(let i=0;i<samples.length;i++)samples[i]=Math.round(Math.sin(2*Math.PI*440*i/44100)*12000);
const all=[];for(let i=0;i<samples.length;i+=1152){const chunk=e.encodeBuffer(samples.subarray(i,i+1152));if(chunk.length)all.push(...chunk);}
all.push(...e.flush());
assert.ok(all.length>1000,'Expected actual MP3 frames');
const first=all.findIndex((byte,index)=>byte===-1||byte===255);
assert.ok(first>=0&&(all[first+1]&0xe0)===0xe0,'Invalid MP3 sync header');
console.log('PASS actual MP3 frames generated');
