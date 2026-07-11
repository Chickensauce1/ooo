const fs = require("fs");
const path = require("path");
const readline = require("readline");
const vm = require("vm");

const LEVEL_GROUPS = {
  primary: ["primary-1", "primary-2", "primary-3", "primary-4", "primary-5", "primary-6"],
  junior: ["junior-7", "junior-8", "junior-9"],
  senior: ["senior-1", "senior-2", "senior-3"],
  cet4: ["college-basic", "college-cet4"],
  cet6: ["college-cet6"]
};

const CURRENT_PACKS = [
  "words.js",
  "words-primary.js",
  "words-secondary.js",
  "words-college.js",
  "words-advanced.js",
  "words-expansion.js"
];

function parseCsvLine(line) {
  const fields = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      fields.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  fields.push(value);
  return fields;
}

function parseCsv(source) {
  const lines = source.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift()).map((header) =>
    header.replace(/^\uFEFF/, "").trim().toLowerCase()
  );
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function normalizeGloss(value) {
  const candidates = String(value || "")
    .split(/\\n|\r?\n|;/)
    .map((item) => item.replace(/\[[^\]]+\]/g, "").replace(/\s+/g, " ").trim())
    .filter((item) => /[\u3400-\u9fff]/.test(item));
  return (candidates[0] || "")
    .replace(/[|`$\\]/g, "")
    .slice(0, 80)
    .trim();
}

function classifyRecord(record) {
  const tags = new Set(String(record.tag || "").toLowerCase().split(/\s+/).filter(Boolean));
  if (tags.has("xx")) return "primary";
  if (tags.has("zk")) return "junior";
  if (tags.has("gk")) return "senior";
  if (tags.has("cet4")) return "cet4";
  if (tags.has("cet6")) return "cet6";
  return null;
}

function frequencyRank(record) {
  const ranks = [record.frq, record.bnc]
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value) && value > 0);
  return ranks.length > 0 ? Math.min(...ranks) : Number.MAX_SAFE_INTEGER;
}

function buildPacks(records, existingWords = new Set()) {
  const grouped = Object.fromEntries(Object.keys(LEVEL_GROUPS).map((group) => [group, []]));
  const acceptedWords = new Set(existingWords);

  records.forEach((record) => {
    const word = String(record.word || "").trim().toLowerCase();
    const meaning = normalizeGloss(record.translation);
    const group = classifyRecord(record);
    if (!group || !/^[a-z]+$/.test(word) || !meaning || acceptedWords.has(word)) return;
    acceptedWords.add(word);
    grouped[group].push({ word, meaning, rank: frequencyRank(record) });
  });

  const packs = Object.fromEntries(
    Object.values(LEVEL_GROUPS).flat().map((levelId) => [levelId, []])
  );

  Object.entries(grouped).forEach(([group, entries]) => {
    const levelIds = LEVEL_GROUPS[group];
    entries
      .sort((left, right) => left.rank - right.rank || left.word.localeCompare(right.word))
      .forEach((entry, index) => {
        const bucket = Math.min(
          levelIds.length - 1,
          Math.floor((index * levelIds.length) / Math.max(entries.length, 1))
        );
        packs[levelIds[bucket]].push([entry.word, entry.meaning]);
      });
  });

  return packs;
}

function loadExistingWords(directory) {
  const context = vm.createContext({ window: {} });
  CURRENT_PACKS.forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(directory, file), "utf8"), context, { filename: file });
  });
  return new Set(context.window.WORD_LEVELS.flatMap((level) => level.words.map(([word]) => word)));
}

function renderPacks(packs, metadata = {}) {
  const total = Object.values(packs).reduce((sum, entries) => sum + entries.length, 0);
  const header = [
    "// Generated from ECDICT. Do not edit by hand.",
    `window.OFFICIAL_VOCABULARY_META = ${JSON.stringify({ ...metadata, generatedEntries: total })};`,
    ""
  ];
  const sections = Object.entries(packs)
    .filter(([, entries]) => entries.length > 0)
    .map(([levelId, entries]) => {
      const body = entries.map(([word, meaning]) => `${word}|${meaning}`).join("\n");
      return `window.addVocabularyPack(${JSON.stringify(levelId)}, \`\n${body}\n\`);`;
    });
  return [...header, ...sections, ""].join("\n");
}

async function readTaggedRecords(inputPath) {
  const records = [];
  let headers = null;
  const lines = readline.createInterface({
    input: fs.createReadStream(inputPath, { encoding: "utf8" }),
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    if (!headers) {
      headers = parseCsvLine(line).map((header) =>
        header.replace(/^\uFEFF/, "").trim().toLowerCase()
      );
      continue;
    }
    if (!line) continue;
    const values = parseCsvLine(line);
    const record = Object.fromEntries(
      headers.map((header, index) => [header, values[index] || ""])
    );
    if (classifyRecord(record) && normalizeGloss(record.translation)) records.push(record);
  }
  return records;
}

async function buildOfficialVocabulary(inputPath, outputPath) {
  const directory = path.dirname(outputPath);
  const records = await readTaggedRecords(inputPath);
  const existingWords = loadExistingWords(directory);
  const packs = buildPacks(records, existingWords);
  const output = renderPacks(packs, {
    source: "ECDICT",
    sourceFile: path.basename(inputPath),
    generatedAt: new Date().toISOString()
  });
  fs.writeFileSync(outputPath, output, "utf8");
  return Object.values(packs).reduce((sum, entries) => sum + entries.length, 0);
}

if (require.main === module) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] || path.join(__dirname, "words-official.js");
  if (!inputPath) {
    console.error("Usage: node build-official-vocabulary.js <stardict.csv> [words-official.js]");
    process.exitCode = 1;
  } else {
    buildOfficialVocabulary(path.resolve(inputPath), path.resolve(outputPath))
      .then((count) => console.log(`Generated ${count} official vocabulary entries.`))
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
  }
}

module.exports = {
  parseCsvLine,
  parseCsv,
  normalizeGloss,
  classifyRecord,
  buildPacks,
  renderPacks,
  readTaggedRecords,
  buildOfficialVocabulary
};
