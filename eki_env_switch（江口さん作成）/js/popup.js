// 2026-02-12更新バージョン

// サブドメがdevの媒体のドメイン配列
const env_dev_domain_list = [
	'menesth',
	'menesth-aroma',
	'e-yoyaku',
	'cocoa-job',
	'menesth-job',
	'act-oshigoto',
];

// TLDがcomの媒体のドメイン配列
const tdl_com_list = [
	'menesth-aroma',
];

// staging環境が存在するドメインリスト
const has_staging_domain_list = [
	'ranking-deli',
	'menesth',
	'cocoa-job',
];

// 台湾環境が存在するドメインリスト
const has_hexin_domain_list = [
	'ranking-deli',
	'girls.ranking-deli',
	'menesth',
	'menesth-aroma',
	'e-yoyaku',
	'cocoa-job',
	'menesth-job',
];

// 台湾環境のドメインをキーとした日本環境のドメインリスト
const hexin_to_jp_domain_map = {
	'eki'          : 'ranking-deli',
	'girls'        : 'girls.ranking-deli',
	'menesth'      : 'menesth',
	'menesth-aroma': 'menesth-aroma',
	'e-yoyaku'     : 'e-yoyaku',
	'cocoa'        : 'cocoa-job',
	'menesth-job'  : 'menesth-job',
}

// このjsを動かして良いURL
const allow_url_list = [
	// 駅ちか本体・会員
	'https://ranking-deli.jp/',
	'https://staging.ranking-deli.jp/',
	'https://pre.ranking-deli.jp/',
	'https://eki.hexin77.com/',
	'https://ranking-deli.internal/',

	// 駅女の子系
	'https://girls.ranking-deli.jp/',
	'https://pre-girls.ranking-deli.jp/',
	'https://girls.hexin77.com/',
	'https://girls.ranking-deli.internal/',

	// メンズリラク
	'https://menesth.jp/',
	'https://staging.menesth.jp/',
	'https://dev.menesth.jp/',
	'https://menesth.hexin77.com/',
	'https://menesth.internal/',

	// メンズアロマ
	'https://menesth-aroma.com/',
	'https://dev.menesth-aroma.com/',
	'https://menesth-aroma.hexin77.com/',
	'https://menesth-aroma.internal/',

	// 駅メンエス
	'https://ranking-mensesthe.jp/',
	'https://pre.ranking-mensesthe.jp/',
	'https://ranking-mensesthe.internal/',

	// ネット予約
	'https://e-yoyaku.jp/',
	'https://dev.e-yoyaku.jp/',
	'https://e-yoyaku.hexin77.com/',
	'https://e-yoyaku.internal/',

	// ココア
	'https://cocoa-job.jp/',
	'https://staging.cocoa-job.jp/',
	'https://dev.cocoa-job.jp/',
	'https://cocoa.hexin77.com/',
	'https://cocoa-job.internal/',

	// リラクジョブ
	'https://menesth-job.jp/',
	'https://dev.menesth-job.jp/',
	'https://menesth-job.hexin77.com/',
	'https://menesth-job.internal/',

	// AV女優LP
	'https://act-oshigoto.jp/',
	'https://dev.act-oshigoto.jp/',
	'https://act-oshigoto.internal/',
];

