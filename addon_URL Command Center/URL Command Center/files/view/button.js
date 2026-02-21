// Tooltip 作成（URLホバー用）
const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function () {
	const buttonsEl = document.getElementById("buttons");
	if (!buttonsEl) return;
	buttonsEl.innerHTML = "";

	// =====================
	// 固定ボタン生成
	// =====================
	const closeExtBtn = document.createElement("button");
	closeExtBtn.textContent = "✖　終了する";
	closeExtBtn.className = "close-extension-btn";
	closeExtBtn.onclick = () => window.close();

	// ：マイセット編集ボタン
	const editSetBtn = document.createElement("button");
	editSetBtn.textContent = "⇅　 マイセットの編集";
	editSetBtn.className = "edit-set-btn";
	editSetBtn.onclick = () => {
		const key = AppState.active;
		if (!key) return;
		if (typeof window.openEditor === "function") {
			window.openEditor(key);
		}
	};

	const settingBtn = document.createElement("button");
	settingBtn.textContent = "⚙　全体設定";
	settingBtn.className = "setting-btn";
	settingBtn.onclick = () => {
		const settingsPanel = document.getElementById("settingsPanel");
		if (settingsPanel) {
		settingsPanel.classList.toggle("open");
		if (typeof window.initSettings === "function") window.initSettings();
		}
	};

	const hr = document.createElement("hr");
	hr.style.margin = "6px 0";

	// =====================
	// メインボタン群 Fragment
	// =====================
	const mainButtonsFragment = document.createDocumentFragment();
	const list = AppState.sets[AppState.active]?.buttons || [];

	list.forEach((b, i) => {
		const btn = document.createElement("button");
		btn.textContent = b.label;
		btn.dataset.index = i;
		btn.dataset.color = b.color || "#607d8b";
		btn.dataset.url = b.url || "";
		btn.style.background = btn.dataset.color;
		btn.style.cursor = "grab";

		btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

		btn.addEventListener("mouseenter", (e) => {
		tooltip.textContent = btn.dataset.url;
		tooltip.style.opacity = 1;
		tooltip.style.left = e.pageX + 10 + "px";
		tooltip.style.top = e.pageY + 10 + "px";
		});

		btn.addEventListener("mousemove", (e) => {
		tooltip.style.left = e.pageX + 10 + "px";
		tooltip.style.top = e.pageY + 10 + "px";
		});

		btn.addEventListener("mouseleave", () => {
		tooltip.style.opacity = 0;
		});

		mainButtonsFragment.appendChild(btn);
	});

	// =====================
	// 上下配置の切り替え
	// =====================
	const buttonsOnTop = AppState.settings?.buttonsOnTop ?? true;

	if (buttonsOnTop) {
		// 上に配置
		buttonsEl.appendChild(settingBtn);
		buttonsEl.appendChild(closeExtBtn);
		buttonsEl.appendChild(editSetBtn); 
		buttonsEl.appendChild(hr);
		buttonsEl.appendChild(mainButtonsFragment);
	} else {
		// 下に配置（メインボタンの下）
		buttonsEl.appendChild(mainButtonsFragment);
		buttonsEl.appendChild(hr);
		buttonsEl.appendChild(editSetBtn); 
		buttonsEl.appendChild(settingBtn);
		buttonsEl.appendChild(closeExtBtn);
	}

	// =====================
	// SortableJS（メインボタンのみ）
	// =====================
	if (typeof Sortable !== "undefined") {
		if (buttonsEl._sortable) buttonsEl._sortable.destroy();

		const offset = buttonsOnTop ? 3 : 0; // 上に固定がある場合だけズレる

		buttonsEl._sortable = Sortable.create(buttonsEl, {
			animation: 150,
			ghostClass: "dragging",
			filter: ".close-extension-btn, .setting-btn, hr",
			onMove: (evt) =>
				!evt.related.classList.contains("close-extension-btn") &&
				!evt.related.classList.contains("setting-btn") &&
				evt.related.tagName !== "HR",

			onEnd: (evt) => {
				const buttons = AppState.sets[AppState.active].buttons;
				const movedItem = buttons.splice(evt.oldIndex - offset, 1)[0];
				buttons.splice(evt.newIndex - offset, 0, movedItem);

				saveStorage({ sets: AppState.sets });
				renderButtons();
			},
		});
	}

	// 設定パネル閉じる
	const closeSettingBtn = document.getElementById("closeSettingsBtn");
	if (closeSettingBtn) {
		closeSettingBtn.onclick = () => {
		const panel = document.getElementById("settingsPanel");
		if (panel) panel.classList.remove("open");
		};
	}
	applyDarkMode(AppState.settings?.darkMode ?? false);
	applyRainbowHover(AppState.settings?.rainbowHover ?? false);
};

// =====================
// ダークモード（カスタム対応）
// =====================
function applyDarkMode(enable) {
const body = document.body;
const buttonsEl = document.getElementById("buttons");
const tabsEl = document.getElementById("tabs");

if (!body) return;

const bgColor = AppState.settings.darkBgColor || "#7f7f93";
const textColor = AppState.settings.darkTextColor || "#ffffff";
const rainbow = AppState.settings.darkRainbowBg || false;
//メモ帳にも追加
const memoPad = document.getElementById("memoPad");
const memoTextarea = document.getElementById("memoTextarea");
if (enable) {
  memoPad.style.background = "#2c2c34";
  memoTextarea.style.background = "#1f1f25";
  memoTextarea.style.color = "#fff";
} else {
  memoPad.style.background = "#f8f9fb";
  memoTextarea.style.background = "#fff";
  memoTextarea.style.color = "#000";
}
//メモ帳にも追加End

if (enable) {
	if (rainbow) {
	body.style.background =
		"linear-gradient(135deg, #ff0080, #7928ca, #2afadf, #00f2fe)";
	body.style.backgroundSize = "400% 400%";
	body.style.animation = "darkRainbow 12s ease infinite";
	} else {
	body.style.background = bgColor;
	body.style.animation = "";
	}

	body.style.color = textColor;
} else {
	body.style.background = "#fafafa";
	body.style.color = "#000000";
	body.style.animation = "";
}
}

// =====================
// 虹色ホバー
// =====================
function applyRainbowHover(enable) {
	const buttonsEl = document.getElementById("buttons");
	if (!buttonsEl) return;

	buttonsEl.querySelectorAll("button").forEach((btn) => {
		if (btn.classList.contains("close-extension-btn") || btn.classList.contains("setting-btn")) return;

		//  まず必ずイベント解除
		btn.onmouseenter = null;
		btn.onmouseleave = null;

		// 元の色に戻す
		if (btn.dataset.color) {
		btn.style.background = btn.dataset.color;
		}
		btn.style.animation = "";

		// ONのときだけ再登録
		if (enable) {
		btn.onmouseenter = () => {
			btn.style.background =
			"linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
			btn.style.backgroundSize = "400% 100%";
			btn.style.animation = "rainbowSlide 3s linear infinite";
		};

		btn.onmouseleave = () => {
			btn.style.background = btn.dataset.color;
			btn.style.animation = "";
		};
		}
	});
	}

// 初期反映
applyDarkMode(AppState.settings?.darkMode ?? false);
applyRainbowHover(AppState.settings?.rainbowHover ?? false);
