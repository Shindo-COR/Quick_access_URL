// files/view/setting/base.js

window.initSettings = function() {
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsContent = document.getElementById("settingContent");

  if (!settingsPanel || !settingsContent) return;

  // 中身をクリア
  settingsContent.innerHTML = "";

  // 保存されていない場合の初期値
  AppState.settings = AppState.settings || {};
  if (AppState.settings.buttonsOnTop === undefined) AppState.settings.buttonsOnTop = true;
  if (AppState.settings.darkMode === undefined) AppState.settings.darkMode = false;
  if (AppState.settings.rainbowHover === undefined) AppState.settings.rainbowHover = false;

  // =====================
  // 1. 閉じる/設定ボタンの位置設定（チェックボックス）
  // =====================
  const btnPositionLabel = document.createElement("label");
  btnPositionLabel.style.display = "flex";
  btnPositionLabel.style.alignItems = "center";
  btnPositionLabel.style.gap = "6px";
  btnPositionLabel.textContent = "閉じる/設定ボタンを上に表示";

  const btnPositionCheckbox = document.createElement("input");
  btnPositionCheckbox.type = "checkbox";
  btnPositionCheckbox.checked = AppState.settings.buttonsOnTop;

  btnPositionCheckbox.onchange = () => {
    AppState.settings.buttonsOnTop = btnPositionCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    renderButtons(); // 変更を即時反映
  };

  btnPositionLabel.prepend(btnPositionCheckbox);
  settingsContent.appendChild(btnPositionLabel);

  // =====================
  // 2. ダークモード（背景のみ）
  // =====================
  const darkModeLabel = document.createElement("label");
  darkModeLabel.style.display = "flex";
  darkModeLabel.style.alignItems = "center";
  darkModeLabel.style.gap = "6px";
  darkModeLabel.textContent = "ダークモード（背景のみ）";

  const darkModeCheckbox = document.createElement("input");
  darkModeCheckbox.type = "checkbox";
  darkModeCheckbox.checked = AppState.settings.darkMode;

  darkModeCheckbox.onchange = () => {
    AppState.settings.darkMode = darkModeCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    applyDarkMode(darkModeCheckbox.checked); // 背景のみ変更
  };

  darkModeLabel.prepend(darkModeCheckbox);
  settingsContent.appendChild(darkModeLabel);

  // =====================
  // 3. ボタンホバー虹色
  // =====================
  const rainbowLabel = document.createElement("label");
  rainbowLabel.style.display = "flex";
  rainbowLabel.style.alignItems = "center";
  rainbowLabel.style.gap = "6px";
  rainbowLabel.textContent = "ボタンホバー時に虹色にする";

  const rainbowCheckbox = document.createElement("input");
  rainbowCheckbox.type = "checkbox";
  rainbowCheckbox.checked = AppState.settings.rainbowHover;

  rainbowCheckbox.onchange = () => {
    AppState.settings.rainbowHover = rainbowCheckbox.checked;
    saveStorage({ settings: AppState.settings });
    applyRainbowHover(rainbowCheckbox.checked);
  };

  rainbowLabel.prepend(rainbowCheckbox);
  settingsContent.appendChild(rainbowLabel);

  // =====================
  // 4. 初期設定読み込み（確認ダイアログ）
  // =====================
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "初期設定を読み込む";
  resetBtn.style.marginTop = "6px";
  resetBtn.onclick = () => {
    if (confirm("本当に初期設定に戻しますか？保存されていない内容は失われます。")) {
      AppState.sets = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG.sets));
      AppState.active = window.DEFAULT_CONFIG.activeSet;
      saveStorage({ sets: AppState.sets, activeSet: AppState.active });
      renderTabs();
      renderButtons();
      alert("初期設定をロードしました");
    }
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
  // パネルを開く
  // =====================
  settingsPanel.classList.add("open");

  // パネル閉じる
  const closeBtn = document.getElementById("closeSettingsBtn");
  if (closeBtn) closeBtn.onclick = () => settingsPanel.classList.remove("open");

  // =====================
  // 初期表示でダークモード反映
  // =====================
  applyDarkMode(AppState.settings.darkMode);
};
