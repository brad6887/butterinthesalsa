type Turnstile = {render:(element:HTMLElement, options:Record<string,unknown>)=>string; reset:(id:string)=>void};
declare global {interface Window {turnstile?:Turnstile}}
export function mountPoll(root:HTMLElement) {
  // Navigation may still be pending: never initialize the poll on canonical HTTP.
  if (window.location?.protocol === 'http:' && window.location.hostname === 'butterinthesalsa.com') return;
  root.querySelector<HTMLElement>(".no-js")!.hidden=true;
  const api=root.dataset.api, siteKey=root.dataset.siteKey;
  if(!api || !siteKey) return;
  const form=root.querySelector('form')!;
  const fieldset=root.querySelector('fieldset')!;
  const submit=root.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const refresh=root.querySelector<HTMLButtonElement>('.refresh')!;
  const status=root.querySelector<HTMLElement>('.status')!;
  const note=root.querySelector<HTMLElement>('.results-note')!;
  const endpoint=api.replace(/\/$/,'')+'/v1/polls/salsa-crisis-v1';
  let voterId:string, token='', widget:string|undefined, voted=false, busy=false, open=false;
  let storageReady=false;
  let visible=false, loading=false, failures=0, timer:ReturnType<typeof setTimeout>|undefined;
  const storageKey='butter-salsa-voter-v1';
  function update() {
    fieldset.disabled=!storageReady || busy || voted || !open;
    submit.disabled=fieldset.disabled || !token;
  }
  function message(text:string) {status.textContent=text;}
  function schedule() {
    clearTimeout(timer);
    if(visible && !document.hidden) timer=setTimeout(()=>load(),Math.min(30000 * 2**failures,240000));
  }
  async function load(manual=false) {
    if(loading) return; loading=true; refresh.disabled=true;
    try {
      const response=await fetch(endpoint,{signal:AbortSignal.timeout(10000),cache:'no-store'});
      if(!response.ok) throw Error();
      const data=await response.json();
      const rows=[...root.querySelectorAll<HTMLElement>('[data-result]')];
      if(data.pollId!=='salsa-crisis-v1' || typeof data.open!=='boolean' || !Number.isSafeInteger(data.total) || data.total<0 || !Array.isArray(data.options) || data.options.length!==4 || !Number.isFinite(Date.parse(data.snapshotAt)) || rows.some(row=>data.options.filter((r:{id:string,count:number})=>r.id===row.dataset.result && Number.isSafeInteger(r.count) && r.count>=0).length!==1) || data.options.reduce((n:number,r:{count:number})=>n+r.count,0)!==data.total) throw Error();
      for(const row of rows) {
        const item=data.options.find((r:{id:string})=>r.id===row.dataset.result);
        const percent=data.total ? item.count/data.total*100 : 0;
        row.querySelector('.count')!.textContent=`${item.count} (${percent.toFixed(1)}%)`;
        row.querySelector('meter')!.value=percent;
      }
      open=data.open; failures=0; update();
      if(storageReady && !voted && !busy) {
        if(!open) message('Voting is closed. Results remain available.');
        else if(status.textContent === 'Voting is closed. Results remain available.' || (token && status.textContent === 'Connecting to the reunion…')) message('Choose your position.');
      }
      // Results announcements must not erase voting eligibility, errors or confirmation.
      note.textContent=`${manual ? 'Results refreshed. ' : ''}${data.total} votes · Updated ${new Date(data.snapshotAt).toLocaleTimeString()}`;
    } catch {failures=Math.min(failures+1,3); note.textContent='Results temporarily unavailable. Any counts shown are from the last successful update.';}
    finally {loading=false; refresh.disabled=false; schedule();}
  }
  refresh.addEventListener('click',()=>load(true));
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting; if(visible && !document.hidden) void load(); else clearTimeout(timer);}).observe(root);
  document.addEventListener('visibilitychange',()=>{if(document.hidden) clearTimeout(timer); else if(visible) void load();});
  try {
    voterId=localStorage.getItem(storageKey)||crypto.randomUUID();
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(voterId)) voterId=crypto.randomUUID();
    localStorage.setItem(storageKey,voterId);
    storageReady=true;
  } catch {update(); message('Voting needs browser storage. Enable it and reload; results remain available.'); return;}
  const script=document.createElement('script');
  script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async=true;
  script.onerror=()=>message('Verification could not load. Reload to try again; results remain available.');
  script.onload=()=>{
    try {widget=window.turnstile!.render(root.querySelector<HTMLElement>('.challenge')!,{sitekey:siteKey,action:'vote',size:'flexible',callback:(value:string)=>{token=value; update(); if(open && status.textContent === 'Connecting to the reunion…') message('Choose your position.');},'expired-callback':()=>{token=''; update(); message('Verification expired. Complete it again before voting.');},'error-callback':()=>{token='';update();message('Verification failed. Please retry the challenge.');}});}
    catch {message('Verification unavailable. Reload to try again.');}
  };
  document.head.append(script);
  form.addEventListener('submit',async(event)=>{
    event.preventDefault(); if(busy || voted || !token || !open || !form.reportValidity()) return;
    const optionId=new FormData(form).get('position'); busy=true; update(); message('Recording your position…');
    try {
      const response=await fetch(endpoint+'/votes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({optionId,voterId,token}),signal:AbortSignal.timeout(15000)});
      const data=await response.json();
      if(!response.ok || data.accepted!==true) throw Error(data.error || 'Vote could not be recorded. Retry with a fresh challenge.');
      voted=true;
      const recorded=form.querySelector<HTMLInputElement>(`input[value="${data.optionId}"]`);
      if(recorded) recorded.checked=true;
      message(data.duplicate ? 'This browser already has a recorded vote. Your original position stands.' : 'Your vote has been recorded. Your friendships are your responsibility.');
      // Wait out the API’s short shared cache for the next fresh snapshot.
      void load();
    } catch(error) {message(error instanceof Error && error.name!=='TimeoutError' && error.name!=='TypeError' ? error.message : 'Connection interrupted. Retry with a fresh challenge; your vote will only be counted once.');}
    finally {busy=false; token=''; if(widget && !voted) window.turnstile?.reset(widget); update();}
  });
}
