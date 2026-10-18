---
title: "Checkout reconciliation and preview retirement plan"
description: "Metadata-only reconciliation and local process retirement, preserving all data and open production."
date: 2026-10-18
status: complete
reviewed: false
session: checkout-reconciliation-preview-retirement-plan
tags:
  - Abbey Root
---

# Checkout reconciliation and preview retirement plan

## Status and definition of done

PLAN ONLY. Prepare a safe reconciliation of the original edge01 checkout with the released commit and retire temporary local preview services. Production voting must remain OPEN and every production/preview/local ballot preserved. No commit, push, deletion, DNS or Pages change is authorized by this preparation. No process was stopped, original branch/index moved, file relocated, archive created or remote setting changed.

Definition of done: classify released versus post-release state, rehearse a non-overwriting reconciliation in a disposable copy, identify exact preview owners/dependencies, specify preservation/rollback and bounded future actions, and verify live ballots. Preparation complete; execution awaits approval.

## Current facts

- Original: `/home/bcooke/git/butterinthesalsa`, main at `f6811482318348f2b17c92569d4d7ad0424001b1`, with five tracked changes and untracked source/session/evidence.
- Released remote main: `7da632ab1806e5dfbb01463446734ae22a04aa16`; clean release checkout retained at `/tmp/butter-approved-release-o4b4k6ej/checkout`.
- **57 of the 58 approved release paths match the released bytes.** Only `site/poll-api/README.md` differs: it correctly records subsequent owner acceptance and OPEN runtime state. Preserve that difference.
- Additional local-only material includes post-release/activation captures, pinned operator open/close package, evidence, logs and receipts. First inventory counted 351 non-allowlisted local files; this grows with review evidence, so re-inventory before execution. Ignored secrets, local database state and dependencies are outside that count.
- Production version `4615a055-da18-45aa-ba39-7c00f0e07824` remains OPEN. Current authoritative accounting: one genuine Team Whatever ballot, other counts zero. Later legitimate public increases are expected, not grounds for reset.
- Hosted preview version `3f2da025-703c-4b45-bbc9-a048f2dea6ff`: exactly three ballots, Butter 1 / Salsa 0 / Absolutely not 1 / Whatever 1. All counters match grouped ballots.
- Persistent original-checkout CLI `/home/bcooke/git/butterinthesalsa/site/poll-api/node_modules/.bin/wrangler` is already version 4.151.1. Current activation evidence also references a CLI in the temporary release checkout; retain that checkout until operator command references are safely reconciled.

## Recommended future sequence — not performed

### 1. Recheck identity and inventory

Require original HEAD still f681148 and remote main still exactly 7da632a, with no independent local commits. Confirm ancestry and all release file hashes/modes, allowing only explicitly recorded post-release changes. Inspect index/staged state, current README, every additional document/evidence path, ignored local database directories, private configuration and active preview commands/start times. Stop for unexpected differences; do not broaden the scope or auto-merge new upstream work.

Capture Git metadata/refs/index and a full path/digest inventory before touching metadata or services. Plan a private local preservation destination such as `/home/bcooke/.local/state/butter-salsa-production/reconciliation-snapshots/<execution-timestamp>/`, directory 0700 and archive files 0600, owned by the operator. Check capacity first. This is proposed local preservation, not an independent off-host recovery guarantee or a new retention policy.

### 2. Retire only confirmed local preview processes

After explicit approval, revalidate the exact process identity, owner, start time, command, working directory, descendants and listener before any TERM. Stop only the identified service tree; wait and verify descendants/listeners exit. Do not use broad pkill/killall patterns, blind stale PIDs or unrelated SSH-session termination. If graceful shutdown does not finish, report the remaining process rather than expanding into a blanket kill.

| Service | Observed identity | Proposed retirement |
| --- | --- | --- |
| Existing real-widget Astro preview | PID 332757, `/tmp/butter-real-preview`, localhost:4322 | Stop that exact Astro process; retain directory and configuration |
| Read-only Tailscale mobile presentation | PID 346833, `/tmp/butter-mobile-readonly-u7gyjk16/server.py`, 100.118.36.96:4333 | Stop that exact server; retain snapshot/script/evidence; no Tailscale reset needed |
| Synthetic local API | npm root 325715, Wrangler node 325803, workerd listener 325845, localhost:8787 | Identify and stop the whole owned preview tree, including auxiliary workerd children; preserve `.wrangler/preview-data` |
| Real-verification/local-D1 API | npm root 329905, Wrangler node 329919, workerd listener 329944, localhost:8788 | Identify and stop its owned tree, including auxiliary workers; preserve `.wrangler/real-preview` |
| Mac tunnel for 4322 | PID 48169, `ssh -N -o ExitOnForwardFailure=yes -L 4322:127.0.0.1:4322 edge01` | Stop only after confirming command/forward ownership and Astro retirement |
| Older Mac combined tunnel | PID 48083, forwards 4321 and 8787 | Conditional: retire only after confirming neither forward supports other work; otherwise leave it for owner review |

Other interactive SSH sessions are excluded. No service manager/boot automation was created for these previews. Tailscale Serve currently has no configuration; the mobile preview is a direct IP-bound process, so do not run Serve/Funnel reset or change ACLs, certificates, DNS or firewall settings.

