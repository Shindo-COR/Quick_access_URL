window.openEditor = function(key) {
  const panel = document.getElementById("editorPanel");
  const content = document.getElementById("editorContent");
  panel.classList.add("open");

  const set = AppState.sets[key];

  content.innerHTML = `
    <label>タブ名</label>
    <input id="tabTitle" value="${set.title}">
    <hr>
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

  document.getElementById("addBtn").onclick = () => {
    set.buttons.push({ label:"", url:"", color:"#4f46e5" });
    drawRows();
  };
};

document.getElementById("closeEditor").onclick = () => {
  document.getElementById("editorPanel").classList.remove("open");
};
