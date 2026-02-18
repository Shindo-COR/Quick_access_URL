// files/view/button.js

// Tooltip 作成（URLホバー用）
const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function() {
  const buttonsEl = document.getElementById("buttons");
  if (!buttonsEl) return;
  buttonsEl.innerHTML = "";

  // =====================
  // 拡張機能閉じるボタン（固定）
  // =====================
  const closeExtBtn = document.createElement("button");
  closeExtBtn.textContent = "✖ Quick Access URLを閉じる";
  closeExtBtn.className = "close-extension-btn";
  closeExtBtn.onclick = () => window.close();

  // =====================
  // 設定ボタン（固定）
  // =====================
  const settingBtn = document.createElement("button");
  settingBtn.textContent = "⚙ 設定";
  settingBtn.className = "setting-btn";
  settingBtn.onclick = () => {
    const settingsPanel = document.getElementById("settingsPanel");
    if (settingsPanel) {
      settingsPanel.classList.toggle("open");
      if (typeof window.initSettings === "function") {
        window.initSettings(); // パネル内容を初期化・描画
      }
    }
  };

  // =====================
  // ボタン位置に応じて追加
  // =====================
  const position = AppState.settings?.buttonsOnTop ?? true; // true=上
  if (!position) {
    buttonsEl.appendChild(closeExtBtn);
    buttonsEl.appendChild(settingBtn);
  } else {
    buttonsEl.appendChild(settingBtn);
    buttonsEl.appendChild(closeExtBtn);
  }

  // アンダーライン
  const hr = document.createElement("hr");
  hr.style.margin = "6px 0";
  buttonsEl.appendChild(hr);

  // =====================
  // メインURLボタン群
  // =====================
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

    buttonsEl.appendChild(btn);
  });

  // =====================
  // SortableJSでドラッグ（メインボタンのみ）
  // =====================
  if (typeof Sortable !== "undefined") {
    if (buttonsEl._sortable) buttonsEl._sortable.destroy();

    buttonsEl._sortable = Sortable.create(buttonsEl, {
      animation: 150,
      ghostClass: "dragging",
      filter: ".close-extension-btn, .setting-btn",
      onMove: (evt) =>
        !evt.related.classList.contains("close-extension-btn") &&
        !evt.related.classList.contains("setting-btn"),
      onEnd: (evt) => {
        const buttons = AppState.sets[AppState.active].buttons;
        const movedItem = buttons.splice(evt.oldIndex - 3, 1);
        buttons.splice(evt.newIndex - 3, 0, movedItem[0]);
        saveStorage({ sets: AppState.sets });
        renderButtons();
      },
    });
  }

  // =====================
  // 設定パネル閉じるボタン
  // =====================
  const closeSettingBtn = document.getElementById("closeSettingsBtn");
  if (closeSettingBtn) {
    closeSettingBtn.onclick = () => {
      const panel = document.getElementById("settingsPanel");
      if (panel) panel.classList.remove("open");
    };
  }
};

// =====================
// ダークモード（背景のみ）
// =====================
function applyDarkMode(enable) {
  const body = document.body;
  const buttonsEl = document.getElementById("buttons");
  const tabsEl = document.getElementById("tabs");

  if (!body || !buttonsEl || !tabsEl) return;

  if (enable) {
    body.style.background = "#1a1a2e";
  } else {
    body.style.background = "#fafafa";
  }

  // ボタン文字色やタブ文字色は変更しない
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
      btn.style.transition = "0.3s background";
      btn.onmouseenter = () => {
        btn.style.background =
          "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
        btn.style.backgroundSize = "400% 100%";
        btn.style.animation = "rainbowSlide 3s linear infinite";
      };
      btn.onmouseleave = () => {
        btn.style.background = btn.dataset.color || "#607d8b";
        btn.style.animation = "";
      };
    } else {
      btn.onmouseenter = (e) => {
        tooltip.textContent = btn.dataset.url || "";
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
        btn.style.background = btn.dataset.color || "#607d8b";
        btn.style.animation = "";
      };
    }
  });
}

// =====================
// 初期描画で設定反映
// =====================
applyDarkMode(AppState.settings?.darkMode ?? false);
applyRainbowHover(AppState.settings?.rainbowHover ?? false);
