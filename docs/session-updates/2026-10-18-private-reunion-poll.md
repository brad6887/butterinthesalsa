---
title: "Private reunion poll implementation"
description: "Implement and validate a local-only Astro, Worker, D1 and Turnstile poll."
date: 2026-10-18
status: complete
reviewed: false
session: private-reunion-poll
tags:
  - Abbey Root
---

# Private reunion poll implementation

## Objective

Continue from the approved architecture review with a privately testable live reunion poll beneath the current splash artwork. Keep people anonymous and preserve the separate approval boundaries for provisioning and publication.

## Definition of Done

- Astro component uses the exact reunion question, four team choices, submit/results/confirmation wording and a privacy notice.
- Worker, versioned D1 migration, server-side Turnstile verification, browser duplicate prevention and modest abuse controls live in the site repository.
- Isolated local tests cover races, retries, challenge/input errors, outages and accessible/mobile browser behavior.
- Audit dependencies, run Abbey build/validate/publish dry-run, inspect diff, and capture setup/limitations without committing or deploying.

## Summary

Implemented in the clean edge01 checkout `/home/bcooke/git/butterinthesalsa`, starting at `f681148` on main. Followed `abbey session`, inspected planning and publication configuration, defined this bounded session, implemented, validated, documented and used `abbey session capture`. Commit and publication steps remain explicitly withheld.

## Accomplishments

- Added `site/src/components/ReunionPoll.astro` and a small framework-free browser script beneath the intact splash artwork. Updated the supplementary coming-soon copy to “Some things can’t be unsqueezed.” No named people or invented personal claims.
- Added `site/poll-api/src/worker.js`, D1 migration and pinned development tooling. Runtime code has no third-party dependencies. Schema uniquely keys browser hash per poll; insert trigger and counter update share the same transaction. A retry returns the original ballot without reusing a consumed challenge.
- Siteverify requires success, exact hostname and action `vote`; requests have size/type/selection checks, an origin allowlist, transient hashed IP limiting and approximate admission limiting. Failures close safely without fabricated counts.
- Results display totals, percentages and accessible meters before voting; refresh every 30 seconds with poll/document visibility, manual refresh, ten-second aggregate caching, bounded error backoff and last-known-data labels.
- Added native radio fieldset, keyboard focus styling, polite status messages, expiration/error handling, storage-denial explanation and JavaScript fallback. Browser checks caught and fixed narrow-screen box sizing and challenge-reset status overwriting.
- Added closed-by-default production configuration and a separately named loopback fixture, persistent local preview data and nonpersistent test D1. No real secret was added; fixture strings are synthetic and confined to test code.
- Added the operations runbook in `site/poll-api/README.md`; no new Abbey command or broad planning reconciliation.

## Validation

- Six API test groups pass against actual local D1 bindings through Wrangler/Miniflare: twenty simultaneous same-browser submissions count once, thirty distinct browsers count exactly thirty, original choice/retry preserved, invalid/expired challenges, wrong hostname/action, verifier failures, invalid/oversized inputs, origin rejection, closed poll, missing configuration, both limiter failures, database outage, coherent results and routes/preflight.
- Browser checks pass through actual local Wrangler API/D1 with a synthetic widget: keyboard radio selection/submission, reload duplicate recovery, expiry, 429 retry, stale results, storage denial, JavaScript fallback, thirty-second refresh and scroll-away pause. Zero axe violations and no horizontal overflow at 320, 390, 768 and 1440px. Mobile screenshot visually reviewed.
- Separately loaded Cloudflare's official public dummy widget in Chromium and observed token issuance. This used no real widget account, secret, remote database or Siteverify request.
- `npm audit` passes with zero vulnerabilities independently in `site` and `site/poll-api`.
- Worker bundle dry-run, Abbey build, Abbey route validation, Abbey publication dry-run and final whitespace review pass. Dry-run confirms no push/deployment. One initial build check ran from the wrong parent directory and selected Abbey Root; it failed before building because Astro was unavailable there. Repeated all required checks from the explicit Butter checkout successfully; no Abbey Root files were edited.
- Final `abbey review` accepted this session metadata and found the session capture. It reported pre-existing missing tags in two older session records and stale backlog statistics; these were left outside this implementation scope. New source/document whitespace checks pass; raw tool logs retain their original formatting. Preview servers were stopped after testing.
- Logs, browser findings and four screenshots are in `working/poll-review/`. Dependency directories, build output, local database, environment files and Wrangler runtime state are ignored.

