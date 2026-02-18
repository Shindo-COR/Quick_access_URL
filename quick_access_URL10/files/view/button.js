// files/view/button.js

// Tooltip 作成（URLホバー用）
const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function () {
  const buttonsEl = document.getElementById("buttons");
  if (!buttonsEl) return;
  buttonsEl.innerHTML = "";

  // =====================
  // 固定ボタン生成
  // =====================
  const closeExtBtn = document.createElement("button");
  closeExtBtn.textContent = "✖ Quick Access URLを閉じる";
  closeExtBtn.className = "close-extension-btn";
  closeExtBtn.onclick = () => window.close();

  const settingBtn = document.createElement("button");
  settingBtn.textContent = "⚙ 設定";
  settingBtn.className = "setting-btn";
  settingBtn.onclick = () => {
    const settingsPanel = document.getElementById("settingsPanel");
    if (settingsPanel) {
      settingsPanel.classList.toggle("open");
      if (typeof window.initSettings === "function") window.initSettings();
    }
  };

  const hr = document.createElement("hr");
  hr.style.margin = "6px 0";

  // =====================
  // メインボタン群 Fragment
  // =====================
  const mainButtonsFragment = document.createDocumentFragment();
  const list = AppState.sets[AppState.active]?.buttons || [];

  list.forEach((b, i) => {
    const btn = document.createElement("button");
    btn.textContent = b.label;
    btn.dataset.index = i;
    btn.dataset.color = b.color || "#607d8b";
    btn.dataset.url = b.url || "";
    btn.style.background = btn.dataset.color;
    btn.style.cursor = "grab";

    btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

    btn.onmouseenter = (e) => {
      tooltip.textContent = btn.dataset.url;
      tooltip.style.opacity = 1;
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    };
    btn.onmousemove = (e) => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    };
    btn.onmouseleave = () => {
      tooltip.style.opacity = 0;
      btn.style.background = btn.dataset.color;
    };

    mainButtonsFragment.appendChild(btn);
  });

  // =====================
  // 上下配置の切り替え（本命修正箇所）
  // =====================
  const buttonsOnTop = AppState.settings?.buttonsOnTop ?? true;

  if (buttonsOnTop) {
    // 上に配置
    buttonsEl.appendChild(closeExtBtn);
    buttonsEl.appendChild(settingBtn);
    buttonsEl.appendChild(hr);
    buttonsEl.appendChild(mainButtonsFragment);
  } else {
    // 下に配置（メインボタンの下）
    buttonsEl.appendChild(mainButtonsFragment);
    buttonsEl.appendChild(hr);
    buttonsEl.appendChild(closeExtBtn);
    buttonsEl.appendChild(settingBtn);
  }

  // =====================
  // SortableJS（メインボタンのみ）
  // =====================
  if (typeof Sortable !== "undefined") {
    if (buttonsEl._sortable) buttonsEl._sortable.destroy();

    const offset = buttonsOnTop ? 3 : 0; // 上に固定がある場合だけズレる

    buttonsEl._sortable = Sortable.create(buttonsEl, {
      animation: 150,
      ghostClass: "dragging",
      filter: ".close-extension-btn, .setting-btn, hr",
      onMove: (evt) =>
        !evt.related.classList.contains("close-extension-btn") &&
        !evt.related.classList.contains("setting-btn") &&
        evt.related.tagName !== "HR",

      onEnd: (evt) => {
        const buttons = AppState.sets[AppState.active].buttons;
        const movedItem = buttons.splice(evt.oldIndex - offset, 1)[0];
        buttons.splice(evt.newIndex - offset, 0, movedItem);

        saveStorage({ sets: AppState.sets });
        renderButtons();
      },
    });
  }

  // 設定パネル閉じる
  const closeSettingBtn = document.getElementById("closeSettingsBtn");
  if (closeSettingBtn) {
    closeSettingBtn.onclick = () => {
      const panel = document.getElementById("settingsPanel");
      if (panel) panel.classList.remove("open");
    };
  }
};

// =====================
// ダークモード
// =====================
function applyDarkMode(enable) {
  const body = document.body;
  if (!body) return;
  body.style.background = enable ? "#2c2c53" : "#fafafa";
}

// =====================
// 虹色ホバー
// =====================
function applyRainbowHover(enable) {
  const buttonsEl = document.getElementById("buttons");
  if (!buttonsEl) return;

  buttonsEl.querySelectorAll("button").forEach((btn) => {
    if (btn.classList.contains("close-extension-btn") || btn.classList.contains("setting-btn")) return;

    if (enable) {
      btn.onmouseenter = () => {
        btn.style.background = "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
        btn.style.backgroundSize = "400% 100%";
        btn.style.animation = "rainbowSlide 3s linear infinite";
      };
      btn.onmouseleave = () => {
        btn.style.background = btn.dataset.color;
        btn.style.animation = "";
      };
    }
  });
}

// 初期反映
applyDarkMode(AppState.settings?.darkMode ?? false);
applyRainbowHover(AppState.settings?.rainbowHover ?? false);
