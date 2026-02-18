// files/view/setting/base.js

// グローバル関数化
window.initSettings = function() {
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsContent = document.getElementById("settingsContent");

  // 初期化
  settingsContent.innerHTML = "";

  // -----------------------------
  // 1. 閉じる/設定ボタンの配置設定
  // -----------------------------
  const btnPositionLabel = document.createElement("label");
  btnPositionLabel.style.display = "flex";
  btnPositionLabel.style.alignItems = "center";
  btnPositionLabel.style.gap = "6px";
  btnPositionLabel.textContent = "閉じる/設定ボタンを上に表示";

  const btnPositionCheckbox = document.createElement("input");
  btnPositionCheckbox.type = "checkbox";
  btnPositionCheckbox.checked = AppState.settings?.buttonsOnTop ?? true;

  btnPositionCheckbox.onchange = () => {
    AppState.settings.buttonsOnTop = btnPositionCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    renderButtons(); // メイン画面更新
  };

  btnPositionLabel.prepend(btnPositionCheckbox);
  settingsContent.appendChild(btnPositionLabel);

  // -----------------------------
  // 2. ダークモード設定
  // -----------------------------
  const darkModeLabel = document.createElement("label");
  darkModeLabel.style.display = "flex";
  darkModeLabel.style.alignItems = "center";
  darkModeLabel.style.gap = "6px";
  darkModeLabel.textContent = "ダークモードを有効にする";

  const darkModeCheckbox = document.createElement("input");
  darkModeCheckbox.type = "checkbox";
  darkModeCheckbox.checked = AppState.settings?.darkMode ?? false;

  darkModeCheckbox.onchange = () => {
    AppState.settings.darkMode = darkModeCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    applyDarkMode(darkModeCheckbox.checked);
  };

  darkModeLabel.prepend(darkModeCheckbox);
  settingsContent.appendChild(darkModeLabel);

  // -----------------------------
  // 3. ボタンホバーを虹色にする設定
  // -----------------------------
  const rainbowLabel = document.createElement("label");
  rainbowLabel.style.display = "flex";
  rainbowLabel.style.alignItems = "center";
  rainbowLabel.style.gap = "6px";
  rainbowLabel.textContent = "ボタンホバー時に虹色にする";

  const rainbowCheckbox = document.createElement("input");
  rainbowCheckbox.type = "checkbox";
  rainbowCheckbox.checked = AppState.settings?.rainbowHover ?? false;

  rainbowCheckbox.onchange = () => {
    AppState.settings.rainbowHover = rainbowCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    applyRainbowHover(rainbowCheckbox.checked);
  };

  rainbowLabel.prepend(rainbowCheckbox);
  settingsContent.appendChild(rainbowLabel);

  // -----------------------------
  // 4. 初期化設定（defaultConfig編集）
  // -----------------------------
  const resetLabel = document.createElement("div");
  resetLabel.style.marginTop = "12px";
  resetLabel.textContent = "初期設定を編集";

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "初期設定を読み込む";
  resetBtn.style.marginTop = "6px";
  resetBtn.onclick = () => {
    AppState.sets = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG.sets));
    AppState.active = window.DEFAULT_CONFIG.activeSet;
    saveStorage({
      sets: AppState.sets,
      activeSet: AppState.active
    });
    renderTabs();
    renderButtons();
    alert("初期設定をロードしました");
  };

  settingsContent.appendChild(resetLabel);
  settingsContent.appendChild(resetBtn);

  // -----------------------------
  // パネルを前面に表示
  // -----------------------------
  Object.assign(settingsPanel.style, {
    position: "fixed",
    top: "0",
    right: "0",
    width: "100%",
    height: "100%",
    zIndex: 9999,
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    overflowY: "auto",
  });

  settingsPanel.classList.add("open");

  // -----------------------------
  // 閉じるボタン
  // -----------------------------
  const closeBtn = document.getElementById("closeSettingsBtn");
  closeBtn.onclick = () => {
    settingsPanel.classList.remove("open");
  };
};
