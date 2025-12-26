import path from "path";
import fs from "fs-extra";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import type { InstallerOptions } from "./index.js";

export const kafkaWarpstreamInstaller = ({
  projectDir,
  projectName,
}: InstallerOptions): void => {
  const kafkaAppDir = path.join(projectDir, "apps/kafka-consumer");

  // Create kafka-consumer app directory
  fs.mkdirSync(path.join(kafkaAppDir, "src"), { recursive: true });

  // Create package.json
  const pkgJson = {
    name: `@${projectName}/kafka-consumer`,
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
  fs.writeJSONSync(path.join(kafkaAppDir, "package.json"), pkgJson, { spaces: 2 });

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
  fs.writeJSONSync(path.join(kafkaAppDir, "tsconfig.json"), tsConfig, { spaces: 2 });

  // Create index.ts
  const indexContent = `import { createWarpStreamConsumer } from "@alt-stack/kafka-client-warpstream";
import { z } from "zod";

const MessageSchema = z.object({
  type: z.string(),
  payload: z.unknown(),
});

async function main() {
  const consumer = await createWarpStreamConsumer({
    bootstrapServer: process.env.WARPSTREAM_URL || "http://localhost:9092",
    groupId: "${projectName}-group",
  });

  await consumer.subscribe({
    topic: "events",
    schema: MessageSchema,
    handler: async (message) => {
      console.log("Received message:", message);
    },
  });

  console.log("WarpStream consumer started");
}

main().catch(console.error);
`;
  fs.writeFileSync(path.join(kafkaAppDir, "src/index.ts"), indexContent);

  // Add dependencies
  addPackageDependency({
    projectDir: kafkaAppDir,
    dependencies: [
      "@alt-stack/kafka-core",
      "@alt-stack/kafka-client-warpstream",
      "zod",
    ],
  });

  addPackageDependency({
    projectDir: kafkaAppDir,
    dependencies: ["typescript", "@types/node", "tsx"],
    devMode: true,
  });
};
