import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const base='https://butter-salsa-poll-preview.butter-salsa.workers.dev',path='/v1/polls/salsa-crisis-v1',origin='http://localhost:4322';
const out={started:new Date().toISOString(),checks:[],limits:['Expired-token verification requires an unused real token held beyond its lifetime; not tested.','Reused-token verification requires a successfully consumed real token with a fresh voter ID; not tested unless recorded below.']};
async function req(name,route,init={},expected){const r=await fetch(base+route,{...init,headers:{Origin:origin,...init.headers}});const body=await r.json().catch(()=>null);out.checks.push({name,status:r.status,expected,pass:expected===undefined?null:r.status===expected,body,allowOrigin:r.headers.get('access-control-allow-origin'),retryAfter:r.headers.get('retry-after')});return {status:r.status,body};}
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
await req('initial results',path,{},200);
const c=await browser.newContext(),page=await c.newPage();
await page.route('http://localhost:4322/',async r=>{const response=await r.fetch();let html=await response.text();if(!html.includes('data-api="http://localhost:8788"')) throw Error('Unexpected preview API configuration');html=html.replace('data-api="http://localhost:8788"','data-api="'+base+'"');await r.fulfill({response,body:html});});
await page.goto(origin);if(await page.locator('#reunion-poll').getAttribute('data-api')!==base) throw Error('Hosted API target not established');await page.locator('#reunion-poll').scrollIntoViewIfNeeded();
try{
await page.waitForFunction(()=>[...document.querySelectorAll('input[name="cf-turnstile-response"]')].some(e=>e.value.length>0),{},{timeout:45000});
await page.getByRole('radio',{name:/Team Butter/}).check();
let used;
page.on('request',r=>{if(r.url()===base+path+'/votes')used=JSON.parse(r.postData());});
let responsePromise=page.waitForResponse(r=>r.url()===base+path+'/votes');
await page.getByRole('button',{name:'Make My Position Official'}).click();
let response=await responsePromise;out.checks.push({name:'real browser valid vote',status:response.status(),body:await response.json()});
await page.reload();await page.locator('#reunion-poll').scrollIntoViewIfNeeded();
await page.waitForFunction(()=>[...document.querySelectorAll('input[name="cf-turnstile-response"]')].some(e=>e.value.length>0),{},{timeout:45000});
await page.getByRole('radio',{name:/Team Whatever/}).check();
responsePromise=page.waitForResponse(r=>r.url()===base+path+'/votes');
await page.getByRole('button',{name:'Make My Position Official'}).click();
response=await responsePromise;out.checks.push({name:'same browser duplicate different selection',status:response.status(),body:await response.json()});
await req('consumed token fresh browser identity',path+'/votes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...used,voterId:crypto.randomUUID()})},400);
}catch(e){out.limits.push('Real browser path incomplete: '+e.message.split('\n')[0]);}
await page.screenshot({path:'../../working/poll-review/hosted-acceptance-browser.png',fullPage:true});
await writeFile('../../working/poll-review/hosted-acceptance.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
}finally{await browser.close();}

