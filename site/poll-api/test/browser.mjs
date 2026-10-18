import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const evidence=new URL('../../../working/poll-review/',import.meta.url);
await mkdir(evidence,{recursive:true});
const checks=[];
async function context(options={}) {
 const c=await browser.newContext(options);
 await c.route('https://challenges.cloudflare.com/turnstile/v0/api.js*',route=>route.fulfill({contentType:'application/javascript',body:`window.turnstile={render(el,opts){window.testChallenge=opts; el.textContent='Local test verification'; opts.callback('local-preview-only');return 'test';},reset(){window.testChallenge.callback('local-preview-only');}};`}));
 return c;
}
try {
 const c=await context({viewport:{width:390,height:844}}), page=await c.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4321/');
 await page.locator('#reunion-poll').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.results-note').textContent.includes('votes'));
 await page.getByRole('radio',{name:/Team Butter/}).focus();
 await page.keyboard.press('ArrowDown');
 assert.equal(await page.getByRole('radio',{name:/Team Salsa/}).isChecked(),true);
 await page.getByRole('button',{name:'Make My Position Official'}).click();
 await page.getByRole('status').filter({hasText:'Your vote has been recorded.'}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Make My Position Official'}).isDisabled(),true);
 checks.push('keyboard radio selection and submission; success status; submit locked');
 await page.reload();await page.locator('#reunion-poll').scrollIntoViewIfNeeded();
 await page.getByRole('radio',{name:/Team Whatever/}).check();
 await page.getByRole('button',{name:'Make My Position Official'}).click();
 await page.getByRole('status').filter({hasText:'already has a recorded vote'}).waitFor();
 assert.equal(await page.getByRole('radio',{name:/Team Salsa/}).isChecked(),true);
 checks.push('reload retry preserves browser identity and original vote');
 for(const width of [320,390,768,1440]) {
  await page.setViewportSize({width,height:900});
  await page.locator('#reunion-poll').scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const audit=await new AxeBuilder({page}).analyze();
  assert.deepEqual(audit.violations.map(v=>({id:v.id,impact:v.impact})),[]);
  await page.screenshot({path:new URL(`viewport-${width}.png`,evidence).pathname,fullPage:true});
 }
 checks.push('no horizontal overflow and zero axe violations at 320,390,768,1440');
 await page.route('**/v1/polls/salsa-crisis-v1',r=>r.fulfill({status:503,contentType:'application/json',body:'{}'}));
 await page.getByRole('button',{name:'Refresh results',exact:true}).click();
 await page.getByText('Results temporarily unavailable.',{exact:false}).waitFor();
 assert.ok(await page.locator('.count').first().textContent() !== '—');
 checks.push('results outage retains prior counts and labels unavailability');
 assert.deepEqual(errors,[]);
 // Fresh visitor: expiration and errors remove submission eligibility; a failed vote can retry.
 const c2=await context(), p2=await c2.newPage();
 await p2.clock.install();
 await p2.goto('http://localhost:4321/');await p2.locator('#reunion-poll').scrollIntoViewIfNeeded();
 await p2.waitForFunction(()=>window.testChallenge);
 await p2.evaluate(()=>window.testChallenge['expired-callback']());
 assert.equal(await p2.getByRole('button',{name:'Make My Position Official'}).isDisabled(),true);
 await p2.evaluate(()=>window.testChallenge.callback('local-preview-only'));
 await p2.getByRole('radio',{name:/Team Butter/}).check();
 await p2.route('**/votes',r=>r.fulfill({status:429,contentType:'application/json',body:JSON.stringify({error:'Too many attempts. Wait a minute and try again.'})}));
 await p2.getByRole('button',{name:'Make My Position Official'}).click();
 await p2.getByRole('status').filter({hasText:'Too many attempts'}).waitFor();
 await p2.unroute('**/votes');
 assert.equal(await p2.getByRole('button',{name:'Make My Position Official'}).isEnabled(),true);
 checks.push('expired challenge disables vote; rate-limit error remains retryable');
 // Fast-forward a real client timer; scroll-away stops recurring requests.
 let gets=0;p2.on('request',r=>{if(r.url().endsWith('salsa-crisis-v1')) gets++;});
 await p2.clock.runFor(31000);assert.ok(gets>=1);const before=gets;
 await p2.evaluate(()=>scrollTo(0,0));await p2.waitForTimeout(100);
 await p2.clock.runFor(61000);assert.equal(gets,before);
 checks.push('30-second visible refresh; scrolling away pauses refresh');
 const c3=await context();await c3.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}});});
 const p3=await c3.newPage();await p3.goto('http://localhost:4321/');await p3.locator('#reunion-poll').scrollIntoViewIfNeeded();
 await p3.getByRole('status').filter({hasText:'Voting needs browser storage'}).waitFor();
 assert.equal(await p3.getByRole('button',{name:'Make My Position Official'}).isDisabled(),true);
 checks.push('blocked browser storage disables voting with explanation');
 const c4=await browser.newContext({javaScriptEnabled:false}), p4=await c4.newPage();await p4.goto('http://localhost:4321/');
 assert.equal(await p4.getByText('Live voting and results require JavaScript.').isVisible(),true);
 checks.push('no-JavaScript instructions visible');
 await writeFile(new URL('browser-findings.json',evidence),JSON.stringify({passed:true,checks,limits:'Synthetic Turnstile widget and verifier; no live account or human screen-reader test.'},null,2)+'\n');
 console.log(JSON.stringify(checks,null,2));
} finally {await browser.close();}
