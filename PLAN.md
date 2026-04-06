# Comprehensive Plan for the `.github` Special Repository

Research basis current as of 2026-04-06.

## Executive Summary

This repository should become the account-level control plane for:

- default community health files that GitHub can surface across repositories
- reusable workflows that other repositories can call
- the policy and security baseline for this repository itself

The best version of this repo is not "the largest number of files." It is the smallest, clearest, safest set of GitHub-supported files that:

- gives contributors a consistent experience across repositories
- keeps security-sensitive processes private when they should be private
- uses structured intake where GitHub supports it
- keeps automation secure by default
- is easy for individual repositories to override when they need repo-specific behavior

## Current State Assessment

This special repo is effectively empty today, so there is no legacy structure we need to preserve.

The nearby repositories in the local workspace suggest that this special repo needs to serve at least three repo archetypes well:

- a profile or showcase repo (`NWarila`)
- a content or documentation-heavy repo (`resume`)
- an infrastructure or automation repo (`github-terraform-runner`)

Implications:

- inherited defaults in this repo should be policy-first and stack-agnostic
- stack-specific behavior should be delivered through reusable workflows and per-repo overrides now, and through workflow templates only if these standards later move under an organization
- this repo should be managed like a control plane, because changes here can affect many downstream repositories invisibly

## Current Known Plan Context

From the provided billing screenshot, the current owner account has a personal `GitHub Pro` subscription.

GitHub Pro feature availability relevant to this plan:

- branch protection rules (required reviews, required status checks, restrict force pushes): AVAILABLE, but required reviews have limited practical value for a solo maintainer who cannot approve their own PRs; still useful to enforce that all changes go through PRs
- repository-level rulesets: AVAILABLE (org-level rulesets require GitHub Team or Enterprise)
- CODEOWNERS: AVAILABLE; works without branch protection for auto-requesting reviewers, but enforcement of required code owner approval requires branch protection
- private vulnerability reporting: AVAILABLE on public repositories on GitHub.com
- Dependabot (security + version updates): AVAILABLE
- code scanning (CodeQL): AVAILABLE on public repos only; private repos require GitHub Advanced Security
- secret scanning: AVAILABLE on public repos only; private repos require GitHub Secret Protection
- GitHub Actions: AVAILABLE; for this plan, the more important constraint is runner model and security posture, not exact monthly quota figures
- GitHub Discussions: AVAILABLE
- personal account `.github` repo default community health files: AVAILABLE, works identically to org `.github` repo

Implications for this plan:

- assume personal-account features compatible with `GitHub Pro` are available now
- do not assume organization-only features are available unless this repo is later moved under or mirrored into an organization with `GitHub Team` or `GitHub Enterprise`
- treat org-wide rulesets, custom repository properties, and GitHub Advanced Security enforcement as conditional future-state capabilities, not day-one assumptions
- treat organization profile features and workflow templates as future-state items, not current-scope requirements for this repo
- branch protection's "required reviews" is available but of limited value as a solo maintainer; use it primarily to enforce PR-based workflow (preventing direct pushes) rather than expecting human review

## Scope and Boundaries

### What this special repo can officially provide

Per GitHub's current documentation, the special `.github` repository can provide account-wide defaults for repositories owned by this personal account:

- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- `GOVERNANCE.md`
- `SECURITY.md`
- `SUPPORT.md`
- `FUNDING.yml`
- issue templates and `.github/ISSUE_TEMPLATE/config.yml`
- pull request templates
- discussion category forms

This repo can also host:

- `.github/workflows/` reusable workflows that other repositories call explicitly

Not current-scope for this personal account:

- `workflow-templates/` are an organization feature and should be treated as future-state only if these standards move under an organization later
- `profile/README.md` is for organization profiles; your personal profile README belongs in the separate `NWarila/NWarila` repository

### What this repo cannot provide as a default to every repository

GitHub's documented default community health file list does not include these files, so they still need per-repo automation, templating, or repo-by-repo ownership:

- `LICENSE`
- `README.md`
- `CODEOWNERS`
- `CITATION.cff`
- `.github/dependabot.yml`

This is an inference from GitHub's supported default file list, plus GitHub's explicit statement that licenses cannot be defaulted from the special `.github` repo.

### Important platform constraints

- Default community health files can come from a public or internal `.github` repository, but issue and pull request templates require a public `.github` repository.
- Workflow templates also require a public `.github` repository, but they are an organization feature rather than a personal-account requirement.
- Since this repo's current mission includes inherited community health files and templates for a personal account, it should be public.
- GitHub resolves community health files inside a repository in this order: `.github/`, repository root, then `docs/`.
- GitHub only falls back to the special `.github` repository if the current repository does not already have its own file of that type.
- Supported default files may live in the repository root, `.github/`, or `docs/`, except where GitHub requires a specific directory.
- Issue templates and `config.yml` must live in `.github/ISSUE_TEMPLATE/`.
- Discussion category forms must live in `.github/DISCUSSION_TEMPLATE/`.
- If a repository has anything in its own `.github/ISSUE_TEMPLATE/` directory, GitHub ignores the default issue template folder from this repo for that repository.
- If a default issue template assigns labels, those labels must exist both in this repo and in every repository that uses the template.
- GitHub Docs still marks issue forms as public preview as of 2026-04-06, so we should use them deliberately and keep the forms simple enough to replace if GitHub changes behavior.
- Default files from this repo do not appear in downstream repositories' file trees, clones, archives, or Git history.

## Research Basis

The plan should use this source hierarchy.

1. GitHub Docs as the platform source of truth
   - Default community health files: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file
   - Community profiles: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories
   - Issue and PR templates: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates
   - Issue template configuration and ordering: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository
   - Issue form syntax: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms
   - Pull request templates: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository
   - Code of conduct: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-code-of-conduct-to-your-project
   - Contributing guidelines: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors
   - Support resources: https://docs.github.com/en/enterprise-cloud@latest/communities/setting-up-your-project-for-healthy-contributions/adding-support-resources-to-your-project
   - Security policy: https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/adding-a-security-policy-to-your-repository
   - Discussion forms: https://docs.github.com/en/discussions/managing-discussions-for-your-community/creating-discussion-category-forms
   - Discussions best practices: https://docs.github.com/en/discussions/guides/best-practices-for-community-conversations-on-github
   - Organization discussions: https://docs.github.com/en/organizations/managing-organization-settings/enabling-or-disabling-github-discussions-for-an-organization
   - Workflow templates: https://docs.github.com/en/actions/how-tos/reuse-automations/create-workflow-templates
   - Reusable workflows: https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows
   - Secure workflow use: https://docs.github.com/en/actions/reference/security/secure-use
   - Organization profile README: https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/customizing-your-organizations-profile
   - Default labels: https://docs.github.com/en/organizations/managing-organization-settings/managing-default-labels-for-repositories-in-your-organization
   - Rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
   - CODEOWNERS for this repo itself: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners

