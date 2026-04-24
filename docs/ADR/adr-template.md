<!--
  This is the canonical ADR template for repositories under the
  `nwarila-platform` and `NWarila` organisations.

  How to use:
    1. Copy this file to a per-repo `docs/ADR/NNNN-short-kebab-title.md`
       where NNNN is the next unused 4-digit number in that repo.
    2. Fill in every section below. Sections whose content genuinely
       does not apply should be kept and filled with "None." so the
       reader can tell "not applicable" from "forgotten."
    3. Open a pull request with the new ADR file.
    4. On merge, update the Status table entry and the linked PR field.

  When to write an ADR:
    - You are making a decision that has one or more rejected
      alternatives with meaningful trade-offs.
    - The decision is architectural in scope — it shapes how future
      work in this repo is done, not just this week's task.
    - A reader six months from now would reasonably ask "why did we
      choose X over Y?" and the answer is not obvious from the code.

  When NOT to write an ADR:
    - You're writing a runbook (procedure, not decision).
    - You're recording a style preference with no real alternatives.
    - You're documenting an obvious or forced choice (e.g., "we use
      the vendor's required SDK").
    - You're tracking a short-lived task; use an issue or PR
      description instead.

  Delete this entire HTML comment block before committing the ADR.
-->

# ADR-NNNN: <Short descriptive title>

| Field | Value |
| --- | --- |
| Status | Proposed \| Accepted \| Rejected \| Superseded by ADR-XXXX |
| Date | YYYY-MM-DD |
| Authors | <name or GitHub handle, comma-separated> |
| Decision-maker | <single named human with authority to accept or reject this ADR> |
| Reversibility | Cheap \| Medium \| Breaking |
| Review-by | YYYY-MM-DD (Proposed ADRs only; revisit if not Accepted by this date) |

## Context

<!--
  What situation forced this decision? Two or three short paragraphs.
  Include:
    - the problem being solved
    - any constraints that narrow the solution space (regulatory,
      vendor-imposed, upstream behaviour, prior ADRs still in force)
    - links to the RFC, issue, incident post-mortem, or discussion
      thread that surfaced the problem (if any)
  Do not describe the decision here. Only the setting.
-->

## Decision

<!--
  One or two paragraphs stating exactly what we will do. Be concrete
  enough that a reader can check whether the code matches the decision.
  If the decision has parameters (thresholds, timeouts, file paths),
  state them here with explicit values.
-->

## Rejected Alternatives

<!--
  List every serious alternative that was considered, with a one-line
  reason it was rejected. "Serious" means it had advocates or plausible
  upside — not straw-men.

  If there were no serious alternatives (rare), state "None — this was a
  forced choice because <reason>" and consider whether the decision is
  actually ADR-worthy at all.
-->

1. **<Alternative A>** — rejected because <reason>.
2. **<Alternative B>** — rejected because <reason>.

## Consequences

### Positive

<!-- What new capabilities or safety properties does this give us? -->

### Negative

<!-- What costs, friction, or new failure modes does this introduce? Be honest. -->

### Neutral

<!--
  Side effects that are neither good nor bad but worth recording — e.g.,
  "we now depend on <vendor>'s stability" or "future ADRs in this area
  must reference this one."
-->

## Supersedes

<!--
  Link to any prior ADR(s) this one replaces. Use "None" if this is a
  new decision. When an ADR is superseded, the old ADR's Status row is
  updated to "Superseded by ADR-NNNN" and a link added in its
  "Superseded by" section.
-->

None.

## Superseded by

<!--
  Populated only when a later ADR overrides this one. At creation time
  this section reads "None (current)."
-->

None (current).

## Implementing PRs

<!--
  List the pull request(s) that implemented this decision. Populated
  post-merge. For Proposed ADRs this may read "Pending."
-->

- <Pending | link to PR>

## Related RFC

<!--
  If this ADR was preceded by an RFC / proposal document, link it here
  so future readers can find the motivational context. Otherwise "None."
-->

None.

## Compliance Notes

<!--
  How does this decision interact with governing principles — security
  baseline, plan documents, prior ADRs whose scope this touches, any
  regulatory posture? One short paragraph. If no interaction, "None."
-->

None.
