window.renderTabs = function() {
  const tabsEl = document.getElementById("tabs");
  tabsEl.innerHTML = "";

  const keys = Object.keys(AppState.sets);

  keys.forEach(key => {
    const tab = document.createElement("div");
    tab.className = "tab";
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

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = e => {
      e.stopPropagation();
      openEditor(key);
    };

    tab.appendChild(title);
    tab.appendChild(editBtn);
    tabsEl.appendChild(tab);
  });

  // タブ右に追加ボタンを設置
  const addBtn = document.createElement("button");
  addBtn.id = "addTabBtn";
  addBtn.textContent = "＋";
  addBtn.onclick = () => {
    const keys = Object.keys(AppState.sets);
    if (keys.length >= AppState.MAX_TABS) {
      alert("タブは最大5つまでです");
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
