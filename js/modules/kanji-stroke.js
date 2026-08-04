// ==================== KANJI STROKE ORDER VIEWER ====================

// Get Unicode hex for a kanji character - returns uppercase
function getUnicodeHex(kanji) {
  return kanji.codePointAt(0).toString(16).toUpperCase();
}

// Get decimal Unicode for animCJK file lookup
function getUnicodeDecimal(kanji) {
  return kanji.codePointAt(0);
}

// Get SVG paths - tries animated first, then static
function getSvgPaths(kanji) {
  const cleanKanji = kanji.charAt(0);
  const hexUnicode = getUnicodeHex(cleanKanji);
  const decimalUnicode = getUnicodeDecimal(cleanKanji);
  const paddedHex = hexUnicode.padStart(5, "0").toUpperCase();

  console.log("📁 SVG Paths:", {
    kanji: cleanKanji,
    hex: hexUnicode,
    decimal: decimalUnicode,
    animated: `images/kanji-animated/${decimalUnicode}.svg`,
    static: `images/kanji-strokes/${paddedHex}.svg`,
  });

  return {
    // Try animated first (animCJK uses decimal filenames)
    primary: `images/kanji-animated/${decimalUnicode}.svg`,
    // Fall back to static (hex filenames)
    fallback: `images/kanji-strokes/${paddedHex}.svg`,
  };
}

