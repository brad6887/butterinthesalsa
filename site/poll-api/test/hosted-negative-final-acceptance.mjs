import {writeFile} from 'node:fs/promises';
const base='https://butter-salsa-poll-preview.butter-salsa.workers.dev',path='/v1/polls/salsa-crisis-v1',origin='http://localhost:4322',checks=[];
const ballot={optionId:'butter',voterId:crypto.randomUUID(),token:'invalid'};
async function test(name,route,init,expected){const r=await fetch(base+route,{...init,headers:{Origin:origin,...init?.headers}});const body=await r.json().catch(()=>null);const check={name,status:r.status,expected,pass:expected===undefined?null:r.status===expected,body,allowOrigin:r.headers.get('access-control-allow-origin'),retryAfter:r.headers.get('retry-after')};checks.push(check);await writeFile('../../working/poll-review/hosted-negative-final-acceptance.json',JSON.stringify({checks},null,2)+'\n');console.log(JSON.stringify(check));return check;}
function post(body){return {method:'POST',headers:{'Content-Type':'application/json'},body:typeof body==='string'?body:JSON.stringify(body)};}
await test('forbidden origin GET',path,{headers:{Origin:'https://example.org'}},403);
await test('no origin GET',path,{headers:{Origin:''}},403);
await test('allowed preflight',path+'/votes',{method:'OPTIONS',headers:{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}},204);
await test('forbidden preflight',path+'/votes',{method:'OPTIONS',headers:{Origin:'https://example.org','Access-Control-Request-Method':'POST'}},403);
await test('forbidden POST',path+'/votes',{...post(ballot),headers:{'Content-Type':'application/json',Origin:'https://example.org'}},403);
await test('invalid selection',path+'/votes',post({...ballot,optionId:'not-a-choice'}),400);
await test('malformed JSON',path+'/votes',post('{'),400);
await test('missing challenge',path+'/votes',post({optionId:'butter',voterId:crypto.randomUUID()}),400);
await test('oversized body',path+'/votes',post('x'.repeat(4097)),413);
await test('wrong content type',path+'/votes',{method:'POST',body:'bad'},415);
for(let i=0;i<5;i++){const c=await test('bounded rate attempt '+i,path+'/votes',post({}),undefined);if(c.status===429){c.pass=c.retryAfter==='60';break;}}
console.log('Cooling down limiter for 65 seconds');
await new Promise(r=>setTimeout(r,65000));
await test('invalid nonempty real challenge',path+'/votes',post(ballot),400);
await test('null JSON',path+'/votes',post('null'),400);
await test('invalid browser ID',path+'/votes',post({...ballot,voterId:'bad'}),400);
await test('final results',path,{},200);

