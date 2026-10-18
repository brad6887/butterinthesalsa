# Reunion poll operations

The Astro frontend is static GitHub Pages; voting is a separate Worker with D1 and Turnstile. No backend release automation or new Abbey command is needed. Only public API URL and site key enter the frontend bundle.

## Current state — 2026-10-18

Hosted preview acceptance is complete: real vote, owner-observed same-browser duplicate behavior, consumed-token replay under a fresh identity, unused-token expiration after 310.4 seconds, invalid inputs, CORS, bounded single-location rate limiting, and D1/live results consistency. Preview now contains **three ballots: Butter 1, Absolutely not 1, Whatever 1**. The owner confirmed the third ballot on 2026-10-18; preserve all three. Do not reset it or repeat write-producing acceptance casually.

Current evidence: [final hosted acceptance](../../docs/session-updates/2026-10-18-final-hosted-poll-acceptance.md), [production readiness review and human follow-up](../../docs/session-updates/2026-10-18-poll-production-readiness-review.md), and `working/poll-review/hosted-{recovered-expiration,recovery-d1}.json` from repository root. Earlier zero-count, TLS-failure and incomplete-acceptance snapshots in historical session captures are superseded by final acceptance; retain them as historical evidence.

- Approved Cloudflare account: `66f376df57f4fb383fde1bbe8b29ffb1`.
- Hosted preview Worker: `butter-salsa-poll-preview`, endpoint `https://butter-salsa-poll-preview.butter-salsa.workers.dev`, accepted version `3f2da025-703c-4b45-bbc9-a048f2dea6ff`.
- Preview D1: `butter-salsa-preview`, ID `af9eb006-6128-4e5e-9046-735f33bbb13a`; migration 0001 applied. Never reuse it for production.
- Preview managed widget: `0x4AAAAAAFaHmwzg07tJ_mV_`, hostname `localhost`, no pre-clearance. Public metadata is `preview-widget.json`.
- Hosted configuration: `wrangler.hosted-preview.json`; origin exactly `http://localhost:4322`. Both `TURNSTILE_SECRET` and `VOTER_HASH_SECRET` bindings are uploaded. Ignored `.dev.vars` holds preview secrets with mode 0600. OAuth credentials remain outside the repository; do not expand scopes to silence warnings or print/copy values into evidence.
- Existing Astro preview runs from disposable `/tmp/butter-real-preview` on edge01 loopback port 4322 and points to the hosted preview API. The Mac SSH tunnel forwards port 4322. Preserve both. Source changes in this repository do not update that disposable copy automatically.
- The API is publicly reachable. Origin filtering is not access control; do not describe this hosted deployment as private. Use separately approved Access or equivalent if private hosting is required.
- Owner keyboard navigation, arrow selection and 200% zoom checks passed. Owner subsequently reported the separate read-only Tailscale preview looks good on the iPhone with VoiceOver, with no issues reported. This is human visual/VoiceOver acceptance of the adapted mobile presentation; its Turnstile and voting client are omitted. Owner also reported real Turnstile navigation with VoiceOver on the existing Mac preview passed, including entry/exit without a focus trap and no vote submission; iPad and individual landscape/large-text/refresh checks were not separately reported. Automated axe checks are not human acceptance. See the [owner acceptance record](../../docs/session-updates/2026-10-18-owner-accessibility-retention-decisions.md).
- Production is **provisioned and deployed CLOSED** under explicit owner authorization. D1 `butter-salsa-production` is `a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3`; migration 0001 applied. Worker `butter-salsa-poll-production`, version `6d52882d-e06e-4e54-98fc-7c23c38b7f0c`, serves `https://butter-salsa-poll-production.butter-salsa.workers.dev`. Widget `0x4AAAAAAFaOigIB5KHmUF-l` is configured for `butterinthesalsa.com`; the Worker additionally enforces the exact hostname. Both production secrets are bound. Zero ballots/all four zero counters and rejected POSTs verified. Public Pages still serves the splash. Opening voting, commits/pushes, public release, DNS and Pages changes remain unauthorized.

