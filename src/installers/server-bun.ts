import path from "path";
import fs from "fs-extra";
import { PKG_ROOT } from "~/consts.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import type { InstallerOptions } from "./index.js";

export const serverBunInstaller = ({
  projectDir,
  projectName,
  options,
}: InstallerOptions): void => {
  const extrasDir = path.join(PKG_ROOT, "template/extras");
  const serverAppDir = path.join(projectDir, "apps/server");

  // Remove .gitkeep if it exists
  const gitkeepPath = path.join(projectDir, "apps/.gitkeep");
  if (fs.existsSync(gitkeepPath)) {
    fs.unlinkSync(gitkeepPath);
  }

  // Copy the server-bun template
  fs.copySync(path.join(extrasDir, "apps/server-bun"), serverAppDir);

  // Replace placeholders
  replaceInDir(serverAppDir, "{{PROJECT_NAME}}", projectName);

  // Add dependencies
  addPackageDependency({
    projectDir: serverAppDir,
    dependencies: [
      "@alt-stack/result",
      "@alt-stack/server-core",
      "@alt-stack/server-bun",
      "zod",
      "@t3-oss/env-core",
    ],
  });

  // Add HTTP client dependencies
  if (options.httpClient === "ky") {
    addPackageDependency({
      projectDir: serverAppDir,
      dependencies: ["@alt-stack/http-client-core", "@alt-stack/http-client-ky", "ky"],
    });
  } else {
    addPackageDependency({
      projectDir: serverAppDir,
      dependencies: ["@alt-stack/http-client-core", "@alt-stack/http-client-fetch"],
    });
  }

  addPackageDependency({
    projectDir: serverAppDir,
    dependencies: ["typescript", "@types/node"],
    devMode: true,
  });
};

function replaceInDir(dir: string, search: string, replace: string): void {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      replaceInDir(filePath, search, replace);
    } else {
      const content = fs.readFileSync(filePath, "utf-8");
      if (content.includes(search)) {
        fs.writeFileSync(filePath, content.replace(new RegExp(search, "g"), replace));
      }
    }
  }
}
