window.openEditor = function(key) {
  const panel = document.getElementById("editorPanel");
  const content = document.getElementById("editorContent");
  panel.classList.add("open");

  const set = AppState.sets[key];

  // エディタ画面HTML
  content.innerHTML = `
    <label>タブ名</label>
    <input id="tabTitle" value="${set.title}">
    <button id="duplicateTab">タブの複製</button>
    <button id="deleteTab">タブの削除</button>
    <button id="resetTab">初期化</button>
    <hr>
    <div style="font-weight:bold">アクセスURLリスト</div>
    <div id="btnEditor"></div>
    <button id="addBtn">＋ URL追加</button>
  `;

  const btnEditor = document.getElementById("btnEditor");

  // ボタン行描画
  function drawRows() {
    btnEditor.innerHTML = "";
    set.buttons.forEach((b, i) => {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
        <input class="label" placeholder="ボタン名を入力" value="${b.label}">
        <input class="url" placeholder="URLを入力" value="${b.url}">
        <input type="color" class="color" value="${b.color}">
        <button class="delete">×</button>
      `;
      row.querySelector(".delete").onclick = () => {
        set.buttons.splice(i,1);
        drawRows();
      };
      btnEditor.appendChild(row);
    });
  }

  drawRows();

  // URL追加
  document.getElementById("addBtn").onclick = () => {
    set.buttons.push({ label:"", url:"", color:"#f19dc3" });
    drawRows();
  };

  // 複製
  const duplicateBtn = document.getElementById("duplicateTab");
  duplicateBtn.onclick = () => {
    const keys = Object.keys(AppState.sets);
    if (keys.length >= AppState.MAX_TABS) return;
    const newKey = "set" + Date.now();
    const cloned = JSON.parse(JSON.stringify(set));
    cloned.title += " (copy)";
    AppState.sets[newKey] = cloned;
    AppState.active = newKey;
    saveStorage({ sets: AppState.sets, activeSet: AppState.active });
    closeEditorPanel();
    renderTabs();
    renderButtons();
  };

  // 削除
  const deleteBtn = document.getElementById("deleteTab");
  deleteBtn.onclick = () => {
    const keys = Object.keys(AppState.sets);
    if (keys.length <= AppState.MIN_TABS) { alert("最低1つのタブが必要です"); return; }
    delete AppState.sets[key];
    AppState.active = Object.keys(AppState.sets)[0];
    saveStorage({ sets: AppState.sets, activeSet: AppState.active });
    closeEditorPanel();
    renderTabs();
    renderButtons();
  };

// 初期化（全タブを defaultConfig の状態に戻す）
	document.getElementById("resetTab").onclick = () => {
	if (!confirm("全タブを初期状態にリセットしますか？\n編集内容は失われます。")) return;

	// DEFAULT_CONFIG の sets を丸ごとコピー
	AppState.sets = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG.sets));
	AppState.active = window.DEFAULT_CONFIG.activeSet || Object.keys(AppState.sets)[0];

	// UI 即時反映
	renderTabs();
	renderButtons();

	// 編集画面を閉じる
	closeEditorPanel();

	// 保存
	saveStorage({ sets: AppState.sets, activeSet: AppState.active });
	};

  // 編集を閉じる
  document.getElementById("close-btn").onclick = () => {
    set.title = document.getElementById("tabTitle").value;
    const rows = document.querySelectorAll("#btnEditor .row");
    set.buttons = [...rows].map(r => ({
      label: r.querySelector(".label").value,
      url: r.querySelector(".url").value,
      color: r.querySelector(".color").value
    }));
    saveStorage({ sets: AppState.sets });
    renderTabs();
    renderButtons();
    closeEditorPanel();
  };
};

function closeEditorPanel() {
  document.getElementById("editorPanel").classList.remove("open");
}
