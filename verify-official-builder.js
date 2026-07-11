const assert = require("assert");
const {
  parseCsvLine,
  parseCsv,
  normalizeGloss,
  classifyRecord,
  buildPacks,
  renderPacks
} = require("./build-official-vocabulary.js");

assert.deepStrictEqual(parseCsvLine('word,"a, b","c""d"'), ["word", "a, b", 'c"d']);
assert.strictEqual(normalizeGloss("[网络] 苹果; apple tree"), "苹果");
assert.strictEqual(classifyRecord({ tag: "zk gk cet4" }), "junior");

const csv = [
  "word,translation,tag,bnc,frq",
  "alpha,阿尔法,xx,10,10",
  "bravo,勇敢的,xx,20,20",
  "campus,校园,zk,30,30",
  "debate,辩论,gk,40,40",
  "finance,金融,cet4,50,50",
  "coherent,连贯的,cet6,60,60",
  "two words,短语,cet4,70,70",
  "englishonly,english only,cet4,80,80"
].join("\n");
const packs = buildPacks(parseCsv(csv), new Set(["alpha"]));

assert.strictEqual(Object.values(packs).flat().length, 5);
assert.strictEqual(packs["primary-1"][0][0], "bravo");
assert.strictEqual(packs["junior-7"][0][0], "campus");
assert.strictEqual(packs["senior-1"][0][0], "debate");
assert.strictEqual(packs["college-basic"][0][0], "finance");
assert.strictEqual(packs["college-cet6"][0][0], "coherent");

const rendered = renderPacks(packs, { source: "test" });
assert.ok(rendered.includes("window.addVocabularyPack"));
assert.ok(rendered.includes('"source":"test"'));

console.log("Official vocabulary builder verified: CSV, tags, ranking, filtering, and rendering.");
