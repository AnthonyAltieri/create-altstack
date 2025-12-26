import path from "path";
import fs from "fs-extra";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import type { InstallerOptions } from "./index.js";

export const workersTriggerInstaller = ({
  projectDir,
  projectName,
}: InstallerOptions): void => {
  const workersAppDir = path.join(projectDir, "apps/workers");

  // Create workers app directory
  fs.mkdirSync(path.join(workersAppDir, "src/jobs"), { recursive: true });

  // Create package.json
  const pkgJson = {
    name: `@${projectName}/workers`,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "trigger dev",
      deploy: "trigger deploy",
      "check-types": "tsc --noEmit",
    },
    dependencies: {},
    devDependencies: {},
  };
  fs.writeJSONSync(path.join(workersAppDir, "package.json"), pkgJson, { spaces: 2 });

  // Create tsconfig.json
  const tsConfig = {
    extends: `@${projectName}/typescript-config/base.json`,
    compilerOptions: {
      outDir: "dist",
      rootDir: "src",
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  };
  fs.writeJSONSync(path.join(workersAppDir, "tsconfig.json"), tsConfig, { spaces: 2 });

  // Create trigger.config.ts
  const triggerConfig = `import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "${projectName}-workers",
  runtime: "node",
  logLevel: "log",
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
  dirs: ["./src/jobs"],
});
`;
  fs.writeFileSync(path.join(workersAppDir, "trigger.config.ts"), triggerConfig);

  // Create example job
  const exampleJob = `import { task } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const SendNotificationPayload = z.object({
  userId: z.string(),
  message: z.string(),
});

export const sendNotification = task({
  id: "send-notification",
  run: async (payload: z.infer<typeof SendNotificationPayload>) => {
    console.log(\`Sending notification to user \${payload.userId}: \${payload.message}\`);

    // Add your notification logic here
    // e.g., send email, push notification, etc.

    return { success: true };
  },
});
`;
  fs.writeFileSync(path.join(workersAppDir, "src/jobs/send-notification.ts"), exampleJob);

  // Create index.ts that exports all jobs
  const indexContent = `export * from "./jobs/send-notification.js";
`;
  fs.writeFileSync(path.join(workersAppDir, "src/index.ts"), indexContent);

  // Add dependencies
  addPackageDependency({
    projectDir: workersAppDir,
    dependencies: [
      "@alt-stack/workers-core",
      "@alt-stack/workers-trigger",
      "@trigger.dev/sdk",
      "zod",
    ],
  });

  addPackageDependency({
    projectDir: workersAppDir,
    dependencies: ["typescript", "@types/node"],
    devMode: true,
  });
};
