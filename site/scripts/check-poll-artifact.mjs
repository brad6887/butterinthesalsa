import assert from 'node:assert/strict';
import {readFile, readdir, stat} from 'node:fs/promises';
import {resolve, relative, sep} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const site = fileURLToPath(new URL('../', import.meta.url));
const settings = JSON.parse(await readFile(new URL('../poll.production.json', import.meta.url), 'utf8'));

export async function validateArtifact(directory = resolve(site, 'dist')) {
  // Verify the frontend source of truth against the actual production resource records.
  const config = JSON.parse(await readFile(new URL('../poll-api/wrangler.production.json', import.meta.url), 'utf8'));
  const widget = JSON.parse(await readFile(new URL('../poll-api/production-widget.json', import.meta.url), 'utf8'));
  assert.equal(settings.apiUrl, `https://${config.name}.butter-salsa.workers.dev`, 'Wrong production API URL');
  assert.equal(config.name, 'butter-salsa-poll-production');
  assert.equal(config.vars.ALLOWED_ORIGINS, 'https://butterinthesalsa.com');
  assert.equal(settings.siteKey, widget.sitekey, 'Wrong production widget key');
  assert.deepEqual(widget.domains, ['butterinthesalsa.com']);
  assert.match(settings.siteKey, /^0x4[A-Za-z0-9_-]+$/, 'Invalid production widget key');
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, {withFileTypes: true})) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else files.push(path);
    }
  }
  directory = resolve(directory);
  await walk(directory);
  assert.ok(!files.some(path => relative(directory, path) === 'CNAME'), 'Unexpected CNAME');
  const html = await readFile(resolve(directory, 'index.html'), 'utf8');
  const redirect = html.match(/<script\b[^>]*id="canonical-https"[^>]*>([\s\S]*?)<\/script>/);
  assert.ok(redirect, 'Missing early HTTPS redirect');
  assert.ok(!/\b(?:type|src|async|defer)=?/.test(redirect[0].split('>')[0]), 'HTTPS redirect must run inline synchronously');
  const firstModule = html.search(/<script\b[^>]*type="module"/);
  assert.ok(firstModule === -1 || html.indexOf(redirect[0]) < firstModule, 'HTTPS redirect must precede client modules');
  const sections = [...html.matchAll(/<section\b[^>]*\bid="reunion-poll"[^>]*>/g)];
  assert.equal(sections.length, 1, 'Expected one poll section');
  assert.ok(sections[0][0].includes(`data-api="${settings.apiUrl}"`), 'Missing or wrong production API');
  assert.ok(sections[0][0].includes(`data-site-key="${settings.siteKey}"`), 'Missing or wrong production widget');
  assert.match(html, /<fieldset\b[^>]*\bdisabled(?:[\s=>])/, 'Initial voting choices must be disabled');
  assert.match(html, /<button\b[^>]*type="submit"[^>]*\bdisabled(?:[\s=>])/, 'Initial submit must be disabled');
  const modules = [...html.matchAll(/<script\b[^>]*type="module"[^>]*src="([^"]+)"[^>]*>/g)];
  assert.ok(modules.length > 0, 'Missing client module');
  for (const [, src] of modules) {
    assert.ok(src.startsWith('/_astro/'), 'Client module must be a local build asset');
    const path = resolve(directory, '.' + src);
    assert.ok(relative(directory, path).split(sep)[0] !== '..', 'Asset escapes artifact');
    assert.ok((await stat(path)).size > 0, 'Missing or empty client module');
  }
  for (const path of files.filter(path => /\.(?:html|js|css)$/.test(path))) {
    const text = await readFile(path, 'utf8');
    assert.doesNotMatch(text, /localhost|127\.0\.0\.1|butter-salsa-poll-preview|0x4AAAAAAFaHmwzg07tJ_mV_|1x00000000000000000000AA|replace-with-approved-site-key/i, `Preview/test settings in ${relative(directory, path)}`);
  }
  return {apiUrl: settings.apiUrl, siteKey: settings.siteKey, clientModules: modules.length};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = await validateArtifact(process.argv[2]);
    console.log('Production poll artifact verified:', JSON.stringify(result));
  } catch (error) {
    console.error('Production poll artifact rejected:', error.message);
    process.exitCode = 1;
  }
}
