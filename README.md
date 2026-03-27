# ghcp-pptx

`ghcp-pptx` は、GitHub Copilot CLI で PowerPoint 資料を作るためのテンプレートリポジトリです。

VS Code の custom agent 前提だった構成を、Copilot CLI がそのまま読める instruction / prompt 中心の構成に整理しています。CLI から自然言語で依頼すると、Markdown の構成案作成、レビュー、PptxGenJS による `.pptx` 生成、最終化までを順番に進められます。

## できること

- テーマと要件からスライド構成 Markdown を作成する
- 構成案をレビューし、修正点を明文化する
- PptxGenJS で `.pptx` を生成する
- 表紙と末尾スライドをテンプレート基準で整える
- 参考リンク付きの配布用 PowerPoint を仕上げる

## Copilot CLI 向けに変更した点

- `AGENTS.md` を追加し、CLI が repo ルートで参照しやすいワークフローを定義しました。
- `.github/copilot-instructions.md` を追加し、GitHub Copilot CLI 用の標準手順を明示しました。
- `.github/agents/*.md` を VS Code 固有の custom agent 用メモから、CLI で参照できる stage 定義に書き換えました。
- `.github/prompts/pptx-create-env.md` を CLI 用のコピペプロンプト集に変更しました。
- README を追加し、セットアップから実行例までをまとめました。

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

Copilot CLI の詳細は公式ドキュメントを参照してください。  
https://docs.github.com/copilot/concepts/agents/about-copilot-cli

## クイックスタート

```powershell
git clone https://github.com/hiyasuto/ghcp-pptx.git
cd ghcp-pptx
copilot
```

CLI 起動後、初回は `/login` でサインインします。必要なら `/model` でモデルを変更してください。

最初の実行例:

```text
@AGENTS.md @.github/instructions/createpptx.instructions.md
「GitHub Copilot CLI 導入ガイド」をテーマに、情報システム部門向けの 12 枚の PowerPoint 資料を作成してください。
必要に応じて外部情報を参照し、`makemd` → `checkmd` → `createpptx` → `finalize` の順で最後まで進めてください。
```

`@path` を付けると、そのファイル内容を会話コンテキストに明示的に含められます。  
instruction ファイルは自動で読まれることがありますが、初回は `@` で指定すると意図が伝わりやすいです。

## ワークフロー

### 1. makemd

テーマ、目的、対象者、想定枚数から `<テーマ名>/md/<テーマ名>.md` を作成します。

### 2. checkmd

事実性、表現の明確さ、情報量、見やすさを確認し、`<テーマ名>/md/<テーマ名>-Checked.md` を作成します。フルパイプラインでは必要に応じて元 Markdown も修正します。

### 3. createpptx

`<テーマ名>/js/create-slide.js` を作成し、PptxGenJS で `<テーマ名>/docs/<テーマ名>.pptx` を生成します。

### 4. finalize

`templates/header.pptx` と `templates/footer.pptx` を基準に最終調整し、`<テーマ名>/md/<テーマ名>-Finalized.md` に修正内容を残します。

## ディレクトリ構成

```text
.
├── .github/
│   ├── agents/
│   ├── instructions/
│   ├── prompts/
│   ├── skills/
│   └── copilot-instructions.md
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
「Azure OpenAI 活用方針」のスライド構成 Markdown を作成してください。
```

### 既存 Markdown から PPTX を再生成する

```text
@.github/agents/createpptx.md @.github/instructions/createpptx.instructions.md
`azure-openai-policy/md/azure-openai-policy.md` を使って PPTX を再生成してください。
```

### 最終調整だけ行う

```text
@.github/agents/finalize.md
`azure-openai-policy/docs/azure-openai-policy.pptx` を確認し、表紙と末尾を整えてください。
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
