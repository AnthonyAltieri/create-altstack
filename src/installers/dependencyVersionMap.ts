export const dependencyVersionMap = {
  // Core alt-stack packages
  "@alt-stack/result": "^0.1.4",
  "@alt-stack/server-core": "^0.4.3",
  "@alt-stack/server-hono": "^0.4.4",
  "@alt-stack/server-express": "^0.1.0",
  "@alt-stack/server-bun": "^0.1.0",
  "@alt-stack/http-client-core": "^0.1.0",
  "@alt-stack/http-client-fetch": "^0.1.0",
  "@alt-stack/http-client-ky": "^0.1.0",
  "@alt-stack/kafka-core": "^0.1.0",
  "@alt-stack/kafka-client-core": "^0.1.0",
  "@alt-stack/kafka-client-kafkajs": "^0.1.2",
  "@alt-stack/kafka-client-warpstream": "^0.1.0",
  "@alt-stack/workers-core": "^0.1.0",
  "@alt-stack/workers-client-core": "^0.1.0",
  "@alt-stack/workers-trigger": "^0.2.0",
  "@alt-stack/workers-client-trigger": "^0.1.2",
  "@alt-stack/workers-warpstream": "^0.1.0",
  "@alt-stack/workers-client-warpstream": "^0.1.0",
  "@alt-stack/zod-openapi": "^0.1.0",
  "@alt-stack/zod-asyncapi": "^0.1.0",

  // Server frameworks
  hono: "^4.0.0",
  "@hono/node-server": "^1.0.0",
  express: "^4.21.0",
  "@types/express": "^4.17.21",

  // HTTP clients
  ky: "^1.7.0",

  // Messaging
  kafkajs: "^2.2.4",

  // Workers
  "@trigger.dev/sdk": "^3.3.16",

  // Frontend (TanStack Start)
  "@tanstack/react-start": "^1.143.11",
  "@tanstack/react-router": "^1.143.11",
  "@tanstack/react-router-devtools": "^1.143.11",
  react: "^19.0.0",
  "react-dom": "^19.0.0",
  vite: "^7.1.7",
  "@vitejs/plugin-react": "^4.6.0",
  tailwindcss: "^4.1.18",
  "@tailwindcss/vite": "^4.1.18",
  "tailwind-merge": "^2.6.0",
  "vite-tsconfig-paths": "^5.1.4",

  // Documentation
  "@docusaurus/core": "^3.5.2",
  "@docusaurus/preset-classic": "^3.5.2",

  // Core dependencies (always included)
  zod: "^4.0.0",
  "@t3-oss/env-core": "^0.9.0",

  // Dev dependencies
  typescript: "5.9.2",
  "@types/node": "^22.5.4",
  "@types/react": "^19.0.8",
  "@types/react-dom": "^19.0.3",
  tsx: "^4.0.0",
  tsup: "^8.0.0",
  vitest: "^4.0.3",
} as const;

export type AvailableDependency = keyof typeof dependencyVersionMap;
