---
title: "Closed poll exact commit and release scope"
description: "Proposed exact allowlist and closed public release; execution is not authorized."
date: 2026-10-18
status: complete
reviewed: false
session: closed-poll-exact-commit-release-scope
tags:
  - Abbey Root
---

# Closed poll exact commit and release scope

## Objective and approval status

Prepare a concrete proposed commit and public-release scope for review. No staging, commit, push, publication, DNS or hosted Pages change is authorized or performed. Production voting remains CLOSED. All three preview votes, original dirty checkout/index, preview process and tunnel must be preserved.

Definition of done: explicit paths and hashes, inspectable patch, exclusions, proof that the selected files are self-contained, closed-state invariants, execution/abort criteria and post-release verification. This preparation is complete; execution awaits explicit owner approval.

## Proposed single commit

Suggested message: `Add reunion poll frontend with closed production integration`.

Repository: `git@github.com:brad6887/butterinthesalsa.git`. Base local HEAD and live remote main both verified as `f6811482318348f2b17c92569d4d7ad0424001b1`. Proposed commit contains exactly the 58 paths listed below, including this scope capture. Existing unchanged tracked files remain inherited from that base. No removal or rename is proposed.

Purpose: publish the static poll interface with readable results and disabled voting; embed only public production settings; redirect canonical HTTP entry to HTTPS before poll startup; run poll tests/artifact checks before Pages upload; retain backend source/configuration/tests and the session/acceptance/recovery records. Historical sessions retain their original observations and are interpreted through the current operations guide. Backend source inclusion is not a Worker deployment.

Public metadata intentionally included: Cloudflare account/resource IDs, workers.dev URLs, public widget keys and custody-location references without secret values. Session reports include operator paths/private-network URLs but no credentials. Historical hosted helpers are retained as documented acceptance aids; they are not run by the release gate and must not be casually reused because some write preview ballots or overwrite evidence.

## Exact path allowlist

- `.abbey/project.yml`
- `.github/workflows/pages.yml`
- `.gitignore`
- `docs/session-updates/2026-10-18-canonical-https-entry-before-poll.md`
- `docs/session-updates/2026-10-18-closed-poll-exact-commit-release-scope.md`
- `docs/session-updates/2026-10-18-closed-poll-production-provisioning.md`
- `docs/session-updates/2026-10-18-final-hosted-poll-acceptance.md`
- `docs/session-updates/2026-10-18-final-owner-acceptance-release-gates.md`
- `docs/session-updates/2026-10-18-https-poll-candidate-release-review.md`
- `docs/session-updates/2026-10-18-owner-accessibility-retention-decisions.md`
- `docs/session-updates/2026-10-18-poll-database-recovery-rehearsal.md`
- `docs/session-updates/2026-10-18-poll-production-provisioning-blocked.md`
- `docs/session-updates/2026-10-18-poll-production-readiness-review.md`
- `docs/session-updates/2026-10-18-poll-release-readiness-review-after-production.md`
- `docs/session-updates/2026-10-18-poll-storage-state-and-production-preparation.md`
- `docs/session-updates/2026-10-18-private-reunion-poll.md`
- `docs/session-updates/2026-10-18-production-poll-frontend-release-validation.md`
- `docs/session-updates/2026-10-18-readonly-tailscale-mobile-preview.md`
- `docs/session-updates/2026-10-18-updated-poll-candidate-blocker-review.md`
- `site/.env.example`
- `site/package.json`
- `site/poll-api/README.md`
- `site/poll-api/migrations/0001_poll.sql`
- `site/poll-api/package-lock.json`
- `site/poll-api/package.json`
- `site/poll-api/preview-widget.json`
- `site/poll-api/production-widget.json`
- `site/poll-api/rollback.production.example.json`
- `site/poll-api/rollback.production.json`
- `site/poll-api/src/poll.js`
- `site/poll-api/src/worker.js`
- `site/poll-api/test/browser.mjs`
- `site/poll-api/test/frontend.test.js`
- `site/poll-api/test/hosted-acceptance.mjs`
- `site/poll-api/test/hosted-negative-acceptance.mjs`
- `site/poll-api/test/hosted-negative-final-acceptance.mjs`
- `site/poll-api/test/hosted-smoke.mjs`
- `site/poll-api/test/hosted-token-acceptance.html`
- `site/poll-api/test/local-worker.js`
- `site/poll-api/test/production-config.test.js`
- `site/poll-api/test/recovery.test.js`
- `site/poll-api/test/runtime.test.js`
- `site/poll-api/test/worker.test.js`
- `site/poll-api/wrangler.hosted-preview.json`
- `site/poll-api/wrangler.json`
- `site/poll-api/wrangler.local.json`
- `site/poll-api/wrangler.production-close.example.json`
- `site/poll-api/wrangler.production-close.json`
- `site/poll-api/wrangler.production.example.json`
- `site/poll-api/wrangler.production.json`
- `site/poll-api/wrangler.real-local.json`
- `site/poll.production.json`
- `site/scripts/check-poll-artifact.mjs`
- `site/scripts/test/https-entry.test.mjs`
- `site/scripts/test/poll-artifact.test.mjs`
- `site/src/components/ReunionPoll.astro`
- `site/src/pages/index.astro`
- `site/src/scripts/reunion-poll.ts`

