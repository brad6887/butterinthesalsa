import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const html = await readFile(new URL('../../dist/index.html', import.meta.url), 'utf8');
const code = html.match(/<script\b[^>]*id="canonical-https"[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(code, 'Compiled artifact must contain the early redirect');
for (const [input, expected] of [
  ['http://butterinthesalsa.com/', 'https://butterinthesalsa.com/'],
  ['http://butterinthesalsa.com/?from=friend#reunion-poll', 'https://butterinthesalsa.com/?from=friend#reunion-poll'],
  ['http://butterinthesalsa.com:80/path?next=one#two', 'https://butterinthesalsa.com/path?next=one#two'],
  ['https://butterinthesalsa.com/', null],
  ['http://localhost:4322/', null],
  ['http://127.0.0.1:4322/', null],
  ['http://unrelated.example/', null],
]) {
  test(`compiled HTTPS redirect for ${input}`, () => {
    const url = new URL(input); const calls = [];
    runInNewContext(code, {URL, location: {protocol: url.protocol, hostname: url.hostname, href: url.href, replace: value => calls.push(value)}});
    assert.deepEqual(calls, expected ? [expected] : []);
  });
}
