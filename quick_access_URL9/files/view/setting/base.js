// files/view/setting/base.js

window.initSettings = function() {
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsContent = document.getElementById("settingContent");
  if (!settingsPanel || !settingsContent) return;

  settingsContent.innerHTML = "";

  // ===== 設定初期化（互換性維持） =====
  AppState.settings = AppState.settings || {};

  // 旧キー互換
  if (AppState.settings.buttonsTop === undefined) {
    AppState.settings.buttonsTop = AppState.settings.buttonsOnTop ?? true;
  }

  if (AppState.settings.darkMode === undefined) AppState.settings.darkMode = false;
  if (AppState.settings.rainbowHover === undefined) AppState.settings.rainbowHover = false;

  // =====================
  // 1. ボタン位置設定
  // =====================
  const posWrap = document.createElement("div");
  posWrap.className = "setting-item";

  const posLabel = document.createElement("label");
  posLabel.textContent = "閉じる/設定ボタンを上に配置";

  const posCheckbox = document.createElement("input");
  posCheckbox.type = "checkbox";
  posCheckbox.checked = AppState.settings.buttonsTop;

  posCheckbox.onchange = () => {
    AppState.settings.buttonsTop = posCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    renderButtons(); // 再描画
  };

  posWrap.appendChild(posLabel);
  posWrap.appendChild(posCheckbox);
  settingsContent.appendChild(posWrap);

  // =====================
  // 2. ダークモード（変更禁止）
  // =====================
  const darkWrap = document.createElement("div");
  darkWrap.className = "setting-item";

  const darkLabel = document.createElement("label");
  darkLabel.textContent = "ダークモード（背景のみ）";

  const darkCheckbox = document.createElement("input");
  darkCheckbox.type = "checkbox";
  darkCheckbox.checked = AppState.settings.darkMode;

  darkCheckbox.onchange = () => {
    AppState.settings.darkMode = darkCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    applyDarkMode(darkCheckbox.checked);
  };

  darkWrap.appendChild(darkLabel);
  darkWrap.appendChild(darkCheckbox);
  settingsContent.appendChild(darkWrap);

  // =====================
  // 3. 虹色ホバー
  // =====================
  const rainbowWrap = document.createElement("div");
  rainbowWrap.className = "setting-item";

  const rainbowLabel = document.createElement("label");
  rainbowLabel.textContent = "ボタンホバー虹色";

  const rainbowCheckbox = document.createElement("input");
  rainbowCheckbox.type = "checkbox";
  rainbowCheckbox.checked = AppState.settings.rainbowHover;

  rainbowCheckbox.onchange = () => {
    AppState.settings.rainbowHover = rainbowCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    applyRainbowHover(rainbowCheckbox.checked);
  };

  rainbowWrap.appendChild(rainbowLabel);
  rainbowWrap.appendChild(rainbowCheckbox);
  settingsContent.appendChild(rainbowWrap);

  // =====================
  // パネル開閉
  // =====================
  settingsPanel.classList.add("open");
  document.getElementById("closeSettingsBtn").onclick = () => {
    settingsPanel.classList.remove("open");
  };

  // 初期反映
  applyDarkMode(AppState.settings.darkMode);
};
