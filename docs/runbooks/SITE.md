# Site Operations

## Ownership

`.abbey/project.yml` owns build output, routes and publication target. Its domain is the Pages host; the project URL includes `/butterinthesalsa/`. Astro declares that host and base path. No CNAME is shipped during initial Pages verification.

Repository: `brad6887/butterinthesalsa`. Origin: `git@github.com:brad6887/butterinthesalsa.git`.
GitHub entry URL: https://brad6887.github.io/butterinthesalsa/
Verified HTTPS site: https://bradcooke.com/butterinthesalsa/
The existing user-site custom domain is inherited. The GitHub entry currently redirects to HTTP; direct HTTPS works. Do not change the existing user-site settings as part of this project.

Custom-domain configuration and Hostinger DNS require separate approval. When cutover is approved, align Abbey domain, Astro URL/base, Pages settings, and CNAME as applicable.

## Prepare edge01

Host setup and validation on 2026-10-16 completed using Abbey Root's opt-in
`ansible/playbooks/site-operations.yml` and `site_operations` role, targeted only
at edge01. The host has Node 22.23.3, npm 10.9.9, Python 3.13 with PyYAML, and
Abbey revision `bf50ff2a26d0556deedc663c6fa3098b7517ffe5`. The role owns versioned
Node under `/opt` and command links under `/usr/local/bin`; the existing common
role still owns shell initialization. No Actions runner was installed.

Abbey is at `/home/bcooke/git/abbey-root`; this project's uncommitted working
snapshot is at `/home/bcooke/git/butterinthesalsa`. It retains the proposed origin
and has no commits. Fresh locked dependency installation, `abbey session`, site
build, route validation and publication dry run passed there. A repeat host setup
made zero changes. See Abbey Root's session update
`docs/session-updates/2026-10-16-prepare-edge01-site-operations.md` for evidence.

Dependency review on 2026-10-16 updated Astro and its locked sharp dependency;
fresh installation, audit, build, validation and publication dry run passed.
See [Dependency Security Review](../session-updates/2026-10-16-dependency-security-review.md)
for versions, advisory assessment and retained evidence. GitHub repository
creation/access, Pages setup, DNS and live HTTPS remain unverified and separately
authorized.

## Build and Preview

From this project, with Abbey and Node available:

```sh
abbey session
npm --prefix site ci
abbey site build
abbey site validate
abbey site publish --dry-run
```

The dry run builds locally and requires a configured Git remote; it does not push. Build output and dependencies are ignored. `npm --prefix site run dev` provides a local design preview.

## Publish Only After Approval

The Pages workflow validates pull requests without deployment. Pushes to `main` affecting the site, project metadata, or workflow build and deploy. Consequently, approving a push to main also needs to authorize its deployment effect.

Before first publication, create the approved GitHub repository, configure `origin`, enable Pages using GitHub Actions, and review environment controls. Confirm the default branch and intended source revision.

After explicit commit/push/publication approval, use `abbey site publish` from the clean project on edge01. The command builds, validates, and asks before pushing HEAD to the configured branch. It does not wait for deployment or establish live success. Inspect the matching Actions run and verify the served content separately.

## Custom Domain Cutover

DNS changes require separate approval. Before cutover, inspect existing Hostinger records, preserving mail and unrelated services. Verify domain ownership through GitHub's current verification procedure, configure the Pages custom domain, and prepare the apex and www records using current GitHub documentation. Check for conflicting records and choose the canonical redirect behavior before applying changes.

After approved cutover, verify authoritative DNS, Pages domain checks, certificate issuance, HTTPS, redirects, assets, and expected page content. A successful push alone is not acceptance.

## Recovery

Record the deployed source revision and last known-good revision. Recover through an explicitly approved revert commit and Pages deployment, without force-pushing. DNS recovery is a separate operation using the retained pre-cutover records.
