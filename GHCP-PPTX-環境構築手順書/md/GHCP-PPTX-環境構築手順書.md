# GHCP-PPTX 環境構築手順書

## プレゼンテーション概要
- **目的**: GHCP-PPTX ワークスペースの環境を一から構築するための手順を解説します
- **対象者**: GitHub Copilot を活用して PowerPoint 資料を自動生成したい開発者・利用者
- **スライド枚数**: 20枚

---

## スライド 1: 表紙

### GHCP-PPTX 環境構築手順書

- GitHub Copilot × pptxgenjs による PowerPoint 自動生成環境
- 作成日: 2026年3月24日

---

## スライド 2: 目次

### 目次

- GHCP-PPTX の概要
- ワークスペース全体構成
- VS Code のダウンロードとインストール
- GitHub Copilot 拡張機能のインストール
- Node.js のインストール
- ワークスペースの取得とフォルダ構成
- .vscode/settings.json の設定
- .vscode/mcp.json の設定
- カスタムエージェントの全体フロー
- 各カスタムエージェントの説明（makemd / checkmd / createpptx / finalize）
- インストラクション・スキル・プロンプトファイルの説明
- テンプレートファイルの説明
- 環境構築後の動作確認方法

---

## スライド 3: GHCP-PPTX の概要

### GHCP-PPTX とは

- GitHub Copilot のカスタムエージェント機能を活用し、PowerPoint 資料を自動生成するワークスペースです
- ユーザーはプロンプトファイルにテーマと指示を記述するだけで、マークダウン作成 → レビュー → PPTX 生成 → 最終調整の一連のフローが自動で実行されます
- Node.js の pptxgenjs ライブラリを使用して、プログラムから .pptx ファイルを生成します
- 4 つのカスタムエージェントが連携し、品質を担保しながら資料を作成します

---

## スライド 4: ワークスペース全体構成

### ワークスペースのディレクトリ構成

<!-- 図解: ツリー図（ディレクトリ構成図） -->

```
ghcp-pptx/
├── .github/
│   ├── agents/          ... カスタムエージェント定義
│   │   ├── makemd.md
│   │   ├── checkmd.md
│   │   ├── createpptx.md
│   │   └── finalize.md
│   ├── instructions/    ... 基本仕様定義
│   │   └── createpptx.instructions.md
│   ├── prompts/         ... プロンプトファイル
│   │   └── pptx-create-env.md
│   └── skills/          ... スキル定義
│       └── create-pptx/
│           └── SKILL.md
├── .vscode/
│   ├── mcp.json         ... MCP サーバー設定
│   └── settings.json    ... エージェント有効化設定
└── templates/
    ├── header.pptx      ... 表紙テンプレート
    └── footer.pptx      ... 最終ページテンプレート
```

- 各ディレクトリにはそれぞれ明確な役割があります
- 以降のスライドで各ファイルの詳細を説明します

---

## スライド 5: VS Code のダウンロードとインストール

### VS Code のダウンロードとインストール

- 以下の公式サイトから VS Code をダウンロードしてください
  - https://code.visualstudio.com/
- Windows の場合は「User Installer」または「System Installer」を選択してダウンロードします
- ダウンロードしたインストーラーを実行し、画面の指示に従ってインストールを完了してください
- インストール時のオプションでは以下を推奨します
  - 「PATH に追加する」にチェックを入れてください
  - 「エクスプローラーのコンテキストメニューに追加」にチェックを入れてください
- インストール完了後、VS Code を起動して正常に動作することを確認してください

**参考リンク**:
- VS Code 公式ダウンロードページ: https://code.visualstudio.com/Download
- VS Code セットアップガイド: https://code.visualstudio.com/docs/setup/windows

---

## スライド 6: GitHub Copilot 拡張機能のインストール

### GitHub Copilot 拡張機能のインストール

- VS Code の拡張機能マーケットプレイスから以下の拡張機能をインストールしてください
  - **GitHub Copilot** (`GitHub.copilot`)
    - AI によるコード補完機能を提供します
  - **GitHub Copilot Chat** (`GitHub.copilot-chat`)
    - チャット形式で AI と対話しながら開発を進めることができます
