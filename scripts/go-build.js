const u = require("./utils");
const parse = require("command-line-args");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const parserOptions = [
  { name: "packages", type: String, multiple: true, defaultOption: true },
  { name: "packageDir", alias: "d", type: String }
];
const parsed = parse(parserOptions);

const rootDir = parsed.packageDir || "cmd";
if (!(fs.existsSync(rootDir) && u.isDirectory(rootDir))) {
  console.error(`Package directory invalid: [${rootDir}]`);
  process.exit(1);
}

let packageDirs = [];
if (parsed.packages && parsed.packages.length > 0) {
  for (const p of parsed.packages) {
    const packageDir = path.join(rootDir, p);
    if (!u.isDirectory(packageDir)) {
      console.warn(`Package [${packageDir}] is not valid directory. `);
      continue;
    }
    packageDirs.push(packageDir);
  }
} else {
  packageDirs = u.getDirectories(rootDir);
  if (packageDirs.length === 0) {
    packageDirs = [rootDir];
  }
}

const packages = [];
for (const packageDir of packageDirs) {
  const files = u
    .getFiles(packageDir)
    .filter(filename => filename.endsWith(".go"));
  packages.push(...files);
}

if (packages.length === 0) {
  console.error("No valid packages.");
  process.exit(1);
}

console.log("Building these packages:");
console.log(`\t${packages.join("\n\t")}`);

for (const p of packages) {
  const packageName = `${path.basename(path.dirname(p))}-${path.basename(
    p,
    ".go"
  )}`;

  execSync(`GOOS=linux go build -ldflags="-s -w" -o bin/${packageName} ./${p}`);
  execSync(`chmod +x bin/${packageName}`);
}
