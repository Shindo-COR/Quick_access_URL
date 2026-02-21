const memoTextarea = document.getElementById("memoTextarea");
const copyMemoBtn = document.getElementById("copyMemoBtn");
const clearMemoBtn = document.getElementById("clearMemoBtn");

// 初期読み込み
const savedMemo = localStorage.getItem("urlCommandCenterMemo");
if (savedMemo) memoTextarea.value = savedMemo;

// 入力保存（debounce推奨）
let memoTimer;
memoTextarea.oninput = () => {
  clearTimeout(memoTimer);
  memoTimer = setTimeout(() => {
    localStorage.setItem("urlCommandCenterMemo", memoTextarea.value);
  }, 300);
};
//copyボタン
copyMemoBtn.onclick = () => {
  memoTextarea.select();
  document.execCommand("copy");
  copyMemoBtn.textContent = "✅ Copied";
  setTimeout(() => (copyMemoBtn.textContent = "📋 Copy"), 1000);
};
// 削除ボタン
clearMemoBtn.onclick = () => {
  memoTextarea.value = "";
  localStorage.removeItem("urlCommandCenterMemo");
};

// Ctrl+Enter でコピー
memoTextarea.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "c") {
    copyMemoBtn.click();
  }
});

//ボタンからメモにURL追記
btn.onclick = () => {
  chrome.tabs.create({ url: b.url });
  memoTextarea.value += `\n${b.url}`;
};