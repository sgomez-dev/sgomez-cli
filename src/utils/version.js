import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "..", "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

export const VERSION = pkg.version;
export const NAME = pkg.name;