2. GitHub Open Source Guides for contributor and governance quality
   - Welcoming communities: https://opensource.guide/building-community/
   - Best practices for maintainers: https://opensource.guide/best-practices/
   - Leadership and governance: https://opensource.guide/leadership-and-governance/
   - Metrics: https://opensource.guide/metrics/

3. Contributor Covenant for a mature code-of-conduct baseline
   - Adoption guide: https://www.contributor-covenant.org/adopt/
   - Current state: Contributor Covenant's current English adoption flow uses version 3.0, while many translated variants still exist only for 2.1

4. OpenSSF Scorecard for measurable repository security quality
   - Project overview and relevant checks: https://github.com/ossf/scorecard
   - Checks relevant to this repo: `Dangerous-Workflow`, `Token-Permissions`, `Pinned-Dependencies`, `Security-Policy`, `License`, `Branch-Protection`, `SAST`
   - Checks not relevant to a config/templates-only repo (expect low or zero scores): `Fuzzing`, `Binary-Artifacts`, `Packaging`, `Signed-Releases`, `CII-Best-Practices`
   - Goal: maximize relevant checks instead of chasing a raw total score that includes irrelevant categories

5. CISA guidance for vulnerability disclosure expectations
   - Coordinated vulnerability disclosure process: https://www.cisa.gov/resources-tools/programs/coordinated-vulnerability-disclosure-program
   - VDP template: https://www.cisa.gov/vulnerability-disclosure-policy-template
   - CISA benchmark timelines from BOD 20-01 guidance: initial response within 3 business days, validation within 7 days, remediation target within 90 days when reasonable

6. Industry-leader examples to benchmark against, without cargo-culting them
   - Electron `SECURITY.md`: https://github.com/electron/electron/blob/main/SECURITY.md
   - Rust governance RFC: https://github.com/rust-lang/rfcs/blob/master/text/1068-rust-governance.md

## Industry Benchmark Takeaways

Reference points such as `github/.github`, `microsoft/.github`, `google/.github`, and `sindresorhus/.github` suggest a few durable patterns:

- strong `.github` repos are usually minimal; they focus on a small number of high-value defaults rather than trying to centralize every possible file
- `CODE_OF_CONDUCT`, `CONTRIBUTING`, and `SECURITY` are the most common defaults across mature examples
- issue templates, PR templates, discussion forms, and reusable workflows are much less universal and therefore need stronger justification
- larger organizations differentiate themselves more through policy automation and enforcement tooling than through extra community-health files
- personal-account maintainers usually keep the baseline even smaller than organizations do, which reinforces the need to justify every extra file against actual maintenance cost
- for this repo, account-wide issue templates, PR templates, and reusable workflows are deliberate convenience choices, not universal best practice; if they stop reducing toil, they should be trimmed or extracted
- the useful lesson from industry benchmarks is restraint: quality comes from clarity, consistency, and secure operations, not from maximizing the number of supported files

## GitHub Community Profile Checklist

The community profile (visible at `https://github.com/<owner>/<repo>/community` for public repositories) checks for:

- **README** - present in a supported location (root, `docs/`, or `.github/`)
- **CODE_OF_CONDUCT** - only marked complete if added via a GitHub template; manually created files are functional but do not get the checkmark
- **LICENSE** - a recognized license file
- **CONTRIBUTING** - present in a supported location
- **SECURITY** - a security policy file in a supported location
- **Issue templates** - must be in `.github/ISSUE_TEMPLATE/` with valid `name:` and `about:` keys (Markdown templates) or `name:` and `description:` keys (YAML issue forms)
- **Pull request template** - present in a supported location

The checklist detects files inherited from the account `.github` repo for repos that lack their own. Maintainers see "Add" buttons; contributors see "Propose" buttons for missing items.

This plan targets completing every checklist item for this repo itself and ensuring the inherited defaults complete as many items as possible for downstream repos.

## Design Principles

- Official-first: start with GitHub-supported paths, behaviors, and UI affordances.
- Clear overrides: defaults should help, not trap, downstream repositories.
- Safe by default: security reporting private, automation least-privilege, actions pinned where possible.
- Public by default for ordinary support: bugs, ideas, and questions should go to public channels unless privacy is required.
- Friendly by default: contributor language should reduce friction for first-time contributors.
- Small governance, explicit ownership: document who decides, who reviews, and how disputes resolve.
- Reuse over duplication: central reusable workflows for logic, and workflow templates for discoverability only if these standards are later used under an organization.
- Measurable quality: use checklists and Scorecard-style criteria instead of "looks good to me."
- Baseline plus overlays: inherited defaults should stay generic; repo-type specialization should happen through templates, reusable workflows, and local overrides.
- Control-plane mindset: this repo deserves stronger review, validation, and rollback discipline than a normal single-project repo.

## Audit Lens: Best Practice vs Overengineering

Each change in this repo should pass all of these tests before it is added:

- real user value: it reduces ambiguity, reduces maintainer toil, improves security, or improves contributor success
- real consumer: at least one current repo will use it in the next rollout phase
- clear owner: someone is responsible for keeping it correct
- low confusion: it does not create more choices, forms, or workflows than contributors and maintainers can reasonably navigate
- justified maintenance cost: the ongoing review burden is lower than the support burden it removes
- removal criteria: there is a clear answer to "when would we remove this if it is not used?"

Anti-overengineering rules:

- do not add a file just because GitHub supports it
- do not create a workflow template or reusable workflow without a concrete first consumer
- do not add discussion forms unless they demonstrably improve intake quality over GitHub's built-in category UI
- do not create multiple templates where one good default is sufficient
- do not create a heavyweight governance model for a small maintainer set
- do not add labels, issue types, or intake steps that no one will actively use for triage
- do not create custom branding assets when built-in Octicons or plain text are enough

This is an inference from the repo context, GitHub Open Source Guides, and maintainer best practices. In particular, Open Source Guides emphasizes documenting vision to avoid scope creep, using automation to remove toil, and avoiding standards that are so complicated they raise the barrier to contribution.

## Placement Decision Matrix

### Use a default community health file when

- the content is human guidance or policy
- the content should appear automatically across repositories that lack a local version
- a local override is acceptable and expected

### Use a workflow template when

- maintainers need a starting workflow in the Actions UI
- the generated workflow becomes repository-owned after creation
- some repo-specific editing is expected immediately

### Use a reusable workflow when

- the implementation logic should stay centralized and evolve over time
- the account wants security fixes and behavior improvements to flow from one maintained implementation
- callers can accept an explicit `@ref` contract

### Use an org setting or ruleset when

