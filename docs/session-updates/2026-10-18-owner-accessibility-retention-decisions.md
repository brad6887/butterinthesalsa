---
title: "Owner accessibility and retention decisions"
description: "Human acceptance checklist and proposed policies awaiting owner responses."
date: 2026-10-18
status: complete
reviewed: false
session: owner-accessibility-retention-decisions
tags:
  - Abbey Root
---

# Owner accessibility and retention decisions

## Objective and Definition of Done

Help the owner complete mobile/screen-reader acceptance and choose recovery/retention policy. Record exact devices, browser/screen-reader, observed passes/failures and chosen policy, without inferring acceptance from automated tests. Keep production voting closed and preserve all three preview votes. No commits, pushes, public release, Worker deployment, DNS or hosted Pages changes.

Status: owner policy decisions and scoped human acceptance are complete: iPhone read-only presentation/VoiceOver and Mac real Turnstile navigation passed as owner-reported outcomes. Devices available: iPhone with Safari or Chrome and Tailscale, iPad with Safari, and Mac. Owner is new to VoiceOver. No human pass is inferred. Earlier proposals below are retained as explicitly unselected alternatives, not scheduled actions.

## Verified starting state

Production GET remains open=false, total zero. Preview GET remains open=true, total three. Existing preview PID 332757 remains running. Private production recovery file exists outside Git; no secret values read or copied. Before-state diff/status and API responses recorded in `working/poll-owner-acceptance/`. No vote submissions or hosted mutations performed.

## Human acceptance checklist — prepared before testing

Existing owner keyboard/arrow-navigation/200% zoom passes remain historical evidence. The checklist below was prepared before testing; owner-reported outcomes at the end establish current status. Unreported individual details remain unreported.

On the Mac, open http://localhost:4322 using the existing tunnel. It is the existing hosted-preview frontend, not the final compiled production artifact. Its three-vote results and real preview verification can be examined without a ballot. Do not activate Make My Position Official or run the token-acceptance harness. Selecting a radio alone does not submit a ballot.

Mac screen-reader check:

1. Turn on VoiceOver using the system Accessibility settings or Command-F5, and use the same control to turn it off afterward. Apple instructions: https://support.apple.com/en-gb/guide/voiceover/vo2682/mac
2. Read the poll question. Each of the four radio choices must have a distinguishable team/description and expose its selected state.
3. Navigate into and out of the real verification area without a focus trap. Completing a challenge alone is permissible; do not submit the form.
4. Read the four result labels/counts, refresh control and privacy link. Expected preview counts: Butter 1, Salsa 0, Absolutely not 1, Whatever 1.
5. Activate Refresh results only. Its result announcement should be understandable and should not erase voting/challenge status or trap/move focus unexpectedly.
6. Report browser, OS/screen-reader and each pass/failure; include the exact confusing label, announcement or focus behavior if any.

Mobile check:

- Identify device, browser, OS and screen reader first. A phone's localhost is not the Mac tunnel; simply using edge01's LAN address would also violate preview API/widget origin restrictions. Do not change the origin allowlist or expose/restart the existing preview to work around this.
- Choose an access route after device information is supplied. An isolated read-only presentation can test actual candidate layout/results, but a mocked widget cannot establish real verification accessibility. Desktop emulation is not a human mobile-device pass.
- Once a suitable route exists: inspect portrait/landscape layout and large text/zoom; verify all labels and results remain readable without clipping, controls are reachable/tappable, and navigation/refresh/privacy work. With the device screen reader, check question/choices/selection announcements, verification entry/exit and results/status announcements. Do not submit a ballot.
- A production-closed presentation and real open-preview verification are different acceptance scopes; record which was tested rather than treating them as interchangeable.

## Selected retention policy — owner confirmed

Owner selected: "Keep them until decide to close". Retention is owner-managed until a later explicit closure/deletion decision. No automatic closure date, deletion date, retention timer or scheduled job is authorized. Closing voting must preserve ballots, counters and HMAC; closure alone does not authorize deleting data, backups, secrets or resources. Revisit retention explicitly when the owner chooses closure. The previously suggested 30/90-day policy was NOT selected.

### Earlier retention proposal — not selected

Suggested bounded policy: close voting 30 days after the separately approved launch. Preserve ballots, aggregate counters, the existing HMAC and any private backups for 90 days after actual closure. At that point request explicit deletion approval with an inventory of D1 data, backup copies, secrets/widget and any desired retained anonymous totals. No automatic closure/deletion, resource teardown or automation is configured. Preserve evidence/captures as historical records without retaining secret values or voter hashes.

