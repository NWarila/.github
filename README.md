# .github

Default community health files, issue/PR templates, and shared GitHub metadata for repositories owned by [NWarila](https://github.com/NWarila).

## What this repo does

This is a [special `.github` repository](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file). Files here are inherited by other repositories under this account that don't have their own versions.

### Inherited defaults

| File | Purpose |
|------|---------|
| `CODE_OF_CONDUCT.md` | Default community standards for repos without their own |
| `CONTRIBUTING.md` | Contribution guidelines for all repos |
| `SECURITY.md` | Vulnerability reporting instructions |
| `SUPPORT.md` | Where to get help |
| `FUNDING.yml` | GitHub Sponsors link |
| `.github/ISSUE_TEMPLATE/` | Bug report, feature request, and documentation issue forms |
| `.github/pull_request_template.md` | Default PR template |

### Not inherited (requires manual action)

| File | Why |
|------|-----|
| `LICENSE` | GitHub does not support default licenses; each repo needs its own |
| `README.md` | Each repo needs its own |
| `CODEOWNERS` | Not supported as a default |
| `.github/dependabot.yml` | Not supported as a default |

## How overrides work

If a repository has its own version of any file listed above, the local file takes precedence. GitHub does not merge defaults with local files.

For issue templates specifically: if a repository has **anything** in its own `.github/ISSUE_TEMPLATE/` directory, GitHub ignores the entire default template folder from this repo for that repository.

## Reusable workflows

Once available (Tier 2), reusable workflows in this repo are called using the double `.github` path:

```yaml
jobs:
  ci:
    uses: NWarila/.github/.github/workflows/reusable-ci.yml@<full-commit-SHA>
```

Consumer repos should pin to commit SHAs and use Dependabot (`github-actions` ecosystem) to receive update PRs.

## Making changes here

Changes in this repo can affect every repository under this account that doesn't have local overrides. Before merging:

1. Check that policy files cross-link correctly
2. Test issue forms in a scratch repo if modified
3. Verify CI passes

## Pending setup

- [ ] Verify the community profile recognizes `CODE_OF_CONDUCT.md`; if GitHub does not mark it complete, re-add it through the [GitHub UI template flow](https://github.com/NWarila/.github/community) to get the green checkmark

## License

[MIT](LICENSE)
