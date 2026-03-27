---
name: create-pptx
description: GitHub Copilot CLI で PowerPoint 資料を作成するときに、Markdown 設計、レビュー、PptxGenJS 生成、最終化までを一気通貫で進めます。
---

## Use when
- 新規の提案資料や説明資料を作りたいとき
- 既存の Markdown から `.pptx` を再生成したいとき
- 表紙や末尾スライドを含めて仕上げたいとき

## Outputs
- `<テーマ名>/md/<テーマ名>.md`
- `<テーマ名>/md/<テーマ名>-Checked.md`
- `<テーマ名>/js/create-slide.js`
- `<テーマ名>/docs/<テーマ名>.pptx`
- `<テーマ名>/md/<テーマ名>-Finalized.md`

## Notes
- `templates/header.pptx` と `templates/footer.pptx` を使用します。
- 詳細仕様は `.github/instructions/createpptx.instructions.md` を参照します。
