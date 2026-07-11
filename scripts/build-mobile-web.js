const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(projectRoot, "mobile", "www");
const runtimeFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "game-rules.js",
  "words.js",
  "words-primary.js",
  "words-secondary.js",
  "words-college.js",
  "words-advanced.js",
  "words-expansion.js",
  "words-official.js"
];

if (!outputRoot.startsWith(`${projectRoot}${path.sep}`)) {
  throw new Error(`Refusing to write mobile assets outside the project: ${outputRoot}`);
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

runtimeFiles.forEach((file) => {
  fs.copyFileSync(path.join(projectRoot, file), path.join(outputRoot, file));
});

console.log(`Mobile web assets ready: ${runtimeFiles.length} files in ${outputRoot}`);
