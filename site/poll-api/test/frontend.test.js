import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mountPoll} from '../../src/scripts/reunion-poll.ts';

// Exercise the actual client with delayed responses, without a browser, widget or remote API.
test('voting eligibility and status survive results refreshes', async t => {
  const names=['document','IntersectionObserver','localStorage','window','fetch','FormData'];
  const original=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  function setup(storageFailure) {
    let observer, script, challenge, resolveFirst;
    let gets=0, posts=0, failResults=false, pollOpen=true;
    const events={};
    const nodes={
      '.no-js':{}, form:{reportValidity:()=>true,addEventListener:(name,fn)=>events[name]=fn,querySelector:()=>({checked:false})},
      fieldset:{disabled:true}, 'button[type=submit]':{disabled:true},
      '.refresh':{disabled:true,addEventListener:(_name,fn)=>events.refresh=fn},
      '.status':{textContent:'Connecting to the reunion…'}, '.results-note':{}, '.challenge':{},
    };
    const rows=['butter','salsa','absolutely-not','whatever'].map(id=>({dataset:{result:id},count:{},meter:{},querySelector(s){return s==='meter'?this.meter:this.count;}}));
    const root={dataset:{api:'https://example.test',siteKey:'test'},querySelector:s=>nodes[s],querySelectorAll:()=>rows};
    globalThis.document={hidden:false,addEventListener(){},createElement:()=>({}),head:{append(value){script=value;}}};
    globalThis.IntersectionObserver=class {constructor(fn){observer=fn;}observe(){}};
    globalThis.localStorage={getItem(){if(storageFailure==='get') throw Error('denied'); return '11111111-1111-4111-8111-111111111111';},setItem(){if(storageFailure==='set') throw Error('denied');}};
    globalThis.window={turnstile:{render(_element,options){challenge=options;return 'test';},reset(){}}};
    globalThis.FormData=class {get(){return 'butter';}};
    globalThis.fetch=async url=>{
      if(url.endsWith('/votes')) {posts++; return {ok:true,json:async()=>({accepted:true,optionId:'butter'})};}
      if(++gets===1) await new Promise(resolve=>resolveFirst=resolve);
      if(failResults) throw Error('results offline');
      return {ok:true,json:async()=>({pollId:'salsa-crisis-v1',open:pollOpen,total:0,options:rows.map(r=>({id:r.dataset.result,count:0})),snapshotAt:new Date().toISOString()})};
    };
    mountPoll(root);
    return {nodes,events,rows,
      async initial(){observer([{isIntersecting:true}]);observer([{isIntersecting:false}]);resolveFirst();await new Promise(resolve=>setImmediate(resolve));},
      token(){script.onload();challenge.callback('synthetic-token');},
      expire(){challenge['expired-callback']();},
      error(){challenge['error-callback']();},
      fail(){failResults=true;}, close(){pollOpen=false;}, reopen(){pollOpen=true;},
      get posts(){return posts;}, get hasScript(){return Boolean(script);},
    };
  }
  try {
    for(const failure of ['get','set']) await t.test(`denied storage ${failure}, delayed GET and repeated refresh`, async()=>{
      const c=setup(failure);
      const expected='Voting needs browser storage. Enable it and reload; results remain available.';
      await c.initial();
      assert.equal(c.nodes.fieldset.disabled,true);
      assert.equal(c.nodes['button[type=submit]'].disabled,true);
      assert.equal(c.hasScript,false);
      for(let i=0;i<2;i++) await c.events.refresh();
      assert.equal(c.nodes['.status'].textContent,expected);
      assert.equal(c.nodes.fieldset.disabled,true);
      assert.match(c.nodes['.results-note'].textContent,/Results refreshed.*0 votes/);
      c.fail();await c.events.refresh();
      assert.equal(c.nodes['.status'].textContent,expected);
      assert.match(c.nodes['.results-note'].textContent,/temporarily unavailable/);
      assert.equal(c.posts,0);
    });
    await t.test('reload after storage recovery enables voting; expiry/error/confirmation survive refresh',async()=>{
      const c=setup();await c.initial();c.token();
      assert.equal(c.nodes.fieldset.disabled,false);
      assert.equal(c.nodes['button[type=submit]'].disabled,false);
      c.expire();const expiry=c.nodes['.status'].textContent;
      await c.events.refresh();assert.equal(c.nodes['.status'].textContent,expiry);
      assert.equal(c.nodes['button[type=submit]'].disabled,true);
      c.token();c.error();const error=c.nodes['.status'].textContent;
      await c.events.refresh();assert.equal(c.nodes['.status'].textContent,error);
      c.token();await c.events.submit({preventDefault(){}});
      const confirmation=c.nodes['.status'].textContent;
      assert.match(confirmation,/Your vote has been recorded/);
      await new Promise(resolve=>setImmediate(resolve));
      await c.events.refresh();assert.equal(c.nodes['.status'].textContent,confirmation);
      assert.equal(c.nodes.fieldset.disabled,true);
      assert.equal(c.posts,1);
    });
    await t.test('closed state persists on refresh and recovers when reopened',async()=>{
      const c=setup();c.close();await c.initial();c.token();
      await c.events.refresh();assert.match(c.nodes['.status'].textContent,/Voting is closed/);
      assert.equal(c.nodes.fieldset.disabled,true);
      c.reopen();await c.events.refresh();assert.equal(c.nodes['.status'].textContent,'Choose your position.');
      assert.equal(c.nodes['button[type=submit]'].disabled,false);
    });
  } finally {
    for(const [name,descriptor] of original) {
      if(descriptor) Object.defineProperty(globalThis,name,descriptor);
      else delete globalThis[name];
    }
  }
});


test('canonical HTTP does not initialize the poll while redirect is pending', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
  globalThis.window = {location: {protocol: 'http:', hostname: 'butterinthesalsa.com'}};
  try {
    // Any DOM access would initialize state/observers before secure navigation completes.
    mountPoll(new Proxy({}, {get() {throw Error('Poll initialized on HTTP');}}));
  } finally {
    if (original) Object.defineProperty(globalThis, 'window', original);
    else delete globalThis.window;
  }
});