## Configuration map

| File | Purpose |
| --- | --- |
| `wrangler.json` | Existing closed preview default; workers.dev disabled. Not a production close config. |
| `wrangler.hosted-preview.json` | Existing open hosted preview only. |
| `wrangler.real-local.json` | Real Siteverify with local D1 on 8788; explicit `--local`. |
| `wrangler.local.json` | Synthetic loopback fixture on 8787; never deploy. |
| `wrangler.production.example.json` | Proposed separate production Worker/D1; initially closed, workers.dev enabled for readable results. |
| `wrangler.production-close.example.json` | Emergency-close template; same production identity, endpoint, DB, origins and limiters, POLL_OPEN=false. |
| `rollback.production.example.json` | Operator release/rollback record, not a Wrangler config. Must pin actual compatible production version and resource IDs. |

Production templates use nil UUID `00000000-0000-0000-0000-000000000000` as reference placeholders; actual production configs now bind the provisioned database. They are review artifacts, not deployable release configurations. Do not deploy example files or assume a placeholder prevents all provider-side effects. No deploy scripts were added. Fill and review real configurations only after provisioning is authorized. Keep a completed production/close pair synchronized except for POLL_OPEN; never use the preview default to close production.

## Owner retention and recovery decisions — 2026-10-18

Owner chose to keep poll data until a later explicit decision to close; no automatic closure/deletion date or scheduled job. Closure preserves ballots, counters and the existing HMAC. Deletion of data, private copies, secrets or resources requires a separate explicit decision; revisit retention at closure.

For this informal poll, owner explicitly accepts local-only secret custody and unproven hosted recovery. Independent off-host backup and a hosted restore rehearsal are not owner-required prerequisites; the technical gaps remain unverified. Loss of local custody or a failed hosted recovery may lose ballots or duplicate-identity continuity. Preserve data/HMAC and keep voting closed if recovery is uncertain. This decision does not authorize opening voting, release or any recovery mutation. Human mobile/screen-reader acceptance remains pending. See [owner decision and acceptance record](../../docs/session-updates/2026-10-18-owner-accessibility-retention-decisions.md).

## Actual closed production configuration — 2026-10-18

Use `wrangler.production.json` and `wrangler.production-close.json`; both are identical and CLOSED, bind the actual production D1 and use namespaces 2001/2002. Examples remain unchanged reference templates. `production-widget.json` contains only public widget metadata. `rollback.production.json` records the actual deployed version and source digests are under `working/poll-production/resumed/source-digests.json`. No public frontend has been released and no earlier production rollback version exists.

Private recovery custody: `edge01:/home/bcooke/.local/state/butter-salsa-production/worker-secrets.json`, mode 0600 in a 0700 directory, outside Git. The operator can re-upload these existing bindings with `npx wrangler secret bulk /home/bcooke/.local/state/butter-salsa-production/worker-secrets.json --config wrangler.production.json` from `site/poll-api`, only under separate operational authorization. Never print/copy values into evidence, never rotate HMAC as a code rollback. File permissions and equality with the uploaded Turnstile secret were verified; independent off-host backup and actual secret-loss recovery have not been tested.

Acceptance and limitations: [closed production session](../../docs/session-updates/2026-10-18-closed-poll-production-provisioning.md). Owner resolved the prior three-vote blocker; the blocked capture remains historical. Closed acceptance does not prove successful production voting/Turnstile challenges, remote data restore, screen-reader/mobile acceptance or public-release readiness. The preparation checklist below is retained as procedural guidance; its provisioning steps are complete, while public release and reopening remain separate approval gates.

## Canonical HTTPS entry

The site runs a small synchronous inline redirect at the start of the head, before client modules, only for HTTP on `butterinthesalsa.com`. It uses location.replace to preserve the path, query and fragment on HTTPS without adding a back-navigation loop. HTTPS and local preview URLs are left alone. The poll client also refuses to initialize on canonical HTTP while navigation is pending. This is a browser redirect in the generated site, not a server 301 or a hosting/DNS setting. Voting still requires JavaScript.

