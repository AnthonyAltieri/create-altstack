import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const TITLE_TEXT = `
   _   _   _____   ____ _____  _    ____ _  __
  /_\\ | | |_   _| / ___|_   _|/ \\  / ___| |/ /
 //_\\\\| |   | |   \\___ \\ | | / _ \\| |   | ' /
/  _  \\ |___| |    ___) || |/ ___ \\ |___| . \\
\\_/ \\_/_____|_|   |____/ |_/_/   \\_\\____|_|\\_\\
`;

export const DEFAULT_APP_NAME = "my-altstack-app";

export const CREATE_ALTSTACK = "create-altstack";
