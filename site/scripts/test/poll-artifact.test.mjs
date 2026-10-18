import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, cp, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {validateArtifact} from '../check-poll-artifact.mjs';

const dist = new URL('../../dist/', import.meta.url);
test('actual production build passes artifact validation', async () => {
  assert.equal((await validateArtifact()).clientModules > 0, true);
});

// Mutate copies of the actual output: these cases previously passed publication checks.
for (const [name, mutate, error] of [
  ['missing HTTPS redirect', html => html.replace(/<script\b[^>]*id="canonical-https"[^>]*>[\s\S]*?<\/script>/, ''), /HTTPS redirect/],
  ['late HTTPS redirect', html => {
    const tag = html.match(/<script\b[^>]*id="canonical-https"[^>]*>[\s\S]*?<\/script>/)[0];
    return html.replace(tag, '') + tag;
  }, /precede client modules/],
  ['deferred HTTPS redirect', html => html.replace('id="canonical-https"', 'id="canonical-https" defer'), /inline synchronously/],
  ['empty API', html => html.replace(/data-api="[^"]*"/, 'data-api'), /production API/],
  ['preview API', html => html.replace('butter-salsa-poll-production', 'butter-salsa-poll-preview'), /production API/],
  ['wrong widget', html => html.replace('0x4AAAAAAFaOigIB5KHmUF-l', 'replace-with-approved-site-key'), /production widget/],
  ['missing poll', html => html.replace('id="reunion-poll"', 'id="missing-poll"'), /poll section/],
  ['missing client', html => html.replace(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g, ''), /client module/],
  ['missing client asset', html => html.replace(/src="\/_astro\/[^"]+\.js"/, 'src="/_astro/missing.js"'), /ENOENT/],
  ['preview setting in bundle', html => html + '<!-- http://localhost:8787 -->', /Preview\/test settings/],
]) {
  test(`rejects ${name}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), 'poll-artifact-'));
    try {
      await cp(dist, directory, {recursive: true});
      const index = join(directory, 'index.html');
      const html = await readFile(index, 'utf8');
      const changed = mutate(html);
      assert.notEqual(changed, html, 'Mutation must exercise actual output');
      await writeFile(index, changed);
      await assert.rejects(validateArtifact(directory), error);
    } finally {await rm(directory, {recursive: true, force: true});}
  });
}

test('rejects an unexpected CNAME', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'poll-artifact-'));
  try {
    await cp(dist, directory, {recursive: true});
    await writeFile(join(directory, 'CNAME'), 'unexpected.example');
    await assert.rejects(validateArtifact(directory), /CNAME/);
  } finally {await rm(directory, {recursive: true, force: true});}
});