Release validation checks the early inline script and rejects missing, deferred or late redirects; compiled-script cases cover HTTP, HTTPS, path/query/fragment preservation and unchanged local preview/unrelated hosts. The client test verifies no poll initialization while canonical HTTP navigation is pending. Production API origin remains exactly `https://butterinthesalsa.com`.

## Local validation

From `site/poll-api`: `npm test`, `npm audit`, `npm run check` (Worker bundle dry run only). Tests include actual TypeScript client state with delayed results/storage failures, isolated local D1 concurrency/verification, direct workerd startup and production-template separation. Node must support `--experimental-strip-types` (the edge01 Node 22.23.3 does). No new dependency was added.

Template-only bundle checks, which do not provision or deploy:

```sh
WRANGLER_SEND_METRICS=false npx wrangler deploy --dry-run --config wrangler.production.example.json --outdir .wrangler/production-dry-run
WRANGLER_SEND_METRICS=false npx wrangler deploy --dry-run --config wrangler.production-close.example.json --outdir .wrangler/production-close-dry-run
```

From `site`: install both dependency sets with `npm ci` and `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci --prefix poll-api`, then run `npm run validate:release`. This builds the configured production artifact, validates it, runs the isolated poll tests and the artifact rejection tests. The Pages build job runs this same gate before artifact upload; it never deploys a Worker or opens voting. Abbey project validation lists the same command. `npm run build` itself also rejects an invalid artifact, so Abbey site build and publish dry run include the artifact check.

Production public settings have one frontend source of truth, `site/poll.production.json`, cross-checked against actual production Worker/widget records. `import.meta.env.PROD` selects those settings; ambient PUBLIC_* values cannot redirect a production build to preview. `npm run dev` still uses explicit PUBLIC_POLL_API_URL/PUBLIC_TURNSTILE_SITE_KEY for local previews. Server secrets never enter either frontend path. Local production artifact inspection requires a mocked approved-origin API or the real canonical site origin; localhost is intentionally rejected by the production API. No production vote is needed for a closed-artifact review.

From repository root: `abbey site build`, `abbey site validate`, `abbey site publish --dry-run`, `git diff --check`. Audit `site` dependencies separately. Capture one coherent session with `abbey session capture`, complete its record and run `abbey review`.

### Synthetic loopback preview

Only if another preview is needed, use separate free ports and do not replace the existing 4322 process/tunnel. From `site/poll-api`:

```sh
WRANGLER_SEND_METRICS=false npm run migrate:preview
WRANGLER_SEND_METRICS=false npm run preview:local
```

From `site`:

```sh
PUBLIC_POLL_API_URL=http://localhost:8787 PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run dev -- --host 127.0.0.1 --port 4321
```

Forward 4321 and 8787 if needed. `npm run test:browser` uses 4321/8787, system Chromium, a synthetic widget/verifier and writes synthetic local ballots and screenshots under `working/poll-review`. It does not prove real verification or human acceptance. Copy its output to a fresh evidence directory if preserving prior screenshots is required. Its storage test checks disabled submission, while `frontend.test.js` also checks fieldset/status behavior after delayed loads and refresh.

`test/local-worker.js` refuses non-loopback request hostnames and accepts fixture tokens only. Never deploy it or `wrangler.local.json`; never expose it publicly. Persistent fixture data lives in ignored `.wrangler/preview-data`; tests use their own nonpersistent D1. Real-local validation uses `npm run migrate:real`/`npm run preview:real` and `.wrangler/real-preview`, not remote D1. Do not reset existing data in this workflow.

Historical `hosted-*.mjs`/HTML helpers are acceptance aids, not a production release gate. Some record pass flags without failing their process or do not assert limiter occurrence; some overwrite existing evidence names. The token harness adds a preview ballot. Inspect target, assertions and output path before any authorized reuse. This session does not rerun hosted acceptance.

## Database recovery rehearsal — local only, 2026-10-18

Run from `site/poll-api`:

