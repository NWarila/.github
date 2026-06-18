# ADR-0010: Adopt a Shared UBI9 Platform Renovate Preset

| Field            | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| ID               | ADR-0010                                                               |
| Scope            | Org baseline                                                           |
| Status           | Accepted                                                               |
| Decision-subject | Shared UBI9 platform Renovate preset and cascade concurrency limits.   |
| Date accepted    | 2026-06-18                                                             |
| Date             | 2026-06-18                                                             |
| Last reviewed    | 2026-06-18                                                             |
| Authors          | Nick Warila (@NWarila)                                                 |
| Decision-makers  | Nick Warila (sole portfolio maintainer)                                |
| Consulted        | UBI9 platform architecture docs and Renovate preset documentation.      |
| Informed         | Maintainers of adopting repositories across the platform organizations. |
| Reversibility    | Medium                                                                 |
| Review-by        | 2026-12-18                                                             |

## TL;DR

`NWarila/.github` publishes `default.json` as the shared UBI9 platform Renovate preset. Consumers can extend it with `github>NWarila/.github`. The preset is intentionally narrower than the historical type-template Renovate baselines: it governs only UBI9 platform cascade concerns that must stay identical across repositories and organizations.

The preset caps Renovate at 4 concurrent PRs, 2 PR creations per hour, and 6 concurrent branches. These values keep nightly base or gate rebuild fan-out bounded for a solo homelab while still allowing Renovate to prepare a small queue of branches ahead of review capacity.

## Context and Problem Statement

ADR-0004 rejected a general org-level Renovate baseline because the portfolio had stack-specific repository templates with different dependency surfaces. The UBI9 platform adds a different class of dependency: base image digests, gate image digests, SLSA generator signer identities, gate-iac fleet tool versions, and Go-FIPS builder boundaries must behave the same everywhere.

Keeping those rules in separate type-template baselines would reintroduce drift at the exact layer that verifies image provenance and digest currency. A base image digest bump, a gate image digest bump, or a SLSA generator signer ref update must not depend on which language or infrastructure template a repository originally used.

## Decision Drivers

1. **Verification-layer coherence.** The SLSA generator reusable workflow SHA and the verification `--certificate-identity` tag must ride together.
2. **Digest cascade uniformity.** UBI9 base and gate images are consumed by digest across repositories and organizations.
3. **Terraform exception clarity.** gate-iac accepts tflint, terraform-docs, and OPA/conftest in lockstep while Terraform itself remains tag-per-pin.
4. **Go-FIPS safety.** Go 1.26 crosses the current GOFIPS140 boundary; Go builder bumps require a dedicated review against a current CMVP-validated module.
5. **Homelab capacity.** A nightly or CVE-driven base rebuild must not create an unbounded PR storm.

## Considered Options

1. **Keep ADR-0004 unchanged and copy rules into every type-template.**
2. **Publish one broad org Renovate baseline that replaces template baselines.**
3. **Publish one narrow UBI9 platform preset and keep type-template baselines for stack-local concerns.**

## Decision Outcome

Chosen option: **Option 3, publish one narrow UBI9 platform preset.**

The preset is `default.json` at the repository root so consumers can use Renovate's default GitHub preset syntax: `github>NWarila/.github`.

The preset owns these cross-platform rules:

- `ghcr.io/nwarila-platform/base-{micro,python,node,java}(-dev)@sha256` digest cascade.
- `ghcr.io/nwarila-platform/gate-*@sha256` digest cascade.
- SLSA generator action SHA and signer-identity tag grouped in one update.
- gate-iac tflint, terraform-docs, and OPA/conftest grouped in one fleet version set.
- gate-iac Terraform image tags preserved per pin.
- Go-FIPS builder surfaces disabled for automation and clamped below Go 1.26.
- Renovate PR, hourly PR creation, and branch concurrency capped.

ADR-0004 remains valid for non-UBI9 stack-local baselines. This decision narrows and supersedes ADR-0004 only where a UBI9 platform repository needs the shared cascade preset.

## Cap Rationale

| Cap | Value | Rationale |
| --- | ----- | --------- |
| `prConcurrentLimit` | 4 | Allows the base, gate, signer, and one ordinary dependency lane to be visible without exceeding solo review capacity. |
| `prHourlyLimit` | 2 | Prevents burst creation when a nightly base or gate rebuild fans out across many consumers. |
| `branchConcurrentLimit` | 6 | Lets Renovate prepare a small backlog while keeping runner and cache pressure bounded. |

These caps deliberately leave the cluster-side resource-quota control as a separate runtime guard. Renovate limits review and branch pressure; runner quotas limit execution pressure.

## Confirmation

Adherence is confirmed by:

1. `default.json` validates with the pinned local Renovate validator version recorded in the implementing PR evidence.
2. A deliberately invalid copy fails validation with a non-zero exit.
3. The committed fixture checker demonstrates extraction and grouping for the base digest, gate digest, SLSA signer identity, gate-iac fleet, Terraform tag-per-pin, Go-FIPS exclusion, and ordinary control dependency paths.

## Consequences

### Positive

- One shared preset controls the UBI9 supply-chain cascade across organizations.
- The signer identity cannot silently lag the generator action pin.
- The Go-FIPS builder boundary is fail-closed by default.
- Renovate fan-out is bounded before the runner layer sees work.

### Negative

- UBI9 consumers now have one more inherited Renovate source to reason about.
- A bad preset change can affect multiple stacks, so changes to `default.json` need focused review.

### Neutral

- Live cross-organization resolution still depends on the Renovate App being installed and is verified separately after merge.
- The preset encodes rules and grouping only; it does not pin produced image digests itself.

## Related ADRs

- [ADR-0004](0004-use-renovate-for-dependency-updates.md) - records the earlier per-template Renovate baseline model that remains valid for non-UBI9 stack-local concerns.
- [ADR-0005](0005-pin-terraform-and-provider-versions-exactly.md) - records the Terraform exact-version policy preserved by the gate-iac tag-per-pin rule.
