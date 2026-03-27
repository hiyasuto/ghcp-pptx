# ghcp-pptx workflow

このリポジトリは、GitHub Copilot CLI だけで PowerPoint 資料を作成するための作業テンプレートです。

## Copilot CLI で自動読込されるもの
- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`

## 手動で `@` 参照するもの
- `.github/agents/*.md`
- `.github/prompts/*.md`
- `README.md`

`.github/agents` は CLI の `/agent` 機能とは別物で、単なる stage 参考ファイルです。自動では読み込まれません。

## 基本方針
- 資料作成の依頼を受けたら、`makemd` → `checkmd` → `createpptx` → `finalize` の順で進めます。
- テーマごとに `<テーマ名>/` ディレクトリを作成し、その配下に `md/`, `js/`, `docs/` を配置します。
- 既存ファイルがある場合は内容を読み、差分が分かるように更新します。
- VS Code の custom agent や GUI 操作は前提にしません。ターミナルで再実行できる成果物を残します。

## 提案書として作る場合の追加要件
- 次の情報を優先して集めます: 課題、対象読者、意思決定者、求める意思決定、Why now、制約、成功指標、代替案。
- 構成は `Executive Summary → 現状課題 → 放置コスト → 提案内容 → 根拠 → 実行計画 → リスク → 意思決定依頼 → 付録` を基本にします。
- 主張は事実、推定、仮説を混同しません。根拠が弱い箇所は仮定として明示します。
- 最終版には、意思決定者が次に何を承認すべきかが明確な CTA スライドを含めます。

## 出力物
- `<テーマ名>/md/<テーマ名>.md`
- `<テーマ名>/md/<テーマ名>-Checked.md`
- `<テーマ名>/js/create-slide.js`
- `<テーマ名>/docs/<テーマ名>.pptx`
- `<テーマ名>/md/<テーマ名>-Finalized.md`
- `<テーマ名>/package.json`

## 品質条件
- スライドは 20 枚以内、16:9、白背景、黒文字、Meiryo UI を基本とします。
- 箇条書きは敬体で統一し、1 スライド 5〜7 項目以内を目安にします。
- 外部情報を使った場合は末尾に参考リンクをまとめます。
- `templates/header.pptx` を表紙差し替え用、`templates/footer.pptx` を最終スライド用として扱います。
- 生成したテーマ配下には `npm run build:pptx` のような再実行可能なコマンドを残します。
