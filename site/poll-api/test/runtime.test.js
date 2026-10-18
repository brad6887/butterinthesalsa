import {test} from "node:test";
import assert from "node:assert/strict";
import {Miniflare} from "miniflare";
import {readFile} from "node:fs/promises";
test("production entry boots in workerd without fixture wrapper",async()=>{
 const modules={};
 for(const name of ["worker.js","poll.js"]) modules[name]={type:"esm",contents:await readFile(new URL("../src/"+name,import.meta.url),"utf8")};
 const runtime=new Miniflare({workers:[{config:{name:"poll",compatibilityDate:"2026-10-01",manifest:{mainModule:"worker.js",modulesRoot:process.cwd(),modules}}}]});
 try {
  const response=await runtime.dispatchFetch("http://localhost/v1/polls/unknown",{headers:{Origin:"http://localhost:4321"}});
  assert.equal(response.status,404);
  assert.deepEqual(await response.json(),{error:"Unknown poll."});
 } finally {await runtime.dispose();}
});
