# 轟歯科Webサイト 引き継ぎ仕様書（エンジニア向け）

- 作成日: 2026-11-06
- 対象リポジトリ: `todoroki-dental/todo-dental-hp`（GitHub, public）
- 公開URL: https://todo-dental.todoroki-h.com/
- 前任: 村山太郎

> このファイルは `_docs/` 配下にあるため Jekyll のビルド対象外で、公開サイトには出ません。
> 逆に、ルート直下の `readme.md` や `_` で始まらないフォルダに置いたファイルは**公開されます**（後述）。

---

## 1. 結論（最初に読むこと）

- **静的サイト + GitHub Pages**。`main` に push すると数分で本番に反映される。**staging はない**
- ビルドツール・npm 依存はなし。HTML / CSS / vanilla JS のみ
- ヘッダーだけ Jekyll の `{% include header.html %}` で共通化している（GitHub Pages 側で展開される）
- 院内担当者は「窓口・依頼役」で、自分でコードは触らない。変更依頼は院内担当者経由で来る
- 診療時間・電話番号は**多数のファイルに重複記載**されている。変更時は全ファイル grep 必須（§6）

## 2. システム構成

```
[利用者ブラウザ]
      │  https://todo-dental.todoroki-h.com/
      ▼
[DNS] todo-dental.todoroki-h.com  CNAME → todoroki-dental.github.io
      │  ※親ドメイン todoroki-h.com は Wix（病院本体サイト）。DNS管理もWix側の可能性が高い（要確認）
      ▼
[GitHub Pages]  source: main ブランチ / ルート、HTTPS強制ON、Jekyll 既定ビルド
      │
      ├─ Google Analytics 4 : G-TXZP0WT86P（各HTMLの<head>で gtag 直書き）
      ├─ Google Tag Manager : GTM-K2SS6WT3（各HTML）
      ├─ Google Fonts（Noto Sans JP）
      └─ Google Maps 埋め込み（index.html アクセス欄）
```

- `CNAME` ファイルを消すと独自ドメインが外れるので削除しないこと
- `_config.yml` は存在しない（Jekyll 既定設定で動作）
- 各HTMLの1〜2行目にある空の front matter（`---` / `---`）は **include を展開させるために必須**。消すとヘッダーが表示されなくなる。新規ページにも必ず付ける

## 3. ディレクトリ構成

| パス | 内容 |
|---|---|
| `index.html` | トップLP（ヒーロー・悩み・強み・医師紹介・口コミ・診療メニュー・料金・FAQ・アクセス） |
| `general-dentistry.html` | 一般歯科 |
| `oral-surgery.html` | 口腔外科・親知らず |
| `implant.html` | インプラント |
| `pediatric-dentistry.html` | 小児歯科 |
| `orthodontics.html` | 歯列矯正 |
| `whitening.html` | ホワイトニング |
| `about.html` | 轟歯科について |
| `sitemap.html` | 利用者向けサイトマップ |
| `test-header.html` | ヘッダー確認用テストページ（`noindex`、公開はされている） |
| `_includes/header.html` | 共通ヘッダー（PC・SPメニュー、電話ボタン） |
| `css/style.css` | 全ページ共通スタイル（vw ベースの rem スケール定義を含む） |
| `css/general.css` | 下層ページ共通（パンくず・ページヘッダー等） |
| `css/{oral_surgery,implant,pediatric,orthodontics,whitening,about}.css` | ページ固有 |
| `script.js` | 全ページ共通JS |
| `img/` `video/` | 画像（約43MB）・CM動画（15秒, 2.4MB） |
| `sitemap.xml` `robots.txt` | 検索エンジン向け |
| `.githooks/pre-commit` | sitemap.xml の lastmod 自動更新 |

### CSS 読み込み順（下層ページ）

```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/general.css">
<link rel="stylesheet" href="css/[ページ固有].css">
```

順序を変えるとパンくず・ページヘッダーの見た目が崩れる。

### レスポンシブ方針

