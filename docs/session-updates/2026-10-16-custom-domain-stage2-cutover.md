---
title: "Custom Domain Stage 2 Cutover"
description: "Approved production custom-domain cutover with retained rollback evidence."
date: 2026-10-16
status: pending
reviewed: false
session: custom-domain-stage2-cutover
tags:
  - Abbey Root
---

# Custom Domain Stage 2 Cutover

## Objective

Publish the validated custom-domain configuration, assign repository Pages domain, change only apex A and www CNAME, and verify deployment, DNS, HTTPS and sibling sites.

## Definition of Done

Successful matching Actions deployment; preserved full DNS zone and ownership TXT; apex and www routing; valid certificate and HTTPS enforcement; served HTML matching validated build; sibling checks and rollback evidence retained.

## Authorization and Validation

User explicitly approved commit/push, publication, repository domain assignment, and Hostinger routing edits. Abbey session completed. Reviewed exactly three intended source modifications; Actions workflow and no-CNAME assertion unchanged. Remote main and HEAD aligned at 4f70a2ca511e5e2b0630b0e7d6acabfe70931efe. npm audit found zero vulnerabilities. Abbey build, validate and publish dry-run passed. Generated canonical is https://butterinthesalsa.com/. Artifact has no CNAME; HTML SHA-256 3f933d93116bc08fa20072e39b846360fd4f4dfcfb15d5d9c25b98f09f349671.

Stage 1 full before/after zone exports reviewed in local Work mirror; before-export hash matches ebcc51098d126e4b066ded01b3b91f8cf9e6a4e40bab0e3873ab590a4e339f10. Current Hostinger UI matches Stage 1 final zone. GitHub account Pages shows butterinthesalsa.com Verified.

## Rollback Evidence

Previous revision and prepared diff retained at /home/bcooke/butterinthesalsa-stage2-20261016. Prior originals at /home/bcooke/butterinthesalsa-stage1-20261016. DNS originals: apex A 2.57.91.91 TTL 50; www CNAME butterinthesalsa.com TTL 300. Preserve ownership TXT and nameservers. Previous repository custom domain empty, Actions source enabled. Any rollback must restore only cutover changes and use a normal reviewed revert, never force-push.

## Outcome

Execution and acceptance pending. Prior preparation note retained as historical evidence; its Stage 1 pending statements are superseded by the completed local DNS verification capture.

## Execution and Stop Condition

- Published revision 6dfc790b393ce8e9325c1fa51ed0e4730bd6e382. Actions run https://github.com/brad6887/butterinthesalsa/actions/runs/38953427668 completed successfully (build and deploy).
- Repository Pages custom domain saved as butterinthesalsa.com; Actions source retained. HTTPS enforcement unavailable, DNS check pending.
- Hostinger rejected the first apex update because existing TTL 50 is outside its current editor range 60–86400. No record update saved. Cancelled edit; confirmed original A, www CNAME, TXT and nameservers still displayed unchanged.
- Stopped further cutover changes under the explicit stop-on-unexpected-conflicts instruction. Proposed resolution: use TTL 300 for all four approved apex A records; retain www TTL 300. Await user decision before resuming.
- Read-only direct HTTP request to GitHub Pages IP 185.199.108.153 using the approved hostname returned exact validated HTML (SHA-256 above). This bypasses DNS only for the test; it does not establish public DNS routing or valid HTTPS. Styles are inline; no external asset references in generated page.
- BradCooke.com and BreadPitt.net HTTPS response bodies matched their before-cutover baselines byte for byte. AbbeyRoot.com timed out before mutation; its availability remains unverified.
- No force push or unrelated site configuration changes. Source working tree clean after deployment, before this documentation follow-up.

## Remaining Acceptance

Resolve TTL conflict; apply approved A/CNAME changes; export and compare complete final zone; query both authoritative servers and public resolvers; verify GitHub DNS/certificate readiness; enable HTTPS when available; verify apex/www HTTP and HTTPS redirects, served canonical/content and sibling availability. Stage 2 is incomplete, not merely waiting for TLS.

## Resumed Cutover — 2026-10-16 14:20 CDT

User explicitly approved TTL 300 to resolve the editor conflict. Re-ran Abbey session and confirmed clean working tree at f3141e0. Rechecked current provider zone before edits.

- Updated apex A to 185.199.108.153 and added 185.199.109.153, 185.199.110.153, 185.199.111.153, all TTL 300. Updated www CNAME to brad6887.github.io, retaining TTL 300.
- Complete provider export at 19:18:37 UTC compared against Stage 1 final export. Only approved A/CNAME changes and expected SOA serial advancement (2026101603 to 2026101608) occurred. Nameservers, ownership TXT, default TTL and all other SOA parameters preserved; no mail or other records existed in either complete export.
- Both authoritative nameservers returned all four exact A values TTL 300, exact www CNAME TTL 300 and unchanged ownership TXT TTL 300. Cloudflare 1.1.1.1 and Google 8.8.8.8 independently returned the same records.
- GitHub repository Pages reports DNS check successful, Actions source retained. Certificate not yet issued; Enforce HTTPS disabled and unchecked. Public HTTPS requests to apex and www fail hostname validation; no certificate bypass used.
- Public apex HTTP returns 200 and matches validated site/dist/index.html byte for byte. Public www HTTP returns 301 to http://butterinthesalsa.com/ then identical content. Canonical remains https://butterinthesalsa.com/; styles inline with no external assets. Final HTTPS redirect/content acceptance remains pending.
- BradCooke.com and BreadPitt.net final HTTPS HTML SHA-256 matches original baselines exactly. AbbeyRoot.com again timed out, consistent with pre-cutover observation; no changes made there.
- Deployed source remains 6dfc790b393ce8e9325c1fa51ed0e4730bd6e382, successful Actions run 38953427668. Documentation-only commits do not trigger this path-filtered deployment.
- Full final export and resolver logs retained at /home/bcooke/butterinthesalsa-stage2-20261016 and in local Work evidence directory working/evidence/2026-10-16-stage2/. Stage 1 before/after exports remain intact in local working/evidence/2026-10-16-domain-verification/.

### Remaining HTTPS Acceptance

Wait for GitHub certificate issuance, refresh repository Pages, enable Enforce HTTPS once available, then verify valid TLS for apex/www, HTTP-to-HTTPS redirects, www-to-apex redirect, canonical and exact content match. DNS cutover and deployment complete; overall session remains pending HTTPS acceptance. No scheduled monitoring created.

### Rollback Clarification

Original apex TTL 50 is retained in backup but current Hostinger editor rejects it. A rollback through that editor would require a supported TTL (minimum 60) or provider assistance to restore exactly 50. Restore original A/CNAME values only if rollback is authorized; preserve TXT and NS. Remove only this repository custom-domain assignment if reverting that setting; do not alter the user-site domain. Revert source changes with normal reviewed Git history, never force-push.
