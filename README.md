# ghcp-pptx

`ghcp-pptx` は、**GitHub Copilot CLI だけで** PowerPoint 資料を作るためのテンプレートリポジトリです。

Markdown で構成を作り、レビューし、`pptxgenjs` で `.pptx` を生成し、最後に表紙と末尾スライドを整える流れを前提にしています。提案書、承認資料、営業提案のような**意思決定を動かす deck** を作りやすくするためのルールも含めています。

## できること

- テーマと要件からスライド構成 Markdown を作成する
- 構成案をレビューし、修正点を明文化する
- `pptxgenjs` で `.pptx` を生成する
- 表紙と末尾スライドをテンプレート基準で整える
- 提案書向けに、課題、効果、差別化、CTA を含む deck を作りやすくする

## CLI-only で本当に使えるかの確認結果

この repo は、**GitHub Copilot CLI 1.0.12 の実行結果**と CLI 公式ドキュメントをもとに整理しています。

Copilot CLI がこの repo で**自動読込する custom instruction** は次の 3 系統だけです。

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`

逆に、次のファイルは**自動では読まれません**。必要なら `@path` で明示してください。

- `.github/agents/*.md`
- `.github/prompts/*.md`
- `README.md`

つまり、この repo の必須ルールは **`.github/instructions` に寄せてあります**。VS Code の設定、custom agent、GUI 操作は不要です。

## 向いているケース

- 提案書、承認資料、営業提案、構想資料のような意思決定向け deck
- まず Markdown で構成を固めてから PPTX に落としたいケース
- 一度作った deck を `npm run build:pptx` で再生成できるようにしたいケース

## 前提条件

- GitHub Copilot CLI
- GitHub Copilot が使える GitHub アカウント
- Node.js の安定版
- PowerPoint 生成後に内容確認できる環境

GitHub Copilot CLI のインストール例:

### Windows

```powershell
winget install GitHub.Copilot
```

### npm

```powershell
npm install -g @github/copilot
```

GitHub Copilot CLI の詳細は公式ドキュメントを参照してください。  
https://docs.github.com/copilot/concepts/agents/about-copilot-cli

## クイックスタート

```powershell
git clone https://github.com/hiyasuto/ghcp-pptx.git
cd ghcp-pptx
.\scripts\verify-cli-only.ps1
copilot
```

CLI 起動後、初回は `/login` でサインインします。必要なら `/model` でモデルを変更してください。

最初の実行例:

```text
@AGENTS.md @.github/instructions/createpptx.instructions.md @.github/instructions/proposal-deck.instructions.md
「GitHub Copilot CLI 導入ガイド」をテーマに、情報システム部門向けの 12 枚の PowerPoint 提案資料を作成してください。
課題、意思決定者、求める意思決定、Why now、制約、成功指標、代替案も整理してください。
必要に応じて外部情報を参照し、`makemd` → `checkmd` → `createpptx` → `finalize` の順で最後まで進めてください。
```

`@path` を付けると、そのファイル内容を会話コンテキストに明示的に含められます。  
`.github/agents/*.md` と `.github/prompts/*.md` は自動読込対象ではないため、使うときは `@` が必要です。

## 提案書で最低限あると良い入力

- テーマ
- 対象者
- 意思決定者
- 課題
- 求める意思決定
- Why now
- 制約
- 成功指標
- 代替案
- 参考 URL

## 推奨する提案書構成

1. Executive Summary
2. 現状課題
3. 放置コストまたは機会損失
4. 提案内容
5. 差別化または代替案比較
6. 効果、ROI、期待成果
7. 実行計画
8. リスクと対策
9. 意思決定依頼
10. 付録

## ワークフロー

### 1. makemd

テーマ、目的、対象者、意思決定者、課題などから `<テーマ名>/md/<テーマ名>.md` を作成します。

### 2. checkmd

事実性、表現の明確さ、情報量、見やすさに加えて、提案としての説得力と CTA の明確さを確認し、`<テーマ名>/md/<テーマ名>-Checked.md` を作成します。

### 3. createpptx

`<テーマ名>/js/create-slide.js` を作成し、`pptxgenjs` で `<テーマ名>/docs/<テーマ名>.pptx` を生成します。あわせて `package.json` に `npm run build:pptx` を残し、ターミナルから再生成できるようにします。

### 4. finalize

`templates/header.pptx` と `templates/footer.pptx` を基準に最終調整し、`<テーマ名>/md/<テーマ名>-Finalized.md` に修正内容を残します。

## ディレクトリ構成

```text
.
├── .github/
│   ├── agents/           # 手動で @ 参照する stage ファイル
│   ├── instructions/     # Copilot CLI が自動読込する instruction
│   ├── prompts/          # 手動で @ 参照する prompt 例
│   └── copilot-instructions.md
├── scripts/
│   └── verify-cli-only.ps1
├── templates/
│   ├── header.pptx
│   └── footer.pptx
├── AGENTS.md
└── README.md
```

資料生成を始めると、各テーマごとに次の構成が追加されます。

```text
<テーマ名>/
├── docs/
│   └── <テーマ名>.pptx
├── js/
│   └── create-slide.js
├── md/
│   ├── <テーマ名>.md
│   ├── <テーマ名>-Checked.md
│   └── <テーマ名>-Finalized.md
└── package.json
```

## ステップ単位で使う例

### Markdown だけ作る

```text
@.github/agents/makemd.md
「Azure OpenAI 活用方針」の提案書向けスライド構成 Markdown を作成してください。
```

### 既存 Markdown から PPTX を再生成する

```text
@.github/agents/createpptx.md @.github/instructions/createpptx.instructions.md
`azure-openai-policy/md/azure-openai-policy.md` を使って PPTX を再生成してください。
`package.json` に `build:pptx` script を残してください。
```

### 最終調整だけ行う

```text
@.github/agents/finalize.md
`azure-openai-policy/docs/azure-openai-policy.pptx` を確認し、表紙と末尾を整えてください。
```

## 非対話モードの例

```powershell
copilot -p "@AGENTS.md @.github/instructions/createpptx.instructions.md @.github/instructions/proposal-deck.instructions.md 「新規 CRM 刷新提案」をテーマに 10 枚の提案資料を作成してください。" --allow-all-tools
```

## Copilot CLI で便利なコマンド

- `/login`: サインイン
- `/model`: モデル変更
- `/diff`: 変更確認
- `/instructions`: 読み込まれている instruction を確認
- `/tasks`: バックグラウンド作業を確認
- `Shift+Tab`: mode を切り替え

## 補足

- 参考にした外部 URL は、資料末尾の `参考リンク` スライドと Markdown の両方に残す想定です。
- 厳密なテンプレート差し替えが難しい環境では、同等レイアウトの表紙・末尾スライドを生成 deck 内に直接作成します。
- 既存テーマを更新したい場合は、対象ディレクトリを指定して再生成を依頼してください。
