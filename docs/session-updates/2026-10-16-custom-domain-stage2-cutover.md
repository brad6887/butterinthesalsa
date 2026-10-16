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
