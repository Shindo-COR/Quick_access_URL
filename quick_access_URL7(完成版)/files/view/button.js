// const tooltip = document.createElement("div");
// tooltip.className = "url-tooltip";
// document.body.appendChild(tooltip);

// window.renderButtons = function() {
//   const buttonsEl = document.getElementById("buttons");
//   buttonsEl.innerHTML = "";

//   const list = AppState.sets[AppState.active]?.buttons || [];

//   list.forEach(b => {
//     const btn = document.createElement("button");
//     btn.textContent = b.label;
//     btn.style.background = b.color || "#333";

//     btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

//     btn.onmouseenter = () => {
//       tooltip.textContent = b.url;
//       tooltip.style.opacity = 1;
//     };
//     btn.onmousemove = e => {
//       tooltip.style.left = e.pageX + 10 + "px";
//       tooltip.style.top = e.pageY + 10 + "px";
//     };
//     btn.onmouseleave = () => tooltip.style.opacity = 0;

//     buttonsEl.appendChild(btn);
//   });
// };

// window.renderButtons = function() {
//   const buttonsEl = document.getElementById("buttons");
//   buttonsEl.innerHTML = "";

//   const list = AppState.sets[AppState.active]?.buttons || [];

//   list.forEach((b, i) => {
//     const btn = document.createElement("button");
//     btn.textContent = b.label;
//     btn.style.background = b.color || "#607d8b";
//     btn.style.cursor = "grab"; // 視覚的にドラッグ可能に
//     btn.dataset.index = i;

//     btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

//     buttonsEl.appendChild(btn);
//   });

//   // SortableJSでドラッグ可能に
//   Sortable.create(buttonsEl, {
//     animation: 150, // アニメーション速度
//     ghostClass: "dragging", // ドラッグ中のスタイル
//     onEnd: (evt) => {
//       const buttons = AppState.sets[AppState.active].buttons;
//       const movedItem = buttons.splice(evt.oldIndex, 1)[0];
//       buttons.splice(evt.newIndex, 0, movedItem);

//       saveStorage({ sets: AppState.sets });
//       renderButtons(); // 並び替え後も反映
//     }
//   });
// };


// Tooltip 作成
// const tooltip = document.createElement("div");
// tooltip.className = "url-tooltip";
// document.body.appendChild(tooltip);

// window.renderButtons = function() {
//   const buttonsEl = document.getElementById("buttons");
//   buttonsEl.innerHTML = "";

//   const list = AppState.sets[AppState.active]?.buttons || [];

//   // ボタンを作成
//   list.forEach((b, i) => {
//     const btn = document.createElement("button");
//     btn.textContent = b.label;
//     btn.style.background = b.color || "#607d8b";
//     btn.style.cursor = "grab"; // ドラッグ可能であることを視覚化
//     btn.dataset.index = i;

//     // クリックでURLを開く
//     btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

//     // ホバーで URL ツールチップ
//     btn.onmouseenter = (e) => {
//       tooltip.textContent = b.url || "";
//       tooltip.style.opacity = 1;
//       tooltip.style.left = e.pageX + 10 + "px";
//       tooltip.style.top = e.pageY + 10 + "px";
//     };
//     btn.onmousemove = (e) => {
//       tooltip.style.left = e.pageX + 10 + "px";
//       tooltip.style.top = e.pageY + 10 + "px";
//     };
//     btn.onmouseleave = () => tooltip.style.opacity = 0;

//     buttonsEl.appendChild(btn);
//   });

//   // ドラッグ並び替え（SortableJS）
//   if (typeof Sortable !== "undefined") {
//     // 既にインスタンスがある場合は破棄して再作成
//     if (buttonsEl._sortable) {
//       buttonsEl._sortable.destroy();
//     }

//     buttonsEl._sortable = Sortable.create(buttonsEl, {
//       animation: 150,
//       ghostClass: "dragging",
//       onEnd: (evt) => {
//         const buttons = AppState.sets[AppState.active].buttons;
//         const movedItem = buttons.splice(evt.oldIndex, 1)[0];
//         buttons.splice(evt.newIndex, 0, movedItem);

//         saveStorage({ sets: AppState.sets });
//         renderButtons(); // 並び替え後も即時反映
//       },
//     });
//   }
// };


// Tooltip 作成（URLホバー用）


// Tooltip 作成（URLホバー用）
const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function() {
  const buttonsEl = document.getElementById("buttons");
  buttonsEl.innerHTML = "";

  // =====================
  // メインURLボタン群
  // =====================
  const list = AppState.sets[AppState.active]?.buttons || [];

  list.forEach((b, i) => {
    const btn = document.createElement("button");
    btn.textContent = b.label;
    btn.style.background = b.color || "#607d8b";
    btn.style.cursor = "grab"; // ドラッグ可能を視覚化
    btn.dataset.index = i;

    // クリックでURLを開く
    btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

    // ホバーで URL ツールチップ
    btn.onmouseenter = (e) => {
      tooltip.textContent = b.url || "";
      tooltip.style.opacity = 1;
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    };
    btn.onmousemove = (e) => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    };
    btn.onmouseleave = () => tooltip.style.opacity = 0;

    buttonsEl.appendChild(btn);
  });

  // =====================
  // 拡張機能を閉じるボタン（固定・一番下）
  // =====================
  const hr = document.createElement("hr");
  hr.style.margin = "6px 0";
  buttonsEl.appendChild(hr);

  const closeExtBtn = document.createElement("button");
  closeExtBtn.textContent = "✖　終了する";
  closeExtBtn.className = "close-extension-btn";
  closeExtBtn.onclick = () => window.close(); // 拡張機能を閉じる
  buttonsEl.appendChild(closeExtBtn);

  // =====================
  // SortableJSでドラッグ並び替え（メインボタンのみ）
  // =====================
  if (typeof Sortable !== "undefined") {
    if (buttonsEl._sortable) {
      buttonsEl._sortable.destroy();
    }

    // 閉じるボタン（最後の2つ: hr + closeExtBtn）を飛ばす
    const mainButtonsCount = buttonsEl.children.length - 2;

    buttonsEl._sortable = Sortable.create(buttonsEl, {
      animation: 150,
      ghostClass: "dragging",
      filter: ".close-extension-btn",
      onMove: (evt) => {
        return !evt.related.classList.contains("close-extension-btn");
      },
      onEnd: (evt) => {
        const buttons = AppState.sets[AppState.active].buttons;
        const movedItem = buttons.splice(evt.oldIndex, 1)[0]; // offset不要
        buttons.splice(evt.newIndex, 0, movedItem);

        saveStorage({ sets: AppState.sets });
        renderButtons();
      },
    });
  }
};