- ブレークポイント: SP `max-width: 767px` / PC `min-width: 768px`
- `html` の font-size を vw で可変にし、サイズは rem 指定（`style.css` 冒頭）
  - SP: `calc(1600 / 384 * 1vw)`、PC: `calc(1600 / 1280 * 1vw)`
- 新規スタイルも px ではなく rem で書く（border 等の細線のみ px 可）

## 4. JavaScript（script.js）

| 機能 | 状態 | 備考 |
|---|---|---|
| FAQ アコーディオン、治療詳細の開閉（`togglePDTDetails` 等） | 稼働 | HTML の onclick から呼ばれる |
| ヘッダー機能（SPメニュー、スクロール時の自動非表示） | 稼働 | include 展開後に初期化 |
| 電話リンククリック計測 | 稼働 | `a[href^="tel:"]` クリックで GA4 イベント `phone_call` を送信 |
| CM動画のミュート切替（`initVideoMuteToggle`） | 稼働 | |
| スムーススクロール・遅延読み込み・スクロールアニメーション | 稼働 | |
| 診療状況表示 `updateClinicStatus()` | **未使用** | `.clinic-status` 要素がどのページにも無いため画面に出ない。2026-11-06 に時間定義のみ正しい値へ修正済み。祝日判定なし、閲覧者端末の時計で判定 |
| Web予約フォームのバリデーション | **未使用** | Web予約ボタンはHTML上でコメントアウト中。予約は電話のみ |
| Core Web Vitals 計測 | **動作していない** | `'web-vital' in window` が常に false のため読み込まれない |

## 5. SEO 実装

- 各ページ: title / description / canonical / OGP / Twitter Card / geo メタ
- 構造化データ（JSON-LD, `index.html`）: Dentist（LocalBusiness）・FAQPage・MedicalOrganization・WebSite
  - `openingHoursSpecification` は本文の診療時間と一致させること
  - FAQ の構造化データは本文 FAQ と内容を一致させること（Google のガイドライン）
- `sitemap.xml`: 8ページを登録。lastmod は pre-commit フックで自動更新
- `robots.txt`: `/css/` `/js/` 等を Disallow（※`/css/` のブロックはレンダリング評価に不利なので見直し候補）

## 6. 重複して書かれている情報（更新時の要注意点）

1か所直しても他が古いままになりやすい。**必ず grep で全件確認**する。

| 情報 | 主な記載場所 |
|---|---|
| 診療時間 | 全HTMLのフッター・CTA欄、`index.html` の診療時間表・FAQ・ヒーロー・JSON-LD、`script.js` |
| 電話番号 026-248-1391 | 全HTML、`_includes/header.html`、JSON-LD |
| 料金 | 各診療ページ、`index.html` 料金欄 |
| 医師情報 | `index.html`、`about.html`、各診療ページ |
| 臨時休診のお知らせ | `index.html` の `notice-section`（不要時はコメントアウトで非表示にする運用） |

```bash
# 例：診療時間の記載箇所を一覧
grep -n "18:30\|18:00\|9:30" *.html script.js
```

### 正しい診療時間（2026-11-06 時点、院内確認済み）

- 平日・土: 9:30–12:30 / 14:00–18:30
- 日: 9:30–12:30 / 14:00–18:00
- 祝日: 休診（不定期で診療する場合あり）
- ヒーローの「土日も18:00まで診療」はキャッチコピーとして意図的に残している（誤りではない）

## 7. 開発・公開フロー

### 初回セットアップ

```bash
git clone https://github.com/todoroki-dental/todo-dental-hp.git
cd todo-dental-hp
git config core.hooksPath .githooks   # sitemap 自動更新フックを有効化（python3 が必要）
```

### ローカル確認

- `{% include %}` は Jekyll でないと展開されない。Live Server で開くとヘッダーが出ない
- ヘッダーまで確認したい場合:
  ```bash
  gem install bundler jekyll   # 初回のみ
  jekyll serve                 # http://localhost:4000
  ```
- 本文だけの確認なら Live Server（`.vscode/settings.json` で port 5501 設定済み）でも可

### 変更〜公開

