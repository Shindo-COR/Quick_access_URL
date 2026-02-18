// editor.js - リセット機能追加版
window.openEditor = function(key) {
  const panel = document.getElementById("editorPanel");
  const content = document.getElementById("editorContent");
  panel.classList.add("open");

  const set = AppState.sets[key];

  // エディタ画面HTML
  content.innerHTML = `
    <label>タブ名</label>
    <input id="tabTitle" value="${set.title}">
    <button id="duplicateTab">複製</button>
    <button id="deleteTab">削除</button>
    <button id="resetTab">リセット</button>
    <hr>
    <div style="font-weight:bold">アクセスURLリスト</div>
    <div id="btnEditor"></div>
    <button id="addBtn">＋ URL追加</button>
  `;

  const btnEditor = document.getElementById("btnEditor");

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
    set.buttons.push({ label:"", url:"", color:"#4f46e5" });
    drawRows();
  };

  // タブ複製
  const duplicateBtn = document.getElementById("duplicateTab");
  if (Object.keys(AppState.sets).length >= AppState.MAX_TABS) {
    duplicateBtn.disabled = true;
    duplicateBtn.textContent = "複製（上限5）";
    duplicateBtn.style.opacity = 0.5;
  }
  duplicateBtn.onclick = () => {
    const keys = Object.keys(AppState.sets);
    if (keys.length >= AppState.MAX_TABS) return;
    const newKey = "set" + Date.now();
    const cloned = JSON.parse(JSON.stringify(set));
    cloned.title = cloned.title + " (copy)";
    const newSets = {};
    keys.forEach(k => {
      newSets[k] = AppState.sets[k];
      if (k === key) newSets[newKey] = cloned;
    });
    AppState.sets = newSets;
    AppState.active = newKey;
    saveStorage({ sets: AppState.sets, activeSet: AppState.active });
    closeEditorPanel();
    renderTabs();
    renderButtons();
  };

  // タブ削除
  document.getElementById("deleteTab").onclick = () => {
    const keys = Object.keys(AppState.sets);
    if (keys.length <= AppState.MIN_TABS) {
      alert("最低1つのタブが必要です");
      return;
    }
    delete AppState.sets[key];
    AppState.active = Object.keys(AppState.sets)[0];
    saveStorage({ sets: AppState.sets, activeSet: AppState.active });
    closeEditorPanel();
    renderTabs();
    renderButtons();
  };

  // タブリセット（初期化）
	document.getElementById("resetTab").onclick = () => {
	if (!confirm("このタブを初期状態にリセットしますか？\n編集内容は失われます。")) return;
	const defaultSet = window.DEFAULT_CONFIG.sets[key] || { title: "New Tab", buttons: [] };

	set.title = defaultSet.title;
	set.buttons = JSON.parse(JSON.stringify(defaultSet.buttons));
	drawRows();
	};


  // 編集を閉じる時も自動保存 + 即時反映
  document.getElementById("closeEditor").onclick = () => {
    // タブ名更新
    set.title = document.getElementById("tabTitle").value;

    // URLリスト更新
    const rows = document.querySelectorAll("#btnEditor .row");
    set.buttons = [...rows].map(r => ({
      label: r.querySelector(".label").value,
      url: r.querySelector(".url").value,
      color: r.querySelector(".color").value
    }));

    // 保存
    saveStorage({ sets: AppState.sets });

    // UIに即時反映
    renderTabs();
    renderButtons();

    // パネル閉じる
    closeEditorPanel();
  };
};

// エディタパネル閉じる
function closeEditorPanel() {
  document.getElementById("editorPanel").classList.remove("open");
}
