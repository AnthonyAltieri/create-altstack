import path from "path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import { PKG_ROOT } from "~/consts.js";

interface ScaffoldOptions {
  projectDir: string;
  projectName: string;
}

export async function scaffoldProject({
  projectDir,
  projectName,
}: ScaffoldOptions): Promise<void> {
  const templateDir = path.join(PKG_ROOT, "template/base");

  // Check if directory exists
  if (fs.existsSync(projectDir)) {
    const files = fs.readdirSync(projectDir);
    if (files.length > 0) {
      const overwrite = await p.confirm({
        message: `Directory ${projectName} already exists and is not empty. Overwrite?`,
        initialValue: false,
      });

      if (!overwrite || p.isCancel(overwrite)) {
        p.cancel("Operation cancelled.");
        process.exit(1);
      }

      // Clear the directory
      fs.emptyDirSync(projectDir);
    }
  } else {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Copy base template
  fs.copySync(templateDir, projectDir);

  // Rename _gitignore to .gitignore
  const gitignorePath = path.join(projectDir, "_gitignore");
  if (fs.existsSync(gitignorePath)) {
    fs.renameSync(gitignorePath, path.join(projectDir, ".gitignore"));
  }

  // Replace placeholders in files
  replaceInFile(
    path.join(projectDir, "package.json"),
    "{{PROJECT_NAME}}",
    projectName
  );
  replaceInFile(
    path.join(projectDir, "README.md"),
    "{{PROJECT_NAME}}",
    projectName
  );
  replaceInFile(
    path.join(projectDir, "packages/typescript-config/package.json"),
    "{{PROJECT_NAME}}",
    projectName
  );
}

function replaceInFile(
  filePath: string,
  searchValue: string,
  replaceValue: string
): void {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf-8");
  const newContent = content.replace(new RegExp(searchValue, "g"), replaceValue);
  fs.writeFileSync(filePath, newContent);
}
