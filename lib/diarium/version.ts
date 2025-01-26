import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

/**
 * Returns the current version of the package according to package.json
 */
export async function version(): Promise<string> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const packageJson = await readFile(`${__dirname}/../package.json`, "utf8");
  const { version } = JSON.parse(packageJson);
  return version;
}
