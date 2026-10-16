---
title: "Splash Visual Review"
description: "Desktop and mobile browser review with a scoped desktop fit correction."
date: 2026-10-16
status: complete
reviewed: false
session: splash-visual-review
---

# Splash Visual Review

## Visual Review — 2026-10-16

Objective: visually review the prepared edge01 splash only; preserve uncommitted work and leave publication, DNS and HTTPS settings untouched.

Definition of done: inspect the existing source and capture, render desktop/mobile viewports in Chrome against edge01 Astro preview, correct narrowly scoped issues, repeat Abbey validation, retain screenshots and findings.

Reviewed edge01 /home/bcooke/git/butterinthesalsa using `abbey session`, planning files, repository instructions, source diff and prior capture. The requested working/splash-review/session-update.md was present in the local project mirror; edge01 had the corresponding docs/session-updates/2026-10-16-photo-splash-page-preparation.md, and no working/splash-review directory initially.

Found one desktop issue: at 1440x900 the 1370x1148 artwork required 248px of vertical scrolling. Added one desktop-only CSS width constraint using viewport height and the original aspect ratio. Full artwork now fits within the desktop viewport without cropping, distortion or scrolling. Mobile behavior is unchanged.

Reviewed Chrome screenshots at 1440x900, 390x844, 320x568 and 768x1024; also checked geometry at 1366x768 and both sides of the 48rem breakpoint (767 and 768px). All six tested sizes have document width and height equal to the viewport, with no horizontal overflow. The image scales proportionately; minor subpixel/derivative rounding is expected. Desktop now renders approximately 1074x900 at 1440x900 and 917x768 at 1366x768. Mobile artwork and supporting text form a centered group with balanced surrounding space. Full image edges remain visible.

Mobile supporting text uses 16px body text and a larger heading, with cream text on a dark brown background. Tablet/desktop artwork text is readable at the tested sizes. English language, descriptive image alternative text, one heading and the tagline/return-soon message were confirmed in the browser accessibility tree. Desktop HTML messaging remains visually clipped but available to assistive technology. This is a bounded visual/accessibility inspection, not a full assistive-device audit.

After the CSS fix, `abbey site build`, `abbey site validate`, `abbey site publish --dry-run` and `git diff --check` passed on edge01. The dry run explicitly reported no push or deployment. The existing dirty-tree warning is expected. Abbey session capture created docs/session-updates/2026-10-16-splash-visual-review.md; no optional journal was created.

Evidence in working/splash-review: desktop-1440-before.jpg, desktop-1440.jpg, viewport-390.jpg, viewport-320.jpg, viewport-768.jpg, mobile-390.jpg (initial unchanged mobile), and viewport-findings.json. Screenshots show the local edge01 build, not the public site. The initial 768px image request was in flight during geometry sampling; a subsequent screenshot and DOM check confirmed it loaded successfully.

Result: visual review passed after one scoped desktop sizing fix. User editorial acceptance remains pending. No commit, push, publication, DNS, HTTPS or monitoring changes were made. Preview and tunnel were stopped after review.
