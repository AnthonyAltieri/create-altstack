import { execa } from "execa";
import ora from "ora";
import { logger } from "~/utils/logger.js";

interface GitOptions {
  projectDir: string;
}

export async function initializeGit({ projectDir }: GitOptions): Promise<void> {
  const spinner = ora("Initializing Git repository...").start();

  try {
    await execa("git", ["init"], { cwd: projectDir, stdio: "pipe" });
    await execa("git", ["add", "."], { cwd: projectDir, stdio: "pipe" });
    await execa("git", ["commit", "-m", "Initial commit from create-altstack"], {
      cwd: projectDir,
      stdio: "pipe",
    });
    spinner.succeed("Git repository initialized!");
  } catch (error) {
    spinner.fail("Failed to initialize Git repository");
    if (error instanceof Error) {
      logger.warn(error.message);
    }
    logger.info("You can initialize git manually with 'git init'");
  }
}