document.addEventListener('DOMContentLoaded', () => {
	function switchEnv(env) {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const current_url = new URL(tabs[0].url);
			let new_url       = current_url;

			const domain = get_current_domain(new_url, env);

			// TLDを取得する
			let tld;
			if (tdl_com_list.includes(domain)) {
				tld = '.com';
			} else {
				tld = '.jp';
			}
			
			if (env === 'prod') {
				new_url.hostname = domain + tld;
			} else if (env === 'staging') {
				new_url.hostname = 'staging.' + domain + '.jp';
			} else if (env === 'pre') {
				// dev環境のURLはdev.をつける
				// NOTE: dev-ってないよね...？
				if (env_dev_domain_list.includes(domain)) {
					new_url.hostname = 'dev.' + domain + tld;
				} else if (domain.includes('girls')) {
					new_url.hostname = 'pre-' + domain + tld;
				} else {
					new_url.hostname = 'pre.' + domain + tld;
				}
			} else if (env === 'local') {
				new_url.hostname = domain + '.internal';
			} else if (env === 'hexin') {
				new_url.host = get_hexin_fqdn(domain);
			}

			const toggle_btn = document.getElementById('new_tab');
			// 新規タブで開きたい場合
			if (toggle_btn.checked) {
				chrome.tabs.create({
					url: new_url.href,
					active: true,
					index: tabs[0].index + 1
				});
			} else {
				chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
					func: (url) => {
						window.location.href = url;
					},
					args: [new_url.href]
				});
			}
		});
	}

	// staging環境を持たない媒体ではstagingボタンを非活性
	function stagingbtn_inactive() {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const current_url = new URL(tabs[0].url);
			const domain      = get_current_domain(current_url);
			const staging_btn = document.getElementById('staging');
			
			if (has_staging_domain_list.includes(domain)) {
				// 会員系はstagingないので非活性
				if (current_url.pathname.includes('/member')) {
					staging_btn.disabled = true;
				} else {
					staging_btn.disabled = false;
				}
			} else {
				staging_btn.disabled = true;
			}
		});
	}

	// 台湾環境を持たない媒体では台湾ボタンを非活性
	function hexinbtn_inactive() {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const current_url = new URL(tabs[0].url);
			const domain      = get_current_domain(current_url);
			const hexin_btn   = document.getElementById('hexin77');
			
			if (has_hexin_domain_list.includes(domain)) {
				hexin_btn.disabled = false;
			} else {
				hexin_btn.disabled = true;
			}
		});
	}

	// domain名取得用
	function get_current_domain(url, env = '') {
		const hostname = url.hostname.match(/^(pre-)?([^.]+)(?:\.([^.]+))?(\.(?:jp|com|internal))$/);

		let domain;
		// 台湾環境URLだったら
		if (hostname[0].includes('hexin77')) {
			let media = hostname[2];
			// 台湾環境から台湾環境へ飛ぶときは変更なし
			if (env === 'hexin') {
				domain = hostname[2];
			} else if(Object.keys(hexin_to_jp_domain_map).includes(media)) {
				domain = hexin_to_jp_domain_map[media];
			}
		} else {
			// 女の子マイペ・管理だったら
			if (hostname[2].includes('girls')) {
				domain = hostname[2] + '.' + hostname[3];
			} else {
				// NOTE: これなんだっけ...意図あり！
				if (hostname[3] == null) {
					domain = hostname[2];
				} else {
					domain = hostname[3];
				}
			}
		}
		
		return domain;
	}

	// 台湾FQDNの取得
	function get_hexin_fqdn(domain){
		let hexin_domain;

		if (domain.includes('girls')) {
			hexin_domain = 'girls';
		} else if (domain.includes('eki') || domain.includes('ranking-deli')) {
			hexin_domain = 'eki';
		} else if (domain.includes('cocoa')) {
			hexin_domain = 'cocoa';
		} else {
			hexin_domain = domain;
		}

		// 台湾環境は全てcom固定
		return hexin_domain + '.hexin77.com';
	}

	// 許可されたURLか
	function is_Allow_URL() {
		return new Promise((resolve) => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				const url = tabs[0].url;
				const isAllowed = allow_url_list.some(pattern => url.startsWith(pattern));
				if (!isAllowed) {
					document.body.innerHTML = '<div class="eki_env_switch"><p class="error_txt">このページでは利用できません</p></div>';
					resolve(false);
				}
				resolve(true);
			});
		});
	}

	is_Allow_URL().then(result => {
		if (result) {
			stagingbtn_inactive();
			// 台湾ボタンを表示しない場合はコメントアウト
			// hexinbtn_inactive();
			document.getElementById('prod').addEventListener('click', () => switchEnv('prod'));
			document.getElementById('pre').addEventListener('click', () => switchEnv('pre'));
			document.getElementById('staging').addEventListener('click', () => switchEnv('staging'));
			document.getElementById('local').addEventListener('click', () => switchEnv('local'));
			// 台湾ボタンを表示しない場合はコメントアウト
			// document.getElementById('hexin77').addEventListener('click', () => switchEnv('hexin'));
		}
	})
});