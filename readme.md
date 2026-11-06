# 轟歯科 Webサイト

長野県須坂市の歯科医院「轟歯科」の公式Webサイト（静的サイト）です。

- 公開URL: https://todo-dental.todoroki-h.com/
- ホスティング: GitHub Pages（`main` ブランチのルートを自動公開）
- 構成: HTML / CSS / vanilla JS（ヘッダーのみ Jekyll の `{% include %}` で共通化）

## 開発者向け

引き継ぎ・運用の詳細は、リポジトリ内の `_docs/HANDOVER_ENGINEER.md` を参照してください。

```bash
# 初回のみ：sitemap.xml の lastmod 自動更新フックを有効化
git config core.hooksPath .githooks
```

> 注意: このファイルは公開サイト上でも閲覧可能です（/readme.md）。内部情報は書かないでください。
