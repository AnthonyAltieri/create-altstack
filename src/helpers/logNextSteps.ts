import chalk from "chalk";
import type { ProjectOptions } from "~/cli/index.js";

interface LogNextStepsOptions {
  projectName: string;
  options: ProjectOptions;
}

export function logNextSteps({
  projectName,
  options,
}: LogNextStepsOptions): void {
  console.log();
  console.log(chalk.bold("Next steps:"));
  console.log();

  console.log(chalk.cyan(`  cd ${projectName}`));

  if (options.flags.noInstall) {
    console.log(chalk.cyan("  pnpm install"));
  }

  console.log(chalk.cyan("  pnpm dev"));
  console.log();

  console.log(chalk.bold("Your project structure:"));
  console.log();
  console.log(chalk.dim("  apps/"));
  console.log(chalk.dim("    server/        - API server"));

  if (options.messaging !== "none") {
    console.log(chalk.dim("    kafka-consumer/ - Kafka message consumer"));
  }

  if (options.workers !== "none") {
    console.log(chalk.dim("    workers/        - Background job workers"));
  }

  if (options.frontend) {
    console.log(chalk.dim("    frontend/       - TanStack Start frontend"));
  }

  if (options.docs) {
    console.log(chalk.dim("    docs/           - Docusaurus documentation"));
  }

  console.log(chalk.dim("  packages/"));
  console.log(chalk.dim("    typescript-config/ - Shared TypeScript configs"));
  console.log();

  console.log(
    chalk.dim("Learn more at: ") +
      chalk.underline("https://github.com/AnthonyAltieri/alt-stack")
  );
  console.log();
}