## Limits and remaining account setup

The validated path is private loopback plus SSH forwarding. Hosted preview is not provisioned. Real hosted Turnstile, Cloudflare account bindings, remote D1, location-distributed rate limiting and human screen-reader acceptance are not established by these local checks. Anonymous browser limits are best effort; rate bindings are approximate per location, not a global hard quota.

After explicit approval, create separate preview D1/widget resources, add real Worker-only Turnstile and HMAC secrets, replace the placeholder database binding, set exact origins/hostnames and use access controls for any hosted private preview. Later production resources and Astro public configuration need their own reviewed setup. The current Pages workflow has no public poll settings; voting remains disabled in an ordinary unconfigured build. No DNS change is needed for the proposed workers.dev API.

See the runbook for starting the private preview, tests, close/rollback behavior, usage review and export/restore acceptance. Preview data is synthetic and separate from future production. Real retention/deletion timing remains an owner decision and is not implied by the tests.

## Next Steps

Owner review of this implementation and screenshots; explicit authorization before external resource provisioning or adding real secrets. Commit, push and public deployment are not authorized. Planning files remain unchanged pending session review.

## Account setup continuation

The owner accepted the private preview and authorized Cloudflare provisioning and real server secrets. Commit, push and public deployment remain pending. Re-ran Abbey session and inspected the existing uncommitted implementation before account actions. Wrangler on edge01 reports not authenticated; the Cloudflare dashboard in Chrome is also at sign-in. Opened the dashboard for owner authentication. No external resources, secrets or deployment have been created. Continue provisioning after account sign-in and explicit account selection if more than one account is available.

## Approved Cloudflare provisioning and real verification

The owner explicitly approved persistent edge01 OAuth access after automatic approval review initially rejected the unapproved scope. Login then succeeded with user/account read, D1 write, Worker scripts write, Turnstile widget write and offline access only. OAuth callback forwarding required IPv6 loopback on edge01. No unrelated default scopes were granted.

Created preview D1 `butter-salsa-preview` (`af9eb006-6128-4e5e-9046-735f33bbb13a`) in account `66f376df57f4fb383fde1bbe8b29ffb1`; applied migration 0001 remotely and verified zero votes. Created the localhost-only real managed widget (`0x4AAAAAAFaHmwzg07tJ_mV_`). Saved its real secret and generated 48-byte HMAC material in ignored `.dev.vars` with mode 0600, without printing values. No hosted Worker exists yet, so these secrets are prepared locally rather than uploaded to a Worker.

Running the production entry exposed a genuine startup defect missed by the fixture: named exported constants are invalid Worker entry points. Moved shared constants into `src/poll.js` and added a direct workerd startup regression test. Seven API groups now pass; audit and Worker bundle dry-run pass. Real Cloudflare widget/token issuance and server Siteverify succeeded through a private loopback browser preview, recording one synthetic local vote while remote D1 remained empty. Existing preview processes/ports were preserved; used separate 4322/8788 ports and a temporary Astro source copy.

Public metadata, real-local configuration and repeatable commands are in the API runbook. Deployment, hosted secret upload, production resources, public frontend settings, commit/push and DNS remain untouched and pending. The owner accepted the visual preview earlier; this does not imply public release approval.

## Backend deployment continuation — 2026-10-18

Owner explicitly authorized Worker backend deployment, D1 configuration/migrations and secret upload. Public site release, commit/push and DNS changes remain withheld. Re-ran Abbey session and inspected the dirty checkout, production entry, migration, setup records and configurations. Live Wrangler identity confirms the existing approved account `66f376df57f4fb383fde1bbe8b29ffb1`.

Remote preview D1 migration tracking reports no migrations pending. Read-only SQL confirms zero ballots and aggregate zero. Production resources were not provisioned; all configured data remains in `butter-salsa-preview`, separate from any future production DB.

Prepared `wrangler.hosted-preview.json` for the preview-only API: production code entry, existing preview D1, real localhost widget, exact origin `http://localhost:4322`, preview URLs disabled, observability disabled. Attempted workers.dev deployment failed because the account has no registered workers.dev subdomain. Asked owner to choose an account-level subdomain; no registration or DNS change was made.

Successfully uploaded Worker `butter-salsa-poll-preview` using closed default configuration with no routes and workers.dev disabled. Code version from deploy: `8feca238-2b1b-4601-9d45-67dc10c778c5` (subsequent secret changes may create another version). Both existing real secrets were passed directly from ignored owner-only `.dev.vars` through standard input to Wrangler secret bulk, without printing values or creating another secret file. Secret list confirms `TURNSTILE_SECRET` and `VOTER_HASH_SECRET` bindings. No public API endpoint is active, and voting remains closed.