- インストール後、GitHub アカウントでサインインしてください
- GitHub Copilot のサブスクリプション（Individual / Business / Enterprise）が必要です
- Agent モード（カスタムエージェントとの連携機能）を利用するため、最新バージョンの VS Code と拡張機能をご利用ください

<!-- 図解: スクリーンショット風の操作手順図 -->

**参考リンク**:
- GitHub Copilot 公式ドキュメント: https://docs.github.com/ja/copilot
- GitHub Copilot in VS Code: https://code.visualstudio.com/docs/copilot/overview

---

## スライド 7: Node.js のインストール

### Node.js のインストール

- PowerPoint ファイルの生成に pptxgenjs ライブラリを使用するため、Node.js が必要です
- 以下の公式サイトから LTS（長期サポート）版をダウンロードしてインストールしてください
  - https://nodejs.org/ja
- インストール後、ターミナルで以下のコマンドを実行してバージョンを確認してください

```bash
node -v
npm -v
```

- Node.js v18 以上を推奨します
- npm（Node Package Manager）も同時にインストールされます

**参考リンク**:
- Node.js 公式サイト: https://nodejs.org/ja
- Node.js ダウンロードページ: https://nodejs.org/ja/download

---

## スライド 8: ワークスペースの取得とフォルダ構成

### ワークスペースのクローンまたはフォルダ構成の作成

- **Git リポジトリからクローンする場合**:

```bash
git clone <リポジトリURL>
cd ghcp-pptx
```

- **手動でフォルダ構成を作成する場合**:
  - 前述のディレクトリ構成に従い、各フォルダとファイルを作成してください
  - `.github/agents/`、`.github/instructions/`、`.github/prompts/`、`.github/skills/`、`.vscode/`、`templates/` の各ディレクトリを作成します
- ワークスペースを VS Code で開く方法:

```bash
code ghcp-pptx
```

- または VS Code の「ファイル」→「フォルダーを開く」からワークスペースフォルダを選択してください

---

## スライド 9: .vscode/settings.json の設定

### .vscode/settings.json の設定内容と説明

- この設定ファイルにより、GitHub Copilot のエージェント機能やスキル機能が有効化されます

```json
{
    "chat.agent.enabled": true,
    "chat.useAgentSkills": true,
    "chat.instructionsFilesLocations": {
        ".github/instructions": true
    },
    "github.copilot.chat.codeGeneration.useInstructionFiles": true
}
```

| 設定項目 | 説明 |
|----------|------|
| `chat.agent.enabled` | カスタムエージェント（.github/agents/ 配下の .md ファイル）を有効化します |
| `chat.useAgentSkills` | スキルファイル（.github/skills/ 配下）を有効化します |
| `chat.instructionsFilesLocations` | インストラクションファイルの参照先ディレクトリを指定します |
| `github.copilot.chat.codeGeneration.useInstructionFiles` | コード生成時にインストラクションファイルを参照するよう設定します |

---

## スライド 10: .vscode/mcp.json の設定

### .vscode/mcp.json の設定内容と説明（Playwright MCP サーバー）

- MCP（Model Context Protocol）サーバーの設定ファイルです
- Playwright MCP サーバーを使用して、ブラウザ操作の自動化機能を GitHub Copilot に提供します

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

| 設定項目 | 説明 |
|----------|------|
| `servers.playwright.command` | npx コマンドを使用して Playwright MCP サーバーを起動します |
| `servers.playwright.args` | 最新版の `@playwright/mcp` パッケージを指定しています |

- Playwright MCP により、エージェントが Web ページの閲覧・情報取得をブラウザ経由で行えるようになります
- 外部情報の参照やスクリーンショット取得等に活用されます

**参考リンク**:
- Playwright MCP: https://github.com/microsoft/playwright-mcp
- VS Code MCP 設定: https://code.visualstudio.com/docs/copilot/chat/mcp-servers

---

## スライド 11: カスタムエージェントの全体フロー

### カスタムエージェントの処理フロー

<!-- 図解: フローチャート（4つのエージェントの処理順序を示すフロー図） -->

- GHCP-PPTX では、4 つのカスタムエージェントが順番に実行されます
- 各エージェントはそれぞれ異なるデータモデルを使用し、品質を担保します

