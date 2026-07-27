(function () {
  const jar = document.getElementById("jar");
  const slots = Array.from(document.querySelectorAll(".slot"));

  // Natural blueberry / red-cabbage / turmeric blend colors
  const reactionColors = {
    1: "#E88E73",
    2: "#E7A680",
    3: "#E5B58A",
    4: "#E2C598",
    5: "#DCC79C",
    6: "#BDAE75",
    7: "#948A4A",
    8: "#69652F",
    9: "#5B5225"
  };

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function getPoint(e) {
    if (e.touches && e.touches.length)
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };

    if (e.changedTouches && e.changedTouches.length)
      return {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function startDrag(e) {
    e.preventDefault();

    const rect = jar.getBoundingClientRect();
    const p = getPoint(e);

    offsetX = p.x - rect.left;
    offsetY = p.y - rect.top;

    // Lock the jar in its current screen position
    jar.style.left = rect.left + "px";
    jar.style.top = rect.top + "px";
    jar.style.width = rect.width + "px";
    jar.style.height = rect.height + "px";

    jar.classList.add("dragging");
    dragging = true;

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
  }

  function onMove(e) {
    if (!dragging) return;

    e.preventDefault();

    const p = getPoint(e);

    jar.style.left = p.x - offsetX + "px";
    jar.style.top = p.y - offsetY + "px";

    const hit = slotUnderJar();

    slots.forEach(slot => {
      if (slot !== hit) slot.style.outline = "none";
    });

    if (hit) {
      hit.style.outline = "2px dashed #3d5a80";
    }
  }

  function slotUnderJar() {
    const jarRect = jar.getBoundingClientRect();

    const cx = jarRect.left + jarRect.width / 2;
    const cy = jarRect.top + jarRect.height / 2;

    for (const slot of slots) {
      const r = slot.getBoundingClientRect();

      if (
        cx >= r.left &&
        cx <= r.right &&
        cy >= r.top &&
        cy <= r.bottom
      ) {
        return slot;
      }
    }

    return null;
  }

  function endDrag() {
    if (!dragging) return;

    dragging = false;

    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("mouseup", endDrag);
    window.removeEventListener("touchend", endDrag);

    const hit = slotUnderJar();

    slots.forEach(slot => {
      slot.style.outline = "none";
    });

    if (hit) {
      react(hit);
    }

    // Return the jar to its original position
    jar.classList.remove("dragging");
    jar.style.left = "";
    jar.style.top = "";
    jar.style.width = "";
    jar.style.height = "";
  }

  function react(slot) {
    const idx = slot.dataset.index;
    const color = reactionColors[idx] || "#999";

    slot.style.background = color;
    slot.classList.add("wet", "reacting");

    setTimeout(() => {
      slot.classList.remove("reacting");
    }, 700);
  }

  jar.addEventListener("mousedown", startDrag);
  jar.addEventListener("touchstart", startDrag, { passive: false });
})();