```sh
RECOVERY_EVIDENCE_DIR=../../working/poll-recovery node --test test/recovery.test.js
# Full focused suite:
RECOVERY_EVIDENCE_DIR=../../working/poll-recovery npm test
```

The executable test is the operator procedure for this synthetic rehearsal. It creates a unique `/tmp/butter-recovery-*` directory and separate source/restore/failure config directories. Each config binds DB to `recovery-only`, nil UUID, and the current absolute migrations directory; default local persistence is confined to that config's `.wrangler/state/v3`. It never selects an existing preview or production config. All temporary databases and SQL dumps are removed in `finally`; only token-free command output, aggregate/schema verification, digests and pass results remain in the evidence directory. Do not run concurrent evidence-producing invocations into the same evidence directory.

Exact underlying operations (the test supplies absolute values for `$WRANGLER`, `$SOURCE_CONFIG`, `$FRESH_CONFIG`, `$BACKUP` and `$REPEAT`; see `commands.log` for expanded commands and results):

```sh
# SOURCE_CONFIG and FRESH_CONFIG are separate temporary local-only configurations.
WRANGLER_SEND_METRICS=false "$WRANGLER" d1 migrations apply DB --local --config "$SOURCE_CONFIG"
# Test seeds four synthetic votes through the real Worker with an injected verifier.
WRANGLER_SEND_METRICS=false "$WRANGLER" d1 export DB --local --config "$SOURCE_CONFIG" --output "$BACKUP"
WRANGLER_SEND_METRICS=false "$WRANGLER" d1 export DB --local --config "$SOURCE_CONFIG" --output "$REPEAT"
cmp "$BACKUP" "$REPEAT"
# Import the complete dump into an EMPTY target, without pre-applying migrations.
WRANGLER_SEND_METRICS=false "$WRANGLER" d1 execute DB --local --config "$FRESH_CONFIG" --file "$BACKUP"
WRANGLER_SEND_METRICS=false "$WRANGLER" d1 migrations apply DB --local --config "$FRESH_CONFIG"
# Last command is a no-op because the export includes d1_migrations.
```

Wrangler 4.151.1 / Node 22.23.3: two exports of the unchanged source are byte-identical within a run. Two independent fresh restores exactly match ordered ballots, all four totals, application schema/trigger and migration ledger. Baseline: Butter 2, Salsa 1, Absolutely not 0, Whatever 1. SQL export ordering preserves counts without firing the insert trigger twice. The test compares actual schema SQL, checks foreign keys, and compares every counter to grouped ballot rows. No blanket claim of cross-version export byte stability is made.

Post-restore Worker GET returns total 4; duplicate identity with a different requested choice returns original Butter and duplicate=true without calling verification or changing rows. Raw duplicate insertion, invalid foreign key and negative counter updates fail without changing the snapshot. One new synthetic identity increments exactly one counter (total 5); closed voting rejects writes and preserves the full snapshot. Deliberately corrupting a target counter is detected by the grouped-ballot invariant.

Full import into an already migrated target fails on `d1_migrations.id` uniqueness with this dump. A deliberately malformed import also fails. Neither failure is a reason to replay migrations, delete real ballots, or repair live totals. Treat failed targets as untrusted: discard only the disposable target, create a fresh isolated target, import the unchanged backup and verify again. Fresh recovery matches the source exactly; the source remains unchanged. Partial-import atomicity is deliberately not assumed.

For independent read verification against an isolated restored target, use `d1 execute DB --local --config "$FRESH_CONFIG" --command '<SQL>'` with each of:

```sql
SELECT name, sql FROM sqlite_schema WHERE name IN ('ballots','totals','count_ballot','d1_migrations') ORDER BY name;
SELECT * FROM d1_migrations ORDER BY id;
SELECT poll_id, option_id, count FROM totals ORDER BY poll_id, option_id;
SELECT poll_id, option_id, COUNT(*) AS ballots FROM ballots GROUP BY poll_id, option_id ORDER BY poll_id, option_id;
PRAGMA foreign_key_check;
```

