import path from "path";
import fs from "fs-extra";
import { PKG_ROOT } from "~/consts.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import type { InstallerOptions } from "./index.js";

export const frontendInstaller = ({
  projectDir,
  projectName,
}: InstallerOptions): void => {
  const extrasDir = path.join(PKG_ROOT, "template/extras");
  const frontendAppDir = path.join(projectDir, "apps/frontend");

  // Copy the frontend template
  fs.copySync(path.join(extrasDir, "apps/frontend"), frontendAppDir);

  // Replace placeholders
  replaceInDir(frontendAppDir, "{{PROJECT_NAME}}", projectName);

  // Add dependencies
  addPackageDependency({
    projectDir: frontendAppDir,
    dependencies: [
      "@tanstack/react-start",
      "@tanstack/react-router",
      "@tanstack/react-router-devtools",
      "react",
      "react-dom",
      "tailwind-merge",
      "zod",
    ],
  });

  addPackageDependency({
    projectDir: frontendAppDir,
    dependencies: [
      "@tailwindcss/vite",
      "@types/node",
      "@types/react",
      "@types/react-dom",
      "@vitejs/plugin-react",
      "tailwindcss",
      "typescript",
      "vite",
      "vite-tsconfig-paths",
    ],
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