All seven local API/runtime test groups pass on recheck, including actual production-entry startup. These local tests do not establish hosted runtime behavior. Git whitespace validation passes; pre-existing dirty frontend work was preserved. No commit, push, Pages change or public frontend release occurred.

Hosted GET/POST, real Turnstile, duplicate, invalid-input, rate-limit, CORS and results checks remain NOT RUN: account-level workers.dev registration is required first. After owner selects the subdomain, deploy the explicit preview configuration and run all hosted checks only against preview D1. Do not use this DB for future production ballots.

### Subdomain selected and preview deployed

Owner selected `butter-salsa.workers.dev`. Registered that account-level subdomain through the authenticated Cloudflare API and deployed the explicit hosted-preview configuration. Cloudflare confirms 100% version `3f2da025-703c-4b45-bbc9-a048f2dea6ff` at `https://butter-salsa-poll-preview.butter-salsa.workers.dev`. Voting is open only in isolated preview D1; this is a publicly reachable API target, not an Access-protected private deployment. The real widget remains localhost-only and the exact allowed frontend origin is `http://localhost:4322`. Public frontend settings remain absent.

Hosted checks attempted but fail before HTTP: TLS alert handshake failure from both edge01 (Node and curl) and the Mac (curl), including a delayed retry. No hosted ballot was submitted. This may be newly registered workers.dev TLS provisioning, but the cause is unconfirmed. Hosted acceptance remains incomplete. The repeatable smoke script is `site/poll-api/test/hosted-smoke.mjs`; it checks HTTP/CORS/invalid challenge/rate limiting and inspects real browser token availability, but successful real vote and duplicate acceptance still need completing. Deployment metadata is recorded in `working/poll-review/hosted-deployment.json`. Earlier no-route and registration-blocked notes above are superseded by this deployment; their validation claims remain bounded to those stages.

## Hosted acceptance continuation — 2026-10-18

Objective: verify the already deployed preview Worker against isolated preview D1, preserving all public-release boundaries. Definition of done: record each hosted check with evidence, explicitly identify manual/incomplete checks, rerun local and Abbey validations, inspect status/diff, and capture this same session.

Inspected the existing dirty edge01 checkout, planning, deployed-preview configuration, production handler, schema, runbook and existing smoke/browser tests. No runtime defect was established and no application code, deployment, migration, secret, DNS, Pages or production resource was changed. Existing processes and unrelated work were preserved.

### Confirmed hosted results

- HTTPS GET returns 200, all four expected choices and total zero. Allowed origin is exactly http://localhost:4322, with no-store and Vary: Origin.
- Disallowed-origin GET, POST and preflight return 403 without Access-Control-Allow-Origin. Missing/empty-origin GET also returns 403. Allowed preflight returns 204 with the allowed origin.
- Invalid selection, malformed JSON, null JSON, invalid UUID and missing challenge return 400. Oversized input returns 413; wrong content type returns 415.
- A nonempty invalid challenge reaches real verification and returns 400 with the verification-failed/expired message. This does NOT establish rejection of a genuinely expired or consumed real token.
- A bounded sequence reached 429 with Retry-After: 60. After a 65-second cooldown, validation requests again returned their expected 400 responses. Limiting was observed from one client/location only; exact global thresholds and the separate aggregate admission binding were not independently established.
- Final read-only remote D1 queries show all four counters zero, zero ballots and no grouped ballot rows. Final hosted GET and the browser display also show zero. Thus unchanged-count consistency is confirmed; incrementing live counts, percentages and post-vote cache convergence remain unverified.

### Manual participation / incomplete acceptance

The real widget loaded in Chromium and displayed an interactive "Verify you are human" checkbox. No token was issued in the 45-second observation window; no CAPTCHA interaction or bypass was attempted. No hosted valid ballot was submitted. Real valid voting, same-browser duplicate preservation, genuinely expired token rejection, consumed token rejection with a fresh browser identity, and changing live totals remain NOT VERIFIED.