D1 rejects `PRAGMA integrity_check` with SQLITE_AUTH; the test records that boundary. Full SQLite page integrity is not claimed. Compare all four counters, treating missing grouped options as zero. A matching total alone is insufficient. The test additionally compares exact ordered synthetic ballot rows and enforces constraints after restore. Keep real voter hashes and exports in approved private backup custody, outside Git, public artifacts and routine logs; this synthetic test is not a real backup custody or HMAC-secret recovery exercise.

Recovery evidence: `working/poll-recovery/{report.json,commands.log,tests.log}`; [session capture](../../docs/session-updates/2026-10-18-poll-database-recovery-rehearsal.md). Rollback template now links this evidence but remains UNPREPARED. Project planning files still describe the earlier splash release; this session capture records the current bounded work without rewriting broader planning.

### Limits and future hosted recovery gate

This proves installed local D1/Worker behavior only. It does not prove remote import/export atomicity, managed export formatting, Time Travel, request blocking duration, large-data behavior, remote migration-ledger parity, binding cutover, real verification, secret custody or provider outage recovery. Cloudflare's [export/import documentation](https://developers.cloudflare.com/d1/best-practices/import-export-data/) confirms SQL export/import and warns that a running export blocks other database requests. Its [migration documentation](https://developers.cloudflare.com/d1/reference/migrations/) describes the migration ledger. Neither documentation nor local passing tests constitute hosted restore acceptance.

A future separately authorized rehearsal must use a newly provisioned isolated remote database, privately export the exact approved source/config during a maintenance window, import into the empty isolated target, verify schema/ledger/ballot/counter/constraint and Worker behavior, then separately review any binding cutover with a closed compatible artifact and preserved HMAC. Do not substitute --remote in these synthetic commands, create resources, switch bindings, restore over live data or rotate secrets under this session's authorization. If validation fails, leave the active database/binding intact and discard only the explicitly approved recovery target; preserve the backup for investigation.

## Runtime safeguards and privacy

- GET `/v1/polls/salsa-crisis-v1` returns all aggregate choices, total, timestamp and open flag. Shared aggregates cache for ten seconds; the open flag is applied outside the cache. Browsers get no-store and poll every thirty seconds while visible, with up to four-minute error backoff. Last-known counts are labeled stale on failure. Results refresh announcements are separate from voting status.
- POST `/v1/polls/salsa-crisis-v1/votes` accepts `{optionId,voterId,token}`: four fixed choices, UUID identity, JSON, streamed 4096-byte body cap and 2048-character token cap. Exact origin allowlisting is not authentication.
- Production entry always uses real Siteverify with an eight-second timeout, success=true, exact hostname and action `vote`. Failed verification never inserts. Duplicate recovery returns an already recorded choice before verifying a fresh challenge; this supports lost-response retries without spending a token again.
- D1 primary key `(poll_id,voter_hash)` and insert trigger count exactly one ballot under races. No mutable-ballot or public admin route. A changed question needs a new poll ID/migration.
- Browser storage is required for voting eligibility. Denied storage keeps choices and Submit disabled; results remain usable. Enabling storage requires reload. Expiry/error/closed/confirmation messages are not replaced by results refresh.
- HMAC-SHA256 separates poll identities. Browser stores a random ID; D1 stores only poll, keyed hash and choice. Raw IP is transiently used for Siteverify and a hashed limiter key, not saved in D1. No body/token logging; Worker observability is disabled. Cloudflare provider processing still applies.
- Five attempts/IP/minute and sixty admitted attempts/location/minute are approximate abuse controls, not a global quota. 429 exposes Retry-After: 60. Shared NATs may affect legitimate users. GET requests are not rate-limited here; monitor request/read/write usage after release, including polling and cache hits.
- Clearing storage or changing browser bypasses duplicate controls. This is not identity-verified voting. Notice states storage remains until cleared and ballots until owner deletion. Decide closure/deletion and private backup retention before release; no automatic deletion is implemented.

## Proposed production preparation — approval required before execution

