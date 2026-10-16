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
