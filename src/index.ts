#!/usr/bin/env node
import { renderTitle } from "~/utils/renderTitle.js";
import { runCli } from "~/cli/index.js";
import { createProject } from "~/helpers/createProject.js";
import { logger } from "~/utils/logger.js";

async function main() {
  renderTitle();

  const options = await runCli();

  await createProject(options);

  logger.success("\nYour alt-stack project is ready!");
  process.exit(0);
}

main().catch((err) => {
  logger.error("An error occurred:");
  logger.error(err);
  process.exit(1);
});
