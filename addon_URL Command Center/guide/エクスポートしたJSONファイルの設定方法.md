# URL Command Center エクスポートしたJSONファイルの編集方法

## 0. 概要
URL Command Center 拡張機能では、
設定内容（タブ・ボタン・UI設定）を JSONファイルとしてエクスポート / インポート できます。

このドキュメントでは、
エクスポートされたJSONの構造と編集方法 を説明します。 

## JSONファイルの全体構造
{
  "sets": { ... },
  "activeSet": "myset1",
  "settings": { ... }
}
**キー**	 **内容**
sets	     タブとボタンの定義
activeSet	 起動時に開くタブ
settings	 UI設定（ダークモード等）

-------------------------------
## 1. sets（タブ・ボタン定義）
### タブ構造
"sets": {
  "default": { ... },
  "myset1": { ... },
  "myset2": { ... }
}
**キー**	**意味**
default	   デフォルトタブ
myset1	   カスタムタブ1
myset2	   カスタムタブ2
※ キー名は内部ID。自由に追加可能。

### タブの中身
"myset1": {
  "title": "CCA-XXXX",
  "buttons": [ ... ]
}
**項目**	**説明**
title	    タブに表示される名前
buttons	    ボタン配列

### ボタン定義
{
  "label": "バックログ",
  "url": "https://cor.backlog.com/view/CCA-XXXX",
  "color": "#2b8269"
}
**項目**	**説明**
label	    ボタン表示名
url	        開くURL
color	    ボタン背景色（HEX）

----------------------------------
## 2. activeSet（起動時のタブ）
"activeSet": "myset1"
⇒拡張機能を開いたときに
最初に表示されるタブID を指定します。

### 例：
"activeSet": "default"

-----------------------------
## 3. settings（UI設定）
"settings": {
  "buttonsOnTop": false,
  "darkBgColor": "#182D46",
  "darkMode": false,
  "darkRainbowBg": false,
  "darkTextColor": "#493a3a",
  "rainbowHover": false
}

**項目**	       **内容**
buttonsOnTop	  設定/閉じるボタンを上部に表示
darkMode	      ダークモードON/OFF
darkBgColor	      ダークモード背景色
darkTextColor	  ダークモード文字色
darkRainbowBg	  背景虹色モード
rainbowHover	  ボタンホバー虹色

----------------------------------
##  4. JSONのカスタマイズ方法

### タブを追加する
"myset4": {
  "title": "新規案件",
  "buttons": []
}

### ボタンを追加する
{
  "label": "管理画面",
  "url": "https://example.com/admin",
  "color": "#ff0000"
}

### ダークモードをデフォルトONにする
"darkMode": true

-----------------------------------
## ５.JSONの適用方法（インポート）

拡張機能の設定画面を開く

「設定をインポート」をクリック

編集したJSONファイルを選択

即時反映される

ーーーーーーーーーーーーーーーーーーー
## ６.初期設定として使う方法
このJSONを defaultconfig.js にコピー することで
拡張機能の「初期状態」をカスタマイズできます。

配布する際に便利です。

------------------------------------
## ⚠ 注意事項
### JSON形式が壊れると読み込み不可
カンマ抜け
ダブルクォート不足
コメント不可

### URLは必ず https:// を含める
含まないとボタンが正常に動作しない場合があります。