- enforcement matters more than guidance
- drift must be prevented, not merely documented
- the control belongs in GitHub settings rather than repository files

### Use a per-repo file when

- the content is legal, ownership-specific, compliance-specific, or stack-specific
- GitHub does not support inheriting that file from the special `.github` repo
- the repository needs materially different behavior

## Recommended Repository Layout

This layout is the full target surface area, not mandatory day-one scope. Conditional files should only be added when their triggering conditions are true.

```text
/
  README.md                          # Tier 1
  LICENSE                            # Tier 1 (MIT)
  CODE_OF_CONDUCT.md                 # Tier 1 (GitHub template)
  CONTRIBUTING.md                    # Tier 1
  SECURITY.md                        # Tier 1
  SUPPORT.md                         # Tier 1
  FUNDING.yml                        # Tier 1 (GitHub Sponsors)
  GOVERNANCE.md                      # Tier 2 (defer until contributors exist)
  CODEOWNERS                         # Tier 2 (defer until contributors exist)
  .github/
    pull_request_template.md         # Tier 1
    ISSUE_TEMPLATE/                  # Tier 1
      01-bug-report.yml
      02-feature-request.yml
      03-documentation.yml
      config.yml
    DISCUSSION_TEMPLATE/             # Tier 2 (defer until forms earn their place)
      q-a.yml
      ideas.yml
      show-and-tell.yml
    workflows/
      repo-ci.yml                    # Tier 1
      reusable-ci.yml                # Tier 2
      reusable-docs.yml              # Tier 2
      reusable-terraform.yml         # Tier 2
      reusable-release.yml           # Tier 2 (conditional)
      reusable-scorecard.yml         # Tier 2 (conditional)
      reusable-codeql.yml            # Tier 2 (conditional)
    dependabot.yml                   # Tier 1
```

Future organization-only additions if these standards move under an organization later:

- `workflow-templates/`
- `profile/README.md`

## Repository Archetypes and Overlay Strategy

### Universal baseline (all repos inherit)

- `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `FUNDING.yml`
- issue templates, PR template
- branch protection (configured per-repo; no org-level shared labels on a personal account - sync labels manually or via scripting)

### Current archetypes in the workspace

- **Profile or showcase** (`NWarila`): lightweight automation, excellent presentation, low-friction contribution guidance
- **Content or documentation** (`resume`): docs intake, Markdown quality, link checking; code-centric workflows optional
- **Infrastructure or Terraform** (`github-terraform-runner`): Terraform fmt/validate, docs generation, stricter credential and runner guidance

### Design rule

- keep inherited defaults generic enough for the universal baseline
- deliver archetype-specific behavior through reusable workflows and local files
- do not create archetypes or overlays for repo types that do not currently exist in the workspace; add them when a real repo needs them

## Priority Tiers

### Tier 1: High-value baseline to ship first

- `README.md`
- `LICENSE`
- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `SUPPORT.md` (routing to Discussions, which are already enabled across all repos)
- `FUNDING.yml` (GitHub Sponsors is active)
- one default PR template
- three issue forms (bug report, feature request, documentation)
- repo-local CI (start with `actionlint` + `markdownlint-cli2`) and Dependabot for this repo itself

Why these first:

- they improve contributor routing, security posture, and maintainability immediately
- they have clear value even for a solo maintainer with a small repo set
- they avoid creating an oversized platform before the basics are trustworthy

### Tier 2: Ship when the conditions justify them

- `CODEOWNERS` (defer until this repo has more than one active contributor)
- `GOVERNANCE.md` (defer until the contributor base warrants formal governance)
- discussion forms (Discussions are enabled, but forms are only worth adding if the default categories and form fields genuinely improve intake quality)
- reusable workflows (defer until at least one pilot consumer repo is ready)
- org-level rulesets and default labels (defer until these standards move under an organization)
- Scorecard workflow for this repo

Conditions:

- each item has a concrete trigger, not just "it would be nice"
- ownership and review paths are clear
- there is at least one pilot consumer
- the target account or organization has the required GitHub plan features enabled

### Tier 3: Defer until demand is proven

- language-specific workflow templates with no current consumers
- release automation for repo types that do not publish releases
- org-wide issue type taxonomy
- custom SVG template icons
- additional reusable workflows beyond the first set per archetype
- workflow templates and `profile/README.md` unless these standards move under an organization later

Rule:

- if an item has no concrete consumer, no clear owner, or no measurable benefit in the next quarter, defer it

## Audit Conclusions From This Pass

Based on the current repo context and authoritative guidance, the strongest "do now" items are:

- contributor and security routing documents
- a minimal issue and PR intake layer
- repo-local hardening for this repo itself
- a small initial reusable-workflow set aligned to real repo archetypes already visible in the workspace

The strongest "defer unless proven" items are:

- Node-specific workflow templates
- release automation as a default platform feature
- discussion forms (Discussions are enabled, but forms need to earn their place)
- heavyweight governance structure for a small maintainer set

## File-by-File Plan

### `README.md` for this repo

Purpose:

- explain what the special `.github` repo does and does not propagate
- document precedence rules and override behavior
- list every maintained default file, workflow template, and reusable workflow
- explain how downstream repos should opt in to reusable workflows
- explain how maintainers should propose changes here, because a change in this repo affects many repositories

Quality bar:

- first screen tells maintainers exactly where to edit for each concern
- includes a "How overrides work" section
- includes an "Account-wide impact" warning before editing defaults
- links directly to the authoritative GitHub docs above

### `LICENSE`

Purpose:

- license this repository itself

Plan:

- use MIT license
- do not treat this as a propagated default, because GitHub explicitly does not support default licenses from the special `.github` repo

### `CODE_OF_CONDUCT.md`

Purpose:

- set a clear baseline for acceptable behavior across repositories that do not define their own code of conduct

Plan:

- use a recognized template rather than inventing custom conduct language
- fill in private reporting instructions and enforcement ownership
- keep enforcement contacts aligned with `SUPPORT.md` and `SECURITY.md`

Resolved decision:

- use GitHub's built-in code of conduct template flow to get the community profile green checkmark
- GitHub docs explicitly state: "Code of conduct will only be marked as complete in your repository's community profile if you use a template." Using the GitHub template flow satisfies this.
- implementation note: the file cannot be created via CLI and get the checkmark; it must be added through the GitHub web UI at `https://github.com/NWarila/.github/community` by clicking "Add" next to Code of Conduct
- after adding via the GitHub UI, fill in the enforcement contact information to align with `SUPPORT.md` and `SECURITY.md`
- the community profile is only visible for public repositories, accessible at `https://github.com/<owner>/<repo>/community` under the Insights tab

### `CONTRIBUTING.md`

Purpose:

- create one welcoming, reusable contribution path for repositories that do not need repo-specific contribution docs

