import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getPlatformProxy} from 'wrangler';
import {createWorker} from '../src/worker.js';

test('production preparation stays closed and separate from preview',async()=>{
  const read=async name=>JSON.parse(await readFile(new URL('../'+name,import.meta.url),'utf8'));
  const production=await read('wrangler.production.example.json');
  const preview=await read('wrangler.hosted-preview.json');
  const closed=await read('wrangler.production-close.example.json');
  assert.deepEqual(closed,production);
  const rollback=await read('rollback.production.example.json');
  assert.notEqual(production.name,preview.name);
  assert.equal(production.main,'src/worker.js');
  assert.equal(production.vars.POLL_OPEN,'false');
  assert.equal(production.workers_dev,true); // Closing must preserve the results endpoint.
  assert.equal(production.preview_urls,false);
  assert.equal(production.observability.enabled,false);
  assert.deepEqual(production.vars,{POLL_OPEN:'false',ALLOWED_ORIGINS:'https://butterinthesalsa.com',TURNSTILE_HOSTNAMES:'butterinthesalsa.com'});
  assert.equal(production.d1_databases[0].database_id,'00000000-0000-0000-0000-000000000000');
  assert.notEqual(production.d1_databases[0].database_name,preview.d1_databases[0].database_name);
  for(const limit of production.ratelimits) assert.ok(!preview.ratelimits.some(other=>other.namespace_id===limit.namespace_id));
  assert.equal(rollback.status,'UNPREPARED_DO_NOT_EXECUTE');
  assert.equal(rollback.worker_name,production.name);
  assert.equal(rollback.account_id,production.account_id);
  assert.equal(rollback.database_name,production.d1_databases[0].database_name);
  assert.deepEqual(rollback.allowed_origins,[production.vars.ALLOWED_ORIGINS]);
  assert.equal(rollback.close_poll_open,'false');
  assert.equal(rollback.close_workers_dev,true);
  assert.match(rollback.known_good_worker_version,/^REPLACE_/);
});

test('production close settings preserve existing ballots and readable results in isolated D1',async()=>{
  const proxy=await getPlatformProxy({configPath:'wrangler.production.example.json',persist:false});
  try {
    await proxy.env.DB.exec(await readFile(new URL('../migrations/0001_poll.sql',import.meta.url),'utf8'));
    const env={...proxy.env,VOTER_HASH_SECRET:'isolated-production-close-test-key-only',TURNSTILE_SECRET:'synthetic-test-only',IP_LIMITER:{limit:async()=>({success:true})},ADMISSION_LIMITER:{limit:async()=>({success:true})}};
    const worker=createWorker(async()=>Response.json({success:true,hostname:'butterinthesalsa.com',action:'vote'}));
    const url='https://production.example/v1/polls/salsa-crisis-v1';
    const vote=()=>new Request(url+'/votes',{method:'POST',headers:{Origin:'https://butterinthesalsa.com','CF-Connecting-IP':'192.0.2.1','Content-Type':'application/json'},body:JSON.stringify({optionId:'butter',voterId:crypto.randomUUID(),token:'synthetic'})});
    // Opening is in-memory test setup only; the checked-in template stays closed.
    assert.equal((await worker.fetch(vote(),{...env,POLL_OPEN:'true'},{})).status,200);
    assert.equal((await worker.fetch(vote(),env,{})).status,403);
    const result=await worker.fetch(new Request(url,{headers:{Origin:'https://butterinthesalsa.com'}}),env,{});
    assert.equal(result.status,200);
    const data=await result.json();
    assert.equal(data.open,false);
    assert.equal(data.total,1);
    assert.equal(data.options.find(row=>row.id==='butter').count,1);
    assert.equal((await env.DB.prepare('SELECT count(*) AS n FROM ballots').first()).n,1);
    assert.equal((await env.DB.prepare('SELECT sum(count) AS n FROM totals').first()).n,1);
  } finally {await proxy.dispose();}
});
