import * as p from "@clack/prompts";
import type { ProjectOptions } from "~/cli/index.js";
import { parseNameAndPath } from "~/utils/parseNameAndPath.js";
import { scaffoldProject } from "./scaffoldProject.js";
import { installPackages } from "./installPackages.js";
import { installDependencies } from "./installDependencies.js";
import { initializeGit } from "./git.js";
import { logNextSteps } from "./logNextSteps.js";
import { buildInstallerMap } from "~/installers/index.js";

export async function createProject(options: ProjectOptions): Promise<void> {
  const { appName, projectDir } = parseNameAndPath(options.appName);

  p.intro(`Creating ${appName}...`);

  // 1. Scaffold base project
  await scaffoldProject({
    projectDir,
    projectName: appName,
  });

  // 2. Build installer map and install selected packages
  const installerMap = buildInstallerMap(options);
  await installPackages({
    projectDir,
    projectName: appName,
    options,
    installerMap,
  });

  // 3. Install dependencies
  if (!options.flags.noInstall) {
    await installDependencies({ projectDir });
  }

  // 4. Initialize git
  if (!options.flags.noGit) {
    await initializeGit({ projectDir });
  }

  // 5. Log next steps
  logNextSteps({
    projectName: appName,
    options,
  });

  p.outro("Done! Happy coding!");
}
