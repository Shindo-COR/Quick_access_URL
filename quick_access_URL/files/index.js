initStorage(() => {
  getStorage((data) => {
    const sets = data.sets;
    const active = data.activeSet || "default";

    renderTabs(sets, active);
    renderButtons(sets[active]);
  });
});

const tabsEl = document.getElementById("tabs");
const buttonsEl = document.getElementById("buttons");

function renderTabs(sets, active) {
  tabsEl.innerHTML = "";
  Object.keys(sets).forEach(setName => {
    const btn = document.createElement("button");
    btn.textContent = setName;
    if (setName === active) btn.style.fontWeight = "bold";

    btn.onclick = () => {
      saveStorage({ activeSet: setName });
      location.reload();
    };

    tabsEl.appendChild(btn);
  });
}

function renderButtons(buttons) {
  buttonsEl.innerHTML = "";
  buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.label;
    btn.style.background = b.color || "#333";
    btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });
    buttonsEl.appendChild(btn);
  });
}

document.getElementById("openOption").onclick = () => {
  chrome.runtime.openOptionsPage();
};
