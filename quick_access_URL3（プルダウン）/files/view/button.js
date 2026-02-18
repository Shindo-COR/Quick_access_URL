// ツールチップ作成（全体で1つだけ）
const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function() {
  const buttonsEl = document.getElementById("buttons");
  buttonsEl.innerHTML = "";

  const list = AppState.sets[AppState.active]?.buttons || [];

  list.forEach((b, i) => {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "4px";

    const btn = document.createElement("button");
    btn.textContent = b.label;
    btn.style.background = b.color || "#607d8b";
    btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

    // ツールチップ表示
    btn.onmouseenter = () => {
      tooltip.textContent = b.url;
      tooltip.style.opacity = 1;
    };
    btn.onmousemove = e => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    };
    btn.onmouseleave = () => tooltip.style.opacity = 0;

    // 簡易編集プルダウン
    const select = document.createElement("select");
    select.style.fontSize = "10px";
    select.style.padding = "2px";
    select.style.width = "60px";
    select.innerHTML = `
      <option value="">編集</option>
      <option value="edit">名前/URL編集</option>
      <option value="color">色変更</option>
    `;
    select.onchange = e => {
      if (e.target.value === "edit") {
        const newLabel = prompt("ボタン名を入力", b.label);
        if (newLabel !== null) b.label = newLabel;
        const newUrl = prompt("URLを入力", b.url);
        if (newUrl !== null) b.url = newUrl;
      } else if (e.target.value === "color") {
        const newColor = prompt("背景色を16進数で入力 (#rrggbb)", b.color || "#607d8b");
        if (newColor) b.color = newColor;
      }

      // 即時反映
      saveStorage({ sets: AppState.sets });
      renderButtons();
      e.target.value = "";
    };

    container.appendChild(btn);
    container.appendChild(select);
    buttonsEl.appendChild(container);
  });
};
