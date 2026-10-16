---
title: "First GitHub Pages Deployment"
description: "Establish the site repository and validate its initial Pages deployment through edge01."
date: 2026-10-16
status: pending
reviewed: false
session: first-github-pages-deployment
tags:
  - Abbey Root
---

# First GitHub Pages Deployment

## Objective

Establish brad6887/butterinthesalsa and verify the first GitHub Actions Pages deployment from edge01. Hostinger DNS and custom-domain cutover are excluded.

## Definition of Done

Reviewed source and commit scope, fresh locked installation and audit, Abbey build/validation/dry run, configured Pages workflow, pushed initial commit, successful matching Actions run, and served content verification.

## Review and Decisions

- Reviewed all initial source, metadata, documentation, workflow and dependency lock changes. No secret-pattern matches found; dependency archives use registry.npmjs.org. This scan is evidence, not a guarantee.
- Repository was absent; created private. GitHub Pages API returned HTTP 422: current plan does not support Pages for this repository. The user subsequently made the repository public; verified public visibility and enabled Actions-based Pages.
- Changed Astro site/base to the GitHub project URL and removed the custom-domain CNAME. Workflow asserts that no CNAME is shipped. No DNS changes.
- Pushes to main affecting site/config/workflow deploy; pull requests build only. Deployment alone receives pages:write and id-token:write. No self-hosted runner or custom credentials.
- Separate Abbey provisioning changes are outside this repository and commit.

## Validation

- edge01 GitHub SSH authentication passed as brad6887.
- Fresh npm ci and npm audit: zero vulnerabilities.
- Abbey build and route validation passed. Publication dry run and Abbey review passed; review warned about missing generated backlog statistics. Initial deployment verified successfully; see acceptance evidence below.

## Next Steps

Review this completed session. Any custom-domain cutover or inherited-domain HTTPS enforcement changes require separate authorization.

## Pages Configuration

GitHub reports an inherited user-site domain, bradcooke.com, with project URL http://bradcooke.com/butterinthesalsa/. Repository cname is null. No existing user-site settings or DNS were changed. Verify the GitHub URL redirect and final HTTPS content after deployment.

## Acceptance Evidence

- Initial source commit: d34ee49004256d2c26d1564a4c5e8ccc45b472bc, committed and pushed from edge01 through abbey site publish.
- Actions run: https://github.com/brad6887/butterinthesalsa/actions/runs/38938038669 — completed success, build and deploy successful.
- https://bradcooke.com/butterinthesalsa/ returned HTTP 200 with valid TLS on 2026-10-16.
- Served HTML SHA-256 equals the validated edge01 dist/index.html byte for byte: 3da0a5272be5ff755d1f6ccbea0a883593700be7831487d800d9968c03225529.
- https://brad6887.github.io/butterinthesalsa/ returns 301 to http://bradcooke.com/butterinthesalsa/ because of existing user-site configuration. Direct HTTPS works; inherited HTTPS enforcement is false. Left those existing settings unchanged.
- No Butter in the Salsa custom domain, Hostinger DNS, unrelated Abbey provisioning, or user-site configuration changed.
- Abbey's installed publish success message incorrectly names BradCooke.com; the actual pushed repository and matching run above establish deployment scope. No shared-tooling fix included.
- Local mirror retains its independent uncommitted Git state; edge01 is the authoritative committed publication checkout. Source and session documentation are synchronized locally.

## Outcome

Definition of Done achieved. Initial Pages deployment and served content verified; custom-domain cutover remains future work. Documentation-only follow-up records acceptance without triggering another Pages deployment.
