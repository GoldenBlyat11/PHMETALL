(function () {
  const tabBtns = Array.from(document.querySelectorAll(".tab-btn"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.toggle("active", b === btn));
      panels.forEach(p => p.classList.toggle("active", p.id === "tab-" + target));
    });
  });
})();

(function () {
  const units = [
    {
      jarId: "jar-blend",
      stripId: "strip-blend",
      // Natural blueberry / red-cabbage / turmeric blend colors
      colors: {
        1: "#E88E73",
        2: "#E7A680",
        3: "#E5B58A",
        4: "#E2C598",
        5: "#DCC79C",
        6: "#BDAE75",
        7: "#948A4A",
        8: "#69652F",
        9: "#5B5225"
      }
    },
    {
      jarId: "jar-blueberry",
      stripId: "strip-blueberry",
      // Blueberry extract: vanilla (acid) -> dark red (base)
      colors: {
        1: "#FF1A75",
        2: "#FF4A80",
        3: "#FFB080",
        4: "#D8FF80",
        5: "#AAFF80"
      }
    },
    {
      jarId: "jar-cabbage",
      stripId: "strip-cabbage",
      // Red cabbage: reddish pink (acid) -> baby blue (base)
      colors: {
        1: "#E06377",
        2: "#CA7E95",
        3: "#B599B4",
        4: "#9FB4D2",
        5: "#89CFF0"
      }
    },
    {
      jarId: "jar-turmeric",
      stripId: "strip-turmeric",
      // Turmeric: deep yellow-brown (acid, stays put) -> deep red-brown (base)
      colors: {
        1: "#C08B1E",
        2: "#C08B1E",
        3: "#5C2A1F"
      }
    }
  ];

  units.forEach(setupUnit);

  function setupUnit(config) {
    const jar = document.getElementById(config.jarId);
    const strip = document.getElementById(config.stripId);

    if (!jar || !strip) return;

    const slots = Array.from(strip.querySelectorAll(".slot"));
    const colors = config.colors;

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
      const color = colors[idx] || "#999";

      slot.style.background = color;
      slot.classList.add("wet", "reacting");

      setTimeout(() => {
        slot.classList.remove("reacting");
      }, 700);
    }

    jar.addEventListener("mousedown", startDrag);
    jar.addEventListener("touchstart", startDrag, { passive: false });
  }
})();
