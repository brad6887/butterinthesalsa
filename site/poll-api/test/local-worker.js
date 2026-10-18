// Synthetic loopback preview ONLY. Never use this entry point for a hosted Worker.
import {createWorker} from '../src/worker.js';
const worker=createWorker(async(_url, options)=>Response.json({success:['XXXX.DUMMY.TOKEN.XXXX','local-preview-only'].includes(options.body.get('response')),hostname:'localhost',action:'vote'}));
export default {fetch(request,env,ctx) {
 if(!['localhost','127.0.0.1'].includes(new URL(request.url).hostname)) return new Response('Loopback preview only',{status:403});
 return worker.fetch(request,{...env,VOTER_HASH_SECRET:'synthetic-local-preview-key-not-a-secret',TURNSTILE_SECRET:'synthetic-local-preview-only'},ctx);
}};
