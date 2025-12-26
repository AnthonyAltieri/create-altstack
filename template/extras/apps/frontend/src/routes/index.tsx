import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
        Welcome to Alt-Stack
      </h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
        Your full-stack TypeScript monorepo is ready.
      </p>
      <div className="flex gap-4">
        <a
          href="https://github.com/AnthonyAltieri/alt-stack"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
        >
          Documentation
        </a>
        <a
          href="/api/health"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          API Health Check
        </a>
      </div>
    </div>
  );
}
