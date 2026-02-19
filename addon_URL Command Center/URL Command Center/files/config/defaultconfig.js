window.DEFAULT_CONFIG = {
sets: {
	default: {
	title: "媒体URL",
	buttons: [
		{ label: "ココアdev", url: "https://dev.cocoa-job.jp/", color: "#FF8DAB" },
		{ label: "リラクジョブdev", url: "https://dev.menesth-job.jp/", color: "#61D4CA" },
		{ label: "大管理pre", url: "https://pre.ranking-deli.jp/kanri", color: "#f17074" },
		{ label: "ココア店舗管理dev", url: "https://dev.cocoa-job.jp/entry/login/", color: "#FF8DAB" },
		{ label: "AV女優dev", url: "https://dev.act-oshigoto.jp/", color: "#FF5396" },
		{ label: "出稼ぎJPdev", url: "https://dev.pjigesaked.com/", color: "#ff8489" },
		{ label: "駅ちかpre", url: "https://pre.ranking-deli.jp/", color: "#f06065" },
		{ label: "駅ちか管理画面pre", url: "https://pre.ranking-deli.jp/admin/login/", color: "#f06065" },
		{ label: "駅メンエスpre", url: "https://pre.ranking-mensesthe.jp/", color: "#358554" },
		{ label: "メンズリラクdev", url: "https://dev.menesth.jp/", color: "#39BF88" },
		{ label: "メンズアロマdev", url: "https://dev.menesth-aroma.com/", color: "#39BF88" },
		{ label: "ネット予約dev", url: "https://dev.e-yoyaku.jp/", color: "#FC4967" },
		{ label: "ヒルズデリdev", url: "https://dev.ex-deli.jp/", color: "#525050" },
	]
	},
	myset1: {
	title: "バックログまとめ",
	buttons: [
		{ label: "ココアバックログ", url: "https://cor.backlog.com/view/CCA-XXXX", color: "#FF8DAB" },
		{ label: "リラクジョブバックログ", url: "https://cor.backlog.com/view/CCA_MENESTH-XXX", color: "#61D4CA" },
		{ label: "内部課題バックログ", url: "https://cor.backlog.com/view/CCABUG-XXX", color: "#2B8269" },
	] 
	},
	myset2: {
	title: "CCA-XXXX",
	buttons: [
		{ label: "バックログ", url: "https://cor.backlog.com/view/CCA-XXXX", color: "#2B8269" },
		{ label: "仕様書", url: "", color: "#fbd460" },
		{ label: "XD", url: "", color: "#8142b1" },
		{ label: "外部QA", url: "", color: "#53ad5c" },
		{ label: "内部修正シート", url: "", color: "#49c768" },
		{ label: "実装したページ", url: "", color: "#ed8585" },
	] 
	},
	myset3: {
	title: "プルリクとデプロイ",
	buttons: [
		{ label: "プルリク作成", url: "https://ap-northeast-1.console.aws.amazon.com/codesuite/codecommit/repositories/eki-web/pull-requests/new/release/.../?region=ap-northeast-1", color: "#FA6F01" },
		{ label: "Jenkins ココア", url: "https://jenkins.core-tech.jp/view/%E3%82%B3%E3%82%B3%E3%82%A2/job/imc_dev_cocoa_job/build?delay=0sec", color: "#FF8DAB" },
		{ label: "Jenkins リラクジョブ", url: "https://jenkins.core-tech.jp/job/imc_dev_menesth_job_jp/", color: "#61D4CA" },
		{ label: "リポジトリ情報", url: "https://wiki.core-tech.jp/user/h.suzuki/%E3%82%A2%E3%82%B8%E3%83%A3%E3%82%A4%E3%83%AB2%E8%AA%B2%E5%AA%92%E4%BD%93_%E9%96%8B%E7%99%BA%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E9%96%A2%E4%BF%82%E6%80%A7%E3%81%BE%E3%81%A8%E3%82%81", color: "#607D8B" },
	] 
	},
	myset4: {
	title: "業務・勤怠",
	buttons: [
		{ label: "ココア業務ナビ！", url: "https://sites.google.com/core-tech.jp/cocoa-develop/top", color: "#FF8DAB" },
		{ label: "勤怠関連システム", url: "https://attendance.core-tech.jp/", color: "#FFA633" },
		{ label: "ジョブカン勤怠申請", url: "https://id.jobcan.jp/users/sign_in", color: "#61D4CA" },
		{ label: "ジョブカン打刻", url: "https://ssl.jobcan.jp/login/mb-employee-global?redirect_to=%2Fm%2Findex%2Findex", color: "#3794FE" },
		{ label: "グループセッション", url: "https://unification5.core-tech.jp/gsession/common/cmn002.do", color: "#739DC4" },
	] 
	},
	myset5: {
	title: "マイセット１",
	buttons: [
		{ label: "ボタンを入力", url: "www.example.com", color: "#FF8DAB" },
		{ label: "", url: "", color: "#61D4CA" },
		{ label: "", url: "", color: "#607D8B" },
	] 
	}
},

settings: {
	buttonsOnTop: true,
	darkMode: false,
	darkBgColor: "#182D46",
	darkTextColor: "#493a3a",
	darkRainbowBg: false,
	rainbowHover: false
},
backlogTemplates: {
  normal: {
    label: "ココア",
    pattern: "https://cor.backlog.com/view/CCA-XXXX",
    color: "#FF8DAB"
  },
  menesth: {
    label: "リラクジョブ",
    pattern: "https://cor.backlog.com/view/CCA_MENESTH-XXX",
    color: "#61D4CA"
  },
  bug: {
    label: "内部課題",
    pattern: "https://cor.backlog.com/view/CCABUG-XXX",
    color: "#f17074"
  }
},



activeSet: "default"
};


