// ================================================================
// GLOBAL SEARCH - wordDict + Jisho.org fallback
// ================================================================
(function() {
  'use strict';

  function initGlobalSearch() {
    const searchInput = document.getElementById("globalSearchInput");
    const resultsContainer = document.getElementById("globalSearchResults");

    if (!searchInput || !resultsContainer) {
      console.warn("Global Search: Elements not found.");
      return;
    }

    // Check if wordDict exists
    if (typeof wordDict === "undefined") {
      console.warn("Global Search: wordDict not found.");
      // Still allow Jisho fallback
    }

    // Helper to create result HTML
    function createResultHTML(key, data) {
      let displayText = `<span class="gs-word">${key}</span>`;
      if (data.reading && data.reading !== key) {
        displayText += ` <span class="gs-reading">(${data.reading})</span>`;
      }
      let meaningText = data.meaning || "";
      let rootInfo = "";
      if (data.is_conjugation && data.root) {
        const rootData = wordDict ? wordDict[data.root] : null;
        const rootMeaning = rootData ? rootData.meaning : "";
        rootInfo = ` <span class="gs-root">← from ${data.root} (${rootMeaning})</span>`;
      }
      return `
        <div class="gs-result-item" data-word="${key}">
          <div>
            ${displayText}
            <span class="gs-meaning">${meaningText}</span>
            ${rootInfo}
          </div>
        </div>
      `;
    }

    // Search function
    searchInput.addEventListener("input", function () {
      const query = this.value.trim().toLowerCase();
      resultsContainer.innerHTML = "";

      if (query.length === 0) {
        resultsContainer.classList.remove("active");
        return;
      }

      const matches = [];
      
      // Search local wordDict if available
      if (window.wordDict && typeof window.wordDict === "object") {
        for (const [key, data] of Object.entries(window.wordDict)) {
          if (key.startsWith("～")) continue;
          const matchKey = key.toLowerCase();
          const matchReading = (data.reading || "").toLowerCase();
          const matchMeaning = (data.meaning || "").toLowerCase();
          if (
            matchKey.includes(query) ||
            matchReading.includes(query) ||
            matchMeaning.includes(query)
          ) {
            matches.push({ key, data, source: "local" });
          }
          if (matches.length >= 10) break;
        }
      }

      // Build results HTML
      let html = `
        <div class="gs-header">
          <span>🔍 ${matches.length} result${matches.length !== 1 ? "s" : ""}</span>
          <button class="gs-close-btn-top" id="gsClosePopupBtn">✕</button>
        </div>
        <div class="gs-results-inner">
      `;

      if (matches.length === 0) {
        // No local results - show Jisho option
        html += `
          <div class="gs-result-item" data-jisho="${query}" style="border-bottom: 2px solid #6c8b6b; background: #f0f7f0;">
            <div>
              <span style="font-weight: 600; color: #6c8b6b;">🔍 "${query}" not found locally</span>
              <br>
              <span style="font-size: 0.85rem; color: #1a2b4c;">
                Click here to search on 
                <strong style="color: #6c8b6b;">Jisho.org</strong> 
                <span style="font-size: 0.7rem; color: #999;">(opens in new tab)</span>
              </span>
            </div>
          </div>
        `;
      } else {
        // Show local results first
        for (const match of matches) {
          html += createResultHTML(match.key, match.data);
        }
        
        // Add Jisho option at the bottom
        html += `
          <div class="gs-result-item" data-jisho="${query}" style="border-top: 2px solid #e8e0d5; background: #faf8f5; margin-top: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 4px;">
              <span style="font-size: 0.85rem; color: #666;">
                🔍 Not finding what you need?
              </span>
              <span style="font-size: 0.8rem; color: #6c8b6b; font-weight: 500; cursor: pointer;">
                Search on Jisho.org →
              </span>
            </div>
          </div>
        `;
      }

      html += `</div>`;
      resultsContainer.innerHTML = html;
      resultsContainer.classList.add("active");

      // Close button
      const closeBtn = document.getElementById("gsClosePopupBtn");
      if (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          resultsContainer.classList.remove("active");
          searchInput.value = "";
          searchInput.blur();
        });
      }

      // Click handler for results
      document.querySelectorAll(".gs-result-item").forEach((item) => {
        item.addEventListener("click", function (e) {
          // Check if it's a Jisho link
          const jishoQuery = this.dataset.jisho;
          if (jishoQuery) {
            // Open Jisho in new tab
            const url = `https://jisho.org/search/${encodeURIComponent(jishoQuery)}`;
            window.open(url, "_blank");
            resultsContainer.classList.remove("active");
            searchInput.value = "";
            searchInput.blur();
            return;
          }

          // Local result - fill the search input
          const wordSpan = this.querySelector(".gs-word");
          if (wordSpan) {
            searchInput.value = wordSpan.textContent;
            resultsContainer.classList.remove("active");
          }
        });
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !e.target.closest(".global-search-wrapper") &&
        !e.target.closest("#globalSearchResults")
      ) {
        resultsContainer.classList.remove("active");
      }
    });

    // Close dropdown with Escape key
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        resultsContainer.classList.remove("active");
        this.blur();
      }
      // Enter key - if results are shown
      if (e.key === "Enter") {
        const firstItem = resultsContainer.querySelector(".gs-result-item");
        if (firstItem) {
          // If it's a Jisho item, open Jisho
          if (firstItem.dataset.jisho) {
            const url = `https://jisho.org/search/${encodeURIComponent(firstItem.dataset.jisho)}`;
            window.open(url, "_blank");
            resultsContainer.classList.remove("active");
            searchInput.value = "";
            searchInput.blur();
            return;
          }
          // Local result
          const wordSpan = firstItem.querySelector(".gs-word");
          if (wordSpan) {
            searchInput.value = wordSpan.textContent;
            resultsContainer.classList.remove("active");
          }
        }
      }
    });

    // Optional: Focus on search with Ctrl+K or Cmd+K
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlobalSearch);
  } else {
    initGlobalSearch();
  }
})();