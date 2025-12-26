import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";

import { CREATE_ALTSTACK, DEFAULT_APP_NAME } from "~/consts.js";
import { validateAppName } from "~/utils/validateAppName.js";
import { logger } from "~/utils/logger.js";

export type ServerFramework = "hono" | "express" | "bun";
export type HttpClient = "fetch" | "ky";
export type Messaging = "none" | "kafkajs" | "warpstream";
export type Workers = "none" | "trigger" | "warpstream";

export interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
  default: boolean;
  CI: boolean;
}

export interface ProjectOptions {
  appName: string;
  serverFramework: ServerFramework;
  httpClient: HttpClient;
  messaging: Messaging;
  workers: Workers;
  frontend: boolean;
  docs: boolean;
  flags: CliFlags;
}

const defaultOptions: ProjectOptions = {
  appName: DEFAULT_APP_NAME,
  serverFramework: "hono",
  httpClient: "fetch",
  messaging: "none",
  workers: "none",
  frontend: false,
  docs: false,
  flags: {
    noGit: false,
    noInstall: false,
    default: false,
    CI: false,
  },
};

export const runCli = async (): Promise<ProjectOptions> => {
  const cliResults = { ...defaultOptions };

  const program = new Command()
    .name(CREATE_ALTSTACK)
    .description("A CLI for creating alt-stack monorepo applications")
    .argument(
      "[dir]",
      "The name of the application, as well as the name of the directory to create"
    )
    .option(
      "--noGit",
      "Skip initializing a new git repo in the project",
      false
    )
    .option(
      "--noInstall",
      "Skip running the package manager's install command",
      false
    )
    .option(
      "-y, --default",
      "Use all default options (Hono + Fetch, no extras)",
      false
    )
    .option("--CI", "Run in CI mode (non-interactive)", false)
    .option(
      "--server <framework>",
      "Server framework: hono | express | bun",
      "hono"
    )
    .option("--http-client <client>", "HTTP client: fetch | ky", "fetch")
    .option(
      "--messaging <provider>",
      "Messaging provider: none | kafkajs | warpstream",
      "none"
    )
    .option(
      "--workers <provider>",
      "Workers provider: none | trigger | warpstream",
      "none"
    )
    .option("--frontend", "Include TanStack Start frontend", false)
    .option("--docs", "Include Docusaurus documentation", false)
    .version("0.1.0", "-v, --version", "Display the version number")
    .addHelpText(
      "afterAll",
      `\n  Built with ${chalk.hex("#7c3aed").bold("alt-stack")} - Type-safe full-stack TypeScript\n`
    )
    .parse(process.argv);

  const cliProvidedName = program.args[0];
  if (cliProvidedName) {
    cliResults.appName = cliProvidedName;
  }

  const opts = program.opts();
  cliResults.flags = {
    noGit: opts.noGit ?? false,
    noInstall: opts.noInstall ?? false,
    default: opts.default ?? false,
    CI: opts.CI ?? false,
  };

  // CI mode - use flags directly
  if (cliResults.flags.CI) {
    cliResults.serverFramework = (opts.server as ServerFramework) || "hono";
    cliResults.httpClient = (opts.httpClient as HttpClient) || "fetch";
    cliResults.messaging = (opts.messaging as Messaging) || "none";
    cliResults.workers = (opts.workers as Workers) || "none";
    cliResults.frontend = opts.frontend ?? false;
    cliResults.docs = opts.docs ?? false;
    return cliResults;
  }

  // Default mode - skip prompts
  if (cliResults.flags.default) {
    return cliResults;
  }

  // Interactive mode
  try {
    const project = await p.group(
      {
        ...(!cliProvidedName && {
          name: () =>
            p.text({
              message: "What will your project be called?",
              placeholder: DEFAULT_APP_NAME,
              validate: validateAppName,
            }),
        }),

        serverFramework: () =>
          p.select({
            message: "Which server framework would you like to use?",
            options: [
              { value: "hono", label: "Hono", hint: "recommended" },
              { value: "express", label: "Express" },
              { value: "bun", label: "Bun native" },
            ],
            initialValue: "hono" as const,
          }),

        httpClient: () =>
          p.select({
            message: "Which HTTP client would you like to use?",
            options: [
              { value: "fetch", label: "Fetch", hint: "native, recommended" },
              { value: "ky", label: "ky" },
            ],
            initialValue: "fetch" as const,
          }),

        messaging: () =>
          p.select({
            message: "Would you like to add messaging support?",
            options: [
              { value: "none", label: "None" },
              { value: "kafkajs", label: "KafkaJS" },
              { value: "warpstream", label: "WarpStream" },
            ],
            initialValue: "none" as const,
          }),

        workers: () =>
          p.select({
            message: "Would you like to add background workers?",
            options: [
              { value: "none", label: "None" },
              { value: "trigger", label: "Trigger.dev" },
              { value: "warpstream", label: "WarpStream" },
            ],
            initialValue: "none" as const,
          }),

        frontend: () =>
          p.confirm({
            message:
              "Would you like to add a frontend? (TanStack Start + React 19)",
            initialValue: false,
          }),

        docs: () =>
          p.confirm({
            message:
              "Would you like to add documentation? (Docusaurus + OpenAPI)",
            initialValue: false,
          }),

        ...(!cliResults.flags.noGit && {
          git: () =>
            p.confirm({
              message:
                "Should we initialize a Git repository and stage the changes?",
              initialValue: true,
            }),
        }),

        ...(!cliResults.flags.noInstall && {
          install: () =>
            p.confirm({
              message: "Should we run 'pnpm install' for you?",
              initialValue: true,
            }),
        }),
      },
      {
        onCancel() {
          p.cancel("Operation cancelled.");
          process.exit(1);
        },
      }
    );

    return {
      appName: project.name ?? cliResults.appName,
      serverFramework: project.serverFramework as ServerFramework,
      httpClient: project.httpClient as HttpClient,
      messaging: project.messaging as Messaging,
      workers: project.workers as Workers,
      frontend: project.frontend ?? false,
      docs: project.docs ?? false,
      flags: {
        ...cliResults.flags,
        noGit: !project.git,
        noInstall: !project.install,
      },
    };
  } catch (err) {
    logger.error("An error occurred during setup:");
    throw err;
  }
};
