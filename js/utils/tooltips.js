// ==================== TOOLTIP FUNCTIONS (mobile support) ====================

function addLongPressSupport(element) {
  if (!element) return;
  let timer;
  element.addEventListener('touchstart', () => {
    timer = setTimeout(() => element.classList.add('long-press'), 500);
  });
  element.addEventListener('touchend', () => {
    clearTimeout(timer);
    setTimeout(() => element.classList.remove('long-press'), 300);
  });
}

function attachTooltipLongPress(container) {
  if (!container) return;
  container.querySelectorAll('.word-tooltip').forEach(addLongPressSupport);
}