import { join } from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

// not currently in use
//  package.mjson is not a reliable way to detect source type
export const sourceType = async (path = "") => {
  const packageDotJsonPath = join(path, "package.json");
  const packageExists = existsSync(packageDotJsonPath);
  const packageDotJson = packageExists
    ? JSON.parse(await readFile(packageDotJsonPath))
    : {};

  return packageDotJson.type;
};
