import {POLL, OPTIONS} from './poll.js';
const path = `/v1/polls/${POLL}`;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function hash(value, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))), b => b.toString(16).padStart(2, '0')).join('');
}

// Injection is available to tests only. The deployed entry point always uses fetch.
export function createWorker(verifyFetch = fetch) {
  return {async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').includes(origin);
    const headers = {'Content-Type':'application/json', 'Cache-Control':'no-store', 'Vary':'Origin', 'X-Content-Type-Options':'nosniff'};
    if (allowed) Object.assign(headers, {'Access-Control-Allow-Origin':origin, 'Access-Control-Allow-Methods':'GET, POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type', 'Access-Control-Expose-Headers':'Retry-After'});
    const reply = (data, status = 200, extra = {}) => Response.json(data, {status, headers:{...headers, ...extra}});
    try {
      const url = new URL(request.url);
      if (url.pathname !== path && url.pathname !== path + '/votes') return reply({error:'Unknown poll.'}, 404);
      if (!allowed) return reply({error:'Origin not allowed.'}, 403);
      if (request.method === 'OPTIONS') return new Response(null, {status:204, headers});
      if (request.method === 'GET' && url.pathname === path) {
        const cache = globalThis.caches?.default;
        const cacheKey = new Request(url.origin + path);
        let snapshot = cache && await cache.match(cacheKey);
        if (!snapshot) {
          const {results} = await env.DB.prepare('SELECT option_id, count FROM totals WHERE poll_id = ?').bind(POLL).all();
          if (results.length !== OPTIONS.length) throw Error('Migration required');
          const options = OPTIONS.map(id => ({id, count:results.find(r => r.option_id === id).count}));
          snapshot = Response.json({pollId:POLL, options, total:options.reduce((n,r) => n+r.count,0), snapshotAt:new Date().toISOString()}, {headers:{'Cache-Control':'public, max-age=10'}});
          if (cache) ctx.waitUntil(cache.put(cacheKey, snapshot.clone()));
        }
        return reply({...await snapshot.json(), open:env.POLL_OPEN === 'true'});
      }
      if (request.method !== 'POST' || url.pathname !== path + '/votes') return reply({error:'Method not allowed.'}, 405, {Allow:'GET, POST, OPTIONS'});
      if (env.POLL_OPEN !== 'true') return reply({error:'Voting is closed.'}, 403);
      if (!env.VOTER_HASH_SECRET || env.VOTER_HASH_SECRET.length < 32 || !env.TURNSTILE_SECRET || !env.TURNSTILE_HOSTNAMES || !env.IP_LIMITER || !env.ADMISSION_LIMITER) throw Error('Configuration missing');
      const ip = request.headers.get('CF-Connecting-IP');
      if (!ip) return reply({error:'Client address unavailable.'}, 503);
      const ipKey = await hash('rate:' + ip, env.VOTER_HASH_SECRET);
      if (!(await env.IP_LIMITER.limit({key:ipKey})).success || !(await env.ADMISSION_LIMITER.limit({key:POLL})).success) return reply({error:'Too many attempts. Wait a minute and try again.'}, 429, {'Retry-After':'60'});
      if (request.headers.get('Content-Type')?.split(';')[0] !== 'application/json') return reply({error:'JSON required.'}, 415);
      if (Number(request.headers.get('Content-Length')) > 4096) return reply({error:'Request too large.'}, 413);
      const reader = request.body?.getReader();
      if (!reader) return reply({error:'Invalid ballot.'}, 400);
      const chunks=[]; let size=0;
      for (;;) {
        const {value, done}=await reader.read(); if(done) break;
        size+=value.length; if(size>4096) {await reader.cancel(); return reply({error:'Request too large.'},413);} chunks.push(value);
      }
      const bytes=new Uint8Array(size); let offset=0;
      for(const chunk of chunks){bytes.set(chunk,offset); offset+=chunk.length;}
      let body; try {body=JSON.parse(new TextDecoder().decode(bytes));} catch {return reply({error:'Invalid ballot.'},400);}
      if (!body || !OPTIONS.includes(body.optionId) || typeof body.voterId !== 'string' || !uuid.test(body.voterId) || typeof body.token !== 'string' || !body.token.length || body.token.length > 2048) return reply({error:'Invalid ballot.'},400);
      const voterHash = await hash(POLL + ':' + body.voterId, env.VOTER_HASH_SECRET);
      // Recover a lost response without trying to reuse a single-use challenge.
      const prior = await env.DB.prepare('SELECT option_id FROM ballots WHERE poll_id = ? AND voter_hash = ?').bind(POLL,voterHash).first();
      if(prior) return reply({accepted:true, duplicate:true, optionId:prior.option_id});
      let challenge;
      try {
        const response = await verifyFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {method:'POST', body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:body.token,remoteip:ip}), signal:AbortSignal.timeout(8000)});
        if (!response.ok) throw Error('Challenge unavailable');
        challenge = await response.json();
      } catch {return reply({error:'Verification unavailable. Please retry with a fresh challenge.'},503);}
      if(challenge.success !== true || challenge.action !== 'vote' || !env.TURNSTILE_HOSTNAMES.split(',').includes(challenge.hostname)) return reply({error:'Verification failed or expired. Please complete a fresh challenge.'},400);
      // One insert + trigger transaction; the unique key is authoritative under races.
      const inserted=await env.DB.prepare('INSERT INTO ballots (poll_id,voter_hash,option_id) VALUES (?,?,?) ON CONFLICT(poll_id,voter_hash) DO NOTHING').bind(POLL,voterHash,body.optionId).run();
      const recorded=await env.DB.prepare('SELECT option_id FROM ballots WHERE poll_id = ? AND voter_hash = ?').bind(POLL,voterHash).first();
      return reply({accepted:true, duplicate:inserted.meta.changes===0, optionId:recorded.option_id});
    } catch {return reply({error:'Poll temporarily unavailable. Please try again.'},503);}
  }};
}
export default createWorker();
