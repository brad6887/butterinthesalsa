---
title: "Publish Reviewed Splash Page"
description: "Publish the accepted responsive artwork splash through Abbey and verify Pages and live assets."
date: 2026-10-16
status: complete
reviewed: false
session: publish-reviewed-splash-page
---

# Publish Reviewed Splash Page

## Objective

Commit, push and publish the visually accepted splash page. User explicitly authorized all three actions. Preserve DNS and Pages HTTPS settings.

## Definition of Done

Focused source and evidence commit, Abbey build/validate/publication dry run, successful Pages deployment for that revision, live HTML and responsive artwork comparison, final revision and clean tree recorded.

## Review and Validation

Reviewed Abbey session, project planning, repository instructions, saved preparation and visual-review findings, source diff and complete untracked file list on edge01. Starting revision: 34ef7a0. Changes are limited to index.astro, original PNG, two prior session captures, visual-review evidence and this publication capture. Remote fetched; no intervening main changes found.

Abbey site build, site validate, site publish --dry-run and git diff --check passed. The dry-run dirty-tree warning is expected before the focused commit. Prior browser review passed at 320–1440px with full desktop artwork fitting the viewport. No layout changes made in this publication session.

## Outcome

Published source revision: 0beeee83cf2946fff6833f7bad649d41dbc2e277 (Publish reviewed Butter in the Salsa artwork splash). Abbey site publish rebuilt, validated and pushed HEAD to origin:main after the authorized confirmation.

GitHub Actions run https://github.com/brad6887/butterinthesalsa/actions/runs/38957284781 completed successfully; both build and deploy jobs succeeded for this source revision.

Live verification from edge01: HTTP and HTTPS each returned 200 for the home page and all eight responsive artwork URLs (480, 800, 1100 and 1370 pixel WebP/JPEG variants). All 18 responses match the validated local build byte for byte. HTTPS used normal certificate validation, without bypasses. HTTP currently serves directly rather than redirecting to HTTPS. Certificate availability is therefore verified now; HTTPS enforcement was not changed. Full URLs and SHA-256 hashes are retained in working/splash-review/publication-verification.json.

Prior desktop/mobile visual acceptance applies to the identical deployed HTML and image bytes. No new browser rendering inspection was performed during publication. No DNS, Pages HTTPS setting or monitoring changes were made.

## Final Review

Definition of done met. Diff checks passed. Source commit left a clean tree after publication; this final capture and verification receipt are committed separately as documentation only. The Pages workflow path filter does not redeploy documentation-only changes. Final repository revision is the commit containing this capture; deployed site revision remains 0beeee83cf2946fff6833f7bad649d41dbc2e277. Verify HEAD equals origin/main and git status is empty after pushing the capture.
