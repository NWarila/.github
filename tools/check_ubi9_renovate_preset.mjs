import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const presetPath = path.join(repoRoot, "default.json");
const fixtureDir = path.join(repoRoot, "tools", "fixtures", "ubi9-renovate");
const preset = JSON.parse(fs.readFileSync(presetPath, "utf8"));

const files = {
  dockerfile: fs.readFileSync(path.join(fixtureDir, "Dockerfile"), "utf8"),
  workflow: fs.readFileSync(path.join(fixtureDir, "workflow.yml"), "utf8"),
  toolPins: fs.readFileSync(path.join(fixtureDir, "gate-iac.env"), "utf8")
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function regexFromRenovate(pattern) {
  const lastSlash = pattern.lastIndexOf("/");
  const body = pattern.slice(1, lastSlash);
  const flags = pattern.slice(lastSlash + 1).replace("g", "");
  return new RegExp(body, `${flags}g`);
}

function fileMatches(manager, fileName) {
  return manager.managerFilePatterns.some((pattern) => {
    const re = regexFromRenovate(pattern);
    return re.test(fileName);
  });
}

function renderTemplate(template, groups) {
  if (!template) return undefined;
  return template
    .replaceAll("{{{depName}}}", groups.depName ?? "")
    .replaceAll("{{depName}}", groups.depName ?? "");
}

function extractCustomDeps() {
  const candidates = [
    ["fixture/.github/workflows/workflow.yml", files.workflow],
    ["fixture/Dockerfile", files.dockerfile],
    ["fixture/tools/gate-iac.env", files.toolPins]
  ];

  const deps = [];
  for (const manager of preset.customManagers) {
    for (const [fileName, content] of candidates) {
      if (!fileMatches(manager, fileName)) continue;
      for (const matchString of manager.matchStrings) {
        const re = new RegExp(matchString, "g");
        for (const match of content.matchAll(re)) {
          const groups = match.groups ?? {};
          deps.push({
            source: "custom.regex",
            fileName,
            description: manager.description,
            datasource: groups.datasource ?? manager.datasourceTemplate,
            depName: groups.depName ?? manager.depNameTemplate,
            packageName: groups.packageName ?? renderTemplate(manager.packageNameTemplate, groups) ?? groups.depName ?? manager.depNameTemplate,
            currentValue: groups.currentValue ?? manager.currentValueTemplate,
            currentDigest: groups.currentDigest,
            replaceString: groups.replaceString ?? match[0]
          });
        }
      }
    }
  }
  return deps;
}

function extractNativeDockerfileDeps() {
  const deps = [];
  const fromRe = /^\s*FROM\s+(?<image>\S+)/gm;
  for (const match of files.dockerfile.matchAll(fromRe)) {
    const image = match.groups.image;
    const digestSplit = image.split("@");
    const nameAndTag = digestSplit[0];
    const currentDigest = digestSplit[1];
    const lastSlash = nameAndTag.lastIndexOf("/");
    const tagIndex = nameAndTag.indexOf(":", lastSlash + 1);
    const depName = tagIndex === -1 ? nameAndTag : nameAndTag.slice(0, tagIndex);
    const currentValue = tagIndex === -1 ? null : nameAndTag.slice(tagIndex + 1);
    deps.push({
      source: "dockerfile",
      fileName: "fixture/Dockerfile",
      datasource: "docker",
      depName,
      packageName: depName,
      currentValue,
      currentDigest
    });
  }
  return deps;
}

function extractNativeActionsDeps() {
  const deps = [];
  const usesRe = /^\s+-?\s*uses:\s*(?<uses>\S+)(?:\s+#\s*(?<tag>v?\d+\.\d+\.\d+))?/gm;
  for (const match of files.workflow.matchAll(usesRe)) {
    const uses = match.groups.uses.replace(/^["']|["']$/g, "");
    const [action, ref] = uses.split("@");
    if (!action || !ref) continue;
    const packageName = action.split("/").slice(0, 2).join("/");
    const isSha = /^[a-f0-9]{40}$/.test(ref);
    deps.push({
      source: "github-actions",
      fileName: "fixture/.github/workflows/workflow.yml",
      datasource: "github-tags",
      depName: packageName,
      packageName,
      currentValue: isSha ? match.groups.tag : ref,
      currentDigest: isSha ? ref : undefined
    });
  }

  const goVersionRe = /uses:\s+actions\/setup-go@[^\n]+\n(?:\s+[^\n]+\n)*?\s+go-version:\s+["']?(?<version>\d+\.\d+(?:\.\d+)?)/m;
  const goVersion = goVersionRe.exec(files.workflow)?.groups?.version;
  if (goVersion) {
    deps.push({
      source: "github-actions",
      fileName: "fixture/.github/workflows/workflow.yml",
      datasource: "github-releases",
      depName: "go",
      packageName: "actions/go-versions",
      currentValue: goVersion
    });
  }
  return deps;
}

function patternMatches(pattern, value) {
  if (!value) return false;
  if (pattern.startsWith("/") && pattern.endsWith("/")) {
    return new RegExp(pattern.slice(1, -1)).test(value);
  }
  return pattern === value;
}

function ruleMatches(rule, dep) {
  if (rule.matchDatasources && !rule.matchDatasources.includes(dep.datasource)) return false;
  if (rule.matchManagers && !rule.matchManagers.includes(dep.source)) return false;
  if (rule.matchPackageNames && !rule.matchPackageNames.some((pattern) => patternMatches(pattern, dep.packageName))) return false;
  return true;
}

function classify(dep) {
  const matchedRules = preset.packageRules.filter((rule) => ruleMatches(rule, dep));
  return {
    ...dep,
    groupName: matchedRules.find((rule) => rule.groupName)?.groupName ?? null,
    enabled: matchedRules.reduce((enabled, rule) => rule.enabled === false ? false : enabled, true),
    allowedVersions: matchedRules.find((rule) => rule.allowedVersions)?.allowedVersions ?? null
  };
}

const deps = [
  ...extractNativeDockerfileDeps(),
  ...extractNativeActionsDeps(),
  ...extractCustomDeps()
].map(classify);

const byPackage = (name) => deps.filter((dep) => dep.packageName === name || dep.depName === name);
const has = (predicate, message) => assert(deps.some(predicate), message);

has((dep) => dep.source === "dockerfile" && dep.depName === "ghcr.io/nwarila-platform/base-micro" && dep.currentDigest?.startsWith("sha256:"), "native Dockerfile base digest was not extracted");
has((dep) => dep.source === "custom.regex" && dep.depName === "ghcr.io/nwarila-platform/base-node" && dep.currentValue === "latest" && dep.groupName === "ubi9 base image digest cascade", "base run digest did not extract/group");
has((dep) => dep.source === "custom.regex" && dep.depName === "ghcr.io/nwarila-platform/gate-python" && dep.currentValue === "latest" && dep.groupName === "ubi9 gate image digest cascade", "gate image digest did not extract/group");

const slsa = byPackage("slsa-framework/slsa-github-generator");
assert(slsa.length >= 2, "SLSA action and signer identity were not both extracted");
assert(new Set(slsa.map((dep) => dep.groupName)).size === 1 && slsa[0].groupName === "slsa generator signer identity lockstep", "SLSA action and signer identity are not one group");

for (const packageName of ["terraform-linters/tflint", "terraform-docs/terraform-docs", "open-policy-agent/opa"]) {
  const dep = byPackage(packageName)[0];
  assert(dep, `${packageName} was not extracted`);
  assert(dep.groupName === "gate-iac fleet toolchain", `${packageName} was not in the fleet group`);
}

const terraformTags = byPackage("ghcr.io/nwarila-platform/gate-iac").map((dep) => dep.currentValue).sort();
assert(terraformTags.join(",") === "1.15.1,1.15.6", `Terraform gate-iac tags were not preserved: ${terraformTags.join(",")}`);

for (const packageName of ["golang/go", "actions/setup-go", "actions/go-versions", "golang"]) {
  const matches = byPackage(packageName);
  assert(matches.length > 0, `${packageName} control was not extracted`);
  assert(matches.every((dep) => dep.enabled === false), `${packageName} is not disabled`);
}
assert(byPackage("golang/go").some((dep) => dep.allowedVersions === "<1.26"), "golang/go clamp <1.26 is missing");
assert(byPackage("actions/go-versions").some((dep) => dep.allowedVersions === "<1.26"), "setup-go go-version clamp <1.26 is missing");
assert(byPackage("golang").some((dep) => dep.allowedVersions === "<1.26"), "golang image clamp <1.26 is missing");

const checkout = byPackage("actions/checkout")[0];
assert(checkout?.enabled === true, "ordinary control dependency should remain enabled");

const report = [
  ["base-dockerfile", "ghcr.io/nwarila-platform/base-micro", "docker", "(digest-only)", "native dockerfile"],
  ["base-run", "ghcr.io/nwarila-platform/base-node", "docker", "latest", "ubi9 base image digest cascade"],
  ["gate-run", "ghcr.io/nwarila-platform/gate-python", "docker", "latest", "ubi9 gate image digest cascade"],
  ["slsa-action", "slsa-framework/slsa-github-generator", "github-tags", slsa.find((dep) => dep.source === "github-actions")?.currentValue, "slsa generator signer identity lockstep"],
  ["slsa-identity", "slsa-framework/slsa-github-generator", "github-tags", slsa.find((dep) => dep.source === "custom.regex")?.currentValue, "slsa generator signer identity lockstep"],
  ["fleet-tflint", "terraform-linters/tflint", "github-releases", byPackage("terraform-linters/tflint")[0].currentValue, "gate-iac fleet toolchain"],
  ["fleet-terraform-docs", "terraform-docs/terraform-docs", "github-releases", byPackage("terraform-docs/terraform-docs")[0].currentValue, "gate-iac fleet toolchain"],
  ["fleet-opa", "open-policy-agent/opa", "github-releases", byPackage("open-policy-agent/opa")[0].currentValue, "gate-iac fleet toolchain"],
  ["terraform-tags", "ghcr.io/nwarila-platform/gate-iac", "docker", terraformTags.join(" + "), "tag-per-pin preserved"],
  ["go-builder", "golang/go", "golang-version", byPackage("golang/go")[0].currentValue, "disabled; allowedVersions <1.26"],
  ["setup-go-action", "actions/setup-go", "github-tags", byPackage("actions/setup-go")[0].currentValue, "disabled"],
  ["setup-go-version", "actions/go-versions", "github-releases", byPackage("actions/go-versions")[0].currentValue, "disabled; allowedVersions <1.26"],
  ["golang-image", "golang", "docker", byPackage("golang")[0].currentValue, "disabled; allowedVersions <1.26"],
  ["ordinary-control", "actions/checkout", "github-tags", checkout.currentValue, "enabled"]
];

console.log("UBI9 Renovate preset fixture check: PASS");
for (const [caseName, depName, datasource, currentValue, verdict] of report) {
  console.log(`${caseName}: datasource=${datasource}; depName=${depName}; currentValue=${currentValue}; verdict=${verdict}`);
}
