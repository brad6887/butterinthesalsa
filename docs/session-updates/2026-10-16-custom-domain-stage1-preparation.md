---
title: "Custom Domain Stage 1 Preparation"
description: "Validated source preparation; Hostinger zone review and ownership TXT creation remain gated."
date: 2026-10-16
status: pending
reviewed: false
session: custom-domain-stage1-preparation
tags:
  - Abbey Root
---

# Custom Domain Stage 1 Preparation

## Objective

Prepare butterinthesalsa.com on edge01 without publishing or changing DNS or repository Pages settings.

## Definition of Done

Preserve source originals; prepare Abbey/Astro/canonical changes; pass audit, build, validation and publication dry run; capture exact ownership challenge and rollback evidence; identify unresolved access and approval gates.

## Summary

Source preparation is complete and validated. Stage 1 remains incomplete because Hostinger requires login: no full zone export exists and mail/unrelated dependencies remain unknown. Public queries are partial observations only.

## Accomplishments

- Reviewed clean main at 4f70a2ca511e5e2b0630b0e7d6acabfe70931efe and planning documents; ran abbey session.
- Set .abbey/project.yml publication domain from brad6887.github.io to butterinthesalsa.com.
- Set site/astro.config.mjs site from https://brad6887.github.io to https://butterinthesalsa.com and base from /butterinthesalsa to /.
- Added canonical link using new URL(Astro.url.pathname, Astro.site); generated href is exactly https://butterinthesalsa.com/.
- Preserved Actions workflow byte for byte and no-CNAME artifact assertion.
- Initiated account-level ownership verification for brad6887. GitHub now requests TXT at _github-pages-challenge-brad6887.butterinthesalsa.com with value 11fe4523788004b28425aff30038a6. No TXT created; verification pending.

## Validation

- npm audit: zero vulnerabilities.
- abbey site build: passed.
- abbey site validate: passed, root route present.
- abbey site publish --dry-run: passed, explicitly no push/deployment; expected dirty-tree warning.
- Generated HTML canonical assertion and absent artifact CNAME: passed.
- git diff --check and unchanged workflow diff: passed.
- Final intended state: three modified source files and this untracked session capture. No staging, commit, push, publication, DNS change, or repository Pages domain assignment.

## Rollback Evidence

Original source files, SHA-256 hashes, initial clean status, HEAD, build/audit/validation/dry-run logs, artifact hash and prepared source diff are retained outside the repository at /home/bcooke/butterinthesalsa-stage1-20261016.
The originals/ subtree preserves the three changed files and unchanged workflow. Restore only these candidate changes after checking for subsequent edits; preserve unrelated work.

Authoritative atlas.dns-parking.com queries from the workstation on 2026-10-16 returned:
- butterinthesalsa.com. 50 IN A 2.57.91.91
- www.butterinthesalsa.com. 300 IN CNAME butterinthesalsa.com.

These match prior review observations but do not constitute a complete zone backup or prove configured panel TTLs. Full Hostinger zone export, original configured records/TTLs and dependency review are still required before approving any DNS mutation. edge01 lacks dig; partial queries ran on the workstation instead.

## Separate Platform Follow-up

Prior review reported Abbey recurring-review Python compatibility failure. Current edge01 abbey session succeeded and reported no recurring reviews due. The earlier error was not reproduced or fixed; investigate the original runtime separately.

## Next Steps

- Sign in to Hostinger and export/review every DNS record, including mail, subdomains, verification, wildcard, service and unrelated dependencies. Retain raw export with exact configured TTLs.
- Obtain separate explicit approval for the ownership TXT creation. Proposed TXT TTL 300 seconds, subject to zone review; retain record after verification.
- Stop at that approval gate. Web DNS cutover, repository Pages custom-domain assignment, commit/push and publication remain out of scope.

