import type { ProjectOptions } from "~/cli/index.js";
import { serverHonoInstaller } from "./server-hono.js";
import { serverExpressInstaller } from "./server-express.js";
import { serverBunInstaller } from "./server-bun.js";
import { kafkaKafkajsInstaller } from "./kafka-kafkajs.js";
import { kafkaWarpstreamInstaller } from "./kafka-warpstream.js";
import { workersTriggerInstaller } from "./workers-trigger.js";
import { workersWarpstreamInstaller } from "./workers-warpstream.js";
import { frontendInstaller } from "./frontend.js";
import { docsInstaller } from "./docs.js";

export interface InstallerOptions {
  projectDir: string;
  projectName: string;
  options: ProjectOptions;
}

export type Installer = (opts: InstallerOptions) => void | Promise<void>;

export interface InstallerConfig {
  inUse: boolean;
  installer: Installer;
}

export type InstallerMap = {
  serverHono: InstallerConfig;
  serverExpress: InstallerConfig;
  serverBun: InstallerConfig;
  kafkaKafkajs: InstallerConfig;
  kafkaWarpstream: InstallerConfig;
  workersTrigger: InstallerConfig;
  workersWarpstream: InstallerConfig;
  frontend: InstallerConfig;
  docs: InstallerConfig;
};

export function buildInstallerMap(options: ProjectOptions): InstallerMap {
  return {
    serverHono: {
      inUse: options.serverFramework === "hono",
      installer: serverHonoInstaller,
    },
    serverExpress: {
      inUse: options.serverFramework === "express",
      installer: serverExpressInstaller,
    },
    serverBun: {
      inUse: options.serverFramework === "bun",
      installer: serverBunInstaller,
    },
    kafkaKafkajs: {
      inUse: options.messaging === "kafkajs",
      installer: kafkaKafkajsInstaller,
    },
    kafkaWarpstream: {
      inUse: options.messaging === "warpstream",
      installer: kafkaWarpstreamInstaller,
    },
    workersTrigger: {
      inUse: options.workers === "trigger",
      installer: workersTriggerInstaller,
    },
    workersWarpstream: {
      inUse: options.workers === "warpstream",
      installer: workersWarpstreamInstaller,
    },
    frontend: {
      inUse: options.frontend,
      installer: frontendInstaller,
    },
    docs: {
      inUse: options.docs,
      installer: docsInstaller,
    },
  };
}
