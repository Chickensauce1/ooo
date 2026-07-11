(function exposeWordChainRules(root) {
  "use strict";

  function normalizeWord(value) {
    return String(value || "").trim().toLowerCase();
  }

  function validateWord({ value, requiredLetter, usedWords, wordMap }) {
    const word = normalizeWord(value);
    if (!word) return { ok: false, code: "empty", word };
    if (!/^[a-z]+$/.test(word)) return { ok: false, code: "invalid-characters", word };
    if (!word.startsWith(requiredLetter)) return { ok: false, code: "wrong-letter", word };
    if (usedWords.has(word)) return { ok: false, code: "duplicate", word };
    if (!wordMap.has(word)) return { ok: false, code: "unknown-word", word };
    return { ok: true, code: "accepted", word, entry: wordMap.get(word) };
  }

  function getLevelOrder(levels, levelId) {
    const currentIndex = levels.findIndex((level) => level.id === levelId);
    if (currentIndex < 0) return levels.map((level) => level.id);

    const currentGroup = levels[currentIndex].group;
    return levels
      .map((level, index) => ({ level, index }))
      .sort((left, right) => {
        const distance = Math.abs(left.index - currentIndex) - Math.abs(right.index - currentIndex);
        if (distance !== 0) return distance;

        const leftMatchesGroup = left.level.group === currentGroup ? 0 : 1;
        const rightMatchesGroup = right.level.group === currentGroup ? 0 : 1;
        if (leftMatchesGroup !== rightMatchesGroup) return leftMatchesGroup - rightMatchesGroup;
        return left.index - right.index;
      })
      .map(({ level }) => level.id);
  }

  function getHintCandidates({ words, requiredLetter, usedWords, levelOrder }) {
    const candidates = words.filter(
      (entry) => entry.word.startsWith(requiredLetter) && !usedWords.has(entry.word)
    );
    if (!levelOrder) return candidates;

    for (const levelId of levelOrder) {
      const preferredCandidates = candidates.filter((entry) => entry.levelId === levelId);
      if (preferredCandidates.length > 0) return preferredCandidates;
    }

    return candidates;
  }

  const api = { normalizeWord, validateWord, getLevelOrder, getHintCandidates };
  root.WORD_CHAIN_RULES = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
