---
title: "Prepare Butter in the Salsa Pages Onboarding"
description: "Prepare local Pages source and record pending edge01 prerequisites."
date: 2026-10-16
status: pending
reviewed: false
session: prepare-butter-in-the-salsa-pages-onboarding
tags:
  - Abbey Root
---

# Prepare Butter in the Salsa Pages Onboarding

## Objective

Prepare an independent Abbey-managed Astro site for GitHub Pages publication through edge01, stopping before commit, push, deployment, or DNS changes.

## Definition of Done

Local metadata, source, locked dependencies, workflow, dry run, and operating instructions are reviewable. Full original acceptance additionally requires an edge01 build and dry run; these remain pending because the host lacks the toolchain.

## Summary

Prepared the site locally. Full on-host validation is incomplete. No live publication occurred.

## Accomplishments

- Initialized the independent project with `abbey init` and captured this record with `abbey session capture`.
- Added a minimal responsive Astro landing page, exact Astro dependency, npm lockfile, domain configuration, and project-owned Pages workflow.
- Configured the local proposed origin URL; no GitHub repository was created and remote existence/write access was not established.
- Inspected edge01 read-only: ARM64, Git, Python 3.13/PyYAML, and successful GitHub SSH authentication. No Abbey/Node/npm on PATH or expected Abbey checkout.
- Obtained a separate current Abbey checkout at bf50ff2, preserving the older clean checkout at 370c04b. Generalized its one misleading Pages success message.

## Validation

- Fresh npm ci and Astro build passed locally; one static page generated.
- Abbey route validation and publish --dry-run passed without push/deployment.
- Abbey project validation passed.
- Workflow trigger/permission checks passed: PRs build only; deployment requires a push to main; Pages write permission is confined to deploy.
- Built CNAME matched the configured domain.
- Abbey review completed for both projects; new session metadata passed. Existing Abbey historical frontmatter debt and new-project missing backlog statistics were reported and left outside scope.
- All untracked site source files passed individual whitespace checks; tracked diffs passed git diff --check.
- Shared site regression results are recorded in the Abbey Root session update.
- Edge01 build/dry run, hosted Actions execution, browser visual inspection, Pages settings, DNS, and HTTPS were not validated.

## Decisions

Use the existing github-pages backend and GitHub-hosted Actions. Keep source and deployment configuration in the site project. Do not install a self-hosted runner. Local build success does not establish edge01 readiness or live acceptance.

## Next Steps

Approve a bounded managed edge01 toolchain/checkout setup, then perform a fresh install, build, and publish dry run there. Separately authorize GitHub repository creation, commits, pushes/deployment, and DNS cutover.

## Notes

All new site files are uncommitted and unstaged. Generated output and dependencies are ignored. No existing working tree or synced source was altered. Persistent host installation was deferred at the external-action boundary.
