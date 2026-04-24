<!--
  This is a worked example showing how to fill in adr-template.md.
  It records a plausible decision that is already reflected in org
  tooling (see scripts/check_action_pins.py in consuming repos),
  framed as if we were writing the ADR at the moment of adoption.

  Real ADRs live in per-repo `docs/ADR/NNNN-short-title.md`, not here.
  This file is documentation of the template in action; nothing in this
  repo enforces its contents.
-->

# ADR-0007: Third-party GitHub Actions are pinned by commit SHA

| Field | Value |
| --- | --- |
| Status | Accepted |
| Date | 2025-04-12 |
| Authors | Nick Warila |
| Decision-maker | Nick Warila (sole org maintainer) |
| Reversibility | Cheap |
| Review-by | N/A (Accepted) |

## Context

GitHub Actions workflows consume third-party actions via the `uses:` key.
Actions can be referenced in four ways:

- by branch (`uses: actions/checkout@main`)
- by tag (`uses: actions/checkout@v4`)
- by major-version alias (`uses: actions/checkout@v4.2`)
- by 40-character commit SHA (`uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683`)

Tags and branch references are **mutable at the source**. A compromised
publisher account, or a rogue maintainer of a popular action, can
retroactively change what `@v4` resolves to. This was not a theoretical
risk: in March 2025 the `tj-actions/changed-files` action was
compromised and every consumer pinned by tag began running attacker
code on their next workflow run. Consumers pinned by SHA were unaffected
because a SHA cryptographically identifies specific bytes.

The org runs automated workflows across multiple repositories. Several
of those workflows have `contents: write` scope and access to secrets
gated via environment rules. A mutable action reference inside any such
workflow is a direct exfiltration path for those credentials.

The org already has Renovate and Dependabot bumping dependency versions
on schedule. There is no reason the same cadence cannot apply to
SHA-pinned actions.

## Decision

Every `uses:` entry in every workflow file under any repo in the
`nwarila-platform` or `NWarila` organisations MUST reference a
third-party action by full 40-character lowercase hexadecimal commit
SHA. The SHA MAY be followed by a comment naming the tag for human
readability:

```yaml
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
```

Org-published actions (under `nwarila-platform/*` or `NWarila/*`) MAY
use tag references because the org controls the source repositories
and the supply chain.

Enforcement is delegated to a CI script (`scripts/check_action_pins.py`
or equivalent) that fails any PR introducing a tag- or branch-pinned
third-party action. The script is a required status check on every
default branch.

## Rejected Alternatives

1. **Pin by tag (e.g., `@v4.2.2`).** Rejected because tags are mutable
   at the source; a compromised publisher can silently replace what
   `@v4.2.2` resolves to. Tag immutability is a publisher-side policy,
   not a GitHub-enforced guarantee.
2. **Pin by major-version alias (e.g., `@v4`).** Rejected for the same
   reason as tag pinning, plus the additional failure mode that
   `@v4` drift across minor versions can introduce behavioural changes
   with no review.
3. **No pinning policy; accept vendor defaults.** Rejected because the
   default behaviour of most third-party actions is tag-pinning, which
   places the org's supply-chain integrity entirely in the hands of
   action publishers. This is the posture the `tj-actions/changed-files`
   incident exploited.
4. **Mirror critical actions into org-owned forks and pin to the fork.**
   Rejected as disproportionate: it multiplies maintenance surface for
   every fork, and SHA pinning provides the same integrity guarantee
   without the fork overhead. Reconsider if a specific action becomes
   frequently compromised or if we need to patch actions out-of-band.

## Consequences

### Positive

- Supply-chain integrity for automated workflows: a compromised action
  publisher cannot retroactively alter what our workflows execute.
- Reproducible workflow runs: the same commit SHA always resolves to
  the same bytes.
- Audit trail: the SHA is a direct pointer to inspectable source.
- Aligns with SLSA build-integrity posture adopted elsewhere in the org.

### Negative

- Renovate PRs become more frequent and noisier; every SHA rotation
  generates a PR even for patch-level action releases.
- Copy-paste from external documentation becomes slightly harder:
  docs usually show tag-pinned examples, and a contributor must resolve
  the tag to a SHA before adding it to a workflow.
- CI enforcement script must be maintained. A false positive or a bug
  in the pin-check script becomes a blocker for every PR until fixed.

### Neutral

- Every workflow file gains a trailing comment documenting the tag the
  SHA corresponds to. This is a new convention contributors must learn.
- Renovate configuration must be tuned to bump action SHAs, not only
  language-level dependencies.

## Supersedes

None.

## Superseded by

None (current).

## Implementing PRs

- `nwarila-platform/github-terraform-framework#<N>` — CI script and
  required-status-check wiring.
- `nwarila-platform/herowars-engine-assets#<N>` — first consumer
  applying the policy to its own workflows.

## Related RFC

None — the decision surface was narrow enough to skip the RFC step.

## Compliance Notes

This ADR implements the least-privilege and supply-chain-integrity
principles that appear in every repo-level security baseline. It is a
prerequisite for any claim of SLSA Build L2 or higher, because L2's
"authenticated provenance" requirement is undermined if the workflow
itself can be mutated via a tag-pin swap. Future ADRs that relax this
policy (e.g., carve-outs for specific actions) must supersede this one
rather than quietly exempting entries in the check script.
