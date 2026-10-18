---
title: "Final owner acceptance and release gates"
description: "Owner real Turnstile pass recorded; remaining publication and voting gates separated."
date: 2026-10-18
status: complete
reviewed: false
session: final-owner-acceptance-release-gates
tags:
  - Abbey Root
---

# Final owner acceptance and release gates

## Objective and result

Record the owner's real Turnstile/VoiceOver pass and review remaining gates without implementing or releasing changes. Followed Abbey session workflow; current source/artifact and deployed-backend digest evidence were checked. No new code blocker established.

Owner reported: “VoiceOver worked with Turnstile, and I could enter and leave the verification area without getting stuck. I didn’t submit a vote, and the total is still three.” Recorded PASSED for real verification navigation on the existing Mac preview, including entry/exit without a focus trap. This is owner-reported human evidence, not an automated result. Exact OS/browser versions and individual spoken announcements were not supplied.

The earlier owner-reported iPhone read-only visual/VoiceOver pass remains scoped to that adapted presentation; it omits Turnstile and the normal voting client. Together these outcomes satisfy the requested scoped mobile/screen-reader checks. They do not establish real mobile voting, an iPad-specific pass, or unreported orientation/large-text details. Those remain documented limits rather than newly imposed prerequisites.

The authoritative current outcomes and policies are in `docs/session-updates/2026-10-18-owner-accessibility-retention-decisions.md`, now complete for that scope, and linked from the poll operations README. Historical reviews retain their original pending observations.

## Gate assessment

| Gate | Current disposition |
| --- | --- |
| Production frontend settings and artifact validation | Resolved in candidate; reviewed evidence remains applicable |
| Poll tests in release validation | Resolved; 16 poll tests and 19 final artifact/navigation checks passed |
| Canonical HTTP entry before poll initialization | Resolved in candidate; compiled navigation and pending-navigation guard covered |
| Scoped human mobile/VoiceOver and real verification navigation | Owner-reported passes recorded, with limits above |
| Retention | Owner chose to keep data until a later closure decision; no automatic closure/deletion; closing alone does not delete data/secrets |
| Recovery policy | Owner explicitly accepted local-only secret custody and unproven hosted recovery for this informal poll; technical gaps remain unverified |
| Commit/push/public release | Not authorized; exact source/evidence scope must be reviewed and explicitly approved before any such action |
| Actual release validation | Future: successful Actions build/deploy, actual served HTTP-to-HTTPS behavior and HTTPS closed-results verification against approved artifact |
| Opening production voting | Not authorized; separate explicit decision and an approved production ballot/accounting plan for any write acceptance |

No additional implementation, off-host backup or hosted restore is required by an inferred policy after the owner's explicit recovery decision. Do not claim that risk acceptance proves recovery correctness. No automatic retention job, backup movement, export, secret rotation, migration, data deletion or remote rehearsal was performed.

## Next concrete release scope to approve

Review a curated source/configuration/tests/current-documentation commit set, excluding private files and disposable mobile-preview/runtime artifacts. The public frontend could then be released with the Worker still CLOSED, only after explicit commit/push/publication approval. A push to main starts Pages; it is a release action. Opening voting is not included. No staging, commit, push or workflow dispatch occurred during this review.

After any approved release, verify actual Actions build/deploy and served assets, HTTP navigation to canonical HTTPS, correct production API/widget settings, readable closed results and unchanged ballot counts. Candidate/intercepted-browser evidence cannot substitute for those post-release observations. Keep the compatible closed configuration and HMAC/data intact.

## Current live state and validation

- Fresh read-only hosted GETs and D1 counts confirm production open=false, zero ballots, and preview total three: Butter 1, Salsa 0, Absolutely not 1, Whatever 1.
- Current source/artifact hashes still match redirect-validation evidence except the intentionally updated operations README. Backend source, migration and actual production/close configuration match provisioning digests. No suite was needlessly rerun for documentation-only changes.
- `working/poll-final-acceptance/` retains before diff/status, read-only D1 aggregate evidence, live API snapshot and final review/status. No voter hashes or secret values retained.
- Existing dirty tracked diff remains byte-identical. Only acceptance records, current operations guidance and this review/evidence were updated or added. No implementation, deployed resource or preview/tunnel change occurred.
- Fresh whitespace and Abbey review checks recorded. Production remains closed; all three preview votes preserved.

## Conclusion

The requested scoped human acceptance and policy decisions are recorded and resolved. Remaining gates are explicit release authorization, actual post-release verification and separate approval before opening voting. No commits, pushes, public release, DNS, Pages or Worker changes occurred.