Plan:

- explain how to choose between Issues, Discussions, PRs, and security reporting
- include a first-time contributor section
- include expectations for issue quality, PR quality, tests, and review etiquette
- explicitly state that repository-specific docs override this default when present
- prefer "minimum useful contribution" language over exhaustive process language
- make maintainers sound responsive and human, not bureaucratic

Quality cues from sources:

- reduce friction for casual contributors
- point people to public channels where appropriate
- make review expectations visible
- label beginner-friendly work and docs work

### `GOVERNANCE.md`

Purpose:

- define ownership and decision-making before conflict or ambiguity appears

Industry context:

- none of the surveyed industry .github repos ship GOVERNANCE.md; governance is typically documented on project websites or in dedicated governance repos for large projects
- for a solo-maintainer personal account, a formal governance document risks looking performative - documenting five roles when one person fills all of them
- the real value of governance documentation appears when a second contributor arrives or when a dispute needs a documented resolution path

Recommendation:

- defer GOVERNANCE.md to Tier 2 or later; a clear `CONTRIBUTING.md` with decision-making expectations and a `SECURITY.md` with escalation contacts covers the immediate need
- when added, keep it to a single short page: who owns the account, how decisions are made (owner decides after considering input), how to escalate conduct or security concerns, and how contributor roles may expand in the future
- do not enumerate five formal roles (owner, maintainer, reviewer, triager, security contact) for a single-person account; collapse to "owner" plus "security contact" and expand only when real people fill additional roles

### `SECURITY.md`

Purpose:

- give researchers a private, trusted reporting path and clear handling expectations

Plan:

- make GitHub private vulnerability reporting the primary path (available on public repos with GitHub Pro)
- fallback contact: link to the GitHub profile (`https://github.com/NWarila`) for contact; acceptable as a fallback since private vulnerability reporting is the primary path
- include supported versions guidance, even if the first version is a simple "latest default branch only"
- include acknowledgement, validation, and update SLAs
- include clear "do not file public issues for vulnerabilities" guidance
- include scope and out-of-scope testing boundaries
- include a good-faith researcher statement

Quality cues from sources:

- private reporting path
- reasonable acknowledgement timeline
- coordinated disclosure expectations
- good-faith researcher language

Benchmark:

- use Electron's `SECURITY.md` as a brevity benchmark
- use CISA guidance for acknowledgement expectations and scope wording
- resolved SLA: acknowledge within 7 business days, validate within 14 days, target remediation or mitigation within 90 days when reasonable (CISA benchmark is 3 business days for acknowledgement, but 7 is more honest for a solo maintainer)

### `SUPPORT.md`

Purpose:

- route ordinary help requests away from the wrong channels

Plan:

- define where to ask questions, where to report bugs, and where to discuss ideas
- distinguish public support from private reporting
- set response expectations honestly
- encourage public support channels for searchable answers

Recommended routing:

- questions -> Discussions
- bugs -> Issues
- security -> `SECURITY.md`
- conduct -> private conduct contact

Discussion scope guidance:

- Discussions are enabled on all repos; this routing is confirmed as the day-one model
- for this personal account, prefer repository-level Discussions
- if these standards later move under an organization and questions span multiple repositories, prefer organization discussions with a designated source repository

### `FUNDING.yml`

Purpose:

- surface GitHub Sponsors link across repos

Plan:

- GitHub Sponsors is active; include `FUNDING.yml` pointing to the Sponsors profile
- this is now Tier 1 scope since a real funding destination exists

### Issue templates in `.github/ISSUE_TEMPLATE/`

Purpose:

- standardize bug and feature intake while steering non-issue traffic elsewhere

Industry context:

- none of the surveyed benchmark `.github` repos ship account-wide default issue templates; they leave templates to individual repos
- the argument against account-wide templates: repos have different needs, and a one-size-fits-all form can frustrate contributors on repos where the fields don't apply (e.g., a documentation repo does not need "reproduction steps")
- the argument for them on a small personal account: with only 3-10 repos, maintaining templates per-repo is more work than one good default; repos that need different templates can override with their own `.github/ISSUE_TEMPLATE/` directory (which fully replaces the defaults)
- recommendation: ship account-wide default templates, but keep them genuinely generic; if a field only makes sense for one repo type, it does not belong in the default

Recommended defaults:

- `01-bug-report.yml`
- `02-feature-request.yml`
- `03-documentation.yml`
- `config.yml`

Available input types in issue forms:

- `markdown` - static display text; `attributes.value` required; no `id` field allowed
- `input` - single-line text; `attributes.label` required
- `textarea` - multi-line text; `attributes.label` required; optional `render` field accepts a language name (e.g., `bash`) and disables Markdown/file-attach in that field
- `dropdown` - select list; `attributes.label` and `options` required; all options must be distinct; `default` is a zero-based integer index; supports `multiple: true`
- `checkboxes` - multiple checkboxes; `attributes.label` and `options` required; each option has its own `label` (required) and `required` (optional bool)
- `upload` - file upload; `attributes.label` required; supports `accept` validation (comma-separated extensions); size limits: images 10 MB, videos 100 MB, others 25 MB

All non-markdown types share: `type` (required), `id` (optional, alphanumeric/hyphens/underscores, must be unique across the form), `attributes` (required), `validations` (optional). The `required` validation is only enforced on public repositories.

Top-level form keys:

- `labels` - array of existing label names; auto-applied but will not create missing labels
- `assignees` - array of GitHub usernames
- `projects` - format `PROJECT-OWNER/PROJECT-NUMBER`
- `type` - references an organization-level issue type; omit it for this personal-account repo, and only consider it if these standards later move under an organization that actively uses issue types
- milestones are not supported in issue forms

Error behavior:

- forms with invalid YAML will fail to render and GitHub shows a validation error; they do not silently fall back to a blank template
- test all forms in a scratch repository before deploying to the account default

Template design rules:

- use issue forms, but keep the forms simple because GitHub still labels them preview
- require duplicate-search acknowledgement
- collect impact, reproduction details, and expected behavior for bugs
- collect problem statement and alternatives for features
- collect page/path and proposed improvement for docs issues
- include a code-of-conduct acknowledgement checkbox where appropriate
- use numeric prefixes so chooser order is stable
- avoid default assignees and project assignment in account-wide templates unless there is a truly universal triage owner and project
- only use the `type:` field if these standards later move under an organization that is prepared to standardize issue types; otherwise omit it
- keep forms short enough for mobile use and drive-by contributors
- no regex/pattern validation is available for `input` or `textarea` fields; keep validation expectations realistic

`config.yml` rules:

- set `blank_issues_enabled: false`
- use `contact_links` for support, discussions, and security
- keep issue tracker for actionable work rather than general support

