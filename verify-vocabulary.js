const fs = require("fs");
const vm = require("vm");

const vocabularyFiles = [
  "words.js",
  "words-primary.js",
  "words-secondary.js",
  "words-college.js",
  "words-advanced.js",
  "words-expansion.js",
  "words-official.js"
];

const context = vm.createContext({ window: {} });
vocabularyFiles.forEach((file) => {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
});

const levels = context.window.WORD_LEVELS;
const warnings = context.window.VOCABULARY_WARNINGS;
const failures = [];
const seen = new Set();

if (!Array.isArray(levels) || levels.length !== 15) {
  failures.push("词库必须包含 15 个年级层级");
}
if (warnings.length > 0) {
  failures.push(...warnings);
}

levels.forEach((level, levelIndex) => {
  level.words.forEach(([word, meaning]) => {
    if (!/^[a-z]+$/.test(word)) failures.push(`${level.id} 包含非法拼写：${word}`);
    if (!meaning.trim()) failures.push(`${level.id} 的 ${word} 缺少中文释义`);
    if (seen.has(word)) failures.push(`重复词：${word}`);
    seen.add(word);
  });

  const eligibleWords = levels
    .slice(0, levelIndex + 1)
    .flatMap((item) => item.words.map(([word]) => word));
  const startingLetters = new Set(eligibleWords.map((word) => word[0]));
  const playableStarters = eligibleWords.filter((word) => startingLetters.has(word.at(-1)));
  if (playableStarters.length === 0) failures.push(`${level.id} 无法生成可继续的随机起始词`);

  const used = new Set([playableStarters[0]]);
  let current = playableStarters[0];
  for (let turn = 0; turn < 20; turn += 1) {
    const requiredLetter = current.at(-1);
    const hint = eligibleWords.find((word) => word[0] === requiredLetter && !used.has(word));
    if (!hint) break;
    if (!eligibleWords.includes(hint)) failures.push(`${level.id} 的提示词发生越级：${hint}`);
    used.add(hint);
    current = hint;
  }
});

const expectedMinimums = {
  "primary-6": 600,
  "junior-9": 850,
  "senior-3": 1200,
  "college-cet6": 1600
};

Object.entries(expectedMinimums).forEach(([levelId, minimum]) => {
  const levelIndex = levels.findIndex((level) => level.id === levelId);
  const count = levels.slice(0, levelIndex + 1).flatMap((level) => level.words).length;
  if (count < minimum) failures.push(`${levelId} 累计词量 ${count}，低于当前基线 ${minimum}`);
});

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  const total = levels.flatMap((level) => level.words).length;
  console.log(`Vocabulary verified: ${levels.length} levels, ${total} unique words.`);
}