1. Approve account, Worker `butter-salsa-poll-production`, new D1 `butter-salsa-production`, a separate production Turnstile widget and fresh production secrets. Keep preview resources/data intact. Proposed API URL is `https://butter-salsa-poll-production.butter-salsa.workers.dev`; verify it after approved deployment. No DNS change is needed for that proposal.
2. After authorized resource creation only, copy both production templates to `wrangler.production.json` and `wrangler.production-close.json`, replacing nil UUID with the new production D1 ID. Keep account/name/entry/DB/limits identical and POLL_OPEN=false in both. Exact origin is `https://butterinthesalsa.com`; hostname is `butterinthesalsa.com`. Add www only if verified and approved as a serving origin. No localhost, wildcard or preview widget in production.
3. Add real production `TURNSTILE_SECRET` and newly generated random `VOTER_HASH_SECRET` of at least 32 bytes through Worker secrets, privately. Only public widget key/API URL belong in Astro. Preserve HMAC across code releases; rotation needs a separate identity/data transition plan. Store recovery material privately, not in release records.
4. Use explicit production config and Wrangler migration tracking to apply 0001 once. Independently verify zero ballots and all four zero counters. Deploy the production entry closed, only under approval. Verify GET open=false and POST rejection, with no accepted ballot. Preserve all three preview votes. No production write smoke without an owner-approved ballot/accounting plan.
5. Complete `rollback.production.example.json` into a reviewed release record with real identifiers, known-good version/frontend commit, migration digest, secret custody reference (never values), and local restore-rehearsal evidence. Initial release has no earlier production version: its safe withdrawal is close voting and restore the approved splash, not select a preview Worker version.
6. Separate publication approval covers committing/pushing, adding public production build settings and Pages deployment. Push to main publishes automatically. Validate the configured frontend artifact, inspect final diff/status, then await Actions build/deploy and verify HTTP and HTTPS independently. Opening voting needs explicit authorization and an updated production config; retain the closed copy.

## Emergency close and rollback — approval required before execution

Never deploy `wrangler.json`, a preview config or a local fixture as a production rollback. Closing preserves the endpoint; code rollback and data restore are different operations.

- **Close:** use the completed `wrangler.production-close.json`, reviewed against the actual deployed production config. Only POLL_OPEN should differ from the open config. Keep workers_dev=true, exact origins, DB ID, limiter namespaces and secret bindings. Under incident authorization, deploy the reviewed compatible source with this config. Verify GET open=false, POST rejection and unchanged grouped ballots/counters. A source deploy uses the checked-out code; select known-good compatible source if current code is defective. No deletion, migration replay or HMAC rotation.
- **Code rollback:** inspect the recorded version's code, bindings, secrets and compatibility against the current production D1 schema, not merely its version ID. A Worker rollback restores that version's configuration and may reopen voting. Prefer rebuilding the reviewed known-good source with the closed config when avoiding a reopen window is required. If native rollback is authorized, the explicit form is `npx wrangler rollback <approved-production-version-id> --config wrangler.production.json`; do not run placeholders or rely on a prompt's default target. Immediately verify actual settings and close again if needed. Do not claim zero reopen window with native rollback.
- **Frontend withdrawal:** separately authorize redeploying the approved splash artifact/commit through Pages. Wait for Actions and verify both protocols. Keep production D1 and HMAC even if the form is removed.
- **Data recovery:** export privately before future schema changes using the exact approved production DB/config, then restore to a new isolated database and compare all four counters to grouped ballots. Verify trigger and duplicate behavior after restore. Exports can block requests; schedule under maintenance authorization. Do not export voter hashes into Git/evidence or restore over live data as a code rollback. Restoring/deleting/repairing production data needs separate authorization.
- **Reopen:** requires owner authorization, post-incident validation and capture. Keep a compatible closed artifact/config and updated release record available.

Provider references: [Turnstile verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [rate-limit accuracy](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [Worker rollback](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/), [D1 export/import](https://developers.cloudflare.com/d1/best-practices/import-export-data/).
