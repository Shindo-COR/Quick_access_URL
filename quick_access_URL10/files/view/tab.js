window.renderTabs = function() {
  const tabsEl = document.getElementById("tabs");
  tabsEl.innerHTML = "";

  const keys = Object.keys(AppState.sets);

  keys.forEach((key, index) => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.draggable = true; // ドラッグ可能
    if (key === AppState.active) tab.classList.add("active");

    const title = document.createElement("span");
    title.textContent = AppState.sets[key].title;
    title.ondblclick = () => openEditor(key);

    tab.onclick = () => {
      AppState.active = key;
      saveStorage({ activeSet: key });
      renderTabs();
      renderButtons();
    };

	// 編集ボタン（画像）
	const editBtn = document.createElement("button");
	editBtn.textContent = "✏️";
	editBtn.className = "edit-tab-btn"; // CSSクラス

	// ツールチップ用 span を追加
	const tooltip = document.createElement("span");
	tooltip.className = "tooltip-text";

	editBtn.onclick = e => {
		e.stopPropagation();
		openEditor(key); 
	};

	editBtn.appendChild(tooltip);
	tab.appendChild(title);
	tab.appendChild(editBtn);
	tabsEl.appendChild(tab);
    // ------------------------
    // ドラッグ & ドロップ処理
    // ------------------------
    tab.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", key);
      tab.classList.add("dragging");
    });

    tab.addEventListener("dragend", e => {
      tab.classList.remove("dragging");
    });

    tab.addEventListener("dragover", e => {
      e.preventDefault();
    });

    tab.addEventListener("drop", e => {
      e.preventDefault();
      const draggedKey = e.dataTransfer.getData("text/plain");
      if (draggedKey === key) return;

      // AppState.sets の順序を入れ替え
      const newSets = {};
      const draggedSet = AppState.sets[draggedKey];
      Object.keys(AppState.sets).forEach(k => {
        if (k === key) {
          newSets[draggedKey] = draggedSet;
        }
        if (k !== draggedKey) {
          newSets[k] = AppState.sets[k];
        }
      });
      AppState.sets = newSets;
      saveStorage({ sets: AppState.sets });

      renderTabs();
    });
  });

  // タブ右に追加ボタンを設置
  const addBtn = document.createElement("button");
  addBtn.id = "addTabBtn";
  addBtn.textContent = "＋";
  addBtn.onclick = () => {
    const keys = Object.keys(AppState.sets);
    if (keys.length >= AppState.MAX_TABS) {
      alert("タブは最大15つまでです");
      return;
    }
    const key = "set" + Date.now();
    AppState.sets[key] = { title: "New Tab", buttons: [] };
    AppState.active = key;
    saveStorage({ sets: AppState.sets, activeSet: key });
    renderTabs();
    renderButtons();
  };
  tabsEl.appendChild(addBtn);
};