Alternative: owner-managed indefinite retention until explicit closure/deletion decisions. This avoids choosing a date now but requires a named future review; it does not silently authorize scheduling, deletion or keeping personal data forever.

The poll notice currently promises owner-managed deletion without a specific date. After selection, reconcile the current operations guidance with the actual policy; do not publish a retention promise or scheduled date that has not been chosen. Preserve HMAC across releases and any recovery while ballots remain active. Deleting or rotating it is not a code rollback.

## Selected recovery decision — owner confirmed

Owner selected: "accept local only", in direct response to the stated choice of local-only secret custody and unproven hosted recovery. Record explicit acceptance for this informal poll: independent off-host secret backup and isolated hosted restore rehearsal are not prerequisites chosen by the owner for opening voting. The underlying limitations remain: local custody loss or failed hosted recovery can lose ballots or duplicate-identity continuity; local restore tests do not prove hosted restore, atomicity or downtime. Preserve current HMAC/data and keep voting closed on uncertain recovery; do not silently reset identities/data. This acceptance does not authorize opening voting, publication, exports, secret rotation, restoration or data deletion.

### Earlier recovery options — option B selected

A. Require an independent private backup of production secrets and an isolated hosted restore rehearsal before opening voting. Define the owner-controlled backup destination, encryption/recovery-key custody and exact hosted rehearsal scope before execution. Prefer synthetic isolated rehearsal data; export of actual production data, provisioning disposable hosted targets, backup transfer or binding cutover needs an explicit concrete scope. No credentials, secret values or ballot hashes belong in Git, public artifacts, screenshots or chat.

B. Explicitly accept local-only secret custody and unproven hosted restoration for this informal poll. Record that loss of edge01/private recovery material or a recovery failure may cause loss of ballots or duplicate-identity continuity, and that a safe response may be to keep voting closed rather than reconstruct identities or reset live data. Existing local restore evidence does not establish hosted recovery, atomicity or downtime. This is a risk decision, not a recovery guarantee.

No backup movement, export, new remote database, secret rotation or hosted restore is performed by choosing a policy alone. If option A is chosen, implementation remains pending until destination/scope are defined and completed. If option B is chosen, document explicit owner acceptance without claiming those technical gaps were tested away.

## Inputs requested at preparation

- Available mobile device and screen reader/access route.
- Actual human check outcomes with device/browser/screen-reader versions where practical.
- Selected retention policy and whether anonymous aggregate results should remain after ballot deletion.
- Selected recovery requirement or explicit risk acceptance; backup destination/custody if required.

Owner answered the asynchronous questions: devices listed above, owner-managed retention, and option B local-only recovery acceptance. The separate read-only Tailscale route and subsequent human outcomes are recorded below. This capture is complete for the scoped owner acceptance and policy decisions; production remains closed.


## Owner mobile acceptance outcome — 2026-10-18

Owner reported: "looks good on the phone with voice over" after receiving the separate read-only Tailscale preview URL. Record an owner-reported iPhone visual/VoiceOver pass with no issue reported for that adapted presentation. Browser/version, individual gestures, landscape/large-text checks and refresh announcement details were not separately specified; do not invent those results. No vote submission was reported.

Scope: read-only mobile layout, labels and saved closed results presentation. Turnstile and the original voting client are omitted, so this does not establish real verification accessibility or open-voting acceptance. At the time of that phone report, iPad and Mac results were unreported; the subsequent Mac result is recorded below. Retention and local-only recovery decisions above remain selected; no reopening or publication approval follows from acceptance.


## Owner real Turnstile/VoiceOver outcome — 2026-10-18

Owner reported: "VoiceOver worked with Turnstile, and I could enter and leave the verification area without getting stuck. I didn’t submit a vote, and the total is still three." Record PASSED for real Turnstile navigation with VoiceOver on the existing Mac preview: understandable operation, entry/exit without a focus trap, no submission and total three confirmed by owner. Browser/OS versions and individual widget announcements were not supplied; do not invent them.

Together with the iPhone read-only visual/VoiceOver outcome, the requested scoped mobile/screen-reader acceptance is complete. An iPad-specific pass, detailed orientation/large-text checks and real mobile Turnstile remain unreported scope limitations, not newly imposed release gates. The adapted mobile preview does not establish actual mobile voting behavior.

Owner-managed retention and explicit local-only/unproven-hosted-recovery acceptance resolve the policy gates without claiming those technical recovery limitations were tested away. Keep production closed. Publication/commit/push and opening voting remain separately unauthorized; live post-release checks and any future approved ballot/accounting acceptance remain to be performed under their own authorization.
