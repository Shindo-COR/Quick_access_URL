const selector = document.getElementById("setSelector");
const editor = document.getElementById("editor");
let currentSet = "default";
let sets = {};

getStorage((data) => {
  sets = data.sets;
  Object.keys(sets).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    selector.appendChild(opt);
  });
  loadSet("default");
});

selector.onchange = () => loadSet(selector.value);

function loadSet(name) {
  currentSet = name;
  editor.innerHTML = "";
  sets[name].forEach((b, i) => addRow(b, i));
}

function addRow(btn, index) {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <input placeholder="Label" value="${btn.label}">
    <input placeholder="URL" value="${btn.url}">
    <input type="color" value="${btn.color}">
    <button>削除</button>
  `;

  row.querySelector("button").onclick = () => {
    sets[currentSet].splice(index, 1);
    loadSet(currentSet);
  };

  editor.appendChild(row);
}

document.getElementById("add").onclick = () => {
  sets[currentSet].push({ label: "New", url: "", color: "#000000" });
  loadSet(currentSet);
};

document.getElementById("save").onclick = () => {
  const rows = editor.querySelectorAll(".row");
  sets[currentSet] = [...rows].map(r => {
    const inputs = r.querySelectorAll("input");
    return {
      label: inputs[0].value,
      url: inputs[1].value,
      color: inputs[2].value
    };
  });

  saveStorage({ sets });
  alert("保存しました");
};

document.getElementById("reset").onclick = () => {
  if (!confirm("本当に初期化しますか？")) return;
  saveStorage({ sets: DEFAULT_SETS, activeSet: "default" });
  location.reload();
};
