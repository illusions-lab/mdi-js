import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const dependencySections = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function workspaceVersion(specifier, version) {
  if (!specifier.startsWith("workspace:")) return specifier;

  const range = specifier.slice("workspace:".length);
  if (range === "*" || range === "^" || range === "~") {
    return `${range === "*" ? "^" : range}${version}`;
  }
  if (range.startsWith("^") || range.startsWith("~")) return range;
  // `workspace:../package` and other workspace protocols are local links.
  // Published packages must instead resolve the package from the registry.
  return `^${version}`;
}

export function createPublishManifest(manifest, workspacePackages) {
  const publishManifest = structuredClone(manifest);

  for (const section of dependencySections) {
    if (!publishManifest[section]) continue;
    for (const [name, specifier] of Object.entries(publishManifest[section])) {
      if (typeof specifier !== "string" || !specifier.startsWith("workspace:")) {
        continue;
      }
      const dependency = workspacePackages.get(name);
      if (!dependency) {
        throw new Error(
          `${manifest.name} references unknown workspace package ${name}`
        );
      }
      publishManifest[section][name] = workspaceVersion(specifier, dependency.version);
    }
  }

  return publishManifest;
}

export function workspacePackageVersions(workspaceRoot) {
  const packagesDirectory = join(workspaceRoot, "packages");
  const entries = readdirSync(packagesDirectory);
  return new Map(
    entries
      .map((entry) => join(packagesDirectory, entry, "package.json"))
      .filter(existsSync)
      .map((manifestPath) => {
        const manifest = readJson(manifestPath);
        return [manifest.name, manifest];
      })
  );
}

export function packPublishablePackage({
  packageDirectory,
  workspaceRoot = resolve(new URL("..", import.meta.url).pathname),
  outputDirectory,
}) {
  if (!outputDirectory) {
    throw new Error("outputDirectory is required so the packed artifact is retained");
  }

  const sourceDirectory = resolve(packageDirectory);
  const manifest = readJson(join(sourceDirectory, "package.json"));
  const packages = workspacePackageVersions(workspaceRoot);
  const stagingRoot = mkdtempSync(join(tmpdir(), "mdi-npm-pack-"));
  const stagingDirectory = join(stagingRoot, basename(sourceDirectory));

  try {
    cpSync(sourceDirectory, stagingDirectory, { recursive: true });
    const publishManifest = createPublishManifest(manifest, packages);
    writeFileSync(
      join(stagingDirectory, "package.json"),
      `${JSON.stringify(publishManifest, null, 2)}\n`
    );
    const packed = JSON.parse(
      execFileSync(
        "npm",
        ["pack", "--json", "--pack-destination", outputDirectory],
        { cwd: stagingDirectory, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }
      )
    );
    return join(outputDirectory, packed[0].filename);
  } finally {
    rmSync(stagingRoot, { recursive: true, force: true });
  }
}

const invokedPath = process.argv[1] && resolve(process.argv[1]);
if (invokedPath === fileURLToPath(import.meta.url)) {
  const [packageDirectory, outputDirectory] = process.argv.slice(2);
  if (!packageDirectory || !outputDirectory) {
    throw new Error(
      "Usage: node pack-publishable-package.mjs <package-directory> <output-directory>"
    );
  }
  console.log(packPublishablePackage({ packageDirectory, outputDirectory }));
}
