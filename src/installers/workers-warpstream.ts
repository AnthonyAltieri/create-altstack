import path from "path";
import fs from "fs-extra";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import type { InstallerOptions } from "./index.js";

export const workersWarpstreamInstaller = ({
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
      dev: "tsx watch src/index.ts",
      build: "tsc",
      start: "node dist/index.js",
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

  // Create example job definition
  const jobsContent = `import { z } from "zod";

export const Topics = {
  "send-notification": z.object({
    userId: z.string(),
    message: z.string(),
  }),
  "process-data": z.object({
    dataId: z.string(),
    type: z.enum(["transform", "aggregate", "export"]),
  }),
} as const;

export type TopicName = keyof typeof Topics;
`;
  fs.writeFileSync(path.join(workersAppDir, "src/jobs/topics.ts"), jobsContent);

  // Create worker index
  const indexContent = `import { createWarpStreamWorker } from "@alt-stack/workers-warpstream";
import { Topics } from "./jobs/topics.js";

async function main() {
  const worker = await createWarpStreamWorker({
    bootstrapServer: process.env.WARPSTREAM_URL || "http://localhost:9092",
    groupId: "${projectName}-workers",
    jobs: Topics,
  });

  worker.on("send-notification", async (payload) => {
    console.log(\`Sending notification to user \${payload.userId}: \${payload.message}\`);
    // Add your notification logic here
  });

  worker.on("process-data", async (payload) => {
    console.log(\`Processing data \${payload.dataId} with type \${payload.type}\`);
    // Add your data processing logic here
  });

  await worker.start();
  console.log("WarpStream worker started");
}

main().catch(console.error);
`;
  fs.writeFileSync(path.join(workersAppDir, "src/index.ts"), indexContent);

  // Add dependencies
  addPackageDependency({
    projectDir: workersAppDir,
    dependencies: [
      "@alt-stack/workers-core",
      "@alt-stack/workers-warpstream",
      "zod",
    ],
  });

  addPackageDependency({
    projectDir: workersAppDir,
    dependencies: ["typescript", "@types/node", "tsx"],
    devMode: true,
  });
};