```
[1. makemd] → [2. checkmd] → [3. createpptx] → [4. finalize]
   ↓              ↓               ↓                ↓
 MD作成        レビュー        PPTX生成        最終調整
(Opus 4.6)    (GPT 5.4)      (Opus 4.6)      (Opus 4.6)
```

- checkmd で NG 判定の場合は makemd に差し戻され、修正が行われます
- すべてのエージェントが正常に完了すると、最終的な .pptx ファイルが生成されます

---

## スライド 12: makemd エージェント

### makemd エージェント（マークダウン作成）

- **ファイル**: `.github/agents/makemd.md`
- **データモデル**: Claude Opus 4.6
- **役割**: PowerPoint 資料を作成する前段階として、スライド構成を定義するマークダウンファイルを作成します

#### 主な機能:
- ユーザーからのテーマや要件をもとに、スライド構成をマークダウン形式で作成します
- 作成したマークダウンファイルは `<テーマ名>/md/` ディレクトリに配置します
- マークダウンには以下を含めます:
  - プレゼンテーションの概要（目的・対象者・スライド枚数）
  - 各スライドの見出し・本文（箇条書き）
  - 図解が必要な箇所の図解種類の明記
  - 参照した外部サイトのリンク情報

---

## スライド 13: checkmd エージェント

### checkmd エージェント（マークダウンレビュー）

- **ファイル**: `.github/agents/checkmd.md`
- **データモデル**: GPT 5.4
- **役割**: makemd が作成したマークダウンファイルの内容を精査し、品質を担保します

#### チェック観点:
| チェック観点 | 内容 |
|-------------|------|
| 事実の正確性 | 記載された事実・数値・用語の正確性を検証します |
| 誤解を招く表現 | 曖昧な表現や不正確な因果関係の記述がないか確認します |
| 過剰な言及 | 1スライドの情報量が多すぎないか確認します |
| 視覚的な見づらさ | 箇条書きのネストの深さや項目数が適切か確認します |

- チェック結果は `<テーマ名>/md/<テーマ名>-Checked.md` に出力されます
- NG がある場合は makemd に差し戻されます

---

## スライド 14: createpptx エージェント

### createpptx エージェント（PowerPoint 生成）

- **ファイル**: `.github/agents/createpptx.md`
- **データモデル**: Claude Opus 4.6
- **役割**: チェック済みのマークダウンファイルをもとに、pptxgenjs を使用して PowerPoint ファイルを生成します

#### 主な機能:
- チェック済みの `<テーマ名>/md/<テーマ名>.md` を入力として使用します
- `.github/instructions/createpptx.instructions.md` に記載された基本仕様に従います
- 生成スクリプトは `<テーマ名>/js/create-slide.js` に配置されます
- 作成した .pptx ファイルは `<テーマ名>/docs/<テーマ名>.pptx` に保存されます
- 実行前に Node.js のバージョン確認を行います

---

## スライド 15: finalize エージェント

### finalize エージェント（最終調整）

- **ファイル**: `.github/agents/finalize.md`
- **データモデル**: Claude Opus 4.6
- **役割**: 作成された PowerPoint 資料の最終確認と調整を行います

#### 主な処理:
- 表紙ページを `templates/header.pptx` のテンプレートに差し替えます
  - タイトル部分のみ既存のタイトルに変更して適用します
- 最終ページに `templates/footer.pptx` のテンプレートを追加します
- `.github/instructions/createpptx.instructions.md` の仕様に基づき最終レビューを実施します
- 仕様外の箇所があれば修正し、完成版を `docs/` ディレクトリに保存します

---

## スライド 16: インストラクションファイルの説明

### .github/instructions/ 配下のインストラクションファイル

- **ファイル**: `createpptx.instructions.md`
- **役割**: PowerPoint 資料作成時の基本的なレイアウトやデザイン条件を定義します

#### 定義されている基本仕様:
| 項目 | 内容 |
|------|------|
| 枚数 | 20枚以内 |
| スライドサイズ | 16:9 |
| テンプレート | Azure Brand Template |
| 背景色 | 白色 |
| フォント色 | 黒色 |
| フォントスタイル | Meiryo UI |
| 文末表現 | ですます調の敬体 |

