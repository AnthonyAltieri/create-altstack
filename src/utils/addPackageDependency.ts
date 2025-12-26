import path from "path";
import fs from "fs-extra";
import sortPackageJson from "sort-package-json";
import {
  dependencyVersionMap,
  type AvailableDependency,
} from "~/installers/dependencyVersionMap.js";

interface AddPackageDependencyOptions {
  projectDir: string;
  dependencies: AvailableDependency[];
  devMode?: boolean;
}

export function addPackageDependency({
  projectDir,
  dependencies,
  devMode = false,
}: AddPackageDependencyOptions): void {
  const pkgJsonPath = path.join(projectDir, "package.json");

  if (!fs.existsSync(pkgJsonPath)) {
    throw new Error(`package.json not found at ${pkgJsonPath}`);
  }

  const pkgJson = fs.readJSONSync(pkgJsonPath) as Record<string, unknown>;

  const depKey = devMode ? "devDependencies" : "dependencies";

  if (!pkgJson[depKey]) {
    pkgJson[depKey] = {};
  }

  const deps = pkgJson[depKey] as Record<string, string>;

  for (const dep of dependencies) {
    const version = dependencyVersionMap[dep];
    deps[dep] = version;
  }

  const sortedPkgJson = sortPackageJson(pkgJson);
  fs.writeJSONSync(pkgJsonPath, sortedPkgJson, { spaces: 2 });
}
