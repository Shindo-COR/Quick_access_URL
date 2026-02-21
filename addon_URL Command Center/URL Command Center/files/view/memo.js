const memoSelect = document.getElementById("memoSelect");
const memoTextarea = document.getElementById("memoTextarea");
const addMemoBtn = document.getElementById("addMemoBtn");
const deleteMemoBtn = document.getElementById("deleteMemoBtn");
const copyMemoBtn = document.getElementById("copyMemoBtn");
const clearMemoBtn = document.getElementById("clearMemoBtn");
const memoToButtonBtn = document.getElementById("memoToButtonBtn");

// === 初期データ ===
const STORAGE_KEY = "urlCommandCenterMemoMulti";
let memoData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  memos: { "default": "" },
  activeMemo: "default"
};

// === UI再描画 ===
function renderMemoSelect() {
  memoSelect.innerHTML = "";
  Object.keys(memoData.memos).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    memoSelect.appendChild(opt);
  });
  memoSelect.value = memoData.activeMemo;
}

// === メモロード ===
function loadActiveMemo() {
  memoTextarea.value = memoData.memos[memoData.activeMemo] || "";
}

// === 保存 ===
function saveMemo() {
  memoData.memos[memoData.activeMemo] = memoTextarea.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memoData));
}

// 初期表示
renderMemoSelect();
loadActiveMemo();

// 切替
memoSelect.onchange = () => {
  memoData.activeMemo = memoSelect.value;
  loadActiveMemo();
};

// 入力保存（debounce）
let memoTimer;
memoTextarea.oninput = () => {
  clearTimeout(memoTimer);
  memoTimer = setTimeout(saveMemo, 300);
};

// 追加
addMemoBtn.onclick = () => {
  const name = prompt("メモ名を入力");
  if (!name) return;
  memoData.memos[name] = "";
  memoData.activeMemo = name;
  renderMemoSelect();
  loadActiveMemo();
  saveMemo();
};

// 削除
deleteMemoBtn.onclick = () => {
  if (memoData.activeMemo === "default") return alert("defaultは削除不可");
  delete memoData.memos[memoData.activeMemo];
  memoData.activeMemo = "default";
  renderMemoSelect();
  loadActiveMemo();
  saveMemo();
};

// Copy
copyMemoBtn.onclick = () => {
  memoTextarea.select();
  document.execCommand("copy");
  copyMemoBtn.textContent = "✅ Copied";
  setTimeout(() => copyMemoBtn.textContent = "📋 Copy", 1000);
};

// Clear
clearMemoBtn.onclick = () => {
  memoTextarea.value = "";
  saveMemo();
};

// Ctrl+C shortcut
memoTextarea.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "c") copyMemoBtn.click();
});

// ===============================
// ===============================
// メモから複数ボタン一括追加
// ===============================
memoToButtonBtn.onclick = () => {
	const text = memoTextarea.value.trim();
	if (!text) return alert("メモが空です");

	const urlRegex = /https?:\/\/[^\s]+/g;
	const matches = [...text.matchAll(urlRegex)];
	if (!matches.length) return alert("URLが見つかりません");

	const setKey = AppState.active;
	if (!setKey) return alert("アクティブなマイセットがありません");

	const set = AppState.sets[setKey];
	if (!set) return alert("セットが存在しません");

	let lastIndex = 0;

	matches.forEach(m => {
		const url = m[0];
		const idx = m.index;

		// URL前テキスト → ラベル
		const labelRaw = text.slice(lastIndex, idx).trim();
		let label =
		labelRaw.split(/\s+/).pop() ||
		new URL(url).hostname.replace("www.", "");

		set.buttons.push({
		label,
		url,
		color: "#6b7cff" // 固定色
		});

		lastIndex = idx + url.length;
	});

	saveStorage({ sets: AppState.sets });
	renderButtons();

	alert(`⚡ ${matches.length} 件追加しました`);
};