Labeling requirement:

- define a small label set up front: `bug`, `enhancement`, `documentation`
- for this personal account, create or sync those labels in target repositories directly, because personal accounts do not have organization default labels
- if these standards later move under an organization, create those labels as organization default labels and still backfill existing repositories separately, because org default labels only apply to newly created repositories

### Pull request template

Purpose:

- make PRs reviewable with consistent context

Recommended default:

- use a single `.github/pull_request_template.md` unless there is a proven need for multiple query-parameter templates

Required sections:

- summary of change
- linked issue or reason no issue exists
- testing performed
- risk / rollback notes
- checklist for docs, security, and release impact

Design rule:

- keep it short enough that contributors fill it out, but structured enough that reviewers can quickly assess risk

### Discussion forms in `.github/DISCUSSION_TEMPLATE/`

Purpose:

- give community conversations a better home than the issue tracker

Directory path:

- files go directly in `.github/DISCUSSION_TEMPLATE/` (no `forms/` subdirectory)
- the YAML filename must match the slug of an existing discussion category exactly (e.g., the "Announcements" category uses `announcements.yml`)

Available YAML keys:

- `body` (required) - array of input fields
- `labels` (optional) - array or comma-delimited string of auto-applied labels
- `title` (optional) - pre-populated default title

Available input types: `markdown`, `textarea` (supports `render` for syntax highlighting), `input`, `dropdown`, `checkboxes`

Default inheritance:

- discussion forms in the account or organization `.github` repo's `.github/DISCUSSION_TEMPLATE/` directory serve as defaults for repositories that lack their own

Recommended forms:

- Q&A form, with filename matching the actual category slug (e.g., `q-a.yml`)
- `ideas.yml`
- `show-and-tell.yml`

Use case:

- Discussions are enabled across all repos, so the infrastructure is in place
- the question is whether structured forms add enough value over GitHub's built-in category prompts to justify the maintenance

Rollout dependencies:

- Discussions must be enabled on a repository before these forms can render
- the filename must match the slug of an existing discussion category exactly; a mismatch will silently fail
- poll categories do not support discussion forms
- category slugs and form filenames are case-sensitive; verify slugs in the GitHub UI before deployment

Recommendation:

- defer discussion forms to Tier 2; Discussions are active but GitHub's built-in category UI may be sufficient without custom forms
- add forms only if contributors are consistently providing incomplete or poorly-routed discussion posts

### Reusable workflows in `.github/workflows/`

Purpose:

- centralize actual automation logic so repositories reuse one secure implementation instead of copying YAML forever

Architectural decision - placement:

- industry practice (GitHub, Microsoft, Google) is to house reusable workflows in a dedicated repo (e.g., `reusable-workflows` or `shared-actions`), not in the `.github` repo
- the `.github` repo's primary purpose is community health defaults; mixing automation logic with policy files creates two unrelated change-risk profiles in one repo
- arguments for a dedicated repo: independent versioning, clearer separation of concerns, easier CODEOWNERS, smaller blast radius per change
- arguments for keeping them in `.github`: fewer repos to manage for a small personal account, simpler discovery, no need to maintain a second repo with its own CI and permissions
- recommendation for a personal account with a small number of repos: start with reusable workflows in this `.github` repo for simplicity; extract to a dedicated repo only if the number of workflows or consumers grows enough that the mixed concerns create real friction
- if extracted later, the `.github` repo retains only community health defaults and repo-local CI

Recommended initial set:

- `reusable-ci.yml` for lightweight general CI
- `reusable-docs.yml` for Markdown or docs validation
- `reusable-terraform.yml` because the local workspace already suggests infrastructure repos are a real consumer

Conditional additions after pilots:

- `reusable-release.yml`
- `reusable-scorecard.yml`
- `reusable-codeql.yml`

Required workflow security rules:

- use `workflow_call` with typed inputs and clearly named secrets
- set top-level `permissions` to the minimum possible, usually `contents: read`
- widen permissions only per job when needed
- pin third-party actions to full-length commit SHAs where feasible
- prefer first-party or verified creator actions when SHA pinning is not yet practical
- use OIDC instead of long-lived cloud credentials where deployments exist
- add concurrency controls to cancel stale runs where appropriate
- keep workflow interfaces stable and documented
- never interpolate untrusted context values (e.g., `github.event.pull_request.title`, `github.event.issue.body`) directly in inline `run:` blocks; use intermediate environment variables or actions that process values as arguments to prevent script injection
- never use `pull_request_target` with `actions/checkout` of the PR head ref; this is a well-known privilege escalation pattern that grants write permissions and secret access to untrusted code
- never store structured data (JSON, XML, YAML) as a single secret; GitHub's log redaction is exact-match only and cannot mask substrings from structured blobs
- self-hosted runners are in active use for most workloads; currently using persistent runners with JIT ephemeral runners as the target model
  - persistent runners carry risk of cross-job state leakage, credential persistence, and toolchain tampering between runs; treat migration to JIT ephemeral runners as a security priority
  - restrict self-hosted runners to private repositories; self-hosted runners should almost never be used for public repositories because any forked PR can execute arbitrary code on the runner
  - until JIT runners are configured, mitigate persistent runner risks by: limiting secrets exposure per workflow, avoiding caching sensitive credentials on disk, and cleaning runner workspaces between jobs where possible
- on a personal account, keep the repository setting that allows GitHub Actions to create or approve pull requests disabled unless a workflow has a clear, reviewed need; if these standards later move under an organization, disable the org-level equivalent by default

Platform constraints for reusable workflows:

- maximum 10 levels total in a call chain (top-level caller plus up to 9 nested reusable workflows); loops are prohibited
- secrets can be passed explicitly via `secrets:` or automatically via `secrets: inherit`; in a chain A->B->C, C only receives secrets if B explicitly passes them onward
- environment secrets cannot be passed because `on.workflow_call` does not support the `environment` keyword
- the caller's `env` context is not propagated; values must be passed as `inputs`
- maximum 25 top-level input properties; maximum payload of 65,535 characters for inputs
- callers can use a matrix strategy to pass different inputs; if a matrix is used, outputs come from the last successful completing run
- `GITHUB_TOKEN` permissions can only be maintained or reduced through the chain, never elevated
- reusable workflows must live directly in `.github/workflows/`; subdirectories are not supported
- private reusable workflows are callable within the same org/enterprise but not cross-org; public or internal repos can be referenced cross-org
- any event type (`workflow_dispatch`, `pull_request`, `push`, `schedule`, etc.) can trigger a caller workflow
- reusable workflows count toward the 500-runs-per-10-seconds queue limit as a single entity
- `services` and `container` jobs can be defined within reusable workflows
- `concurrency` can be set at both the workflow and job level within reusable workflows

Versioning policy:

- consumers pin to exact commit SHAs; this is the strongest supply-chain safety posture
- the `uses:` path for workflows in a repo named `.github` contains a double `.github` - first as the repo name, second as the directory: `uses: NWarila/.github/.github/workflows/reusable-ci.yml@<full-SHA>`; this looks odd but is correct and GitHub handles it properly; no shorthand exists
- document the current recommended SHA in this repo's README or a dedicated version table so consumers know which SHA to pin to
- when a reusable workflow changes, update the documented SHA and notify consumers (or use Dependabot to propose SHA bumps in consumer repos)
- treat interface changes to workflow inputs, secrets, and outputs as breaking changes; document them in commit messages or a changelog
- the tradeoff: SHA pinning is high-friction for consumers to update; Dependabot for GitHub Actions can automate SHA bump PRs, which mitigates this
- avoid deep call graphs; even though GitHub allows nested reuse, one level of reuse is the preferred default until complexity is justified

### Workflow templates in `workflow-templates/`

Purpose:

- make it easy to start the right workflow from the GitHub Actions UI

Scope note:

- this is future-state guidance only if these standards are later applied under an organization
- workflow templates are not a current-scope requirement for this personal-account `.github` repo

Recommended initial set:

- generic CI
- Python CI
- Terraform CI
- docs/site CI

Conditional additions after demonstrated need:

- Node CI
- release pipeline

`.properties.json` schema:

- `name` (required) - display name; must be unique within the repo
- `description` (required) - shown in the Actions UI
- `iconName` (optional) - use Octicon references with the syntax `"octicon <icon-name>"` (e.g., `"octicon shield"`, `"octicon play"`, `"octicon mark-github"`); local SVG files in an `icons/` directory are also supported but Octicons are preferred to avoid maintaining image assets
- `categories` (optional) - array of strings; not a fixed list; accepts general categories (e.g., `continuous-integration`, `deployment`, `testing`, `code-quality`), Linguist language names, and tech stack names; templates matching a repo's detected language/stack are shown more prominently
- `filePatterns` (optional) - array of regular expressions (not globs) matched against files in the repository's root directory; when a file matches, the template is surfaced/prioritized
- `creator` (optional) - author attribution shown in UI
- `labels` (optional) - array; adding `"preview"` hides the template unless `?preview=true` is in the URL, useful for testing before publishing
- `enterprise` (optional) - boolean; gates visibility to enterprise plans

Template variables:

- `$default-branch` - replaced with the repo's actual default branch name at instantiation
- `$protected-branches` - replaced with the repo's protected branch names
- `$cron-daily` - replaced with a valid randomized daily cron expression (avoids thundering herd)

Design rules:

- start from GitHub's official starter workflows and code scanning patterns where possible
- use `$default-branch` (and `$cron-daily` for scheduled workflows to avoid thundering herd)
- attach `.properties.json` metadata for every template
- use `filePatterns` so templates only appear when relevant
- keep templates thin by delegating repeated logic to reusable workflows
- include comments for any required secrets, environment setup, or manual follow-up steps
- use `labels: ["preview"]` in `.properties.json` to test templates before making them visible to all users
- remember that workflow templates require a public `.github` repo and are not available for Enterprise Managed Users
- remember that templates in a public `.github` repo are available to all repository visibility types (public, private, internal)
- there is no documented limit on the number of workflow templates
- if only one repository needs a template, prefer a local workflow in that repo over expanding shared template surface area

### `profile/README.md`

Purpose:

- document future organization-profile scope and clarify what belongs elsewhere today

Plan:

- current personal-account rule: your public profile README belongs in the separate `NWarila/NWarila` repository, not here
- if these standards are later applied under an organization, use `profile/README.md` in that org-owned `.github` repo
- for that future org case, explain what the organization builds and maintains
- point to the most important repositories
- point to contribution and support entry points
- point to security reporting and funding if applicable
- keep it concise and maintained, not a marketing wall of text
- remember that public organization profiles are not available for Enterprise Managed Users
- remember that member-only profile content lives in `.github-private/profile/README.md`, which is adjacent scope but not part of this public repo
- treat pinned repositories as a rollout task in the GitHub UI, because they are not file-backed here

## Repo-Local Hardening Files for This Repository Itself

These files do not propagate as defaults, but this repository should still have them because it is the control plane for account-wide standards.

### `CODEOWNERS`

Purpose:

- protect the files that can impact many repositories at once

Solo-maintainer reality check:

- CODEOWNERS auto-requests reviews, but as a solo maintainer there is no one else to request
- enforcing required code owner approval requires branch protection with required reviews, which a solo maintainer cannot satisfy for their own PRs
- practical value today is near zero; CODEOWNERS becomes valuable only when collaborators are added
- recommendation: defer CODEOWNERS until this repo has more than one active contributor, or until these standards move under an organization with a review team
- if added now for documentation purposes, keep it simple and do not enable the branch protection rule that requires code owner approval

Intended ownership coverage (for when collaborators exist):

- `/.github/workflows/`
- `/*.md` policy files in the repo root

### `.github/dependabot.yml`

Purpose:

- keep GitHub Actions and reusable workflow references up to date in this repo itself
- critical enabler for the SHA-pinning versioning strategy: Dependabot's `github-actions` ecosystem covers both step-level action references and reusable workflow references (`jobs.<id>.uses`), and preserves SHA pinning style when proposing bumps

Plan:

- enable `github-actions` updates with a weekly schedule
- Dependabot PRs will include the version tag associated with each new SHA for auditability
- consumer repos should also have `dependabot.yml` with `github-actions` enabled so they receive SHA bump PRs when this repo's reusable workflows change
- treat automation dependency updates as security maintenance, not optional cleanup

### Repo CI for this repo

This repository should validate itself with:

- workflow linting with `actionlint` (GitHub Action: `rhysd/actionlint`); catches syntax errors, type mismatches, script injection patterns, and validates reusable workflow input/output/secret interfaces at call sites
- YAML schema validation for issue forms and discussion forms using `check-jsonschema` (`python-jsonschema/check-jsonschema`); no dedicated GitHub-published JSON Schema exists for these, so a hand-maintained schema against the documented spec is needed
- Markdown linting with `markdownlint-cli2` (GitHub Action: `DavidAnson/markdownlint-cli2-action`)
- link checking with `lychee` (GitHub Action: `lycheeverse/lychee-action`); faster and more actively maintained than `markdown-link-check`
- Scorecard on the repo itself (relevant checks only: `Dangerous-Workflow`, `Token-Permissions`, `Pinned-Dependencies`, `Security-Policy`, `License`, `Branch-Protection`)
- reusable workflow smoke tests: at least one pilot caller repo that exercises each reusable workflow family before changes are considered complete

