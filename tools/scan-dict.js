// tools/scan-dict.js
// Throwaway script: finds tokens in sentences.js + stories.js that getWordMeaning() cannot resolve.
// Run from the repo root: node tools/scan-dict.js

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// ---------- 1. Load the data files into a sandbox ----------
function loadData() {
  const sandbox = { window: {}, module: {}, console };
  sandbox.global = sandbox;
  vm.createContext(sandbox);

  const root = path.resolve(__dirname, "..");

  for (const rel of ["js/data/wordDict.js", "js/data/sentences.js", "js/data/stories.js"]) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) {
      console.error(`✗ Missing file: ${file}`);
      process.exit(1);
    }
    let code = fs.readFileSync(file, "utf8");
    
    // FIX: Top-level const doesn't attach to the sandbox global in Node's vm.
    // We append a line to manually assign the variables we need to the global scope.
    if (rel.includes("sentences.js")) code += "\n; global.sentencesData = sentencesData;";
    if (rel.includes("stories.js"))   code += "\n; global.sprintStories = sprintStories;";

    try {
      vm.runInContext(code, sandbox, { filename: rel });
    } catch (e) {
      console.error(`✗ Error evaluating ${rel}:`, e.message);
      process.exit(1);
    }
  }

  return {
    wordDict: sandbox.wordDict || sandbox.window.wordDict,
    sentencesData: sandbox.sentencesData,
    sprintStories: sandbox.sprintStories,
  };
}

// ---------- 2. Replicate getWordMeaning() from helpers.js ----------
// (Copy-paste of the production logic so this script tests the real thing.)
const PARTICLES = [
  "は","が","を","に","へ","で","と","も","か","よ","ね",
  "から","まで","より","くらい","ごろ","だけ","ほど","の","には","や",
];

function getWordMeaning(word, dict) {
  if (!dict) return null;
  let cleanWord = word.trim();
  if (!cleanWord) return null;

  if (dict[cleanWord]) return dict[cleanWord].meaning;

  let strippedWord = cleanWord.replace(/[（(][^）)]*[）)]/g, "").trim();
  if (strippedWord && dict[strippedWord]) return dict[strippedWord].meaning;

  for (const particle of PARTICLES) {
    if (cleanWord === particle || strippedWord === particle) {
      if (dict[particle]) return dict[particle].meaning;
    }
    if (cleanWord.endsWith(particle) && cleanWord.length > particle.length) {
      const base = cleanWord.slice(0, -particle.length);
      if (dict[base]) return dict[base].meaning;
      if (dict[cleanWord]) return dict[cleanWord].meaning;
    }
  }

  const suffixes = ["い","な","ます","です","した","て","た","る","う","く","む","ぶ","ぬ","ぐ","す"];
  for (const suffix of suffixes) {
    if (strippedWord.endsWith(suffix) && strippedWord.length > suffix.length) {
      const base = strippedWord.slice(0, -suffix.length);
      if (dict[base]) return dict[base].meaning;
      if (dict[base + "る"]) return dict[base + "る"].meaning;
    }
  }

  const verbStems = ["行き","見","食べ","飲み","読み","書き","聞き","話し","買い","売り","作り","使い","待ち","持ち","渡し","曲がり","止まり","入り","出","上がり","下がり","寝","起き","浴び","磨き","洗い","泳ぎ","走り","飛び","立ち","座り","知り","教え","習い","見せ","弾き","引き"];
  for (const stem of verbStems) {
    if (strippedWord === stem || cleanWord === stem) {
      if (dict[stem + "る"]) return dict[stem + "る"].meaning;
      if (dict[stem + "く"]) return dict[stem + "く"].meaning;
      if (dict[stem + "う"]) return dict[stem + "う"].meaning;
    }
  }

  // Prefix/suffix match (the tightened version from the helpers.js fix)
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (key.length > 1 &&
        (strippedWord.startsWith(key) || strippedWord.endsWith(key) ||
         cleanWord.startsWith(key) || cleanWord.endsWith(key))) {
      return dict[key].meaning;
    }
  }

  const numbers = ["一","二","三","四","五","六","七","八","九","十","百","千","万"];
  for (const num of numbers) {
    if (strippedWord === num || cleanWord === num) {
      if (dict[num]) return dict[num].meaning;
    }
  }

  return null;
}

// ---------- 3. Collect tokens ----------
function tokenize(text) {
  if (!text) return [];
  return text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function scan() {
  const { wordDict, sentencesData, sprintStories } = loadData();

  if (!wordDict) { console.error("✗ wordDict not found"); process.exit(1); }
  if (!sentencesData) { console.error("✗ sentencesData not found"); process.exit(1); }
  if (!sprintStories) { console.error("✗ sprintStories not found"); process.exit(1); }

  console.log(`Loaded: ${Object.keys(wordDict).length} dict entries, ${sentencesData.length} sentences, ${sprintStories.length} stories\n`);

  // token → { count, sources:Set }
  const misses = new Map();
  let totalTokens = 0;
  let resolvedTokens = 0;

  const record = (text, source) => {
    for (const tok of tokenize(text)) {
      totalTokens++;
      const meaning = getWordMeaning(tok, wordDict);
      if (meaning) {
        resolvedTokens++;
      } else {
        const entry = misses.get(tok) || { count: 0, sources: new Set() };
        entry.count++;
        entry.sources.add(source);
        misses.set(tok, entry);
      }
    }
  };

  sentencesData.forEach((s, i) => record(s.jp, `sentence#${i + 1}`));
  sprintStories.forEach((s, i) => record(s.storyJp, `story#${i + 1}`));

  const pct = ((resolvedTokens / totalTokens) * 100).toFixed(1);
  console.log(`Tokens scanned:  ${totalTokens}`);
  console.log(`Resolved:        ${resolvedTokens} (${pct}%)`);
  console.log(`Missed (unique): ${misses.size}`);
  console.log(`Missed (total):  ${totalTokens - resolvedTokens}\n`);

  if (misses.size === 0) {
    console.log("🎉 No missing tokens. wordDict covers everything.");
    return;
  }

  // Sort by frequency desc, then alphabetically for stable output
  const sorted = [...misses.entries()].sort(
    (a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0])
  );

  console.log("=== MISSING TOKENS (sorted by frequency) ===");
  console.log("count  token                         sample source");
  console.log("-----  ----------------------------  -----------------");
  for (const [tok, info] of sorted) {
    const count = String(info.count).padStart(5);
    const displayTok = tok.length > 28 ? tok.slice(0, 27) + "…" : tok;
    const sample = [...info.sources][0];
    console.log(`${count}  ${displayTok.padEnd(28)}  ${sample}`);
  }

  // Optional: emit a ready-to-paste stub block
  const top = sorted.slice(0, 50);
  console.log("\n=== TOP 50 — PASTE INTO wordDict.js ===");
  console.log("// ===== ADDED FROM SCAN =====");
  for (const [tok, info] of top) {
    const key = /[^\u4e00-\u9faf\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\u3000-\u303f\uff00-\uffef〜～]/.test(tok)
      ? JSON.stringify(tok)
      : tok;
    console.log(
      `  ${key}: { reading: ${JSON.stringify(tok.replace(/[（(][^）)]*[）)]/g, ""))}, meaning: "TODO", category: "TODO" }, // ×${info.count}`
    );
  }
  console.log("// ===== END ADDED =====");
}

scan();