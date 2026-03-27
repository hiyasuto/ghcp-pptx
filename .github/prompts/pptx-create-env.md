# Copilot CLI 用サンプルプロンプト

このファイルは自動読込されません。GitHub Copilot CLI で使うときは、内容をそのまま貼り付けるか、`@.github/prompts/pptx-create-env.md` のように明示して使ってください。

## フルパイプラインで資料を作る
```text
@AGENTS.md @.github/instructions/createpptx.instructions.md @.github/instructions/proposal-deck.instructions.md
「<テーマ>」をテーマに、<対象者> 向けの <枚数> 枚の PowerPoint 提案資料を作成してください。
課題、意思決定者、求める意思決定、Why now、制約、成功指標、代替案も明示してください。
必要に応じて外部情報を参照し、`makemd` → `checkmd` → `createpptx` → `finalize` の順で完了まで進めてください。
```

## Markdown だけ作る
```text
@.github/agents/makemd.md
「<テーマ>」のスライド構成 Markdown を作成してください。
```

## 既存 Markdown から PPTX だけ再生成する
```text
@.github/agents/createpptx.md @.github/instructions/createpptx.instructions.md
`<テーマ名>/md/<テーマ名>.md` を使って PowerPoint を再生成してください。
`package.json` に `npm run build:pptx` を残してください。
```

## 最終調整だけ行う
```text
@.github/agents/finalize.md
`<テーマ名>/docs/<テーマ名>.pptx` を最終確認して、テンプレート反映と修正メモ作成まで行ってください。
```
