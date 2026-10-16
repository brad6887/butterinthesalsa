---
title: "Dependency Security Review"
description: "Resolve Astro and sharp advisories on edge01 and review provisioning scope."
date: 2026-10-16
status: pending
reviewed: false
session: dependency-security-review
tags:
  - Abbey Root
---

# Dependency Security Review

## Objective

Resolve the Butter in the Salsa dependency advisories in its existing edge01
workspace and review the separate uncommitted Abbey Root provisioning changes.

## Definition of Done

No reported critical or high advisories; reproducible locked installation;
successful Abbey build, route validation and publication dry run; reviewed source
differences and provisioning; captured evidence without commit or publication.

## Summary

Completed. Astro is pinned to 7.2.8 instead of 7.0.3. Its supported optional
sharp range ^0.35.4 resolves to 0.35.5 in the lockfile, replacing 0.34.5.
Fresh npm audit reports zero advisories at every severity. No override, forced
audit fix, direct sharp dependency, framework major upgrade or site source edit.

## Accomplishments

- Ran abbey session and inspected planning, instructions, source and Git state.
- Retained original manifests and a source backup on edge01 under
  /tmp/butter-security-20261016 before changing dependencies.
- Selected the earliest Astro critical fix, 7.2.8, instead of audit's suggested
  latest 7.4.0. Node >=22.12 remains compatible with installed Node 22.23.3.
- Reviewed all nine advisory records: six Astro and three sharp. Critical AVIF
  optimization requires processing attacker-controlled images. This site has one
  static page, no image processing or server routes, islands or transitions;
  current source does not exercise those paths. Dependencies were still patched.
- Synced only manifests back to the local workspace after verifying both local
  originals matched the saved on-host originals byte for byte.
- Captured this update with abbey session capture; optional journal omitted.

## Impact

The dependency prerequisite for publication is satisfied as of this audit.
GitHub repository/access, Pages setup, DNS and hosted HTTPS remain unverified.

## Validation

On edge01, Node 22.23.3 / npm 10.9.9:

- Before: npm audit exit 1; two affected packages (Astro critical, sharp high).
- After: npm audit exit 0, zero vulnerabilities; npm ls confirms Astro 7.2.8 and
  sharp 0.35.5. npm ci succeeded with zero advisories; post-ci audit also exit 0.
- abbey site build passed, one static page; abbey site validate passed route /.
- abbey site publish --dry-run rebuilt and validated, explicitly reported no
  push or Pages deployment. Expected uncommitted-source warning remains.
- Final abbey review passed session metadata in both workspaces. It warned
  that generated backlog statistics are stale/missing; left outside this scope.
- Git status inspected in both workspaces. This project has an unborn main
  branch and all source is untracked, so tracked git diff alone is insufficient.
  Byte comparison against the retained pre-session archive found exactly two
  changed existing files: site/package.json and site/package-lock.json before
  capture. Lock diff: 328 insertions, 512 deletions, 80 changed package entries
  including root metadata and platform variants; reviewed dependency graph changes.
- git diff --check passed. Build artifacts/dependencies remain ignored.
- Installed Abbey checkout remains clean at bf50ff2a26d0556deedc663c6fa3098b7517ffe5.
- Raw before/after audit JSON and lockfile diff are retained in
  working/dependency-security-review/. The edge01 temporary backup is not durable.

## Provisioning Review

Read-only review of Abbey Root's playbook, defaults, tasks, README and existing
abbey-site one-line project-name correction; no provisioning files edited or
Ansible apply performed in this session.

- Scope is opt-in, default target selects no hosts. Pinned official archives,
  architecture checks, checksum verification, user-owned toolkit clone with
  update:false/force:false, and refusal to replace unrelated entrypoints fit
  initial host preparation. No web server, runner or DNS changes.
- Syntax check passed with temporary controller configuration and explicit
  ANSIBLE_ROLES_PATH. Initial check omitted that path and could not find the
  role; corrected invocation passed. No apply/idempotence rerun in this session;
  prior session's successful repeat remains historical evidence only.
- Limitation: entrypoint checks accept only the newly selected Node directory,
  so changing the Node version later rejects existing managed-version symlinks.
  Treat as initial provisioning until an explicit upgrade workflow is designed.
- Existing toolkit checkouts are deliberately not updated or revision-validated
  by the role; session-level version/status checks remain necessary.
- Check mode skips extraction/linking, so syntax/preview cannot establish a
  usable installation. Existing prior apply evidence is separate.
- The one-line abbey-site change correctly replaces a hardcoded project name
  with PROJECT_NAME in the real-publication success message. Not exercised by
  this dry run. Keep it separate from dependency and provisioning commit scopes.

## Design Decisions

Use one project-owned session record and link to it from the operations runbook.
Do not reconcile broader planning or modify separate provisioning code here.

## Lessons Learned

The earliest framework critical patch can support a newer transitive security
patch without an override. Preserve file baselines when source is all untracked.

## Next Steps

- Separately review/authorize any desired dependency or provisioning commits.
- Address the managed Node upgrade limitation before using this role to upgrade.
- Separately authorize repository creation, Pages configuration and publication;
  DNS and HTTPS acceptance remain later work.

## Notes

No staging, commits, pushes, repository creation, publication, DNS changes or
infrastructure application occurred. Local and edge01 dependency files agree.
Automatic approval review rejected copying the full source backup because it
could contain sensitive material. Only audit/dependency artifacts were copied;
the source backup remains on edge01. No requested work remains blocked by this.

Advisory sources:
- https://github.com/advisories/GHSA-26w7-cxv4-gfx2 (Astro fixed in 7.2.8)
- https://github.com/advisories/GHSA-wq5f-xc86-pv6w (sharp fixed in 0.35.5)
Other advisory IDs, titles and affected ranges are preserved in audit-before.json.
