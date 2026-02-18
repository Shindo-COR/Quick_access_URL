// Tooltip 作成（URLホバー用）
const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function() {
  const buttonsEl = document.getElementById("buttons");
  buttonsEl.innerHTML = "";

  // =====================
  // 拡張機能を閉じるボタン（固定）
  // =====================
  const closeExtBtn = document.createElement("button");
  closeExtBtn.textContent = "✖　Quick Access URLを閉じる";
  closeExtBtn.className = "close-extension-btn";
  closeExtBtn.onclick = () => window.close();
  buttonsEl.appendChild(closeExtBtn);

  // =====================
  // 設定ボタン（固定）
  // =====================
  const settingBtn = document.createElement("button");
  settingBtn.textContent = "⚙ 設定";
  settingBtn.className = "setting-btn";
  settingBtn.onclick = () => {
    const settingPanel = document.getElementById("settingPanel");
    if (settingPanel) {
      settingPanel.classList.toggle("open");
    }
  };
  buttonsEl.appendChild(settingBtn);

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
    btn.style.background = b.color || "#607d8b";
    btn.style.cursor = "grab";
    btn.dataset.index = i;

    btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

    btn.onmouseenter = (e) => {
      tooltip.textContent = b.url || "";
      tooltip.style.opacity = 1;
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    };
    btn.onmousemove = (e) => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    };
    btn.onmouseleave = () => tooltip.style.opacity = 0;

    buttonsEl.appendChild(btn);
  });

  // =====================
  // SortableJSでドラッグ並び替え（メインボタンのみ）
  // =====================
  if (typeof Sortable !== "undefined") {
    if (buttonsEl._sortable) {
      buttonsEl._sortable.destroy();
    }

    buttonsEl._sortable = Sortable.create(buttonsEl, {
      animation: 150,
      ghostClass: "dragging",
      filter: ".close-extension-btn, .setting-btn",
      onMove: (evt) => {
        return !evt.related.classList.contains("close-extension-btn") &&
               !evt.related.classList.contains("setting-btn");
      },
      onEnd: (evt) => {
        const buttons = AppState.sets[AppState.active].buttons;
        const movedItem = buttons.splice(evt.oldIndex - 3, 1)[0]; // offset: close + setting + hr
        buttons.splice(evt.newIndex - 3, 0, movedItem);

        saveStorage({ sets: AppState.sets });
        renderButtons();
      },
    });
  }
};
// 設定パネルの閉じるボタン挙動
const closeSettingBtn = document.getElementById("closeSettingBtn");
if (closeSettingBtn) {
  closeSettingBtn.onclick = () => {
    const panel = document.getElementById("settingPanel");
    if (panel) panel.classList.remove("open");
  };
}
