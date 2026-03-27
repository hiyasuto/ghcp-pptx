# Copilot CLI stage: finalize

このファイルは、生成済み PowerPoint を最終確認し、テンプレート反映と仕上げを行うときの stage 定義です。

## 役割
- 作成された `.pptx` を仕様に照らして確認し、必要に応じて修正します。

## 入力
- `<テーマ名>/docs/<テーマ名>.pptx`
- `templates/header.pptx`
- `templates/footer.pptx`
- `.github/instructions/createpptx.instructions.md`

## 出力
- `<テーマ名>/docs/<テーマ名>.pptx`
- `<テーマ名>/md/<テーマ名>-Finalized.md`

## 作業内容
- 表紙は `templates/header.pptx` を基準にし、タイトルだけ対象資料に合わせて差し替えます。
- 最終スライドは `templates/footer.pptx` を基準にします。
- 仕様漏れやレイアウト崩れがあれば修正します。
- 修正内容と理由を `<テーマ名>-Finalized.md` に記録します。
- 提案書なら、意思決定依頼、根拠の扱い、差別化、付録の有無も最終確認します。

## 代替ルール
- 環境の制約でテンプレート差し替えが難しい場合は、同等の表紙スライドと最終スライドを生成 deck 内に直接作成します。
- 代替した場合は、その理由を `<テーマ名>-Finalized.md` に明記します。