Stopping local processes does not retire hosted Cloudflare preview resources. Hosted preview Worker/D1/widget remain untouched and still publicly reachable under their existing origin restrictions. Do not disable/delete them or assume the three ballots disappeared. Hosted-preview deactivation is a different future scope if desired.

### 3. Preserve stable local state before reconciliation

Once local API writers and their descendants have stopped, make the private preservation copy/archive of Git metadata, working source, post-release documents/evidence, pinned operator package, ignored preview configuration and **complete local database directories including any WAL/sidecar files**. Do not claim a raw copy taken while writers are active is a consistent local database backup. Preserve original directories in place too; no deletion/move is required.

Only explicitly regenerable dependencies/build caches may be omitted from the archive if documented; do not accidentally exclude all `.wrangler` state or private `.dev.vars` merely because they are ignored. Treat the archive as secret-bearing: no Git staging, public uploads, content dumps or secret values in logs. Production secret custody outside the repo remains untouched. No Cloudflare production/preview D1 export is proposed: production must stay open, and managed exports can interrupt requests. Owner's accepted local-only recovery policy remains unchanged.

### 4. Reconcile Git metadata without overwriting the worktree

After preservation and explicit approval, fetch the existing released commit from origin into the original repository; fetch creates no new source commit and triggers no Pages publication. Verify the fetched object is exactly the approved 7da632a commit and descendant of original f681148. Never substitute an unreviewed latest commit.

Then use **`git reset --mixed 7da632ab1806e5dfbb01463446734ae22a04aa16`** in the original checkout. This deliberate local branch/index realignment is the proposed exception to preserving the old metadata; it does not write working-tree files. Do not use `--hard`, checkout/restore over files, clean, stash/pop or broad staging.

Expected result: main/index match the already released commit; previously untracked release files are tracked; all working bytes stay exactly as they were. Current operations README remains a visible unstaged modification. Post-release captures, operator package/evidence and ignored private/local database material stay present. **The goal is reconciled metadata with honestly preserved local work, not a falsely clean checkout.** No commit or push is needed.

A rehearsal in a disposable clone used the released tree, current approved source paths, post-release session captures and an actual aggregate receipt. Mixed reset advanced f681148 to 7da632a with zero working path/byte changes. The only resulting tracked difference was the current README; post-release documents/evidence remained untracked. Ignored secrets/databases were not copied into that rehearsal, so it does not replace the private preservation step. The original repository and index were untouched.

### 5. Verify preserved state and operational tooling

Compare the full pre/post file inventories, including stable local state and ignored files; investigate any path/byte loss. Confirm branch/index and tracked status exactly match the expected result. Run read-only Git/Abbey consistency checks. Code is unchanged, so reconciliation alone does not justify re-running hosted write acceptance or submitting another ballot.

Retain the pinned open/close package and both source/config hashes. Current committed production/close files are historical CLOSED snapshots while production runtime is OPEN; metadata reconciliation does not update or deploy them. Never run a generic production deploy to “sync” runtime with Git. Future authorized operator commands should use the persistent 4.151.1 CLI and the pinned package intentionally. Verify bundle-only compatibility if operator paths change; no actual deploy is in this plan.

Retain the clean release checkout and all `/tmp` preview directories for now. Do not delete them to make the status look clean. Later deletion/archive retention is a separately reviewable scope after dependencies and rollback evidence are settled. No additional documentation commit is implied by this reconciliation.

### 6. Check live resources without changing them

Production must remain open=true on version 4615a055 with coherent counters/grouped ballots and at least the recorded owner ballot preserved. Natural increases while open are legitimate; never force totals back to one. Preview must remain exactly three on its original version. Use aggregate-only reads and retain no voter hashes/secret values. Verify public HTTP/HTTPS frontend still matches the released artifact and no Pages run/push was initiated.

Expected local result after approved retirement: the four preview listeners and only the explicitly retired SSH forwards are gone; production HTTP/API and hosted preview data remain intact. No DNS/Pages/Worker/D1/widget/secret setting change. Do not close production as a generic cleanup failure response; stop local reconciliation and report, since this scope requires voting to remain open.

## Rollback and stop conditions

Before metadata realignment, any inventory/preservation failure means stop and leave original Git metadata unchanged. If previews have already been stopped, keep their directories/data and report their stopped status; restart only the same approved command/ports if the execution approval includes restoration and they are still free.

After mixed reset, if metadata must be reversed, a separately verified mixed reset back to f681148 can restore the old branch/index view without touching files; preserve the new evidence and verify bytes again. Do not restore a whole archive over live work or use destructive commands. No hosted data restore, counter repair, HMAC rotation, native Worker rollback or production closure is part of this rollback.

## Preparation evidence and approval boundary

`working/poll-reconciliation-plan/` retains original diff/index hash, 58-path comparison, local-only inventory, temporary-copy rehearsal/status and live aggregate/version/tooling evidence. Final whitespace and Abbey review are recorded. Preparation added only this plan/evidence and did not fetch/reset the original repository, stop processes, create archives, move/delete files, commit, push or change deployed resources.

A future approval can cover the local process stops, private local preservation and exact metadata-only realignment described here, while continuing to prohibit deletions, commits/pushes, production/preview Worker changes, DNS and Pages changes. Conditional combined-tunnel retirement must remain conditional on ownership/dependency verification. Production stays open and all ballots stay preserved.