// Display stroke order modal
function showStrokeOrder(kanji, unicode, meaning) {
  console.log("🎨 showStrokeOrder called with:", { kanji, unicode, meaning });

  // If unicode is not provided or invalid, calculate it
  if (
    !unicode ||
    unicode === "undefined" ||
    unicode === "" ||
    unicode === "NaN"
  ) {
    unicode = getUnicodeHex(kanji);
    console.log("🔢 Calculated Unicode:", unicode);
  }

  // Ensure unicode is uppercase
  unicode = String(unicode).toUpperCase();

  let modal = document.getElementById("strokeOrderModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "strokeOrderModal";
    modal.className = "stroke-modal";
    modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(4px);
        `;
    modal.innerHTML = `
            <div class="stroke-modal-content" style="
                background: white;
                border-radius: 24px;
                width: 90%;
                max-width: 500px;
                max-height: 85vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: strokeFadeIn 0.2s ease;
                position: relative;
                z-index: 100000;
            ">
                <div class="stroke-modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid #e8e0d5;
                    background: #6c8b6b;
                    border-radius: 24px 24px 0 0;
                ">
                    <h3 id="strokeKanjiTitle" style="margin: 0; color: white; font-size: 1.2rem;"></h3>
                    <button class="stroke-close-btn" style="
                        background: none;
                        border: none;
                        font-size: 1.8rem;
                        cursor: pointer;
                        color: white;
                        transition: opacity 0.2s;
                    ">&times;</button>
                </div>
                <div class="stroke-modal-body" style="padding: 24px; text-align: center;">
                    <div class="stroke-svg-container" id="strokeSvgContainer" style="
                        background: #faf8f5;
                        border-radius: 16px;
                        padding: 20px;
                        margin-bottom: 20px;
                        min-height: 200px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div class="stroke-loading" style="text-align: center; color: #8a7b6e; padding: 40px;">Loading stroke order...</div>
                    </div>
                </div>
                <div class="stroke-modal-footer" style="
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    padding: 16px 20px;
                    border-top: 1px solid #e8e0d5;
                    background: #faf8f5;
                    border-radius: 0 0 24px 24px;
                ">
                    <button id="strokeReplayBtn" class="small-btn" style="
                        background: #6c8b6b;
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 40px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        display: none;
                        font-family: inherit;
                        line-height: 1.5;
                        text-align: center;
                        vertical-align: middle;
                    ">▶️ Replay</button>
                    <button id="strokeCloseBtn" class="small-btn" style="
                        background: #e8e0d5;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 40px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        font-family: inherit;
                        line-height: 1.5;
                        text-align: center;
                        vertical-align: middle;
                    ">Close</button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);

    const style = document.createElement("style");
    style.textContent = `
            @keyframes strokeFadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .stroke-modal-content {
                animation: strokeFadeIn 0.2s ease;
            }
            #strokeReplayBtn, #strokeCloseBtn {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                white-space: nowrap !important;
            }
        `;
    document.head.appendChild(style);

    modal.querySelector(".stroke-close-btn").addEventListener("click", () => {
      modal.style.display = "none";
    });
    modal.querySelector("#strokeCloseBtn").addEventListener("click", () => {
      modal.style.display = "none";
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
    modal.querySelector("#strokeReplayBtn").addEventListener("click", () => {
      replayAnimation();
    });
  }

  // Update title
  const titleEl = document.getElementById("strokeKanjiTitle");
  const cleanTitle = kanji.charAt(0);
  titleEl.innerHTML = `<span style="font-size: 1.8rem; font-weight: bold; margin-right: 8px;">${cleanTitle}</span> - ${meaning || "Kanji"}`;

  const container = document.getElementById("strokeSvgContainer");
  const paths = getSvgPaths(kanji);
  console.log("📁 Trying SVG paths:", paths);

  // Clear container and show loading
  container.innerHTML =
    '<div class="stroke-loading" style="text-align: center; color: #8a7b6e; padding: 40px;">Loading stroke order...</div>';

  // Store current kanji data for replay
  window._currentStrokeData = {
    kanji: kanji,
    unicode: unicode,
    meaning: meaning,
    paths: paths,
    isAnimated: false,
  };

  // Create an image element that tries both paths
  let img = document.createElement("img");
  img.alt = `Stroke order for ${kanji}`;
  img.style.maxWidth = "100%";
  img.style.height = "auto";
  img.style.background = "white";
  img.style.maxHeight = "300px";
  img.style.display = "block";
  img.style.margin = "0 auto";
  img.style.padding = "10px";
  img.style.borderRadius = "8px";

  let attempted = false;

  img.onerror = function () {
    if (!attempted) {
      attempted = true;
      console.log(
        "❌ Animated failed, trying static fallback:",
        paths.fallback,
      );
      this.src = paths.fallback;
    } else {
      console.log("❌ Both paths failed");
      this.style.display = "none";
      container.innerHTML = `
                <div style="text-align:center;padding:30px 20px;">
                    <div style="font-size:6rem;color:#2c3e2f;margin-bottom:10px;line-height:1.2;">${kanji.charAt(0)}</div>
                    <div style="font-size:0.8rem;color:#999;padding:12px;background:#f5f0eb;border-radius:8px;margin-top:8px;">
                        💡 SVG stroke diagram not available.
                    </div>
                </div>
            `;
      // Hide replay button if both failed
      document.getElementById("strokeReplayBtn").style.display = "none";
    }
  };

  img.onload = function () {
    console.log("✅ SVG loaded successfully from:", this.src);
    container.innerHTML = "";
    container.appendChild(img);

    const replayBtn = document.getElementById("strokeReplayBtn");

    // Check if animated version is being shown
    if (this.src.includes("kanji-animated")) {
      window._currentStrokeData.isAnimated = true;
      replayBtn.style.display = "inline-flex";
      replayBtn.textContent = "▶️ Replay";
      replayBtn.title = "Replay the stroke order animation";
    } else {
      window._currentStrokeData.isAnimated = false;
      replayBtn.style.display = "none";
    }
  };

  // Start loading the primary SVG (animated)
  img.src = paths.primary;
  container.innerHTML = "";
  container.appendChild(img);

  // Show the modal
  modal.style.display = "flex";
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  console.log("🖼️ Modal displayed");
}

// Replay the animation
function replayAnimation() {
  const data = window._currentStrokeData;
  if (!data || !data.isAnimated) return;

  console.log("🔄 Replaying animation for:", data.kanji);

  const container = document.getElementById("strokeSvgContainer");
  const img = container.querySelector("img");

  if (img) {
    // Force reload by adding timestamp to URL
    const src = img.src.split("?")[0];
    img.src = src + "?t=" + Date.now();

    // Also update the replay button to show it's replaying
    const replayBtn = document.getElementById("strokeReplayBtn");
    replayBtn.textContent = "🔄 Replaying...";
    replayBtn.style.opacity = "0.7";

    setTimeout(() => {
      replayBtn.textContent = "▶️ Replay";
      replayBtn.style.opacity = "1";
    }, 1500);
  }
}

// Add stroke order buttons to kanji cards
function addStrokeButtonsToKanjiList() {
  const kanjiCards = document.querySelectorAll(".kanji-card");
  console.log("Adding stroke buttons to", kanjiCards.length, "cards");

  kanjiCards.forEach((card) => {
    if (card.querySelector(".stroke-order-btn")) return;

    let kanji = "";
    let meaning = "";

    const kanjiPatternEl = card.querySelector(".kanji-pattern");
    if (kanjiPatternEl) {
      kanji = kanjiPatternEl.textContent.trim();
      kanji = kanji.charAt(0);
    }

    if (!kanji) {
      const match = card.innerText.match(/^[一-龯]/);
      if (match) kanji = match[0];
    }

    const meaningEl = card.querySelector(".kanji-meaning");
    if (meaningEl) {
      meaning = meaningEl.textContent.trim();
    }

    if (kanji && kanji.length === 1) {
      const unicode = getUnicodeHex(kanji);
      console.log(`🆕 Adding stroke button for "${kanji}" (${unicode})`);

      const strokeBtn = document.createElement("button");
      strokeBtn.className = "small-btn stroke-order-btn";
      strokeBtn.innerHTML = "✍️ Stroke Order";
      strokeBtn.style.margin = "10px 5px 0 5px";
      strokeBtn.style.background = "#6c8b6b";
      strokeBtn.style.color = "white";
      strokeBtn.style.border = "none";
      strokeBtn.style.padding = "6px 12px";
      strokeBtn.style.borderRadius = "20px";
      strokeBtn.style.cursor = "pointer";
      strokeBtn.style.fontSize = "0.75rem";
      strokeBtn.dataset.kanji = kanji;
      strokeBtn.dataset.unicode = unicode;
      strokeBtn.dataset.meaning = meaning || "";

      const masteredBtn = card.querySelector(".mark-mastered-btn");
      if (masteredBtn) {
        masteredBtn.parentNode.insertBefore(strokeBtn, masteredBtn.nextSibling);
      } else {
        const cardFooter = card.querySelector(".kanji-examples");
        if (cardFooter) {
          cardFooter.insertAdjacentElement("afterend", strokeBtn);
        } else {
          card.appendChild(strokeBtn);
        }
      }
    }
  });
}

function initStrokeButtons() {
  console.log("Stroke order viewer initializing...");
  addStrokeButtonsToKanjiList();

  const observer = new MutationObserver(() => {
    if (document.querySelectorAll(".kanji-card").length > 0) {
      addStrokeButtonsToKanjiList();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStrokeButtons);
} else {
  initStrokeButtons();
}