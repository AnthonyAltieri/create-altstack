import path from "path";
import fs from "fs-extra";
import sortPackageJson from "sort-package-json";

interface AddPackageScriptOptions {
  projectDir: string;
  scripts: Record<string, string>;
}

export function addPackageScript({
  projectDir,
  scripts,
}: AddPackageScriptOptions): void {
  const pkgJsonPath = path.join(projectDir, "package.json");

  if (!fs.existsSync(pkgJsonPath)) {
    throw new Error(`package.json not found at ${pkgJsonPath}`);
  }

  const pkgJson = fs.readJSONSync(pkgJsonPath) as Record<string, unknown>;

  if (!pkgJson.scripts) {
    pkgJson.scripts = {};
  }

  const existingScripts = pkgJson.scripts as Record<string, string>;

  for (const [name, command] of Object.entries(scripts)) {
    existingScripts[name] = command;
  }

  const sortedPkgJson = sortPackageJson(pkgJson);
  fs.writeJSONSync(pkgJsonPath, sortedPkgJson, { spaces: 2 });
}
