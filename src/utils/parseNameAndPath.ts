import path from "path";

interface ParsedNameAndPath {
  appName: string;
  projectDir: string;
}

// Handles scoped package names like @org/my-app
export function parseNameAndPath(input: string): ParsedNameAndPath {
  const trimmedInput = input.trim();

  // Handle scoped packages: @org/name -> use 'name' as the directory
  if (trimmedInput.startsWith("@")) {
    const [scope, name] = trimmedInput.split("/");
    if (name) {
      return {
        appName: trimmedInput,
        projectDir: path.resolve(process.cwd(), name),
      };
    }
  }

  return {
    appName: trimmedInput,
    projectDir: path.resolve(process.cwd(), trimmedInput),
  };
}
