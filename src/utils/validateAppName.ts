// Validates that the app name is a valid npm package name
const validationRegExp =
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

export function validateAppName(rawInput: string): string | undefined {
  const input = rawInput.trim();

  if (input.length === 0) {
    return "App name cannot be empty";
  }

  if (!validationRegExp.test(input)) {
    return "App name must be a valid npm package name (lowercase, no spaces, alphanumeric with dashes)";
  }

  return undefined;
}
