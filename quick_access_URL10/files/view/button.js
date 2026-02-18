// files/view/button.js

// Tooltip 作成（URLホバー用）
const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function() {
  const mainButtonsEl = document.getElementById("buttons");
  const topButtonsEl = document.getElementById("topButtons");
  const bottomButtonsEl = document.getElementById("bottomButtons");

  if (!mainButtonsEl || !topButtonsEl || !bottomButtonsEl) return;

  mainButtonsEl.innerHTML = "";
  topButtonsEl.innerHTML = "";
  bottomButtonsEl.innerHTML = "";
// system button 共通クラス
const SYSTEM_BTN_CLASS = "qa-main-style";





  // =====================
  // 閉じるボタン
  // =====================
const closeExtBtn = document.createElement("button");
closeExtBtn.textContent = "✖ Quick Access URLを閉じる";
closeExtBtn.className = `close-extension-btn ${SYSTEM_BTN_CLASS}`;
closeExtBtn.onclick = () => window.close();

  // =====================
  // 設定ボタン
  // =====================
const settingBtn = document.createElement("button");
settingBtn.textContent = "⚙ 設定";
settingBtn.className = `setting-btn ${SYSTEM_BTN_CLASS}`;
settingBtn.onclick = () => {
  const settingsPanel = document.getElementById("settingsPanel");
  if (settingsPanel) {
    settingsPanel.classList.toggle("open");
    initSettings();
  }
};

  // =====================
  // ボタン位置設定
  // =====================
  const onTop = AppState.settings?.buttonsOnTop ?? true;
  const targetContainer = onTop ? topButtonsEl : bottomButtonsEl;

  targetContainer.appendChild(closeExtBtn);
  targetContainer.appendChild(settingBtn);

  // =====================
  // 区切り線（トップ側のみ表示）
  // =====================
  if (onTop) {
    const hr = document.createElement("hr");
    hr.style.margin = "6px 0";
    topButtonsEl.appendChild(hr);
  }

  // =====================
  // メインURLボタン
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

    mainButtonsEl.appendChild(btn);
  });

  // =====================
  // Sortable（メインボタンのみ）
  // =====================
  if (typeof Sortable !== "undefined") {
    if (mainButtonsEl._sortable) mainButtonsEl._sortable.destroy();

    mainButtonsEl._sortable = Sortable.create(mainButtonsEl, {
      animation: 150,
      ghostClass: "dragging",
      onEnd: (evt) => {
        const buttons = AppState.sets[AppState.active].buttons;
        const moved = buttons.splice(evt.oldIndex, 1);
        buttons.splice(evt.newIndex, 0, moved[0]);
        saveStorage({ sets: AppState.sets });
        renderButtons();
      },
    });
  }

  // =====================
  // 設定パネル閉じる
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
