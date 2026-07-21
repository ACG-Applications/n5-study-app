// sw.js - Service Worker for N5 Study App

const CACHE_NAME = "n5-study-app-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./sentence-builder.html",
  "./manifest.json",
  // CSS files
  "./css/variables.css",
  "./css/style.css",
  "./css/sentenceBuilder.css",
  "./css/listening.css",
  "./css/kana-helper.css",
  "./css/kanji-helper.css",
  // JS Data files
  "./js/data/sprints.js",
  "./js/data/sentences.js",
  "./js/data/stories.js",
  "./js/data/wordDict.js",
  "./js/data/adjectivesData.js",
  "./js/data/adverbsData.js",
  "./js/data/grammarData.js",
  "./js/data/kanjiData.js",
  "./js/data/particles.js",
  "./js/data/particlesData.js",
  "./js/data/practiceTestData.js",
  "./js/data/verbsData.js",
  "./js/data/video_list.js",
  // JS Utils
  "./js/utils/furigana.js",
  "./js/utils/helpers.js",
  "./js/utils/kanaHelper.js",
  "./js/utils/tooltips.js",
  "./js/utils/particleExtractor.js",
  // JS Managers
  "./js/managers/masteryManager.js",
  // JS Modules
  "./js/modules/audio.js",
  "./js/modules/sentenceBuilder.js",
  "./js/modules/flashcards.js",
  "./js/modules/storyMode.js",
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

// Install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate and clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch from cache first (offline-first strategy)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      const fetchRequest = event.request.clone();
      return fetch(fetchRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    }),
  );
});
