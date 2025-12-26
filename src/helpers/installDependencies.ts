import { execa } from "execa";
import ora from "ora";
import { logger } from "~/utils/logger.js";

interface InstallOptions {
  projectDir: string;
}

export async function installDependencies({
  projectDir,
}: InstallOptions): Promise<void> {
  const spinner = ora("Installing dependencies with pnpm...").start();

  try {
    await execa("pnpm", ["install"], {
      cwd: projectDir,
      stdio: "pipe",
    });
    spinner.succeed("Dependencies installed successfully!");
  } catch (error) {
    spinner.fail("Failed to install dependencies");
    logger.error("Error installing dependencies:");
    if (error instanceof Error) {
      logger.error(error.message);
    }
    logger.info("You can try running 'pnpm install' manually in the project directory.");
  }
}
