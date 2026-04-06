# .github

Default GitHub metadata for repositories owned by
[NWarila](https://github.com/NWarila).

## Purpose

This is the special account-level `.github` repository for the personal
`NWarila` account. It exists to hold durable defaults that GitHub can reuse
across repositories when a repository does not define its own local version.

## Inherited Defaults

GitHub can reuse the following files from this repository:

| File | Purpose |
|------|---------|
| `CODE_OF_CONDUCT.md` | Default community standards |
| `CONTRIBUTING.md` | Default contribution guidance |
| `SECURITY.md` | Default vulnerability reporting instructions |
| `SUPPORT.md` | Default support routing |
| `.github/FUNDING.yml` | Default sponsorship configuration |
| `.github/ISSUE_TEMPLATE/` | Default issue forms and issue chooser config |
| `.github/pull_request_template.md` | Default pull request template |

## Repo-Local Only

The following files in this repository are important here, but are not
inherited by other repositories:

| File | Why it stays local |
|------|--------------------|
| `README.md` | Documents the operating model of this special repo |
| `LICENSE` | Each repository needs its own license file |
| `.github/dependabot.yml` | Dependabot must be configured per repository |
| `.github/workflows/` | These workflows validate this repo itself |

## Override Rules

If a repository has its own version of an inherited file, the local file wins.
GitHub does not merge local and default content.

For issue templates specifically: if a repository has anything in its own
`.github/ISSUE_TEMPLATE/` directory, GitHub ignores the entire default issue
template directory from this repo for that repository.

## Change Discipline

Changes here can affect every repository under this account that does not have
local overrides. Before merging:

1. Verify policy files and templates still point to the right routes.
2. Test issue form changes in GitHub before broad rollout.
3. Ensure repo CI passes.

## Documentation Rule

Keep durable operating guidance in this `README.md`.

Do not keep temporary planning artifacts in this repository. If a future change
creates a real long-lived architectural decision, capture the rationale in
`docs/adr/` at that time instead of maintaining a standing plan document.

## License

[MIT](LICENSE)
