import { appendFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { globSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const manifests = globSync(join(root, "packages", "*", "package.json"));
const pending = [];
const dryRun = process.argv.includes("--dry-run");

for (const manifestPath of manifests) {
	const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
	if (manifest.private) continue;
	try {
		execFileSync("npm", ["view", `${manifest.name}@${manifest.version}`, "version"], {
			cwd: root,
			stdio: "ignore",
		});
	} catch {
		pending.push(manifest.name);
	}
}

if (pending.length > 0 && !dryRun) {
	execFileSync("pnpm", ["run", "release"], { cwd: root, stdio: "inherit" });
}

if (process.env.GITHUB_OUTPUT) {
	appendFileSync(process.env.GITHUB_OUTPUT, `published=${pending.length > 0}\n`);
	appendFileSync(process.env.GITHUB_OUTPUT, `publishedPackages=${JSON.stringify(pending)}\n`);
}

console.log(
	pending.length > 0
		? `${dryRun ? "Would publish" : "Published"} ${pending.join(", ")}`
		: "No unpublished workspace packages.",
);
