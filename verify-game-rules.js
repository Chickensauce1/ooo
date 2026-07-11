const assert = require("assert");
const rules = require("./game-rules.js");

const words = [
  { word: "apple", meaning: "苹果", levelId: "primary-1" },
  { word: "egg", meaning: "鸡蛋", levelId: "primary-1" },
  { word: "earth", meaning: "地球", levelId: "primary-5" }
];
const wordMap = new Map(words.map((entry) => [entry.word, entry]));

assert.strictEqual(rules.normalizeWord("  Apple "), "apple");
assert.strictEqual(
  rules.validateWord({ value: "", requiredLetter: "e", usedWords: new Set(), wordMap }).code,
  "empty"
);
assert.strictEqual(
  rules.validateWord({ value: "e-mail", requiredLetter: "e", usedWords: new Set(), wordMap }).code,
  "invalid-characters"
);
assert.strictEqual(
  rules.validateWord({ value: "apple", requiredLetter: "e", usedWords: new Set(), wordMap }).code,
  "wrong-letter"
);
assert.strictEqual(
  rules.validateWord({ value: "egg", requiredLetter: "e", usedWords: new Set(["egg"]), wordMap }).code,
  "duplicate"
);
const misspelledWord = rules.validateWord({
  value: "eartth",
  requiredLetter: "e",
  usedWords: new Set(),
  wordMap
});
assert.strictEqual(misspelledWord.ok, false);
assert.strictEqual(misspelledWord.code, "unknown-word");

const accepted = rules.validateWord({
  value: " Earth ",
  requiredLetter: "e",
  usedWords: new Set(["apple"]),
  wordMap
});
assert.strictEqual(accepted.ok, true);
assert.strictEqual(accepted.entry.levelId, "primary-5");

const hints = rules.getHintCandidates({
  words: words.slice(0, 2),
  requiredLetter: "e",
  usedWords: new Set(["apple"])
});
assert.deepStrictEqual(hints.map((entry) => entry.word), ["egg"]);

const levels = [
  { id: "primary-5", group: "primary" },
  { id: "primary-6", group: "primary" },
  { id: "junior-7", group: "junior" },
  { id: "junior-8", group: "junior" },
  { id: "junior-9", group: "junior" }
];
assert.deepStrictEqual(rules.getLevelOrder(levels, "junior-7"), [
  "junior-7",
  "junior-8",
  "primary-6",
  "junior-9",
  "primary-5"
]);

const prioritizedHints = [
  { word: "earth", meaning: "地球", levelId: "primary-5" },
  { word: "eagle", meaning: "鹰", levelId: "primary-6" },
  { word: "easy", meaning: "容易的", levelId: "junior-7" },
  { word: "event", meaning: "事件", levelId: "junior-8" }
];
assert.deepStrictEqual(
  rules
    .getHintCandidates({
      words: prioritizedHints,
      requiredLetter: "e",
      usedWords: new Set(),
      levelOrder: rules.getLevelOrder(levels, "junior-7")
    })
    .map((entry) => entry.word),
  ["easy"]
);
assert.deepStrictEqual(
  rules
    .getHintCandidates({
      words: prioritizedHints,
      requiredLetter: "e",
      usedWords: new Set(["easy"]),
      levelOrder: rules.getLevelOrder(levels, "junior-7")
    })
    .map((entry) => entry.word),
  ["event"]
);

console.log("Game rules verified: spelling validation, cross-level words, and prioritized hints.");
