import {chromium} from "playwright";
import {writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
const base="https://butter-salsa-poll-preview.butter-salsa.workers.dev", path="/v1/polls/salsa-crisis-v1", origin="http://localhost:4322";
const evidence={url:base,checks:[],realTurnstile:"not run"};
async function check(name,route,init,status){let r=await fetch(base+route,{...init,headers:{Origin:origin,...init?.headers}});assert.equal(r.status,status,name);evidence.checks.push({name,status:r.status});return r;}
await check("results",path,{},200);
await check("CORS forbidden",path,{headers:{Origin:"https://example.org"}},403);
const pre=await check("preflight",path+"/votes",{method:"OPTIONS",headers:{"Access-Control-Request-Method":"POST"}},204);assert.equal(pre.headers.get("Access-Control-Allow-Origin"),origin);
await check("invalid JSON type",path+"/votes",{method:"POST",body:"bad"},415);
await check("invalid ballot",path+"/votes",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"},400);
await check("invalid real challenge",path+"/votes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({optionId:"butter",voterId:crypto.randomUUID(),token:"invalid"})},400);
for(let i=0;i<4;i++){const r=await fetch(base+path+"/votes",{method:"POST",headers:{Origin:origin,"Content-Type":"application/json"},body:"{}"});if(r.status===429){assert.equal(r.headers.get("Retry-After"),"60");evidence.checks.push({name:"hosted rate limit",status:429});break;}}
await writeFile("../../working/poll-review/hosted-findings.json",JSON.stringify(evidence,null,2));
const browser=await chromium.launch({executablePath:"/usr/bin/chromium",headless:true,args:["--no-sandbox"]});
try{const page=await browser.newPage();await page.route("http://localhost:8788/**",r=>r.continue({url:base+new URL(r.request().url()).pathname}));await page.goto(origin);await page.waitForTimeout(3000);console.log("Page:",await page.locator("body").innerText());console.log("Widget token available:",await page.locator("input[name=cf-turnstile-response]").evaluateAll(es=>es.some(e=>e.value.length>0)));}finally{await browser.close();}
console.log(JSON.stringify(evidence));