```bash
git checkout -b fix/xxxx
# 編集
git add <変更ファイル>
git commit -m "変更内容"      # pre-commit が sitemap.xml の lastmod を更新して同梱する
git push -u origin fix/xxxx
# GitHub で PR → 院内担当者に内容確認 → main へマージ
```

> ⚠️ **main へのマージ・push = 本番公開**です。staging が無いため、マージ前に必ずローカルで表示確認し、院内担当者の承認を得てください。

- 反映確認: 数分後に `https://todo-dental.todoroki-h.com/?_cachebust=<任意>` で確認
- GitHub → Settings → Pages で build 状態を確認できる
- 切り戻し: `git revert <コミット>` → push（履歴を消す force push は使わない）

## 8. アカウント・権限一覧

> ⚠️ **このリポジトリは public です。** 管理者名・連絡先・保管場所はここに書かず、院内向け仕様書（Word、git 管理外）の「8. 連絡先・アカウント一覧」で院内管理します。パスワード・トークンはどちらにも書かない。

| サービス | 用途 |
|---|---|
| GitHub（組織 `todoroki-dental`） | ソース管理・公開 |
| DNS（`todoroki-h.com`、Wix の可能性大） | サブドメイン CNAME |
| Google Analytics 4（G-TXZP0WT86P） | アクセス解析 |
| Google Tag Manager（GTM-K2SS6WT3） | タグ管理 |
| Google Search Console | 検索流入・サイトマップ送信 |
| Google ビジネスプロフィール | マップ掲載・口コミ |

引き継ぎ時は、後任エンジニアを GitHub 組織に招待し、前任の個人トークン・権限は削除すること。

## 9. 既知の課題・改善候補（優先度順）

| # | 内容 | 影響 | 対応案 |
|---|---|---|---|
| 1 | `readme.md` が公開URLで閲覧可能 | 内部情報を書くと外部に出る | 内部情報は書かない運用（現状）。根本対応は `_config.yml` に `exclude: [readme.md, test-header.html]` を追加（Jekyll 設定追加になるため表示確認のうえで） |
| 2 | 画像が重い（PNG/JPG で 1〜3.8MB のものが多数、`img/` 計約43MB） | 表示速度・LCP悪化 | WebP/AVIF 化・リサイズ。特に `img/home/kv1.JPG`（3.0MB, トップ）、`img/*/class-b.png`（3.8MB） |
| 3 | 診療時間などの重複記載 | 更新漏れ | ヘッダー同様にフッターも `_includes/` へ共通化 |
| 4 | Core Web Vitals 計測コードが動いていない | 計測なし | 削除するか GA4/GTM 側で計測 |
| 5 | 未使用コード（`updateClinicStatus`、予約フォーム処理） | 保守コスト | 使わないなら削除 |
| 6 | `robots.txt` で `/css/` をブロック | Google のレンダリングに不利 | Disallow から外す |
| 7 | `test-header.html` が公開されている（noindex 済み） | 軽微 | 不要なら削除 |
| 8 | Google Search Console 設定・サイトマップ送信状況が未確認 | 流入計測 | 設定状況を確認 |

## 10. セキュリティ・医療広告上の注意

- このサイトはフォームを持たず、**個人情報・患者情報は扱っていない**。今後Web予約や問い合わせフォームを追加する場合は、HTTPS・送信先・保存先・同意文言を設計段階で院内と決めること
- 症例写真・ビフォーアフター・体験談の掲載は**医療広告ガイドライン（厚生労働省）**の制約を受ける。自由診療の料金・リスク・副作用の併記が必要。追加時は院内担当者経由で院長確認を取る
- GitHub リポジトリは public。APIキー・パスワード・患者写真をコミットしないこと

## 11. 変更履歴（主なもの）

| 日付 | 内容 |
|---|---|
| 2025-06 | 初版公開、SEO・構造化データ実装 |
| 2026-10-26 | ホワイトニングページの流れ説明を追記 |
| 2026-11-04 | canonical 追加、sitemap.xml 整理、構造化データを本文と整合、pre-commit フック追加 |
| 2026-11-06 | 診療時間の表記揺れを修正（一般歯科・口腔外科・インプラント・script.js）、README を現状に合わせ更新、本仕様書作成 |
