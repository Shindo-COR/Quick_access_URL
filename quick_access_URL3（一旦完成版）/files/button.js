const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function() {
  const buttonsEl = document.getElementById("buttons");
  buttonsEl.innerHTML = "";

  const list = AppState.sets[AppState.active]?.buttons || [];

  list.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.label;
    btn.style.background = b.color || "#333";

    btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

    btn.onmouseenter = () => {
      tooltip.textContent = b.url;
      tooltip.style.opacity = 1;
    };
    btn.onmousemove = e => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    };
    btn.onmouseleave = () => tooltip.style.opacity = 0;

    buttonsEl.appendChild(btn);
  });
};
