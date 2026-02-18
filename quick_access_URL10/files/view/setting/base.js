// files/view/setting/base.js

window.initSettings = function () {
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsContent = document.getElementById("settingContent");
  if (!settingsPanel || !settingsContent) return;

  settingsContent.innerHTML = "";

  // 初期値
  AppState.settings = AppState.settings || {};
  if (AppState.settings.buttonsOnTop === undefined)
    AppState.settings.buttonsOnTop = true;
  if (AppState.settings.darkMode === undefined)
    AppState.settings.darkMode = false;
  if (!AppState.settings.darkBgColor) AppState.settings.darkBgColor = "#1a1a2e";
  if (!AppState.settings.darkTextColor)
    AppState.settings.darkTextColor = "#ffffff";
  if (AppState.settings.darkRainbowBg === undefined)
    AppState.settings.darkRainbowBg = false;
  if (AppState.settings.rainbowHover === undefined)
    AppState.settings.rainbowHover = false;

  // =====================
  // 1. ボタン位置
  // =====================
  const posLabel = document.createElement("label");
  posLabel.textContent = "閉じる/設定ボタンを上に表示";
  posLabel.style.display = "flex";
  posLabel.style.gap = "6px";

  const posCheck = document.createElement("input");
  posCheck.type = "checkbox";
  posCheck.checked = AppState.settings.buttonsOnTop;
  posCheck.onchange = () => {
    AppState.settings.buttonsOnTop = posCheck.checked;
    saveStorage({ settings: AppState.settings });
    renderButtons();
  };

  posLabel.prepend(posCheck);
  settingsContent.appendChild(posLabel);

  // =====================
  // 2. ダークモード ON/OFF
  // =====================
  const darkLabel = document.createElement("label");
  darkLabel.textContent = "ダークモード";
  darkLabel.style.display = "flex";
  darkLabel.style.gap = "6px";

  const darkCheck = document.createElement("input");
  darkCheck.type = "checkbox";
  darkCheck.checked = AppState.settings.darkMode;
  darkCheck.onchange = () => {
    AppState.settings.darkMode = darkCheck.checked;
    saveStorage({ settings: AppState.settings });
    applyDarkMode(darkCheck.checked);
  };

  darkLabel.prepend(darkCheck);
  settingsContent.appendChild(darkLabel);

  // =====================
  // 3. ダーク背景色
  // =====================
  const bgLabel = document.createElement("label");
  bgLabel.textContent = "ダーク背景色";
  bgLabel.style.display = "flex";
  bgLabel.style.gap = "6px";

  const bgPicker = document.createElement("input");
  bgPicker.type = "color";
  bgPicker.value = AppState.settings.darkBgColor;
  bgPicker.oninput = () => {
    AppState.settings.darkBgColor = bgPicker.value;
    saveStorage({ settings: AppState.settings });
    applyDarkMode(true);
  };

  bgLabel.appendChild(bgPicker);
  settingsContent.appendChild(bgLabel);

  // =====================
  // 4. ダーク文字色
  // =====================
  const textLabel = document.createElement("label");
  textLabel.textContent = "ダーク文字色";
  textLabel.style.display = "flex";
  textLabel.style.gap = "6px";

  const textPicker = document.createElement("input");
  textPicker.type = "color";
  textPicker.value = AppState.settings.darkTextColor;
  textPicker.oninput = () => {
    AppState.settings.darkTextColor = textPicker.value;
    saveStorage({ settings: AppState.settings });
    applyDarkMode(true);
  };

  textLabel.appendChild(textPicker);
  settingsContent.appendChild(textLabel);

//   // =====================
//   // 5. ダーク虹背景
//   // =====================
//   const rainbowBgLabel = document.createElement("label");
//   rainbowBgLabel.textContent = "ダークモード背景を虹色にする";
//   rainbowBgLabel.style.display = "flex";
//   rainbowBgLabel.style.gap = "6px";

//   const rainbowBgCheck = document.createElement("input");
//   rainbowBgCheck.type = "checkbox";
//   rainbowBgCheck.checked = AppState.settings.darkRainbowBg;
//   rainbowBgCheck.onchange = () => {
//     AppState.settings.darkRainbowBg = rainbowBgCheck.checked;
//     saveStorage({ settings: AppState.settings });
//     applyDarkMode(true);
//   };

//   rainbowBgLabel.prepend(rainbowBgCheck);
//   settingsContent.appendChild(rainbowBgLabel);

  // =====================
  // 6. ホバー虹色
  // =====================
  const hoverLabel = document.createElement("label");
  hoverLabel.textContent = "ボタンホバー虹色";
  hoverLabel.style.display = "flex";
  hoverLabel.style.gap = "6px";

  const hoverCheck = document.createElement("input");
  hoverCheck.type = "checkbox";
  hoverCheck.checked = AppState.settings.rainbowHover;
  hoverCheck.onchange = () => {
    AppState.settings.rainbowHover = hoverCheck.checked;
    saveStorage({ settings: AppState.settings });
    applyRainbowHover(hoverCheck.checked);
  };

  hoverLabel.prepend(hoverCheck);
  settingsContent.appendChild(hoverLabel);

  // =====================
  // 初期化ボタン
  // =====================
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "初期設定を読み込む";
  resetBtn.onclick = () => {
    if (!confirm("本当に初期設定に戻しますか？")) return;
    AppState.sets = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG.sets));
    AppState.active = window.DEFAULT_CONFIG.activeSet;
    saveStorage({ sets: AppState.sets });
    renderTabs();
    renderButtons();
    alert("初期設定をロードしました");
  };
  settingsContent.appendChild(resetBtn);

  // =====================
  // 5. 設定データ操作（インポート／エクスポート）
  // =====================
  const configLabel = document.createElement("div");
  configLabel.style.marginTop = "12px";
  configLabel.style.fontWeight = "bold";
  configLabel.textContent = "設定データ操作";
  settingsContent.appendChild(configLabel);

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "設定をエクスポート";
  exportBtn.style.marginTop = "6px";
  exportBtn.onclick = () => {
    const dataStr = JSON.stringify(AppState.sets, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "QuickAccessURL_config.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  settingsContent.appendChild(exportBtn);

  const importBtn = document.createElement("button");
  importBtn.textContent = "設定をインポート";
  importBtn.style.marginTop = "6px";
  importBtn.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          AppState.sets = imported;
          saveStorage({ sets: AppState.sets });
          renderTabs();
          renderButtons();
          alert("設定をインポートしました");
        } catch (err) {
          alert("設定ファイルの読み込みに失敗しました");
          console.error(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  settingsContent.appendChild(importBtn);
  // =====================
  // パネル表示
  // =====================
  settingsPanel.classList.add("open");

  const closeBtn = document.getElementById("closeSettingsBtn");
  if (closeBtn) closeBtn.onclick = () => settingsPanel.classList.remove("open");

  // 初期反映
  applyDarkMode(AppState.settings.darkMode);
};