## Byte-level review package

`working/poll-release-scope/commit-manifest.json` records the base, every allowed path, proposed Git file mode, SHA256 and byte length. `candidate.patch` contains the tracked diff and each allowed untracked file as a new file, generated without touching the Git index. `manifest.sha256` and `candidate.patch.sha256` identify those review artifacts. Any content/path/mode change requires an updated scope and validation before execution. This document cannot contain its own hash; its final bytes are included in the external manifest.

`validated-artifact-sha256.json` pins the locally validated static output. Raw validation logs and local evidence remain outside the proposed commit; committed session records summarize their scope/results and reference their local custody. No claim that excluded logs become public Git evidence.

## Explicit exclusions and preservation

- All `working/**` material: logs, screenshots, raw receipts, source snapshots/tars, local runtime code/manifests and review packages. `excluded-files.txt` enumerates currently untracked non-allowlisted paths. Preserve them locally; do not delete, move, broadly stage or add them to this commit.
- Ignored/private `.dev.vars*`, `.env*` except the explicitly listed public `.env.example`, Wrangler local state, node_modules, generated dist/.astro, OAuth configuration and `/home/bcooke/.local/state/butter-salsa-production/worker-secrets.json`. Keep existing ignore rules. No secret values or real ballot hashes/exports are proposed for Git.
- Disposable `/tmp/butter-mobile-readonly-u7gyjk16`, read-only Tailscale preview PID 346833/port 4333, original preview PID 332757/port 4322, Mac tunnel and all existing databases/widgets/secrets. Leave their runtime state alone.
- No broad planning rewrite, recovery exports/restores, data repair/deletion, HMAC rotation, resource provisioning, new automation or release tags.

## Proposed public-release behavior

After separate execution approval only, publish this one reviewed source commit through the existing GitHub Pages workflow on `origin:main`. Visitors receive the question, choices, privacy notice, live production results and a closed-voting message. Radios/submit stay disabled once closed state is loaded. Production results initially show all four zero counters. Canonical HTTP browser entry navigates to HTTPS using the reviewed inline script; this is not a server 301 or new HSTS/DNS configuration.

Production API remains `https://butter-salsa-poll-production.butter-salsa.workers.dev`; widget key `0x4AAAAAAFaOigIB5KHmUF-l`; exact origin `https://butterinthesalsa.com`. D1 remains `a6d45ef4-32d4-4d7a-a501-c2c0788fbcd3`. Both actual production/close configs retain POLL_OPEN=false and limiter namespaces 2001/2002. Production Worker version remains `6d52882d-e06e-4e54-98fc-7c23c38b7f0c`: this scope does not deploy or change it. Preview version/resources and all three votes remain untouched.

## Proposed execution sequence — not run

1. Recheck live account/resources, closed production with zero ballots, preview with three, exact manifest hashes, source status/index and live remote main. Abort for divergence, unexpected state or unreviewed content; never force-push, reset or clean the original checkout.
2. Create a separate clean temporary release checkout from the approved base with its remote targeting the actual GitHub repository. Overlay only the exact allowlist. Do not use `git add .` in the original dirty checkout, stash unrelated work, or copy private/runtime files. This keeps the original checkout, branch/index and previews intact.
3. Install both dependency sets, run the shared release validation and appropriate Abbey build/site validate/publish dry run plus whitespace check in that isolated checkout. Compare its output with the approved artifact receipt. Review the exact staged path/mode/content set there against the approved manifest; abort on extra or missing files. These are future steps under execution approval, not staging already performed.
4. Make the single approved commit in that isolated checkout. Verify its parent and full contents. Recheck remote main before publication. Use the existing Abbey publication path from the clean checkout targeting `origin:main` only after push/publication authorization. A push starts the existing Pages build/deploy; no separate Worker deployment, DNS, custom-domain, Pages-setting, workflow dispatch or voting action is included. Abort rather than rebase/merge new remote changes without review.
5. Wait for actual Actions build AND deploy success for that exact SHA. Record the commit and run/version mapping locally. No extra documentation commit is silently included; any later commit/amendment needs its own scope. The pre-release rollback record honestly references the previously uncommitted deployment base; pair it with the actual release receipt instead of inventing a self-referential commit SHA.
6. Perform the read-only post-release verification below. If it fails, report failure and keep voting closed; do not infer permission for corrective deployments, resets, data changes or an unreviewed rollback.

## Required post-release verification

- Exact Actions source SHA, build gate and successful Pages deployment; fetch every served artifact and compare approved hashes, including JS/images. Record actual deployment evidence; local rehearsal is not live CI evidence.
- Check HTTP and HTTPS independently. Verify served HTTP bytes and actual browser navigation to canonical HTTPS, preserving query/fragment; HTTPS loads the approved production API/widget and closed results. No preview/localhost/test settings or secrets in public output.
- Production GET open=false, four zero counters and D1 zero ballots. If a closed POST probe is separately included in execution approval, it must be rejected and counts remain unchanged; do not send a valid vote, consume a production ballot or open voting. A read-only release can rely on the existing closed-POST evidence plus current GET/DB checks until that probe is approved.
- Preview still exactly three ballots/counters and its original Worker version; original preview/tunnel remain available. No production write acceptance is part of this scope.
- Store actual commit/Actions/served-content evidence in a local session update. Do not treat green Actions as approval to open voting.

## Validation already completed for preparation

A fresh temporary checkout was assembled from the base Git archive plus only the 57 pre-existing allowlisted candidate paths, with no private env, scratch evidence or dependencies copied. Both npm ci installs and shared release validation passed: 16 poll and 19 artifact/navigation checks. The final 58th path is this documentation-only scope capture. Temporary checkout was removed. Source/artifact receipts are retained in the review package. This proves the proposed implementation is self-contained without its working evidence; it is not an actual GitHub Actions run.

Current live reads confirm production closed/zero, preview three; actual production and emergency-close configurations are identical and closed. Final private-value scan, whitespace, diff/index preservation and Abbey review are recorded alongside the manifest. No secret values emitted.

## Approval boundary

A future approval must explicitly cover the proposed single commit, push to main and resulting public Pages release with voting CLOSED. This preparation grants none of those actions. Opening voting, hosted recovery, DNS/Pages settings, Worker deployment, data deletion and additional commits are excluded. Retention remains owner-managed and local-only recovery limitations remain explicitly accepted; no new recovery gate is imposed.


## Nonblocking patch whitespace observation

Applying the exact patch reports an existing extra blank line at EOF in three historical helpers: `hosted-acceptance.mjs`, `hosted-negative-acceptance.mjs` and `hosted-negative-final-acceptance.mjs` under site/poll-api/test. The patch applies without modification and all resulting hashes match. Tracked diff whitespace and selected per-line trailing-space scans passed; these separate EOF warnings are disclosed rather than silently normalizing reviewed source. No executable release gate runs those historical helpers. They are not release blockers or an authorization to change their contents.
