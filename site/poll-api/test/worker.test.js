import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getPlatformProxy} from 'wrangler';
import {createWorker} from '../src/worker.js';
import {POLL} from '../src/poll.js';
let proxy, env;
const allow={limit:async()=>({success:true})};
const url=`https://api.example/v1/polls/${POLL}`;
const good=async()=>Response.json({success:true,hostname:'localhost',action:'vote'});
const worker=createWorker(good);
const id=()=>crypto.randomUUID();
const ballot=(voterId=id(),optionId='butter',token='valid')=>({voterId,optionId,token});
function req(body, extras={}) {
 return new Request(url+'/votes',{method:'POST',headers:{Origin:'http://localhost:4321','CF-Connecting-IP':'192.0.2.1','Content-Type':'application/json',...extras},body:JSON.stringify(body)});
}
const send=(body,e=env,w=worker)=>w.fetch(req(body),e,{waitUntil(){}});
async function total(){return (await env.DB.prepare('SELECT sum(count) AS n FROM totals').first()).n;}
before(async()=>{
 proxy=await getPlatformProxy({configPath:'wrangler.json',persist:false});
 env={...proxy.env,POLL_OPEN:'true',VOTER_HASH_SECRET:'isolated-test-only-key-32-characters-long',TURNSTILE_SECRET:'test-only',IP_LIMITER:allow,ADMISSION_LIMITER:allow};
 const sql=await readFile(new URL('../migrations/0001_poll.sql',import.meta.url),'utf8');
 await env.DB.exec(sql);
});
after(async()=>{await proxy?.dispose();});
test('concurrent same-browser ballots count once, immutable choice, retry without challenge reuse',async()=>{
 const before=await total(), voter=id();
 const responses=await Promise.all(Array.from({length:20},(_,i)=>send(ballot(voter,i%2?'butter':'salsa'))));
 for(const r of responses) assert.equal(r.status,200);
 const bodies=await Promise.all(responses.map(r=>r.json()));
 assert.equal(new Set(bodies.map(b=>b.optionId)).size,1);
 assert.equal(bodies.filter(b=>!b.duplicate).length,1);
 assert.equal(await total(),before+1);
 const retry=await send(ballot(voter,'whatever','expired'),env,createWorker(()=>{throw Error('must not verify twice');}));
 assert.equal((await retry.json()).duplicate,true);
});
test('concurrent distinct browsers count exactly once each',async()=>{
 const before=await total();
 const replies=await Promise.all(Array.from({length:30},()=>send(ballot())));
 assert.ok(replies.every(r=>r.status===200)); assert.equal(await total(),before+30);
});
test('invalid and expired challenge, hostname/action mismatch, verifier outages do not write',async()=>{
 const before=await total();
 for(const result of [{success:false},{success:true,hostname:'evil.example',action:'vote'},{success:true,hostname:'localhost',action:'login'}]) {
  assert.equal((await send(ballot(),env,createWorker(async()=>Response.json(result)))).status,400);
 }
 for(const verify of [async()=>{throw Error('network');},async()=>new Response('',{status:503}),async()=>new Response('bad json')]) {
  assert.equal((await send(ballot(),env,createWorker(verify))).status,503);
 }
 assert.equal(await total(),before);
});
test('reject invalid selections, browser ids, bodies, types and oversized streams',async()=>{
 const before=await total();
 for(const b of [null,{},ballot(id(),'unknown'),ballot('not-uuid'),ballot(id(),'butter',''),ballot(id(),'butter','x'.repeat(2049))]) assert.equal((await send(b)).status,400);
 assert.equal((await worker.fetch(req(ballot(),{'Content-Type':'text/plain'}),env,{})).status,415);
 assert.equal((await worker.fetch(new Request(url+'/votes',{method:'POST',headers:{Origin:'http://localhost:4321','CF-Connecting-IP':'192.0.2.1','Content-Type':'application/json'},body:'broken'}),env,{})).status,400);
 assert.equal((await send({...ballot(),padding:'x'.repeat(5000)})).status,413);
 assert.equal(await total(),before);
});
test('origin, close switch, missing config, limiter denial and database outage fail closed',async()=>{
 const before=await total();
 assert.equal((await worker.fetch(req(ballot(),{Origin:'https://evil.example'}),env,{})).status,403);
 assert.equal((await send(ballot(),{...env,POLL_OPEN:'false'})).status,403);
 assert.equal((await send(ballot(),{...env,VOTER_HASH_SECRET:''})).status,503);
 for(const name of ['IP_LIMITER','ADMISSION_LIMITER']) {
  const r=await send(ballot(),{...env,[name]:{limit:async()=>({success:false})}});
  assert.equal(r.status,429); assert.equal(r.headers.get('Retry-After'),'60');
 }
 assert.equal((await send(ballot(),{...env,DB:{prepare(){throw Error('outage');}}})).status,503);
 assert.equal(await total(),before);
});
test('results include all choices, coherent totals; preflight, routes, methods',async()=>{
 const result=await worker.fetch(new Request(url,{headers:{Origin:'http://localhost:4321'}}),env,{});
 assert.equal(result.status,200); assert.equal(result.headers.get('Access-Control-Allow-Origin'),'http://localhost:4321');
 const data=await result.json(); assert.equal(data.options.length,4); assert.equal(data.total,await total());
 assert.equal(data.total,data.options.reduce((n,r)=>n+r.count,0));
 assert.equal((await worker.fetch(new Request(url,{method:'OPTIONS',headers:{Origin:'http://localhost:4321'}}),env,{})).status,204);
 assert.equal((await worker.fetch(new Request(url,{method:'DELETE',headers:{Origin:'http://localhost:4321'}}),env,{})).status,405);
 assert.equal((await worker.fetch(new Request(url+'/unknown',{headers:{Origin:'http://localhost:4321'}}),env,{})).status,404);
});