Overengineering check: start with `actionlint` and `markdownlint-cli2` only. Add schema validation and link checking when the first false-positive or missed error justifies the added CI complexity. Do not build a five-tool CI pipeline before the repo has content to validate.

## Control-Plane Change Management

This repo should be operated more carefully than a normal content repo.

Recommended change classes:

- low risk: wording-only edits in docs that do not change routing, contacts, or workflow behavior
- medium risk: template changes that affect contributor intake or metadata
- high risk: reusable workflow changes, security contact changes, org-profile changes, or anything that can break downstream CI or block issue creation

Recommended controls:

- when collaborators exist, require CODEOWNERS review for all high-risk areas; until then, use branch protection to enforce PR-based workflow even for solo changes
- require passing repo CI before merge
- tag known-good states after meaningful platform releases
- keep a short rollback playbook in the repo README or a maintainer runbook

## Key Risks and Mitigations

### Broken issue forms can block issue creation

Mitigation:

- validate issue forms in CI
- test them in a scratch repository before rollout

### Breaking reusable workflow changes can fail many downstream pipelines at once

Mitigation:

- consumers pin to commit SHAs, so breaking changes do not propagate automatically
- use pilot callers before broad adoption
- Dependabot in consumer repos proposes SHA bump PRs, giving consumers a review gate before adopting changes

### Org settings can drift away from repo defaults

Mitigation:

- treat rulesets, default labels, Actions policy, and vulnerability reporting settings as part of the same rollout, not a separate afterthought

### Over-specific defaults can frustrate non-code repositories

Mitigation:

- keep inherited defaults generic
- deliver specialization through templates and reusable workflows

### Contact details can rot

Mitigation:

- review support and security contacts as part of the semiannual maintenance pass
- use shared aliases instead of personal inboxes where possible

## Intentional Omissions and Deferrals

These are cases where doing less is the higher-quality choice.

- defer discussion forms until the default category forms demonstrably improve intake quality over GitHub's built-in category UI
- defer Node-specific workflow templates unless a current repo actually needs them
- defer release workflows for repositories that do not publish releases
- avoid multiple PR templates unless contributors truly need different PR entry paths
- avoid org-wide issue types unless the org is prepared to adopt and use them consistently
- avoid deep reusable-workflow chains even though GitHub technically allows them
- avoid custom SVG icons unless Octicons or plain text create a real usability problem

Principle:

- "GitHub supports this" is not enough by itself; the file, template, or workflow should earn its place through actual use, reduced toil, or materially better security

## Future Organization Settings If These Standards Move Under an Organization

This personal-account repo does not use these settings today. Keep this section as future-state guidance if the same standards are later adopted under an organization.

### Required org-level settings

- these settings are conditional if the special `.github` repo remains under a personal `GitHub Pro` account; they become applicable when the same standards are used under an organization
- if organization-wide rulesets are part of the target design, confirm the org is on GitHub Team or Enterprise; otherwise plan for repository-level protections instead
- create organization default labels that match issue templates
- create repository rulesets for protected branches, required PRs, and required status checks; available ruleset rules include:
  - restrict creations, restrict updates, restrict deletions
  - require linear history
  - require deployments to succeed before merging
  - require signed commits
  - require a pull request before merging
  - require status checks to pass (can be pinned to a specific GitHub App source)
  - block force pushes
  - require code scanning results (block merges when a required tool finds alerts at or above a configured severity)
  - restrict file paths, file path length, file extensions, and file size
  - org-level rulesets can target repos by name pattern (glob, e.g., `prod-*`) and by custom repository properties
  - org-level rulesets, file-path/extension/size restrictions, and code scanning rules generally require GitHub Team or Enterprise
- require review for workflow changes through `CODEOWNERS` plus rulesets
- review GitHub Actions organization policy so pinned actions and approved actions are enforced where possible
- set the org-level default `GITHUB_TOKEN` permission to **read-only**; this is the single strongest security lever for Actions and ensures least-privilege unless explicitly widened per-workflow
- disable "Allow GitHub Actions to create and approve pull requests" at the org level unless explicitly required by a workflow
- enable private vulnerability reporting on repositories where it is appropriate
- require 2FA for org members if not already enabled

### Strongly recommended org-level settings

- standard default branch naming
- baseline repository topics or custom properties for repo classification
- if issue forms will use `type:`, define an org-wide issue type taxonomy first
- require linear history, block force pushes, and require pull requests on long-lived branches unless a repo has a clear exception
- if GitHub Advanced Security is available, require code scanning results through rulesets for code-bearing repositories
- decisions on which repositories enable Discussions
- a shared support email or alias for conduct and security escalation

## Implementation Phases

### Phase 0: Decide the non-obvious choices - RESOLVED

All Phase 0 decisions have been made:

- account context: personal `GitHub Pro`
- license: MIT
- code of conduct: GitHub template flow (green checkmark)
- support channel: Discussions-first (enabled on all repos)
- security SLA: acknowledge within 7 business days, validate within 14 days, remediate within 90 days
- funding: `FUNDING.yml` with GitHub Sponsors (active)
- runners: self-hosted persistent runners for most workloads, JIT ephemeral as target
- reusable workflow versioning: commit SHA pinning

Remaining open: org plan tier (if these standards move under an organization later); pilot cohort selection

### Phase 1: Build the baseline documents

Deliver:

- `README.md`
- `LICENSE` (MIT)
- `CODE_OF_CONDUCT.md` (via GitHub template flow)
- `CONTRIBUTING.md`
- `SECURITY.md` (7 business day acknowledgement SLA)
- `SUPPORT.md` (Discussions-first routing)
- `FUNDING.yml` (GitHub Sponsors)

Deferred from Phase 1 (see Tier 2):

- `GOVERNANCE.md` - defer until the contributor base warrants it; `CONTRIBUTING.md` covers decision-making expectations in the interim
- `CODEOWNERS` - defer until this repo has more than one active contributor

Exit criteria:

- every policy file cross-links correctly
- owner, escalation, and support paths are internally consistent
- this repo can stand on its own as an exemplar repository

### Phase 2: Build the intake layer

Deliver:

- issue forms
- `config.yml`
- PR template
- discussion forms

Exit criteria:

- issue chooser routes support and security away from normal issues
- template ordering is intentional
- required labels exist in the pilot repositories, or are provided by org defaults if these standards later move under an organization

### Phase 3: Build the automation layer

Deliver:

- reusable workflows
- workflow templates if these standards later move under an organization
- repo-local CI and Scorecard workflows
- Dependabot config for Actions dependencies

Exit criteria:

- if workflow templates are in scope, they appear in the GitHub UI with correct metadata
- reusable workflows are callable by downstream repositories
- workflow security posture follows GitHub secure-use guidance

### Phase 4: Configure organization settings if this standard is used under an organization

