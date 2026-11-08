import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
// Keep the runtime assets on the app origin; only model files need an initial download.
env.backends.onnx.wasm.wasmPaths = {
  wasm: new URL('../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm', import.meta.url).href,
  mjs: new URL('../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.mjs', import.meta.url).href,
};
env.backends.onnx.wasm.numThreads = 1;
let generator;
let device;
async function load() {
 if (generator) return;
 const progress_callback = p => { if (p.status === 'progress' && p.file?.includes('onnx')) self.postMessage({type:'progress', progress:Math.round(p.progress || 0)}); };
 // q4 is compatible with both providers; fallback if an adapter is present but unusable.
 try {
   if (!navigator.gpu || !await navigator.gpu.requestAdapter()) throw new Error('WebGPU yok');
   device='webgpu';
   generator=await pipeline('text-generation','onnx-community/Qwen2.5-0.5B-Instruct',{dtype:'q4',device,progress_callback});
 } catch (e) {
   self.postMessage({type:'status', message:'Ekran kartı kullanılamıyor; işlemci modu deneniyor (daha yavaş olabilir).'});
   device='wasm';
   generator=await pipeline('text-generation','onnx-community/Qwen2.5-0.5B-Instruct',{dtype:'q4',device,progress_callback});
 }
 self.postMessage({type:'ready',device});
}
self.onmessage=async ({data})=>{
 try {
  if(data.type==='load') {await load();return;}
  if(data.type==='generate') {
   await load();
   const output=await generator([{role:'system',content:'Sen Türkçe konuşan yardımsever bir ders öğretmenisin. Yalnızca verilen kaynak bölümünü kullan. Kaynakta yoksa bilmiyorum de. Kısa ve anlaşılır cevap ver.'},{role:'user',content:data.prompt}],{max_new_tokens:512,do_sample:false,repetition_penalty:1.1});
   const generated=output?.[0]?.generated_text;
   const text=Array.isArray(generated)?generated[generated.length-1]?.content:generated;
   if(!text?.trim()) throw new Error('Model boş yanıt verdi.');
   self.postMessage({type:'result',text});
  }
 } catch(e){self.postMessage({type:'error',message:e?.message||'Yerel model çalıştırılamadı.'})}
};