- 強調する部分は太字にします
- 写真やアイコンを活用し、視覚的にわかりやすくします
- 文字や図形、画像がシートからはみ出ないよう設計します

---

## スライド 17: スキルファイルの説明

### .github/skills/ 配下のスキルファイル

- **ファイル**: `.github/skills/create-pptx/SKILL.md`
- **スキル名**: create-pptx
- **役割**: PowerPoint を新規に作成する指示があった際に、Node.js の pptxgenjs を使用して .pptx 形式の資料を作成するための専門知識を提供します

#### スキルファイルの特徴:
- YAML フロントマターでスキル名と説明を定義しています
- エージェントがコード生成を行う際に自動的に参照されます
- 基本レイアウト・デザイン条件として以下を定義しています:
  - 図解や箇条書きの活用
  - スライド内容の簡潔なまとめ
  - アイコンやイラストの適宜使用
  - 1枚のシート内に収まるレイアウト設計

**参考リンク**:
- VS Code カスタムスキル: https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview

---

## スライド 18: プロンプトファイルの説明

### .github/prompts/ 配下のプロンプトファイル

- **ファイル**: `pptx-create-env.md`
- **役割**: PowerPoint 資料の作成指示と、カスタムエージェントの実行順序を定義するプロンプトファイルです

#### プロンプトファイルの構成:
- **役割の定義**: パワーポイントの要点まとめ・視覚的表現のエキスパートとして振る舞います
- **指示内容**: 作成したい資料のテーマや要件を記述します
- **タスク順序**: 以下の 4 つのエージェントが順番に実行されます
  1. `makemd.md` — マークダウンファイルの作成
  2. `checkmd.md` — マークダウンのレビュー
  3. `createpptx.md` — PowerPoint ファイルの生成
  4. `finalize.md` — 最終確認と調整

- VS Code の Copilot Chat で「Run」ボタンを押すことでプロンプトを実行できます

---

## スライド 19: テンプレートファイルの説明

### templates/ 配下のテンプレートファイル

<!-- 図解: 2つのテンプレートのレイアウトイメージ図 -->

- **templates/header.pptx**
  - 表紙ページ用のテンプレートファイルです
  - finalize エージェントにより、生成された資料の表紙がこのテンプレートに差し替えられます
  - タイトル部分は資料のテーマ名に自動で更新されます

- **templates/footer.pptx**
  - 最終ページ用のテンプレートファイルです
  - finalize エージェントにより、資料の最後にこのページが追加されます
  - 資料の締めくくりとして統一されたデザインを提供します

- これらのテンプレートにより、すべての資料で統一された表紙と最終ページのデザインが適用されます

---

## スライド 20: 環境構築後の動作確認方法

### 環境構築後の動作確認

- 以下の手順で環境が正しく構築されたことを確認してください

1. **前提条件の確認**: ターミナルで `node -v` および `npm -v` を実行し、バージョンが表示されることを確認します
2. **VS Code の設定確認**: ステータスバーに GitHub Copilot アイコンが表示され、Copilot Chat（`Ctrl+Alt+I`）で Agent モードが利用できることを確認します
3. **プロンプトファイルの実行**: `.github/prompts/pptx-create-env.md` を開き、「Run」ボタンをクリックして実行します
4. **出力の確認**: 処理完了後、`<テーマ名>/docs/<テーマ名>.pptx` が生成されていることを確認します

- 各ステップで問題がなければ、環境構築は完了です

---

## 参考リンク一覧

| リソース | URL |
|----------|-----|
| VS Code 公式サイト | https://code.visualstudio.com/ |
| VS Code ダウンロード | https://code.visualstudio.com/Download |
| VS Code Windows セットアップ | https://code.visualstudio.com/docs/setup/windows |
| GitHub Copilot 公式ドキュメント | https://docs.github.com/ja/copilot |
| GitHub Copilot in VS Code | https://code.visualstudio.com/docs/copilot/overview |
| Node.js 公式サイト | https://nodejs.org/ja |
| Node.js ダウンロード | https://nodejs.org/ja/download |
| pptxgenjs GitHub | https://github.com/gitbrent/PptxGenJS |
| VS Code MCP サーバー設定 | https://code.visualstudio.com/docs/copilot/chat/mcp-servers |
| VS Code カスタムエージェント | https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview |
