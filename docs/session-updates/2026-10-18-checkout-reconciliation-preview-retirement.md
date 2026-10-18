---
title: "Checkout reconciliation and preview retirement"
description: "Authorized local retirement and metadata-only alignment completed with all ballots preserved."
date: 2026-10-18
status: complete
reviewed: false
session: checkout-reconciliation-preview-retirement
tags:
  - Abbey Root
---

# Checkout reconciliation and preview retirement

## Authorization and outcome

Owner approved stopping verified local previews/tunnels, private state preservation and aligning the original checkout to released commit 7da632a. Production must remain open and every ballot preserved. No deletion, new commit, push, DNS or Pages change authorized.

Completed: original main/index now match **7da632ab1806e5dfbb01463446734ae22a04aa16**; all 656 preserved working paths and bytes survived the metadata change; verified local preview services/tunnels are retired; private preservation archives verified. Production remains OPEN with **three ballots** and hosted preview retains its original **three ballots**. The increase from one to three production ballots occurred before this task and was treated as legitimate public participation, never reset.

## Preflight

Original HEAD was f6811482318348f2b17c92569d4d7ad0424001b1, live remote main 7da632a, staged diff empty. Of the approved 58 release paths, 57 matched exactly; current operations README was the expected post-release difference. Verified process identities, dedicated process groups, listeners, available disk capacity, local preview database accounting and live production/preview states before action.

## Preview retirement

- Stopped Astro PID 332757 / localhost:4322 and read-only Tailscale Python PID 346833 / 100.118.36.96:4333.
- Stopped verified synthetic API process group 325715 / localhost:8787 and real-local API group 329905 / localhost:8788, including local workerd database writers and auxiliary children.
- Normal shutdown needed a bounded fallback: TERM stopped the first npm wrapper but left Wrangler children; normal interrupt stopped its workerd writers. A detached CLI node PID 325810 remained after TERM/INT/HUP. Its exact command/owner/group and absence of database/private-file handles were checked; stable local databases were privately archived first, then SIGKILL was sent **only to that verified orphan**. No broad kill, unrelated Node/SSH process or database worker was forcibly killed. The other preview groups exited on normal signals.
- Mac 4322 tunnel PID 48169 was already absent. Combined tunnel PID 48083 was confirmed to forward only 4321 and 8787, with no edge01 4321 listener and 8787 belonging to the retired synthetic API. Its listeners were inspected, then that exact SSH process received TERM and exited. Other SSH sessions were not targeted.
- Final edge01 ports 4322/4333/8787/8788 and dedicated Mac preview forwards are absent. Tailscale Serve remained unconfigured; no Serve/Funnel reset, ACL/firewall, certificate or DNS action.
- All preview directories, scripts, snapshots, dependencies and databases remain in place. No file/directory cleanup or resource deletion was performed. Hosted Cloudflare preview Worker/D1/widget remain deployed and unchanged; stopping local presentations does not remove that hosted endpoint.

## Private preservation

Custody: **`/home/bcooke/.local/state/butter-salsa-production/reconciliation-snapshots/20261018T195350Z`**, private directory mode 0700 and archives mode 0600, operator-owned and outside Git.

Preserved:

- Complete `.git` metadata before stops/fetch/reset in `git-before/`.
- Read-only aggregate accounting of both persistent local preview databases before stops; no voter identities read or logged.
- Stable complete local preview database directories, including sidecars, after workerd writers exited and before terminating the lingering handle-free wrapper.
- `worktree-before.tar.gz`, checked by reading every archive member against a private inventory of **656 paths**, including working source, post-release documents/evidence, operator package and ignored private/local state.
- `temporary-preview-directories.tar.gz` preserves both disposable preview directories too; originals remain present.

Explicit regenerable omissions from the worktree archive: site/node_modules, site/poll-api/node_modules, site/dist and site/.astro. Git metadata is preserved separately rather than duplicated inside that archive. Dependencies/build output were not deleted from the originals. Private configuration and local database state were not omitted merely because Git ignores them. No secret values were printed, uploaded or staged. Existing production secret custody outside the repository was untouched. This is local preservation, not new off-host recovery acceptance or a production D1 export.

## Metadata-only reconciliation

Fetched origin main, verified it was the exact released commit and a descendant of f681148, then ran the approved `git reset --mixed 7da632ab1806e5dfbb01463446734ae22a04aa16` in the original checkout. No hard reset, checkout/restore over files, clean, stash or broad staging.

Immediately after the metadata change, a full comparison confirmed all 656 inventoried working paths/content were identical. Previously untracked released files are now tracked. The sole tracked difference remained the current README, with no staged changes; local-only documents/evidence and ignored state remain present.

After that proof, the README was intentionally updated to record retired local services and persistent operator tooling, and this new session/evidence was added. This is honest local documentation work, not a falsely clean checkout. No new source commit or push was made. HEAD and origin/main now agree on the already existing released commit; remote main was not advanced by this task.

## Persistent operational tooling

Original-checkout `site/poll-api/node_modules/.bin/wrangler` remains verified 4.151.1. Using it with the pinned operator package's OPEN and CLOSED configurations, both bundle-only dry runs passed. No actual deploy occurred. Current guidance now points to that persistent CLI instead of relying on a CLI under the temporary release checkout, which remains retained and clean.

Runtime remains OPEN on the operator package's configuration. Git-tracked production/close configs remain the historical CLOSED release snapshot; Git alignment is not permission to deploy them or synchronize runtime back to closed. No Worker settings, D1 bindings, secrets/HMAC, widget, origin or limiter changes.

## Final validation

- Production: open=true, **three ballots**, aggregate counters match grouped ballots and do not decrease from preflight. Worker version remains `4615a055-da18-45aa-ba39-7c00f0e07824`.
- Hosted preview: exactly **three ballots**, Butter 1 / Salsa 0 / Absolutely not 1 / Whatever 1; grouped ballots/counters agree. Worker remains `3f2da025-703c-4b45-bbc9-a048f2dea6ff`.
- Both persistent local preview database accountings match the pre-stop records. No production/preview ballot submitted, deleted, repaired or reset.
- HTTP and HTTPS public index digests match the released artifact. No Pages/DNS/settings/source deployment or new workflow dispatch.
- Abbey consistency validation, tracked whitespace check and final session review recorded. Full poll tests were not repeated for metadata-only reconciliation; no source logic changed.
- A first provider version query used an OAuth value loaded before Wrangler refreshed its stored token and received 401. Reloading the already refreshed credential succeeded; no login, scope expansion or credential values exposed.

Evidence in original checkout `working/poll-reconciliation-execution/`: preflight/status/diff/index receipts, process shutdown records and exact orphan fallback, listener checks, private snapshot reference, byte-preservation reconciliation receipt, local/hosted accounting, bundle-only tooling checks, final status and Abbey review. Private inventories/archives remain only in the custody directory above.

## Remaining state

Production voting stays OPEN under the existing owner-managed retention and accepted recovery policy. All data and preview/release directories remain retained. Current README and post-release captures/evidence remain uncommitted by design. No further deletion, commit, push, hosted preview deactivation, DNS, Pages, deployment or cleanup is implied. Any future archive deletion or hosted resource retirement needs its own explicit scope.
