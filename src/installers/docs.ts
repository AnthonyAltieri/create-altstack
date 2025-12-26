import path from "path";
import fs from "fs-extra";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import type { InstallerOptions } from "./index.js";

export const docsInstaller = ({
  projectDir,
  projectName,
}: InstallerOptions): void => {
  const docsAppDir = path.join(projectDir, "apps/docs");

  // Create docs app directory structure
  fs.mkdirSync(path.join(docsAppDir, "docs"), { recursive: true });
  fs.mkdirSync(path.join(docsAppDir, "src/pages"), { recursive: true });
  fs.mkdirSync(path.join(docsAppDir, "static/img"), { recursive: true });

  // Create package.json
  const pkgJson = {
    name: `@${projectName}/docs`,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "docusaurus start",
      build: "docusaurus build",
      serve: "docusaurus serve",
      clear: "docusaurus clear",
    },
    dependencies: {},
    devDependencies: {},
  };
  fs.writeJSONSync(path.join(docsAppDir, "package.json"), pkgJson, { spaces: 2 });

  // Create docusaurus.config.ts
  const docusaurusConfig = `import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "${projectName}",
  tagline: "Full-stack TypeScript Monorepo",
  favicon: "img/favicon.ico",

  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",

  organizationName: "${projectName}",
  projectName: "${projectName}",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "${projectName}",
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/AnthonyAltieri/alt-stack",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: \`Built with alt-stack and Docusaurus.\`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
`;
  fs.writeFileSync(path.join(docsAppDir, "docusaurus.config.ts"), docusaurusConfig);

  // Create sidebars.ts
  const sidebars = `import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    {
      type: "category",
      label: "Getting Started",
      items: ["getting-started/installation", "getting-started/project-structure"],
    },
    {
      type: "category",
      label: "API Reference",
      items: ["api/overview"],
    },
  ],
};

export default sidebars;
`;
  fs.writeFileSync(path.join(docsAppDir, "sidebars.ts"), sidebars);

  // Create intro doc
  const introDocs = `---
slug: /
sidebar_position: 1
---

# Introduction

Welcome to **${projectName}** documentation.

This project was bootstrapped with [create-altstack](https://github.com/AnthonyAltieri/alt-stack).

## Features

- Type-safe API with Zod validation
- Monorepo architecture with Turborepo
- Multiple server framework options (Hono, Express, Bun)

## Quick Start

\`\`\`bash
cd ${projectName}
pnpm install
pnpm dev
\`\`\`
`;
  fs.writeFileSync(path.join(docsAppDir, "docs/intro.md"), introDocs);

  // Create getting started docs
  fs.mkdirSync(path.join(docsAppDir, "docs/getting-started"), { recursive: true });

  const installationDoc = `---
sidebar_position: 1
---

# Installation

## Prerequisites

- Node.js >= 18
- pnpm 9.0.0+

## Setup

1. Install dependencies:

\`\`\`bash
pnpm install
\`\`\`

2. Start development:

\`\`\`bash
pnpm dev
\`\`\`
`;
  fs.writeFileSync(path.join(docsAppDir, "docs/getting-started/installation.md"), installationDoc);

  const structureDoc = `---
sidebar_position: 2
---

# Project Structure

\`\`\`
${projectName}/
├── apps/
│   ├── server/      # API server
│   ├── frontend/    # TanStack Start frontend (if included)
│   └── docs/        # This documentation
├── packages/
│   └── typescript-config/  # Shared TypeScript configs
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
\`\`\`
`;
  fs.writeFileSync(path.join(docsAppDir, "docs/getting-started/project-structure.md"), structureDoc);

  // Create API docs
  fs.mkdirSync(path.join(docsAppDir, "docs/api"), { recursive: true });

  const apiOverview = `---
sidebar_position: 1
---

# API Overview

The API is built with alt-stack's type-safe server framework.

## Endpoints

### Health Check

\`\`\`
GET /api/health
\`\`\`

Returns the health status of the API.

### Messages

\`\`\`
GET /api/messages      # List all messages
POST /api/messages     # Create a message
GET /api/messages/:id  # Get a message
DELETE /api/messages/:id  # Delete a message
\`\`\`
`;
  fs.writeFileSync(path.join(docsAppDir, "docs/api/overview.md"), apiOverview);

  // Create custom CSS
  fs.mkdirSync(path.join(docsAppDir, "src/css"), { recursive: true });
  const customCss = `:root {
  --ifm-color-primary: #7c3aed;
  --ifm-color-primary-dark: #6d28d9;
  --ifm-color-primary-darker: #5b21b6;
  --ifm-color-primary-darkest: #4c1d95;
  --ifm-color-primary-light: #8b5cf6;
  --ifm-color-primary-lighter: #a78bfa;
  --ifm-color-primary-lightest: #c4b5fd;
  --ifm-code-font-size: 95%;
}

[data-theme='dark'] {
  --ifm-color-primary: #a78bfa;
  --ifm-color-primary-dark: #8b5cf6;
  --ifm-color-primary-darker: #7c3aed;
  --ifm-color-primary-darkest: #6d28d9;
  --ifm-color-primary-light: #c4b5fd;
  --ifm-color-primary-lighter: #ddd6fe;
  --ifm-color-primary-lightest: #ede9fe;
}
`;
  fs.writeFileSync(path.join(docsAppDir, "src/css/custom.css"), customCss);

  // Add dependencies
  addPackageDependency({
    projectDir: docsAppDir,
    dependencies: ["@docusaurus/core", "@docusaurus/preset-classic"],
  });

  addPackageDependency({
    projectDir: docsAppDir,
    dependencies: ["typescript"],
    devMode: true,
  });
};
