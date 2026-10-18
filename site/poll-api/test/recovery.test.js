import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {getPlatformProxy} from 'wrangler';
import {createWorker} from '../src/worker.js';

// Every CLI invocation is local, with a nil database ID and a fresh /tmp config.
// No hosted config, .dev.vars, real identity, credential or ballot is read.
test('local Wrangler export restores exact ballots, counters, schema and migration ledger twice', {timeout:180000}, async()=>{
 const root=await mkdtemp(join(tmpdir(),'butter-recovery-'));
 const bin=resolve('node_modules/.bin/wrangler');
 const migration=resolve('migrations');
 const transcript=[];
 const report={scope:'synthetic local D1 only; no remote commands',restores:[]};
 const digest=s=>createHash('sha256').update(s).digest('hex');
 const cli=(dir,args,ok=true)=>{
  transcript.push('cwd='+dir+'\n'+[bin,...args,'--config',join(dir,'wrangler.json')].join(' '));
  let output, failure;
  try {output=execFileSync(bin,[...args,'--config',join(dir,'wrangler.json')],{cwd:dir,env:{...process.env,WRANGLER_SEND_METRICS:'false',CI:'true'},encoding:'utf8',stdio:['ignore','pipe','pipe']});}
  catch(error){failure=error;}
  if(failure){transcript.push(String(failure.stdout||'')+String(failure.stderr||''));if(ok) throw failure;assert.match(String(failure.stdout||'')+String(failure.stderr||''),/already exists|syntax error|UNIQUE constraint failed: d1_migrations.id/i);return '';}
  transcript.push(output);assert.ok(ok,'expected command failure');return output;
 };
 const store=async name=>{const dir=join(root,name);await mkdir(dir);await writeFile(join(dir,'wrangler.json'),JSON.stringify({name:'recovery-only',compatibility_date:'2026-10-01',d1_databases:[{binding:'DB',database_name:'recovery-only',database_id:'00000000-0000-0000-0000-000000000000',migrations_dir:migration}]}));return dir;};
 const proxy=dir=>getPlatformProxy({configPath:join(dir,'wrangler.json'),persist:{path:join(dir,'.wrangler/state/v3')}});
 const snapshot=async db=>{
  const rows=async sql=>(await db.prepare(sql).all()).results;
  const result={ballots:await rows('SELECT * FROM ballots ORDER BY poll_id,voter_hash'),totals:await rows('SELECT * FROM totals ORDER BY poll_id,option_id'),schema:await rows("SELECT type,name,tbl_name,sql FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name"),migrations:await rows('SELECT * FROM d1_migrations ORDER BY id')};
  assert.deepEqual(await rows('PRAGMA foreign_key_check'),[]);
  await assert.rejects(rows('PRAGMA integrity_check'),/not authorized/); // D1 disallows this pragma.
  for(const total of result.totals) assert.equal(total.count,result.ballots.filter(b=>b.poll_id===total.poll_id&&b.option_id===total.option_id).length);
  assert.equal(result.totals.length,4);
  return result;
 };
 const allow={limit:async()=>({success:true})};
 const worker=createWorker(async()=>Response.json({success:true,hostname:'localhost',action:'vote'}));
 const env=db=>({DB:db,POLL_OPEN:'true',ALLOWED_ORIGINS:'http://localhost:4321',TURNSTILE_HOSTNAMES:'localhost',VOTER_HASH_SECRET:'synthetic-recovery-key-at-least-32-chars',TURNSTILE_SECRET:'synthetic-only',IP_LIMITER:allow,ADMISSION_LIMITER:allow});
 const voter='00000000-0000-4000-8000-000000000001';
 const request=(id=voter,optionId='butter')=>new Request('http://localhost/v1/polls/salsa-crisis-v1/votes',{method:'POST',headers:{Origin:'http://localhost:4321','CF-Connecting-IP':'192.0.2.1','Content-Type':'application/json'},body:JSON.stringify({voterId:id,optionId,token:'synthetic-only'})});
 try {
  const source=await store('source');
  cli(source,['d1','migrations','apply','DB','--local']);
  let p=await proxy(source); let baseline;
  try {
   for(const [i,choice] of ['butter','salsa','whatever','butter'].entries()) assert.equal((await worker.fetch(request(`00000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`,choice),env(p.env.DB),{})).status,200);
   baseline=await snapshot(p.env.DB);assert.equal(baseline.ballots.length,4);
  } finally {await p.dispose();}
  const backup=join(root,'backup.sql'), second=join(root,'backup-repeat.sql');
  cli(source,['d1','export','DB','--local','--output',backup]);
  cli(source,['d1','export','DB','--local','--output',second]);
  const sql=await readFile(backup,'utf8');assert.equal(await readFile(second,'utf8'),sql);
  report.baseline={ballots:baseline.ballots.length,totals:baseline.totals,migrations:baseline.migrations,schema:baseline.schema};
  report.export_sha256=digest(sql);report.migration_sha256=digest(await readFile(join(migration,'0001_poll.sql')));
  // Recover twice from the same immutable dump; no migration is pre-applied.
  for(let round=1;round<=2;round++) {
   const target=await store('restore-'+round);
   cli(target,['d1','execute','DB','--local','--file',backup]);
   cli(target,['d1','migrations','apply','DB','--local']);
   p=await proxy(target);
   try {
    const db=p.env.DB;assert.deepEqual(await snapshot(db),baseline);
    const get=await worker.fetch(new Request('http://localhost/v1/polls/salsa-crisis-v1',{headers:{Origin:'http://localhost:4321'}}),env(db),{});
    assert.equal(get.status,200);assert.equal((await get.json()).total,4);
    const duplicateWorker=createWorker(()=>{throw Error('duplicate must not consume challenge');});
    const duplicate=await duplicateWorker.fetch(request(voter,'whatever'),env(db),{});
    assert.equal(duplicate.status,200);assert.deepEqual(await duplicate.json(),{accepted:true,duplicate:true,optionId:'butter'});
    await assert.rejects(db.prepare("INSERT INTO ballots SELECT poll_id,voter_hash,'whatever' FROM ballots LIMIT 1").run(),/UNIQUE/);
    await assert.rejects(db.prepare("INSERT INTO ballots VALUES ('salsa-crisis-v1','synthetic-invalid','invalid')").run(),/FOREIGN KEY/);
    await assert.rejects(db.prepare('UPDATE totals SET count=-1').run(),/CHECK/);
    assert.deepEqual(await snapshot(db),baseline);
    assert.equal((await worker.fetch(request('00000000-0000-4000-8000-000000000099','absolutely-not'),env(db),{})).status,200);
    const after=await snapshot(db);assert.equal(after.ballots.length,5);assert.equal(after.totals.find(r=>r.option_id==='absolutely-not').count,1);
    const beforeClose=await snapshot(db);assert.equal((await worker.fetch(request(),{...env(db),POLL_OPEN:'false'},{})).status,403);assert.deepEqual(await snapshot(db),beforeClose);
    await db.prepare("UPDATE totals SET count=count+1 WHERE option_id='butter'").run();
    await assert.rejects(snapshot(db),/Expected values/); // Detect count corruption; discard target.
    report.restores.push({round,exact_snapshot:true,migration_reapply_noop:true,read_total:4,duplicate_preserved:true,constraints:true,new_ballot_trigger:true,closed_preserves:true,counter_corruption_detected:true});
   } finally {await p.dispose();}
  }
  const collision=await store('pre-migrated');cli(collision,['d1','migrations','apply','DB','--local']);
  cli(collision,['d1','execute','DB','--local','--file',backup],false);
  // Failed imports are never trusted or repaired in place: discard target, restore fresh.
  const broken=join(root,'broken.sql');await writeFile(broken,sql+'\nTHIS IS INVALID SQL;\n');
  const failed=await store('failed-import');cli(failed,['d1','execute','DB','--local','--file',broken],false);
  const recovered=await store('recovered');cli(recovered,['d1','execute','DB','--local','--file',backup]);
  p=await proxy(recovered);try {assert.deepEqual(await snapshot(p.env.DB),baseline);}finally {await p.dispose();}
  report.failure_recovery={premigrated_target_rejected:true,malformed_import_rejected:true,fresh_target_recovery_exact:true,partial_import_atomicity:'not assumed'};
  // Source remains unchanged despite all target failure/recovery exercises.
  p=await proxy(source);try {assert.deepEqual(await snapshot(p.env.DB),baseline);}finally {await p.dispose();}
  report.status='passed';
  console.log(JSON.stringify(report,null,2));
 } finally {
  await rm(root,{recursive:true,force:true});
  report.temporary_stores_removed=true;
  const evidence=process.env.RECOVERY_EVIDENCE_DIR;
  if(evidence){await mkdir(evidence,{recursive:true});await writeFile(join(evidence,'commands.log'),transcript.join('\n'));await writeFile(join(evidence,'report.json'),JSON.stringify(report,null,2)+'\n');}
 }
});