Deliver:

- default labels
- branch/tag rulesets
- Actions policy decisions
- 2FA and vulnerability-reporting settings review

Exit criteria:

- org settings reinforce the repo defaults instead of contradicting them

### Phase 5: Pilot rollout

Pilot against a small representative set of repositories first, such as:

- `resume`
- `NWarila`
- `github-terraform-runner`

Pilot checks:

- verify the defaults surface correctly on repositories with no overrides
- verify repositories with local overrides behave as expected
- verify discussions, issues, PRs, and security reporting all route correctly
- verify at least one repository can consume each reusable workflow class

Rollback procedure:

- since changes to this repo affect all org repos that lack local overrides, a broken default (e.g., a malformed issue form) can disrupt multiple repos simultaneously
- maintain a known-good tagged commit or branch that can be force-restored if a deployment causes widespread issues
- for issue templates specifically, a broken form will prevent issue creation across all repos without local templates; test form validity before merging
- reusable workflow changes do not break downstream CI immediately because consumers pin to commit SHAs; however, consumers must update their pinned SHAs to receive fixes, so communicate changes clearly

### Phase 6: Continuous maintenance

Cadence for a solo maintainer with a small repo set (scale up if the account grows):

- let Dependabot handle Actions dependency updates on its own schedule rather than committing to a separate monthly manual review; review and merge Dependabot PRs promptly when they arrive
- semiannual review of policy files, contact information, and workflow security posture (combine into one pass rather than splitting into quarterly/semiannual/annual)
- post-incident review updates after any real security or conduct event

Overengineering note: a four-tier review cadence (monthly, quarterly, semiannual, annual) is appropriate for a team-maintained org. For a single maintainer with 3-10 repos, it creates calendar noise that leads to skipped reviews. One meaningful semiannual review plus Dependabot automation is more realistic and more likely to actually happen.

### Phase gates

- do not move from Phase 1 to broader automation work until the baseline documents are internally consistent and reviewed
- do not expand workflow templates or reusable workflows without at least one pilot consumer per addition
- do not add discussion forms without evidence that they improve intake quality over the built-in category UI
- do not treat Phase 3 and later as mandatory completion if Tier 1 and Tier 2 already solve the actual problems you are trying to reduce

## Validation and Pilot Test Matrix

### Default documents

- create a scratch public repo with no local community health files and verify that `CODE_OF_CONDUCT`, `CONTRIBUTING`, `SECURITY`, `SUPPORT`, and `FUNDING.yml` surface from this repo
- verify the Sponsor button appears on repos that inherit `FUNDING.yml`
- add local overrides one at a time and verify the local file wins

### Issue and PR intake

- open the issue chooser in a scratch repo and verify template order, contact links, labels, and `blank_issues_enabled: false`
- open a draft PR and verify the default PR template body renders as intended

### Discussions

- Discussions are already enabled; verify that the intended discussion category slugs exist in pilot repos and match any form filenames exactly
- verify that poll categories remain unaffected by discussion forms

### Workflow templates

- future organization-only validation:
- open the Actions "New workflow" screen in representative pilot repos and verify that `filePatterns` show the right templates
- confirm template icons, descriptions, and setup comments are understandable without outside context

### Reusable workflows

- call each reusable workflow from at least one pilot repo before broad rollout using the double `.github` path: `NWarila/.github/.github/workflows/<name>@<SHA>`
- verify permissions, secrets, runner assumptions (self-hosted persistent runners), and concurrency behavior
- verify that Dependabot in the pilot repo detects the SHA-pinned reusable workflow reference and proposes updates when the workflow changes
- test at least one public-repo caller and one private-repo caller if both are in scope

### Organization profile

- future organization-only validation:
- verify that the public profile README renders correctly on the org Overview page
- if member-only profile content is desired, verify the separate `.github-private` flow as adjacent work

## Success Metrics

The plan is working when:

- 100 percent of pilot repositories without local overrides surface the intended default community health files
- 100 percent of pilot repositories can create issues and pull requests with the intended templates without manual repair
- the special `.github` repo itself maintains a strong relevant Scorecard posture, especially for `Dangerous-Workflow`, `Token-Permissions`, `Pinned-Dependencies`, `Security-Policy`, and `Branch-Protection`
- median maintainer first response time for issues and pull requests stays within the published support target
- security reports are acknowledged and validated within the published SLA
- active code and infrastructure repos progressively migrate to central reusable workflows rather than copy-pasting YAML by hand
- changes in this repo can be rolled out and, if necessary, rolled back predictably

## Definition of Done

The repo is "best possible" when all of the following are true:

- the special `.github` repo is public and fully documented
- the repository itself has a license, README, CI, and secure workflow maintenance (plus CODEOWNERS when collaborators exist)
- GitHub's supported default community health files exist and are internally consistent
- issue templates, PR templates, and discussion forms reflect the intended support model
- reusable workflows hold the real logic, and workflow templates are discoverable where they are actually in scope
- actions use least privilege and follow GitHub secure-use guidance
- repository settings are aligned with the defaults, and future org settings are documented where applicable
- a pilot rollout confirms actual GitHub behavior, not just file correctness
- the repo meets a strong OpenSSF Scorecard baseline on the checks relevant to this repository
- the repo does not carry optional files, templates, or workflows that lack a current owner, consumer, or measurable reason to exist

## Resolved Decisions

- **Account context**: personal `GitHub Pro`
- **License**: MIT
- **Code of conduct**: use GitHub's built-in template flow to get the community profile green checkmark
- **Discussions**: enabled on all repos; Discussions is the primary support entry point for questions
- **Issue templates**: keep three templates (bug report, feature request, documentation)
- **Security acknowledgement SLA**: 7 business days for initial acknowledgement; validation and remediation targets follow CISA guidance (validation within 14 days, remediation target within 90 days when reasonable)
- **Funding**: `FUNDING.yml` is in scope; GitHub Sponsors is active at `https://github.com/sponsors/NWarila`; config uses `github: NWarila`
- **Self-hosted runners**: used for all workloads that allow it; currently persistent runners, with JIT ephemeral runners as the target isolation model once configured
- **Reusable workflow versioning**: commit SHA pinning; consumers pin to exact commit SHAs for maximum stability and supply-chain safety

## Recommended Pilot Cohort

- `resume` for a public, content-heavy repository where inherited community-health defaults should be easy to validate
- `NWarila` for a highly visible personal-facing repository where support and funding defaults matter
- `github-terraform-runner` for reusable-workflow, security, and self-hosted-runner validation

## Future-State Decisions If Scope Expands

- If these standards are later adopted under an organization, confirm the org plan and feature set before reusing the organization-only guidance in this document: Free, Team, or Enterprise Cloud; GitHub Advanced Security; Enterprise Managed Users
