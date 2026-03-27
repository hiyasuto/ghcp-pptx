# GitHub Copilot CLI instructions for ghcp-pptx

このリポジトリは GitHub Copilot CLI だけで PowerPoint を作成することを前提にしています。

## 重要
- 自動読込されるのは `AGENTS.md`、`.github/copilot-instructions.md`、`.github/instructions/**/*.instructions.md` だけです。
- `.github/agents/*.md` と `.github/prompts/*.md` は参考ファイルです。必要なら `@path` で明示して使います。
- VS Code 固有機能、custom agent、GUI 操作は前提にしません。

## 標準手順
1. テーマ名から作業用フォルダー名を決めます。
2. `.github/instructions/createpptx.instructions.md` を仕様として参照します。
3. 提案書・承認資料・ピッチ資料なら `.github/instructions/proposal-deck.instructions.md` のルールも適用します。
4. 詳細な stage が必要な場合は `.github/agents/makemd.md` → `.github/agents/checkmd.md` → `.github/agents/createpptx.md` → `.github/agents/finalize.md` を `@` で参照します。
5. `createpptx` 段階では Node.js のバージョンを確認し、必要ならテーマ配下に `package.json` と `pptxgenjs` の依存関係を用意します。
6. スクリプト実行後は `.pptx` の出力有無を確認し、最終化メモまで作成します。

## 守ること
- 既存の Markdown がある場合は、それを起点に再生成します。
- 生成物は必ずテーマ配下に閉じます。
- 参照した URL は `参考リンク` として残します。
- 単独ステップだけ依頼された場合は、そのステップに必要な前提だけ確認して実行します。
- 生成スクリプトは CLI から再実行できるようにし、`npm run build:pptx` のようなコマンドを残します。

## CLI で役立つ操作
- `@path` で参考ファイルを会話に含められます。
- `/instructions` で自動読込中の instruction を確認できます。
- `/diff` で変更確認、`/tasks` でバックグラウンド作業確認ができます。