Next acceptance requires a human to complete the real widget from a localhost:4322 frontend pointed explicitly at the hosted preview URL. Confirm that target before submitting; the existing ordinary real-local preview points at the local API. Record a successful vote, reload with the same browser ID and try a different choice (original ballot must remain), test the consumed token under a fresh identity, and hold a separate unused real token beyond its lifetime before submitting. Do not record tokens in evidence. Compare hosted results after the ten-second cache window against read-only preview D1 counters and grouped ballots. Any resulting synthetic preview votes should remain explicitly identified; deletion/reset is not part of this run.

### Validation and capture

Seven local API/runtime test groups pass. Abbey site build, site validate, site publish --dry-run and git diff --check pass. Session capture reused this existing record; optional journal creation was not requested. Final tracked diff remains the pre-existing .gitignore and index.astro changes; the poll implementation/session/evidence remain untracked as before. No commit or push occurred.

Evidence: working/poll-review/hosted-acceptance.json, hosted-acceptance-browser.png, hosted-negative-acceptance.json, hosted-final-d1.json, api-tests-hosted-acceptance.log and abbey-{build,validate,dry-run}-hosted-acceptance.log. Repeatable bounded test helpers were added under site/poll-api/test/hosted-acceptance.mjs and hosted-negative-acceptance.mjs; they use the exact preview endpoint and persist no challenge tokens. Probe rows without an expected status in the raw negative-check evidence are exploratory rate-limit attempts; the observed 429 plus Retry-After header is the limiter evidence.

Hosted acceptance remains INCOMPLETE pending human challenge participation. Public release remains withheld.


## Human hosted acceptance setup — 2026-10-18

Objective: replace the established port 4322 real-local preview with the real hosted-preview configuration, verify zero initial results and real widget loading, then hand human verification to the owner. Definition of done for setup: browser requests reach the exact approved Worker, real Cloudflare widget loads, no fixture intercepts, no vote submitted, setup captured.

Reviewed Abbey session, project status, next tasks, dirty tree, existing session and hosted configuration. Port 4322 belonged to Astro PID 329978 in disposable /tmp/butter-real-preview. Preserved unrelated processes and SSH tunnel; stopped only that Astro child. Refreshed disposable source from the current working source and restarted Astro on 127.0.0.1:4322 (PID 332757) with hosted API https://butter-salsa-poll-preview.butter-salsa.workers.dev and the existing real localhost site key. Public-only settings were recorded in ignored mode-0600 site/.env.hosted-preview.local; no secrets were read or printed. Initial restart used an incorrect Astro executable path, exited without binding, and was corrected to the existing .bin/astro entry.

Unmodified Playwright browser requests (no routing/interception or fixture injection) confirmed the hosted API GET, real challenges.cloudflare.com api.js and real widget iframe with the approved site key. Hosted GET returned 200, open true, four counters zero and total zero. Screenshot and sanitized evidence: working/poll-review/hosted-human-preview.{png,json}. No Worker vote POST occurred; no human challenge interaction or bypass was attempted. Existing hosted config binds only approved butter-salsa-preview D1 and exact allowed origin http://localhost:4322. No Worker deployment, secret upload, migrations, production resources, DNS, commit, push or public site release.

Human voting acceptance remains pending. Owner should hard-refresh http://localhost:4322, scroll to the poll, complete the real Cloudflare verification if prompted, select one choice and press Make My Position Official. Record displayed confirmation and totals; preserve browser storage for later duplicate acceptance. Real verification may be automatic. Initial zero is established; successful vote and duplicate behavior remain unverified.


### Owner human vote accepted

Owner reported that the Mac browser displayed "success!" and recorded the vote, with no interactive verification prompt. A read-only hosted results GET at 2026-10-18T12:32:13Z independently returned total 1: whatever 1, butter/salsa/absolutely-not 0. This confirms a successful hosted preview ballot after the verified zero baseline. No agent ballot or challenge interaction occurred. The real widget may complete verification automatically; no checkbox is required for every visitor. Same-browser duplicate preservation remains unverified. No production ballots or release actions occurred.


### Owner duplicate-vote acceptance

Owner reported: "This browser already has a recorded vote. Your original position stands." Independent read-only hosted GET confirmed total remains 1, whatever 1 and all other choices 0. This confirms the observed browser duplicate-prevention path and unchanged original result, not that a second POST reached the Worker. Evidence: working/poll-review/hosted-human-duplicate.json. Initial Python urllib GET returned 403; curl GET succeeded. Human initial vote and browser duplicate acceptance are confirmed. Genuine expired/consumed-token rejection and distributed limiter behavior remain unverified. Preview stays running on port 4322. No agent ballots, resets, production actions, commit or push.
