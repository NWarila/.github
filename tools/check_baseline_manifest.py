"""Validate the org baseline manifest consumed by drift-gate."""

from __future__ import annotations

import json
from pathlib import Path, PurePosixPath
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "baseline-manifest.json"
ADR_ROOT = ROOT / "docs" / "decision-records"


def fail(message: str) -> None:
    raise SystemExit(f"baseline-manifest check failed: {message}")


def manifest_path(field: str, value: Any) -> str:
    if not isinstance(value, str) or not value:
        fail(f"{field} must be a non-empty string")
    path = PurePosixPath(value)
    if path.is_absolute() or ".." in path.parts:
        fail(f"{field} must be repo-rooted and must not contain '..': {value!r}")
    return value


def main() -> None:
    try:
        raw = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"{MANIFEST.name} is not valid JSON: {exc}")

    if not isinstance(raw, dict) or set(raw) != {"version", "files"}:
        fail("root must contain exactly 'version' and 'files'")
    if raw["version"] != "1":
        fail(f"unsupported manifest version: {raw['version']!r}")
    files = raw["files"]
    if not isinstance(files, list) or not files:
        fail("'files' must be a non-empty list")

    sources: list[str] = []
    targets: set[str] = set()
    for idx, item in enumerate(files):
        if not isinstance(item, dict) or set(item) != {"source", "target"}:
            fail(f"files[{idx}] must contain exactly 'source' and 'target'")
        source = manifest_path(f"files[{idx}].source", item["source"])
        target = manifest_path(f"files[{idx}].target", item["target"])
        if target in targets:
            fail(f"duplicate target path: {target!r}")
        sources.append(source)
        targets.add(target)

    missing = [source for source in sources if not (ROOT / source).is_file()]
    if missing:
        fail(f"sources missing: {missing}")

    org_adrs = sorted(path.relative_to(ROOT).as_posix() for path in ADR_ROOT.glob("000*.md"))
    unlisted_adrs = [path for path in org_adrs if path not in sources]
    if unlisted_adrs:
        fail(f"org ADRs missing from baseline manifest: {unlisted_adrs}")

    expected_targets = {
        f"docs/decision-records/org/{Path(source).name}"
        for source in org_adrs
    }
    missing_targets = sorted(expected_targets - targets)
    if missing_targets:
        fail(f"org ADR mirror targets missing from baseline manifest: {missing_targets}")

    print(f"baseline manifest check passed: {len(files)} files")


if __name__ == "__main__":
    main()
