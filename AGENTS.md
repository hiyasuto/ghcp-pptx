# ghcp-pptx workflow

このリポジトリは、GitHub Copilot CLI で PowerPoint 資料を作成するための作業テンプレートです。

## 基本方針
- 資料作成の依頼を受けたら、`makemd` → `checkmd` → `createpptx` → `finalize` の順で進めます。
- テーマごとに `<テーマ名>/` ディレクトリを作成し、その配下に `md/`, `js/`, `docs/` を配置します。
- 情報が不足している場合は、目的、対象者、想定枚数、言語を優先して確認します。
- 既存ファイルがある場合は内容を読み、差分が分かるように更新します。

## 出力物
- `<テーマ名>/md/<テーマ名>.md`
- `<テーマ名>/md/<テーマ名>-Checked.md`
- `<テーマ名>/js/create-slide.js`
- `<テーマ名>/docs/<テーマ名>.pptx`
- `<テーマ名>/md/<テーマ名>-Finalized.md`

## 品質条件
- スライドは 20 枚以内、16:9、白背景、黒文字、Meiryo UI を基本とします。
- 箇条書きは敬体で統一し、1 スライド 5〜7 項目以内を目安にします。
- 外部情報を使った場合は末尾に参考リンクをまとめます。
- `templates/header.pptx` を表紙差し替え用、`templates/footer.pptx` を最終スライド用として扱います。

## Copilot CLI での使い方
- このリポジトリのルートで `copilot` を起動します。
- 必要に応じて `@.github/agents/makemd.md` のようにファイルを明示して文脈に含めます。
- VS Code 専用の custom agent には依存せず、このリポジトリ内の instruction / prompt ファイルを参照して作業します。
