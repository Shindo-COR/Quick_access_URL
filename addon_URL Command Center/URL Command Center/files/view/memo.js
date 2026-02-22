const memoSelect = document.getElementById("memoSelect");
const memoTextarea = document.getElementById("memoTextarea");
const addMemoBtn = document.getElementById("addMemoBtn");
const deleteMemoBtn = document.getElementById("deleteMemoBtn");
const copyMemoBtn = document.getElementById("copyMemoBtn");
const clearMemoBtn = document.getElementById("clearMemoBtn");
const memoToButtonBtn = document.getElementById("memoToButtonBtn");

// 初期データ 
const STORAGE_KEY = "urlCommandCenterMemoMulti";
let memoData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
	memos: { "memo1": "" },
	activeMemo: "memo1"
};

// UI再描画 
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

//  メモロード 
function loadActiveMemo() {
	memoTextarea.value = memoData.memos[memoData.activeMemo] || "";
}

//  保存 
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
	if (memoData.activeMemo === "memo1") return alert("memo1は削除できません");
	delete memoData.memos[memoData.activeMemo];
	memoData.activeMemo = "memo1";
	renderMemoSelect();
	loadActiveMemo();
	saveMemo();
};

// コピー
copyMemoBtn.onclick = () => {
	memoTextarea.select();
	document.execCommand("copy");
	copyMemoBtn.textContent = "✅ コピーしました";
	setTimeout(() => copyMemoBtn.textContent = "コピー(Ctrl+Cでも可)", 1500);
};

// クリア
clearMemoBtn.onclick = () => {
	memoTextarea.value = "";
	saveMemo();
};

// Ctrl+C shortcut
memoTextarea.addEventListener("keydown", e => {
	if (e.ctrlKey && e.key === "c") copyMemoBtn.click();
});

// ===============================
// メモから複数ボタン一括追加
// ===============================
// ボタン or myset 両対応
function parseMemoSmart(text) {
	const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
	if (!lines.length) return null;

	const first = lines[0];
	const mysetMatch = first.match(/^myset\s+(.+)/i);

	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const buttons = [];

	const startIndex = mysetMatch ? 1 : 0;
	const setName = mysetMatch ? mysetMatch[1].trim() : null;

	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i];
		const urls = line.match(urlRegex);
		if (!urls) continue;

		const url = urls[0];
		let label = line.replace(url, "").trim();
		if (!label) label = url.replace(/^https?:\/\//, "").split("/")[0];

		buttons.push({
		label,
		url,
		color: "#6b7cff"
		});
	}

	return { isMyset: !!mysetMatch, setName, buttons };
}

// メモ変換実行関数
	function executeMemo() {
		const memo = memoTextarea.value;
		const parsed = parseMemoSmart(memo);
		if (!parsed || !parsed.buttons.length) {
			alert("有効なURLが見つかりません");
			return;
		}

  // =====================
  // MySet生成モード
  // =====================
	if (parsed.isMyset) {
		const name = parsed.setName;

		if (AppState.sets[name]) {
		if (!confirm(`"${name}" は既に存在します。上書きしますか？`)) return;
		}

		AppState.sets[name] = {
		title: name,
		buttons: parsed.buttons
		};

		AppState.active = name;
		saveStorage({ sets: AppState.sets, activeSet: name });
		renderTabs();
		renderButtons();

		alert(` マイセット "${name}" を生成しました`);
		return;
	}

	// =====================
	// ボタン追加モード
	// =====================
	const currentSet = AppState.sets[AppState.active];
	currentSet.buttons.push(...parsed.buttons);

	saveStorage({ sets: AppState.sets });
	renderButtons();

	// alert(` ${parsed.buttons.length} 件のボタンを追加しました`);
}

// ボタンイベント登録
const memoExecuteBtn = document.getElementById("memoExecuteBtn");
memoExecuteBtn.onclick = executeMemo;