---
title: "Read-only Tailscale mobile preview"
description: "Separate tailnet-only mobile presentation with no ballot submission path."
date: 2026-10-18
status: complete
reviewed: false
session: readonly-tailscale-mobile-preview
tags:
  - Abbey Root
---

# Read-only Tailscale mobile preview

## Objective and Definition of Done

Set up a separate read-only mobile preview for iPhone/iPad over Tailscale, verify disabled voting and rejected writes, preserve existing source/resources/process/tunnel and all three preview votes, and document access and teardown. No commits, pushes, public release, DNS, hosted Pages or production/preview Worker changes.

## Access

Connect the iPhone or iPad to the same Tailscale tailnet, then open Safari at **http://100.118.36.96:4333/**. Mac access over Tailscale returned HTTP 200. Actual iPhone/iPad access and human acceptance remain pending. The iPad needs Tailscale connected too; phone connectivity does not automatically extend to another device.

This service binds only edge01's Tailscale IPv4 address, not LAN or wildcard interfaces. It uses HTTP within the encrypted Tailscale connection. No certificates, DNS records, Tailscale Serve/Funnel configuration, ACLs, firewall rules or public hosting were changed. Existing Serve configuration was empty before and afterward. Access follows existing tailnet permissions; the service is not restricted to just these two devices.

## What is being tested

A disposable copy of the validated compiled site preserves its artwork, layout, question, radio labels, results and privacy link. It visibly identifies itself as a read-only mobile acceptance preview. It shows a saved closed-production snapshot with zero votes; this is separate from the preserved three-vote hosted preview.

The original client module and API/widget settings are disconnected in this copy. A small read-only refresh handler announces the same saved results. Voting controls remain disabled, form submission is suppressed, CSP blocks form actions and external connections/frames, and the server rejects POST/PUT/PATCH/DELETE/OPTIONS. No Worker credentials, database connection or upstream network requests exist in the running server. Static file access is limited to the page, saved aggregate results and built image/style assets; JavaScript asset requests and arbitrary paths are rejected. No directory listing or client/IP request logging.

This adapted presentation supports human mobile layout, labels, results, refresh announcements, focus and VoiceOver checks. It does **not** establish real Turnstile accessibility, production secure-context behavior or voting acceptance. The original localhost preview remains available on the Mac for real verification navigation without submitting a ballot. No human pass is inferred from automated checks.

## Runtime and teardown

- Edge01 process: Python PID **346833**, serving **100.118.36.96:4333**.
- Disposable directory: `/tmp/butter-mobile-readonly-u7gyjk16`.
- Runtime script: `/tmp/butter-mobile-readonly-u7gyjk16/server.py`; immutable public copy and aggregate snapshot are alongside it. No secret files were copied.
- Evidence and saved server source: `working/poll-mobile-readonly/{manifest.json,server.py,validation.json,after-live-state.json}`.
- This is a detached temporary process, not a boot service. It runs until stopped or host restart; no automatic restart or expiration was configured.
- To stop, first verify PID 346833 still identifies that exact Python script, then send TERM to that PID. Do not stop the existing preview PID 332757 or alter the Mac tunnel. The disposable directory may be removed after this process is confirmed stopped; no repository or Cloudflare resource deletion is needed. Tailscale Serve/Funnel needs no cleanup because neither was configured.

## Validation and preservation

- Browser loaded the new Tailscale URL; closed controls, four zero counts and Refresh worked without page errors. Widths 320, 390 and 834 had no horizontal overflow. Browser requests stayed on this service; no widget/API was contacted.
- POST, PUT, PATCH, DELETE and OPTIONS to the vote route all returned 405. The read-only handler has no forwarding or insertion path.
- Current read-only hosted GETs confirm production remains open=false/total zero and preview remains total three: Butter 1, Salsa 0, Absolutely not 1, Whatever 1. No hosted POST or mutation occurred.
- Existing preview PID 332757 remains running. The original Mac tunnel is preserved; no process or tunnel was restarted.
- Tracked candidate diff is byte-identical to the before-state. The earlier source-digest comparison differed only in the operations README because it had just been updated with owner policy choices; compiled site and other candidate source matched prior validation. No implementation files changed during setup. Only this session capture/evidence and the disposable runtime were added.
- Whitespace and final Abbey review captured. No dependency, CI, DNS, Pages, Worker, D1, Turnstile or secret change occurred.

## Suggested acceptance pass

On each device, report model/browser and whether portrait/landscape, large text/zoom, question/labels, results, Refresh and privacy navigation are understandable. With VoiceOver, check reading order and Refresh announcements. Disabled voting controls are expected. Real verification is intentionally absent here and must be assessed separately on the existing Mac preview. No ballot needs to be submitted.


## Owner follow-up — 2026-10-18

Owner reported "looks good on the phone with voice over". The iPhone read-only presentation has an owner-reported visual/VoiceOver pass with no reported issues. Do not infer separate iPad, landscape, large-text, exact refresh-announcement or real Turnstile acceptance from this brief response. No vote was reported or requested.
