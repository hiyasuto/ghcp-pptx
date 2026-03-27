# GitHub Copilot CLI instructions for ghcp-pptx

このリポジトリは GitHub Copilot CLI で PowerPoint を作成することを前提にしています。

## 標準手順
1. テーマ名から作業用フォルダー名を決めます。
2. `.github/instructions/createpptx.instructions.md` を仕様として参照します。
3. `.github/agents/makemd.md` → `.github/agents/checkmd.md` → `.github/agents/createpptx.md` → `.github/agents/finalize.md` の順に成果物を作成します。
4. `createpptx` 段階では Node.js のバージョンを確認し、必要ならテーマ配下に `package.json` と `pptxgenjs` の依存関係を用意します。
5. スクリプト実行後は `.pptx` の出力有無を確認し、最終化メモまで作成します。

## 守ること
- VS Code 固有機能や GUI 操作を前提にしません。
- 既存の Markdown がある場合は、それを起点に再生成します。
- 生成物は必ずテーマ配下に閉じます。
- 参照した URL は `参考リンク` として残します。
- 単独ステップだけ依頼された場合は、そのステップに必要な前提だけ確認して実行します。

## CLI で役立つ操作
- `@path` で stage ファイルを会話に含められます。
- `/diff` で変更確認、`/tasks` でバックグラウンド作業確認、`/instructions` で instruction 読み込み確認ができます。
