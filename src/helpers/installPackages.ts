import ora from "ora";
import type { ProjectOptions } from "~/cli/index.js";
import type { InstallerMap } from "~/installers/index.js";

interface InstallPackagesOptions {
  projectDir: string;
  projectName: string;
  options: ProjectOptions;
  installerMap: InstallerMap;
}

export async function installPackages({
  projectDir,
  projectName,
  options,
  installerMap,
}: InstallPackagesOptions): Promise<void> {
  const spinner = ora("Setting up project packages...").start();

  try {
    for (const [name, config] of Object.entries(installerMap)) {
      if (config.inUse) {
        spinner.text = `Installing ${name}...`;
        await config.installer({
          projectDir,
          projectName,
          options,
        });
      }
    }
    spinner.succeed("Project packages configured!");
  } catch (error) {
    spinner.fail("Failed to configure packages");
    throw error;
  }
}
