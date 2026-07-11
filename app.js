(() => {
  "use strict";

  const LEVELS = window.WORD_LEVELS || [];
  const RULES = window.WORD_CHAIN_RULES;
  const SAVES_KEY = "word-chain-game-saves-v1";
  const LAST_LEVEL_KEY = "word-chain-last-level-v1";
  const DEFAULT_LEVEL_ID = "junior-7";
  const ALL_WORDS = LEVELS.flatMap((level) =>
    level.words.map(([word, meaning]) => ({
      word: RULES.normalizeWord(word),
      meaning,
      levelId: level.id
    }))
  );
  const ALL_WORD_MAP = new Map(ALL_WORDS.map((entry) => [entry.word, entry]));

  const elements = {
    setupView: document.querySelector("#setup-view"),
    gameView: document.querySelector("#game-view"),
    setupLevelSelect: document.querySelector("#setup-level-select"),
    gameLevelSelect: document.querySelector("#game-level-select"),
    setupLevelNote: document.querySelector("#setup-level-note"),
    startGameButton: document.querySelector("#start-game-button"),
    newGameButton: document.querySelector("#new-game-button"),
    saveGameButton: document.querySelector("#save-game-button"),
    openArchiveButton: document.querySelector("#open-archive-button"),
    saveCount: document.querySelector("#save-count"),
    chainCount: document.querySelector("#chain-count"),
    libraryCount: document.querySelector("#library-count"),
    currentWord: document.querySelector("#current-word"),
    currentMeaning: document.querySelector("#current-meaning"),
    requiredLetter: document.querySelector("#required-letter"),
    inputLetter: document.querySelector("#input-letter"),
    wordForm: document.querySelector("#word-form"),
    wordInput: document.querySelector("#word-input"),
    wordInputWrap: document.querySelector("#word-input-wrap"),
    submitButton: document.querySelector(".submit-button"),
    feedbackMessage: document.querySelector("#feedback-message"),
    hintTrigger: document.querySelector("#hint-trigger"),
    hintPanel: document.querySelector("#hint-panel"),
    meaningHintTab: document.querySelector("#meaning-hint-tab"),
    letterHintTab: document.querySelector("#letter-hint-tab"),
    hintContent: document.querySelector("#hint-content"),
    revealLetterButton: document.querySelector("#reveal-letter-button"),
    chainList: document.querySelector("#chain-list"),
    chainEmptySpace: document.querySelector("#chain-empty-space"),
    activeLevelPill: document.querySelector("#active-level-pill"),
    saveDialog: document.querySelector("#save-dialog"),
    saveForm: document.querySelector("#save-form"),
    saveNameInput: document.querySelector("#save-name-input"),
    savePreviewLevel: document.querySelector("#save-preview-level"),
    savePreviewCount: document.querySelector("#save-preview-count"),
    archiveDialog: document.querySelector("#archive-dialog"),
    closeArchiveButton: document.querySelector("#close-archive-button"),
    archiveList: document.querySelector("#archive-list"),
    archiveItemTemplate: document.querySelector("#archive-item-template"),
    toast: document.querySelector("#toast"),
    toastMessage: document.querySelector("#toast-message")
  };

  let game = null;
  let hint = createEmptyHint();
  let toastTimer = null;

  function createEmptyHint() {
    return {
      target: null,
      mode: "meaning",
      revealedLetters: 1
    };
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `game-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getLevel(levelId) {
    return LEVELS.find((level) => level.id === levelId) || LEVELS[0];
  }

  function getLevelWords(levelId) {
    return ALL_WORDS.filter((entry) => entry.levelId === levelId);
  }

  function getHintLevelOrder(levelId) {
    return RULES.getLevelOrder(LEVELS, levelId);
  }

  function getLastLetter(word) {
    return word.slice(-1).toLowerCase();
  }

  function getRequiredLetter() {
    if (!game || game.chain.length === 0) return "";
    return getLastLetter(game.chain[game.chain.length - 1].word);
  }

  function getUnusedCandidates(excludedWords = new Set()) {
    if (!game) return [];
    const requiredLetter = getRequiredLetter();
    const usedWords = new Set(game.chain.map((item) => item.word));
    excludedWords.forEach((word) => usedWords.add(word));
    return RULES.getHintCandidates({
      words: ALL_WORDS,
      requiredLetter,
      usedWords,
      levelOrder: getHintLevelOrder(game.levelId)
    });
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function chooseStarter(levelId) {
    const playableWords = (words) =>
      words.filter((entry) =>
        ALL_WORDS.some(
          (candidate) => candidate.word !== entry.word && candidate.word.startsWith(getLastLetter(entry.word))
        )
      );

    for (const candidateLevelId of getHintLevelOrder(levelId)) {
      const starters = playableWords(getLevelWords(candidateLevelId));
      if (starters.length > 0) return pickRandom(starters);
    }

    return pickRandom(ALL_WORDS);
  }

  function populateLevelSelect(select) {
    select.innerHTML = "";
    const groups = new Map();

    LEVELS.forEach((level) => {
      if (!groups.has(level.group)) {
        const optgroup = document.createElement("optgroup");
        optgroup.label = level.group;
        groups.set(level.group, optgroup);
        select.append(optgroup);
      }

      const option = document.createElement("option");
      option.value = level.id;
      option.textContent = level.name;
      groups.get(level.group).append(option);
    });
  }

  function getStoredLevelId() {
    try {
      const stored = localStorage.getItem(LAST_LEVEL_KEY);
      if (stored && LEVELS.some((level) => level.id === stored)) return stored;
    } catch (error) {
      console.warn("无法读取上次选择的年级", error);
    }
    return LEVELS.some((level) => level.id === DEFAULT_LEVEL_ID) ? DEFAULT_LEVEL_ID : LEVELS[0]?.id;
  }

  function storeLevelId(levelId) {
    try {
      localStorage.setItem(LAST_LEVEL_KEY, levelId);
    } catch (error) {
      console.warn("无法保存年级选择", error);
    }
  }

  function updateSetupNote() {
    const levelId = elements.setupLevelSelect.value;
    const level = getLevel(levelId);
    elements.setupLevelNote.textContent = `${level.note} · 本年级 ${level.words.length} 个提示词`;
  }

  function syncLevelSelects(levelId) {
    elements.setupLevelSelect.value = levelId;
    elements.gameLevelSelect.value = levelId;
    updateSetupNote();
  }

  function startGame(levelId) {
    const level = getLevel(levelId);
    const starter = chooseStarter(level.id);
    const now = new Date().toISOString();

    game = {
      id: createId(),
      archiveId: null,
      levelId: level.id,
      chain: [{ ...starter, source: "system" }],
      createdAt: now,
      updatedAt: now,
      finished: false
    };

    hint = createEmptyHint();
    storeLevelId(level.id);
    syncLevelSelects(level.id);
    elements.setupView.hidden = true;
    elements.gameView.hidden = false;
    elements.saveGameButton.disabled = false;
    renderGame();
    window.requestAnimationFrame(() => elements.wordInput.focus());
  }

  function showSetup() {
    elements.setupView.hidden = false;
    elements.gameView.hidden = true;
    elements.saveGameButton.disabled = true;
    game = null;
    hint = createEmptyHint();
    updateSetupNote();
  }

  function renderGame() {
    if (!game) return;

    const level = getLevel(game.levelId);
    const current = game.chain[game.chain.length - 1];
    const requiredLetter = getRequiredLetter();
    const candidates = getUnusedCandidates();

    game.finished = false;
    elements.currentWord.textContent = current.word;
    elements.currentMeaning.textContent = current.meaning;
    elements.requiredLetter.textContent = requiredLetter.toUpperCase();
    elements.inputLetter.textContent = requiredLetter.toUpperCase();
    elements.wordInput.placeholder = "输入完整单词";
    elements.wordInput.disabled = false;
    elements.submitButton.disabled = false;
    elements.hintTrigger.disabled = candidates.length === 0;
    elements.chainCount.textContent = String(game.chain.length);
    elements.libraryCount.textContent = String(getLevelWords(game.levelId).length);
    elements.activeLevelPill.textContent = level.name;
    elements.gameLevelSelect.value = game.levelId;
    elements.savePreviewLevel.textContent = level.name;
    elements.savePreviewCount.textContent = String(game.chain.length);

    renderChain();
    resetInputState();

    if (candidates.length === 0) {
      closeHint();
      setFeedback("暂时没有可用提示词，你仍然可以输入自己想到的词。", "neutral");
    } else {
      setFeedback(`词尾是 ${requiredLetter.toUpperCase()}，输入一个同字母开头且未用过的词。`, "neutral");
    }
  }

  function renderChain() {
    elements.chainList.innerHTML = "";

    game.chain.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.className = "chain-item";
      if (item.source === "system") listItem.classList.add("is-system");
      if (index === game.chain.length - 1) listItem.classList.add("is-latest");

      const indexNode = document.createElement("span");
      indexNode.className = "chain-index";
      indexNode.textContent = String(index + 1).padStart(2, "0");

      const wordNode = document.createElement("div");
      wordNode.className = "chain-word";
      const word = document.createElement("strong");
      word.textContent = item.word;
      const meaning = document.createElement("span");
      meaning.textContent = item.source === "system" ? `${item.meaning} · 系统起始词` : item.meaning;
      wordNode.append(word, meaning);

      const letter = document.createElement("span");
      letter.className = "chain-link-letter";
      letter.textContent = getLastLetter(item.word);
      letter.title = `下一个词需以 ${getLastLetter(item.word).toUpperCase()} 开头`;

      listItem.append(indexNode, wordNode, letter);
      elements.chainList.append(listItem);
    });

    elements.chainEmptySpace.hidden = game.chain.length >= 5;
    window.requestAnimationFrame(() => {
      elements.chainList.scrollTop = elements.chainList.scrollHeight;
    });
  }

  function resetInputState() {
    elements.wordInputWrap.classList.remove("is-error", "is-success");
    elements.feedbackMessage.classList.remove("is-error", "is-success");
  }

  function setFeedback(message, type) {
    elements.feedbackMessage.textContent = message;
    elements.feedbackMessage.classList.toggle("is-error", type === "error");
    elements.feedbackMessage.classList.toggle("is-success", type === "success");
    elements.wordInputWrap.classList.toggle("is-error", type === "error");
    elements.wordInputWrap.classList.toggle("is-success", type === "success");
  }

  function rejectWord(message) {
    setFeedback(message, "error");
    elements.wordInput.select();
  }

  function submitWord(event) {
    event.preventDefault();
    if (!game) return;

    const requiredLetter = getRequiredLetter();
    const usedWords = new Set(game.chain.map((item) => item.word));
    const validation = RULES.validateWord({
      value: elements.wordInput.value,
      requiredLetter,
      usedWords,
      wordMap: ALL_WORD_MAP
    });
    const word = validation.word;

    if (validation.code === "empty") {
      rejectWord("先写下一个单词吧。");
      return;
    }
    if (validation.code === "invalid-characters") {
      rejectWord("这里只输入英文字母，不需要空格或标点。");
      return;
    }
    if (validation.code === "wrong-letter") {
      rejectWord(`这个词要以 ${requiredLetter.toUpperCase()} 开头。`);
      return;
    }
    if (validation.code === "duplicate") {
      rejectWord(`“${word}”已经在本局出现过，换一个词吧。`);
      return;
    }
    if (validation.code === "unknown-word") {
      rejectWord(`没有查到“${word}”，请检查单词拼写。`);
      return;
    }
    const entry = validation.entry;
    game.chain.push({ ...entry, source: "user" });
    game.updatedAt = new Date().toISOString();
    hint = createEmptyHint();
    elements.wordInput.value = "";
    closeHint();
    renderGame();

    setFeedback(`接得好！“${word}”已加入词链。`, "success");
    elements.wordInput.focus();
  }

  function ensureHintTarget() {
    if (hint.target) return hint.target;
    const candidates = getUnusedCandidates();
    hint.target = candidates.length > 0 ? pickRandom(candidates) : null;
    hint.revealedLetters = 1;
    return hint.target;
  }

  function openHint() {
    if (!game) return;
    const target = ensureHintTarget();
    if (!target) {
      setFeedback("当前没有可用提示词，你仍然可以继续接龙。", "neutral");
      return;
    }
    elements.hintPanel.hidden = false;
    elements.hintTrigger.querySelector("span").textContent = "换一个提示词";
    renderHint();
  }

  function closeHint() {
    elements.hintPanel.hidden = true;
    elements.hintTrigger.querySelector("span").textContent = "给我一点提示";
  }

  function switchHintMode(mode) {
    hint.mode = mode;
    elements.meaningHintTab.classList.toggle("is-active", mode === "meaning");
    elements.letterHintTab.classList.toggle("is-active", mode === "letters");
    elements.meaningHintTab.setAttribute("aria-pressed", String(mode === "meaning"));
    elements.letterHintTab.setAttribute("aria-pressed", String(mode === "letters"));
    renderHint();
  }

  function renderHint() {
    const target = ensureHintTarget();
    if (!target) return;

    elements.hintContent.innerHTML = "";
    if (hint.mode === "meaning") {
      const meaningText = document.createElement("span");
      meaningText.textContent = `中文意思：${target.meaning}（共 ${target.word.length} 个字母）`;
      elements.hintContent.append(meaningText);
      elements.revealLetterButton.hidden = true;
      return;
    }

    const pattern = document.createElement("div");
    pattern.className = "hint-pattern";
    [...target.word].forEach((letter, index) => {
      const cell = document.createElement("span");
      cell.textContent = index < hint.revealedLetters ? letter : "";
      pattern.append(cell);
    });
    elements.hintContent.append(pattern);

    const allRevealed = hint.revealedLetters >= target.word.length;
    elements.revealLetterButton.hidden = allRevealed;
    elements.revealLetterButton.textContent =
      hint.revealedLetters === target.word.length - 1 ? "显示完整拼写" : "再揭一个字母";
  }

  function revealNextLetter() {
    if (!hint.target) return;
    hint.revealedLetters = Math.min(hint.revealedLetters + 1, hint.target.word.length);
    renderHint();
  }

  function replaceHintTarget() {
    const alternatives = getUnusedCandidates(new Set(hint.target ? [hint.target.word] : []));
    if (alternatives.length === 0) return;

    hint.target = pickRandom(alternatives);
    hint.revealedLetters = 1;
    elements.hintPanel.hidden = false;
    renderHint();
  }

  function requestNewGame() {
    if (!game) {
      showSetup();
      return;
    }

    const shouldRestart =
      game.chain.length <= 1 || window.confirm("开始新游戏后，当前未保存的进度会清空。继续吗？");
    if (shouldRestart) startGame(game.levelId);
  }

  function changeGameLevel(event) {
    if (!game) return;
    const nextLevelId = event.target.value;
    if (nextLevelId === game.levelId) return;

    const shouldChange =
      game.chain.length <= 1 || window.confirm("切换年级会开始一局新游戏。继续吗？");

    if (shouldChange) {
      startGame(nextLevelId);
    } else {
      elements.gameLevelSelect.value = game.levelId;
    }
  }

  function loadSaves() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVES_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(isValidSave) : [];
    } catch (error) {
      console.warn("无法读取游戏档案", error);
      return [];
    }
  }

  function isValidSave(save) {
    return Boolean(
      save &&
        typeof save.id === "string" &&
        typeof save.name === "string" &&
        LEVELS.some((level) => level.id === save.levelId) &&
        Array.isArray(save.chain) &&
        save.chain.length > 0 &&
        save.chain.every((item) => typeof item.word === "string" && typeof item.meaning === "string")
    );
  }

  function writeSaves(saves) {
    try {
      localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
      updateSaveCount();
      return true;
    } catch (error) {
      console.error("无法写入游戏档案", error);
      showToast("保存失败，请检查浏览器存储权限");
      return false;
    }
  }

  function updateSaveCount() {
    elements.saveCount.textContent = String(loadSaves().length);
  }

  function makeDefaultSaveName() {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    return `${getLevel(game.levelId).name} · ${formatter.format(new Date())}`;
  }

  function openSaveDialog() {
    if (!game) return;
    elements.saveNameInput.value = makeDefaultSaveName();
    elements.savePreviewLevel.textContent = getLevel(game.levelId).name;
    elements.savePreviewCount.textContent = String(game.chain.length);
    elements.saveDialog.showModal();
    window.requestAnimationFrame(() => elements.saveNameInput.select());
  }

  function handleSaveForm(event) {
    event.preventDefault();
    if (event.submitter?.value === "cancel") {
      elements.saveDialog.close();
      return;
    }

    const name = elements.saveNameInput.value.trim();
    if (!name) {
      elements.saveNameInput.focus();
      return;
    }

    const saves = loadSaves();
    const saveId = game.archiveId || createId();
    const now = new Date().toISOString();
    const snapshot = {
      id: saveId,
      name,
      levelId: game.levelId,
      chain: game.chain.map((item) => ({ ...item })),
      createdAt: game.createdAt,
      savedAt: now
    };

    const existingIndex = saves.findIndex((save) => save.id === saveId);
    if (existingIndex >= 0) {
      saves[existingIndex] = snapshot;
    } else {
      saves.unshift(snapshot);
    }

    if (writeSaves(saves)) {
      game.archiveId = saveId;
      elements.saveDialog.close();
      showToast(existingIndex >= 0 ? "档案已更新" : "本局已保存");
    }
  }

  function openArchive() {
    renderArchive();
    elements.archiveDialog.showModal();
  }

  function renderArchive() {
    const saves = loadSaves().sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    elements.archiveList.innerHTML = "";

    if (saves.length === 0) {
      const empty = document.createElement("div");
      empty.className = "archive-empty";
      empty.innerHTML = `
        <svg class="icon" aria-hidden="true"><use href="#icon-folder"></use></svg>
        <strong>还没有游戏档案</strong>
        <p>完成几个单词后，就可以把本局保存到这里。</p>
      `;
      elements.archiveList.append(empty);
      return;
    }

    saves.forEach((save) => {
      const fragment = elements.archiveItemTemplate.content.cloneNode(true);
      const item = fragment.querySelector(".archive-item");
      item.dataset.saveId = save.id;
      fragment.querySelector(".archive-level").textContent = getLevel(save.levelId).name;
      fragment.querySelector(".archive-name").textContent = save.name;
      fragment.querySelector(".archive-meta").textContent = `${save.chain.length} 个词 · ${formatSaveTime(save.savedAt)}`;
      fragment.querySelector(".archive-chain-preview").textContent = save.chain
        .slice(-5)
        .map((entry) => entry.word)
        .join("  →  ");
      fragment.querySelector(".resume-save-button").addEventListener("click", () => resumeSave(save.id));
      fragment.querySelector(".delete-save-button").addEventListener("click", () => deleteSave(save.id));
      elements.archiveList.append(fragment);
    });
  }

  function formatSaveTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "时间未知";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  function resumeSave(saveId) {
    const save = loadSaves().find((item) => item.id === saveId);
    if (!save) {
      showToast("这个档案已经不存在了");
      renderArchive();
      return;
    }

    game = {
      id: createId(),
      archiveId: save.id,
      levelId: save.levelId,
      chain: save.chain.map((item, index) => ({
        ...item,
        source: item.source || (index === 0 ? "system" : "user")
      })),
      createdAt: save.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finished: false
    };
    hint = createEmptyHint();
    storeLevelId(game.levelId);
    syncLevelSelects(game.levelId);
    elements.setupView.hidden = true;
    elements.gameView.hidden = false;
    elements.saveGameButton.disabled = false;
    elements.archiveDialog.close();
    closeHint();
    renderGame();
    showToast(`已载入“${save.name}”`);
    elements.wordInput.focus();
  }

  function deleteSave(saveId) {
    const saves = loadSaves();
    const target = saves.find((save) => save.id === saveId);
    if (!target) return;
    if (!window.confirm(`确定删除档案“${target.name}”吗？`)) return;

    const nextSaves = saves.filter((save) => save.id !== saveId);
    if (writeSaves(nextSaves)) {
      if (game?.archiveId === saveId) game.archiveId = null;
      renderArchive();
      showToast("档案已删除");
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toastMessage.textContent = message;
    elements.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
  }

  function initialize() {
    if (LEVELS.length === 0) {
      document.body.textContent = "词库加载失败，请刷新页面重试。";
      return;
    }

    populateLevelSelect(elements.setupLevelSelect);
    populateLevelSelect(elements.gameLevelSelect);
    const initialLevelId = getStoredLevelId();
    syncLevelSelects(initialLevelId);
    updateSaveCount();

    elements.setupLevelSelect.addEventListener("change", () => {
      storeLevelId(elements.setupLevelSelect.value);
      updateSetupNote();
    });
    elements.gameLevelSelect.addEventListener("change", changeGameLevel);
    elements.startGameButton.addEventListener("click", () => startGame(elements.setupLevelSelect.value));
    elements.newGameButton.addEventListener("click", requestNewGame);
    elements.saveGameButton.addEventListener("click", openSaveDialog);
    elements.openArchiveButton.addEventListener("click", openArchive);
    elements.closeArchiveButton.addEventListener("click", () => elements.archiveDialog.close());
    elements.wordForm.addEventListener("submit", submitWord);
    elements.wordInput.addEventListener("input", resetInputState);
    elements.hintTrigger.addEventListener("click", () => {
      if (elements.hintPanel.hidden) openHint();
      else replaceHintTarget();
    });
    elements.meaningHintTab.addEventListener("click", () => switchHintMode("meaning"));
    elements.letterHintTab.addEventListener("click", () => switchHintMode("letters"));
    elements.revealLetterButton.addEventListener("click", revealNextLetter);
    elements.saveForm.addEventListener("submit", handleSaveForm);

    [elements.saveDialog, elements.archiveDialog].forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });
  }

  window.__WORD_CHAIN__ = {
    getState: () => (game ? JSON.parse(JSON.stringify(game)) : null),
    getAllWords: () => ALL_WORDS.map((entry) => ({ ...entry })),
    getHintLevelOrder,
    getUnusedCandidates,
    startGame,
    loadSaves
  };

  initialize();
})();
