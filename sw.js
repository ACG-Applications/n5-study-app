// sw.js - Service Worker for N5 Study App

const CACHE_NAME = "n5-study-app-v3";

const urlsToCache = [
  // ─── HTML pages ────────────────────────────────────────────
  "./",
  "./index.html",
  "./sentence-builder.html",
  "./story-quiz.html",
  "./word-search.html",
  "./directions.html",
  "./particles.html",
  "./verbs.html",
  "./adjectives.html",
  "./adverbs.html",
  "./grammar.html",
  "./kanji.html",
  "./listening.html",
  "./practice-test.html",
  "./manifest.json",
  "./favicon.ico",

  // ─── App icons (PWA) ───────────────────────────────────────
  "./images/icons/icon-48x48.png",
  "./images/icons/icon-72x72.png",
  "./images/icons/icon-96x96.png",
  "./images/icons/icon-144x144.png",
  "./images/icons/icon-192x192.png",
  "./images/icons/icon-512x512.png",

  // ─── CSS ────────────────────────────────────────────────────
  "./css/variables.css",
  "./css/components.css",
  "./css/style.css",
  "./css/learn.css",
  "./css/sentenceBuilder.css",
  "./css/listening.css",
  "./css/story-quiz.css",
  "./css/particles.css",
  "./css/verbs.css",
  "./css/adjectives.css",
  "./css/adverbs.css",
  "./css/grammar.css",
  "./css/kanji.css",
  "./css/practice-test.css",
  "./css/kana-helper.css",
  "./css/kanji-helper.css",
  "./css/kanji-stroke.css",

  // ─── JS Data ────────────────────────────────────────────────
  "./js/data/sprints.js",
  "./js/data/sentences.js",
  "./js/data/stories.js",
  "./js/data/storyQuizData.js",
  "./js/data/wordDict.js",
  "./js/data/mastered.js",
  "./js/data/adjectivesData.js",
  "./js/data/adverbsData.js",
  "./js/data/grammarData.js",
  "./js/data/kanjiData.js",
  "./js/data/particlesData.js",
  "./js/data/practiceTestData.js",
  "./js/data/verbsData.js",
  "./js/data/video_list.js",

  // ─── JS Utils ───────────────────────────────────────────────
  "./js/utils/furigana.js",
  "./js/utils/helpers.js",
  "./js/utils/kanaHelper.js",
  "./js/utils/particleExtractor.js",

  // ─── JS Managers ────────────────────────────────────────────
  "./js/managers/masteryManager.js",

  // ─── JS Modules ─────────────────────────────────────────────
  "./js/modules/audio.js",
  "./js/modules/globalSearch.js",
  "./js/modules/sentenceBuilder.js",
  "./js/modules/flashcards.js",
  "./js/modules/vocab.js",
  "./js/modules/storyMode.js",
  "./js/modules/story-quiz.js",
  "./js/modules/print.js",
  "./js/modules/ui.js",
  "./js/modules/mastered.js",
  "./js/modules/kanji-stroke.js",
  "./js/modules/kanji-helper.js",
  "./js/modules/adjectives.js",
  "./js/modules/adverbs.js",
  "./js/modules/grammar.js",
  "./js/modules/kanji.js",
  "./js/modules/listening.js",
  "./js/modules/particles.js",
  "./js/modules/practiceTest.js",
  "./js/modules/verbs.js",
];

// ─── Install ─────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Pre-caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      const fetchRequest = event.request.clone();
      return fetch(fetchRequest)
        .then((response) => {
          // Don't cache non-OK or cross-origin (opaque) responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch((err) => {
          console.warn("[SW] Fetch failed for:", event.request.url, err);
          // No cached copy and network unavailable — let the browser show
          // its default offline error for this resource.
          return new Response("", { status: 504, statusText: "Offline" });
        });
    })
  );
});