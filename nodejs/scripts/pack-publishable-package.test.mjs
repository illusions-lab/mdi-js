import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  existsSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {
  createPublishManifest,
  packPublishablePackage,
} from "./pack-publishable-package.mjs";

const repositoryRoot = resolve(new URL("../..", import.meta.url).pathname);
const packagesRoot = join(repositoryRoot, "nodejs");

function packedManifest(tarball) {
  return JSON.parse(
    execFileSync("tar", ["-xOf", tarball, "package/package.json"], {
      encoding: "utf8",
    })
  );
}

test("createPublishManifest converts every workspace dependency section", () => {
  const manifest = {
    name: "consumer",
    dependencies: { core: "workspace:*", external: "^1.0.0" },
    devDependencies: { tools: "workspace:^" },
    optionalDependencies: { core: "workspace:~" },
    peerDependencies: { tools: "workspace:../tools" },
  };
  const publishManifest = createPublishManifest(
    manifest,
    new Map([
      ["core", { version: "2.3.4" }],
      ["tools", { version: "5.6.7" }],
    ])
  );

  assert.deepEqual(publishManifest, {
    name: "consumer",
    dependencies: { core: "^2.3.4", external: "^1.0.0" },
    devDependencies: { tools: "^5.6.7" },
    optionalDependencies: { core: "~2.3.4" },
    peerDependencies: { tools: "^5.6.7" },
  });
  assert.equal(manifest.dependencies.core, "workspace:*");
});

test("createPublishManifest rejects workspace dependencies outside the workspace", () => {
  assert.throws(
    () =>
      createPublishManifest(
        { name: "consumer", dependencies: { missing: "workspace:*" } },
        new Map()
      ),
    /unknown workspace package missing/
  );
});

test("npm artifacts replace workspace dependencies and MDI installs for consumers", () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "mdi-consumer-install-"));
  const artifactsDirectory = join(temporaryDirectory, "artifacts");
  const consumerDirectory = join(temporaryDirectory, "consumer");

  try {
    mkdirSync(artifactsDirectory);
    const tarballs = readdirSync(join(packagesRoot, "packages")).filter((packageName) =>
      existsSync(join(packagesRoot, "packages", packageName, "package.json"))
    )
      .map((packageName) =>
        packPublishablePackage({
          packageDirectory: join(packagesRoot, "packages", packageName),
          workspaceRoot: packagesRoot,
          outputDirectory: artifactsDirectory,
        })
      );

    for (const tarball of tarballs) {
      assert.doesNotMatch(JSON.stringify(packedManifest(tarball)), /workspace:/);
    }

    mkdirSync(consumerDirectory);
    writeFileSync(
      join(consumerDirectory, "package.json"),
      JSON.stringify({ name: "mdi-consumer-fixture", private: true })
    );
    execFileSync(
      "npm",
      [
        "install",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--prefer-offline",
        ...tarballs,
      ],
      { cwd: consumerDirectory, stdio: "inherit" }
    );

    const installed = JSON.parse(
      readFileSync(
        join(consumerDirectory, "node_modules", "@illusions-lab", "mdi", "package.json"),
        "utf8"
      )
    );
    assert.doesNotMatch(JSON.stringify(installed), /workspace:/);
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});
