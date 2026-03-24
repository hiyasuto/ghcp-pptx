const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ============================================================
// GHCP-PPTX 環境構築手順書 — PowerPoint 生成スクリプト
// ============================================================

const pptx = new pptxgen();

// --- グローバル設定 ---
pptx.layout = "LAYOUT_WIDE"; // 16:9
pptx.author = "GHCP-PPTX";
pptx.subject = "GHCP-PPTX 環境構築手順書";
pptx.title = "GHCP-PPTX 環境構築手順書";

// --- 定数 ---
const FONT_FACE = "Meiryo UI";
const COLOR_BLACK = "1E1E1E";
const COLOR_WHITE = "FFFFFF";
const COLOR_AZURE_BLUE = "0078D4";
const COLOR_AZURE_LIGHT = "50E6FF";
const COLOR_AZURE_DARK = "002050";
const COLOR_GRAY = "605E5C";
const COLOR_LIGHT_GRAY = "F3F2F1";
const COLOR_ACCENT_GREEN = "00A36C";
const COLOR_ACCENT_ORANGE = "FF8C00";
const COLOR_ACCENT_RED = "D13438";

// --- ヘルパー関数 ---

/**
 * スライド上部にタイトルバーを配置する
 */
function addTitleBar(slide, title) {
  // Azure ブルーのタイトルバー
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.9,
    fill: { color: COLOR_AZURE_BLUE },
  });
  slide.addText(title, {
    x: 0.5, y: 0.1, w: 12.5, h: 0.7,
    fontSize: 24, fontFace: FONT_FACE, color: COLOR_WHITE, bold: true,
  });
}

/**
 * スライド下部にページ番号を配置する
 */
function addPageNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 11.5, y: 7.0, w: 1.8, h: 0.4,
    fontSize: 10, fontFace: FONT_FACE, color: COLOR_GRAY, align: "right",
  });
}

/**
 * 箇条書きテキストオブジェクトを生成する
 */
function bulletList(items, opts = {}) {
  return items.map((item) => {
    const isObj = typeof item === "object" && item !== null;
    const text = isObj ? item.text : item;
    const bold = isObj ? !!item.bold : false;
    const indent = isObj && item.indent ? item.indent : 0;
    const bullet = isObj && item.bullet !== undefined ? item.bullet : true;
    const fontSize = isObj && item.fontSize ? item.fontSize : (opts.fontSize || 13);
    return {
      text,
      options: {
        fontSize,
        fontFace: FONT_FACE,
        color: opts.color || COLOR_BLACK,
        bold,
        bullet: bullet ? { indent: 14 + indent * 14 } : false,
        indentLevel: indent,
        breakLine: true,
        lineSpacingMultiple: 1.3,
        ...(isObj && item.options ? item.options : {}),
      },
    };
  });
}

/**
 * アイコン風の四角形を描画する（テキストアイコン）
 */
function addIconBox(slide, x, y, w, h, iconText, label, bgColor) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: bgColor },
    rectRadius: 0.1,
  });
  slide.addText(iconText, {
    x, y: y + 0.1, w, h: h * 0.55,
    fontSize: 22, fontFace: FONT_FACE, color: COLOR_WHITE, align: "center", valign: "middle",
  });
  slide.addText(label, {
    x, y: y + h * 0.55, w, h: h * 0.4,
    fontSize: 9, fontFace: FONT_FACE, color: COLOR_WHITE, align: "center", valign: "top", bold: true,
  });
}

/**
 * フロー矢印を描画する
 */
function addArrow(slide, x, y, w) {
  slide.addShape(pptx.shapes.RIGHT_ARROW, {
    x, y, w, h: 0.35,
    fill: { color: COLOR_AZURE_BLUE },
  });
}

const TOTAL_SLIDES = 20;

// ============================================================
// スライド 1 (表紙) は header.pptx テンプレートに差し替えるため省略
// ============================================================

// ============================================================
// スライド 2: 目次
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "目次");
  addPageNumber(slide, 2, TOTAL_SLIDES);

  const tocLeft = [
    "GHCP-PPTX の概要",
    "ワークスペース全体構成",
    "VS Code のダウンロードとインストール",
    "GitHub Copilot 拡張機能のインストール",
    "Node.js のインストール",
    "ワークスペースの取得とフォルダ構成",
    "settings.json の設定",
    "mcp.json の設定",
    "カスタムエージェントの全体フロー",
    "makemd エージェント",
  ];
  const tocRight = [
    "checkmd エージェント",
    "createpptx エージェント",
    "finalize エージェント",
    "インストラクションファイルの説明",
    "スキルファイルの説明",
    "プロンプト・テンプレートファイルの説明",
    "環境構築後の動作確認方法",
  ];

  tocLeft.forEach((t, i) => {
    const num = String(i + 3).padStart(2, " ");
    slide.addText(`${num}.  ${t}`, {
      x: 0.6, y: 1.15 + i * 0.5, w: 6.2, h: 0.45,
      fontSize: 12, fontFace: FONT_FACE, color: COLOR_BLACK,
      valign: "middle",
    });
    // 番号のアクセント線
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 1.15 + i * 0.5, w: 0.06, h: 0.4,
      fill: { color: COLOR_AZURE_BLUE },
    });
  });

  tocRight.forEach((t, i) => {
    const num = String(i + 13).padStart(2, " ");
    slide.addText(`${num}.  ${t}`, {
      x: 6.9, y: 1.15 + i * 0.5, w: 6.2, h: 0.45,
      fontSize: 12, fontFace: FONT_FACE, color: COLOR_BLACK,
      valign: "middle",
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 6.8, y: 1.15 + i * 0.5, w: 0.06, h: 0.4,
      fill: { color: COLOR_AZURE_BLUE },
    });
  });
})();

// ============================================================
// スライド 3: GHCP-PPTX の概要
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "GHCP-PPTX とは");
  addPageNumber(slide, 3, TOTAL_SLIDES);

  slide.addText(bulletList([
    { text: "GitHub Copilot のカスタムエージェント機能を活用し、PowerPoint 資料を自動生成するワークスペースです", bold: true },
    { text: "ユーザーはプロンプトファイルにテーマと指示を記述するだけで、一連のフローが自動で実行されます" },
    { text: "Node.js の pptxgenjs ライブラリを使用して、プログラムから .pptx ファイルを生成します" },
    { text: "4 つのカスタムエージェントが連携し、品質を担保しながら資料を作成します" },
  ]), {
    x: 0.5, y: 1.3, w: 7.5, h: 3.5,
    valign: "top",
  });

  // 4つのエージェントアイコン
  addIconBox(slide, 0.8, 5.3, 2.5, 1.3, "📝", "makemd", COLOR_AZURE_BLUE);
  addIconBox(slide, 3.7, 5.3, 2.5, 1.3, "✅", "checkmd", COLOR_ACCENT_GREEN);
  addIconBox(slide, 6.6, 5.3, 2.5, 1.3, "📊", "createpptx", COLOR_ACCENT_ORANGE);
  addIconBox(slide, 9.5, 5.3, 2.5, 1.3, "🎨", "finalize", COLOR_AZURE_DARK);

  // 矢印
  addArrow(slide, 3.35, 5.75, 0.3);
  addArrow(slide, 6.25, 5.75, 0.3);
  addArrow(slide, 9.15, 5.75, 0.3);
})();

// ============================================================
// スライド 4: ワークスペース全体構成
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "ワークスペースのディレクトリ構成");
  addPageNumber(slide, 4, TOTAL_SLIDES);

  const treeLines = [
    "ghcp-pptx/",
    "├── .github/",
    "│   ├── agents/          … カスタムエージェント定義",
    "│   │   ├── makemd.md",
    "│   │   ├── checkmd.md",
    "│   │   ├── createpptx.md",
    "│   │   └── finalize.md",
    "│   ├── instructions/    … 基本仕様定義",
    "│   │   └── createpptx.instructions.md",
    "│   ├── prompts/         … プロンプトファイル",
    "│   │   └── pptx-create-env.md",
    "│   └── skills/          … スキル定義",
    "│       └── create-pptx/SKILL.md",
    "├── .vscode/",
    "│   ├── mcp.json         … MCP サーバー設定",
    "│   └── settings.json    … エージェント有効化設定",
    "└── templates/",
    "    ├── header.pptx      … 表紙テンプレート",
    "    └── footer.pptx      … 最終ページテンプレート",
  ];

  // 背景ボックス
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.2, w: 8, h: 5.8,
    fill: { color: "F9F9F9" },
    rectRadius: 0.1,
    line: { color: "E0E0E0", width: 1 },
  });

  slide.addText(treeLines.join("\n"), {
    x: 0.6, y: 1.3, w: 7.6, h: 5.5,
    fontSize: 11, fontFace: "Consolas", color: COLOR_BLACK,
    valign: "top", lineSpacingMultiple: 1.25,
  });

  // 右側の補足
  slide.addText(bulletList([
    { text: "各ディレクトリにはそれぞれ明確な役割があります" },
    { text: "以降のスライドで各ファイルの詳細を説明します" },
  ]), {
    x: 8.7, y: 1.3, w: 4.5, h: 2.5,
    valign: "top",
  });
})();

// ============================================================
// スライド 5: VS Code のダウンロードとインストール
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "VS Code のダウンロードとインストール");
  addPageNumber(slide, 5, TOTAL_SLIDES);

  slide.addText(bulletList([
    { text: "公式サイト（https://code.visualstudio.com/）からダウンロードしてください" },
    { text: "Windows の場合は「User Installer」または「System Installer」を選択します" },
    { text: "インストーラーを実行し、画面の指示に従って完了してください" },
    { text: "インストール時の推奨オプション:", bold: true },
    { text: "「PATH に追加する」にチェックを入れてください", indent: 1 },
    { text: "「エクスプローラーのコンテキストメニューに追加」にチェックを入れてください", indent: 1 },
    { text: "インストール完了後、VS Code を起動して正常に動作することを確認してください" },
  ]), {
    x: 0.5, y: 1.3, w: 12.3, h: 4.5,
    valign: "top",
  });

  // VS Code アイコンボックス
  addIconBox(slide, 4.5, 5.6, 4.3, 1.2, "💻", "Visual Studio Code", COLOR_AZURE_BLUE);
})();

// ============================================================
// スライド 6: GitHub Copilot 拡張機能のインストール
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "GitHub Copilot 拡張機能のインストール");
  addPageNumber(slide, 6, TOTAL_SLIDES);

  slide.addText(bulletList([
    { text: "VS Code の拡張機能マーケットプレイスから以下をインストールしてください", bold: true },
  ]), {
    x: 0.5, y: 1.2, w: 12.3, h: 0.6,
    valign: "top",
  });

  // 2つの拡張機能カード
  // GitHub Copilot
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 2.0, w: 5.8, h: 1.8,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.1,
    line: { color: COLOR_AZURE_BLUE, width: 2 },
  });
  slide.addText("🤖  GitHub Copilot", {
    x: 0.8, y: 2.1, w: 5.4, h: 0.5,
    fontSize: 16, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addText("GitHub.copilot\nAI によるコード補完機能を提供します", {
    x: 0.8, y: 2.6, w: 5.4, h: 1.0,
    fontSize: 11, fontFace: FONT_FACE, color: COLOR_GRAY, lineSpacingMultiple: 1.4,
  });

  // GitHub Copilot Chat
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 2.0, w: 5.8, h: 1.8,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.1,
    line: { color: COLOR_AZURE_BLUE, width: 2 },
  });
  slide.addText("💬  GitHub Copilot Chat", {
    x: 7.0, y: 2.1, w: 5.4, h: 0.5,
    fontSize: 16, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addText("GitHub.copilot-chat\nチャット形式で AI と対話しながら開発できます", {
    x: 7.0, y: 2.6, w: 5.4, h: 1.0,
    fontSize: 11, fontFace: FONT_FACE, color: COLOR_GRAY, lineSpacingMultiple: 1.4,
  });

  slide.addText(bulletList([
    { text: "インストール後、GitHub アカウントでサインインしてください" },
    { text: "GitHub Copilot のサブスクリプション（Individual / Business / Enterprise）が必要です" },
    { text: "Agent モードを利用するため、最新バージョンの VS Code と拡張機能をご利用ください" },
  ]), {
    x: 0.5, y: 4.2, w: 12.3, h: 2.5,
    valign: "top",
  });
})();

// ============================================================
// スライド 7: Node.js のインストール
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "Node.js のインストール");
  addPageNumber(slide, 7, TOTAL_SLIDES);

  slide.addText(bulletList([
    { text: "PowerPoint ファイルの生成に pptxgenjs ライブラリを使用するため、Node.js が必要です", bold: true },
    { text: "公式サイト（https://nodejs.org/ja）から LTS（長期サポート）版をダウンロードしてください" },
    { text: "Node.js v18 以上を推奨します" },
    { text: "npm（Node Package Manager）も同時にインストールされます" },
  ]), {
    x: 0.5, y: 1.2, w: 12.3, h: 2.8,
    valign: "top",
  });

  // コマンド表示ボックス
  slide.addText("バージョン確認コマンド", {
    x: 0.6, y: 4.2, w: 4, h: 0.4,
    fontSize: 12, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 4.7, w: 5.5, h: 1.5,
    fill: { color: "2D2D2D" }, rectRadius: 0.1,
  });
  slide.addText("$ node -v\nv25.x.x\n\n$ npm -v\n11.x.x", {
    x: 0.9, y: 4.8, w: 5, h: 1.3,
    fontSize: 12, fontFace: "Consolas", color: "4EC9B0",
    valign: "top", lineSpacingMultiple: 1.2,
  });

  // Node.js アイコン
  addIconBox(slide, 7.5, 4.7, 4.5, 1.5, "⬢", "Node.js + npm", COLOR_ACCENT_GREEN);
})();

// ============================================================
// スライド 8: ワークスペースの取得とフォルダ構成
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "ワークスペースの取得とフォルダ構成");
  addPageNumber(slide, 8, TOTAL_SLIDES);

  // Git clone セクション
  slide.addText("Git リポジトリからクローンする場合", {
    x: 0.6, y: 1.2, w: 6, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.7, w: 5.5, h: 1.1,
    fill: { color: "2D2D2D" }, rectRadius: 0.1,
  });
  slide.addText("$ git clone <リポジトリURL>\n$ cd ghcp-pptx", {
    x: 0.9, y: 1.8, w: 5, h: 0.9,
    fontSize: 12, fontFace: "Consolas", color: "4EC9B0",
    valign: "top", lineSpacingMultiple: 1.3,
  });

  // 手動セクション
  slide.addText("手動でフォルダ構成を作成する場合", {
    x: 6.8, y: 1.2, w: 6, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addText(bulletList([
    { text: "ディレクトリ構成に従い、各フォルダとファイルを作成してください", fontSize: 11 },
    { text: ".github/agents/", indent: 1, fontSize: 11 },
    { text: ".github/instructions/", indent: 1, fontSize: 11 },
    { text: ".github/prompts/", indent: 1, fontSize: 11 },
    { text: ".github/skills/", indent: 1, fontSize: 11 },
    { text: ".vscode/", indent: 1, fontSize: 11 },
    { text: "templates/", indent: 1, fontSize: 11 },
  ]), {
    x: 6.8, y: 1.7, w: 6, h: 3.5,
    valign: "top",
  });

  // VS Code で開く方法
  slide.addText("VS Code でワークスペースを開く", {
    x: 0.6, y: 3.3, w: 6, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.8, w: 5.5, h: 0.8,
    fill: { color: "2D2D2D" }, rectRadius: 0.1,
  });
  slide.addText("$ code ghcp-pptx", {
    x: 0.9, y: 3.9, w: 5, h: 0.6,
    fontSize: 12, fontFace: "Consolas", color: "4EC9B0",
    valign: "middle",
  });

  slide.addText(bulletList([
    { text: "または VS Code の「ファイル」→「フォルダーを開く」からワークスペースフォルダを選択してください" },
  ]), {
    x: 0.5, y: 4.8, w: 12.3, h: 0.8,
    valign: "top",
  });
})();

// ============================================================
// スライド 9: .vscode/settings.json の設定
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "settings.json の設定内容と説明");
  addPageNumber(slide, 9, TOTAL_SLIDES);

  slide.addText(bulletList([
    { text: "この設定ファイルにより、GitHub Copilot のエージェント機能やスキル機能が有効化されます", bold: true },
  ]), {
    x: 0.5, y: 1.2, w: 12.3, h: 0.6,
    valign: "top",
  });

  // JSON コードブロック
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.9, w: 6.5, h: 2.8,
    fill: { color: "2D2D2D" }, rectRadius: 0.1,
  });
  slide.addText(
    '{\n  "chat.agent.enabled": true,\n  "chat.useAgentSkills": true,\n  "chat.instructionsFilesLocations": {\n    ".github/instructions": true\n  },\n  "github.copilot.chat.codeGeneration\n   .useInstructionFiles": true\n}',
    {
      x: 0.8, y: 2.0, w: 6, h: 2.6,
      fontSize: 11, fontFace: "Consolas", color: "4EC9B0",
      valign: "top", lineSpacingMultiple: 1.2,
    }
  );

  // 設定項目テーブル
  const tableRows = [
    [
      { text: "設定項目", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_AZURE_BLUE }, align: "center", valign: "middle" } },
      { text: "説明", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_AZURE_BLUE }, align: "center", valign: "middle" } },
    ],
    [
      { text: "chat.agent.enabled", options: { fontSize: 9, fontFace: "Consolas", valign: "middle" } },
      { text: "カスタムエージェントを有効化します", options: { fontSize: 9, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "chat.useAgentSkills", options: { fontSize: 9, fontFace: "Consolas", valign: "middle" } },
      { text: "スキルファイルを有効化します", options: { fontSize: 9, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "instructionsFilesLocations", options: { fontSize: 9, fontFace: "Consolas", valign: "middle" } },
      { text: "インストラクションファイルの参照先を指定します", options: { fontSize: 9, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "useInstructionFiles", options: { fontSize: 9, fontFace: "Consolas", valign: "middle" } },
      { text: "コード生成時にインストラクションを参照します", options: { fontSize: 9, fontFace: FONT_FACE, valign: "middle" } },
    ],
  ];
  slide.addTable(tableRows, {
    x: 7.3, y: 1.9, w: 5.8,
    rowH: [0.4, 0.5, 0.5, 0.5, 0.5],
    border: { type: "solid", pt: 0.5, color: "E0E0E0" },
    colW: [2.3, 3.5],
  });
})();

// ============================================================
// スライド 10: .vscode/mcp.json の設定
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "mcp.json の設定内容と説明（Playwright MCP）");
  addPageNumber(slide, 10, TOTAL_SLIDES);

  slide.addText(bulletList([
    { text: "MCP（Model Context Protocol）サーバーの設定ファイルです", bold: true },
    { text: "Playwright MCP サーバーを使用して、ブラウザ操作の自動化機能を提供します" },
  ]), {
    x: 0.5, y: 1.2, w: 12.3, h: 1.0,
    valign: "top",
  });

  // JSON コードブロック
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 2.4, w: 6.5, h: 2.2,
    fill: { color: "2D2D2D" }, rectRadius: 0.1,
  });
  slide.addText(
    '{\n  "servers": {\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    }\n  }\n}',
    {
      x: 0.8, y: 2.5, w: 6, h: 2.0,
      fontSize: 11, fontFace: "Consolas", color: "4EC9B0",
      valign: "top", lineSpacingMultiple: 1.2,
    }
  );

  // テーブル
  const tableRows = [
    [
      { text: "設定項目", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_AZURE_BLUE }, align: "center", valign: "middle" } },
      { text: "説明", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_AZURE_BLUE }, align: "center", valign: "middle" } },
    ],
    [
      { text: "command", options: { fontSize: 9, fontFace: "Consolas", valign: "middle" } },
      { text: "npx コマンドで Playwright MCP を起動します", options: { fontSize: 9, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "args", options: { fontSize: 9, fontFace: "Consolas", valign: "middle" } },
      { text: "最新版の @playwright/mcp を指定しています", options: { fontSize: 9, fontFace: FONT_FACE, valign: "middle" } },
    ],
  ];
  slide.addTable(tableRows, {
    x: 7.3, y: 2.4, w: 5.8,
    rowH: [0.4, 0.5, 0.5],
    border: { type: "solid", pt: 0.5, color: "E0E0E0" },
    colW: [2.0, 3.8],
  });

  slide.addText(bulletList([
    { text: "Playwright MCP により、エージェントが Web ページの閲覧・情報取得をブラウザ経由で行えます" },
    { text: "外部情報の参照やスクリーンショット取得等に活用されます" },
  ]), {
    x: 0.5, y: 5.0, w: 12.3, h: 1.5,
    valign: "top",
  });
})();

// ============================================================
// スライド 11: カスタムエージェントの全体フロー
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "カスタムエージェントの処理フロー");
  addPageNumber(slide, 11, TOTAL_SLIDES);

  slide.addText(bulletList([
    { text: "GHCP-PPTX では、4 つのカスタムエージェントが順番に実行されます", bold: true },
    { text: "各エージェントはそれぞれ異なるデータモデルを使用し、品質を担保します" },
  ]), {
    x: 0.5, y: 1.2, w: 12.3, h: 1.0,
    valign: "top",
  });

  // フロー図 — 4つのボックスと矢印
  const agents = [
    { label: "1. makemd", desc: "MD作成", model: "Opus 4.6", color: COLOR_AZURE_BLUE, icon: "📝" },
    { label: "2. checkmd", desc: "レビュー", model: "GPT 5.4", color: COLOR_ACCENT_GREEN, icon: "✅" },
    { label: "3. createpptx", desc: "PPTX生成", model: "Opus 4.6", color: COLOR_ACCENT_ORANGE, icon: "📊" },
    { label: "4. finalize", desc: "最終調整", model: "Opus 4.6", color: COLOR_AZURE_DARK, icon: "🎨" },
  ];

  agents.forEach((a, i) => {
    const x = 0.5 + i * 3.2;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.8, w: 2.6, h: 2.5,
      fill: { color: a.color }, rectRadius: 0.15,
      shadow: { type: "outer", blur: 6, offset: 2, color: "999999", opacity: 0.3 },
    });
    slide.addText(a.icon, {
      x, y: 2.9, w: 2.6, h: 0.8,
      fontSize: 28, fontFace: FONT_FACE, color: COLOR_WHITE, align: "center", valign: "middle",
    });
    slide.addText(a.label, {
      x, y: 3.7, w: 2.6, h: 0.5,
      fontSize: 14, fontFace: FONT_FACE, color: COLOR_WHITE, align: "center", bold: true,
    });
    slide.addText(a.desc, {
      x, y: 4.2, w: 2.6, h: 0.4,
      fontSize: 12, fontFace: FONT_FACE, color: COLOR_WHITE, align: "center",
    });
    slide.addText(a.model, {
      x, y: 4.7, w: 2.6, h: 0.4,
      fontSize: 10, fontFace: FONT_FACE, color: COLOR_AZURE_LIGHT, align: "center",
    });
    // 矢印
    if (i < 3) {
      addArrow(slide, x + 2.65, 3.85, 0.45);
    }
  });

  // NG差し戻しの注釈
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2, y: 5.8, w: 7.5, h: 0.9,
    fill: { color: "FFF3E0" }, rectRadius: 0.08,
    line: { color: COLOR_ACCENT_ORANGE, width: 1 },
  });
  slide.addText("⚠  checkmd で NG 判定の場合は makemd に差し戻され、修正が行われます", {
    x: 1.4, y: 5.9, w: 7.1, h: 0.7,
    fontSize: 11, fontFace: FONT_FACE, color: COLOR_ACCENT_ORANGE, valign: "middle",
  });
})();

// ============================================================
// スライド 12: makemd エージェント
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "makemd エージェント（マークダウン作成）");
  addPageNumber(slide, 12, TOTAL_SLIDES);

  // 基本情報カード
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.2, w: 5.5, h: 1.2,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.08,
    line: { color: COLOR_AZURE_BLUE, width: 1.5 },
  });
  slide.addText("📄  ファイル: .github/agents/makemd.md\n🧠  データモデル: Claude Opus 4.6", {
    x: 0.7, y: 1.3, w: 5.1, h: 1.0,
    fontSize: 11, fontFace: FONT_FACE, color: COLOR_BLACK, lineSpacingMultiple: 1.5,
  });

  slide.addText("役割", {
    x: 0.5, y: 2.7, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addText(bulletList([
    { text: "PowerPoint 資料の前段階として、スライド構成を定義するマークダウンファイルを作成します", bold: true },
  ]), {
    x: 0.5, y: 3.1, w: 12.3, h: 0.6,
    valign: "top",
  });

  slide.addText("主な機能", {
    x: 0.5, y: 3.8, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addText(bulletList([
    { text: "ユーザーからのテーマや要件をもとに、スライド構成をマークダウン形式で作成します" },
    { text: "作成したマークダウンファイルは <テーマ名>/md/ ディレクトリに配置します" },
    { text: "マークダウンには以下を含めます：", bold: true },
    { text: "プレゼンテーションの概要（目的・対象者・スライド枚数）", indent: 1 },
    { text: "各スライドの見出し・本文（箇条書き）", indent: 1 },
    { text: "図解が必要な箇所の図解種類の明記", indent: 1 },
    { text: "参照した外部サイトのリンク情報", indent: 1 },
  ]), {
    x: 0.5, y: 4.2, w: 12.3, h: 3.2,
    valign: "top",
  });
})();

// ============================================================
// スライド 13: checkmd エージェント
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "checkmd エージェント（マークダウンレビュー）");
  addPageNumber(slide, 13, TOTAL_SLIDES);

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.2, w: 5.5, h: 1.2,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.08,
    line: { color: COLOR_ACCENT_GREEN, width: 1.5 },
  });
  slide.addText("📄  ファイル: .github/agents/checkmd.md\n🧠  データモデル: GPT 5.4", {
    x: 0.7, y: 1.3, w: 5.1, h: 1.0,
    fontSize: 11, fontFace: FONT_FACE, color: COLOR_BLACK, lineSpacingMultiple: 1.5,
  });

  slide.addText("チェック観点", {
    x: 0.5, y: 2.7, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });

  const checkTable = [
    [
      { text: "チェック観点", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_ACCENT_GREEN }, align: "center", valign: "middle" } },
      { text: "内容", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_ACCENT_GREEN }, align: "center", valign: "middle" } },
    ],
    [
      { text: "事実の正確性", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "記載された事実・数値・用語の正確性を検証します", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "誤解を招く表現", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "曖昧な表現や不正確な因果関係がないか確認します", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "過剰な言及", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "1スライドの情報量が多すぎないか確認します", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "視覚的な見づらさ", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "箇条書きのネスト深さや項目数が適切か確認します", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
  ];
  slide.addTable(checkTable, {
    x: 0.5, y: 3.2, w: 12.3,
    rowH: [0.4, 0.5, 0.5, 0.5, 0.5],
    border: { type: "solid", pt: 0.5, color: "E0E0E0" },
    colW: [3, 9.3],
  });

  slide.addText(bulletList([
    { text: "チェック結果は <テーマ名>/md/<テーマ名>-Checked.md に出力されます" },
    { text: "NG がある場合は makemd に差し戻されます" },
  ]), {
    x: 0.5, y: 5.8, w: 12.3, h: 1.2,
    valign: "top",
  });
})();

// ============================================================
// スライド 14: createpptx エージェント
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "createpptx エージェント（PowerPoint 生成）");
  addPageNumber(slide, 14, TOTAL_SLIDES);

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.2, w: 5.5, h: 1.2,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.08,
    line: { color: COLOR_ACCENT_ORANGE, width: 1.5 },
  });
  slide.addText("📄  ファイル: .github/agents/createpptx.md\n🧠  データモデル: Claude Opus 4.6", {
    x: 0.7, y: 1.3, w: 5.1, h: 1.0,
    fontSize: 11, fontFace: FONT_FACE, color: COLOR_BLACK, lineSpacingMultiple: 1.5,
  });

  slide.addText("主な機能", {
    x: 0.5, y: 2.7, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });

  slide.addText(bulletList([
    { text: "チェック済みの <テーマ名>/md/<テーマ名>.md を入力として使用します", bold: true },
    { text: ".github/instructions/createpptx.instructions.md に記載された基本仕様に従います" },
    { text: "生成スクリプトは <テーマ名>/js/create-slide.js に配置されます" },
    { text: "作成した .pptx ファイルは <テーマ名>/docs/<テーマ名>.pptx に保存されます" },
    { text: "実行前に Node.js のバージョン確認を行います" },
  ]), {
    x: 0.5, y: 3.2, w: 12.3, h: 3.0,
    valign: "top",
  });

  // フロー小さめ
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.0, y: 5.6, w: 2.8, h: 0.9,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.08,
    line: { color: COLOR_ACCENT_ORANGE, width: 1 },
  });
  slide.addText("📄 MD ファイル\n（入力）", {
    x: 1.0, y: 5.65, w: 2.8, h: 0.8,
    fontSize: 10, fontFace: FONT_FACE, color: COLOR_BLACK, align: "center", valign: "middle",
  });
  addArrow(slide, 3.9, 5.9, 0.6);
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.6, y: 5.6, w: 2.8, h: 0.9,
    fill: { color: COLOR_ACCENT_ORANGE }, rectRadius: 0.08,
  });
  slide.addText("⚙ create-slide.js\n（処理）", {
    x: 4.6, y: 5.65, w: 2.8, h: 0.8,
    fontSize: 10, fontFace: FONT_FACE, color: COLOR_WHITE, align: "center", valign: "middle",
  });
  addArrow(slide, 7.5, 5.9, 0.6);
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.2, y: 5.6, w: 2.8, h: 0.9,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.08,
    line: { color: COLOR_ACCENT_ORANGE, width: 1 },
  });
  slide.addText("📊 .pptx ファイル\n（出力）", {
    x: 8.2, y: 5.65, w: 2.8, h: 0.8,
    fontSize: 10, fontFace: FONT_FACE, color: COLOR_BLACK, align: "center", valign: "middle",
  });
})();

// ============================================================
// スライド 15: finalize エージェント
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "finalize エージェント（最終調整）");
  addPageNumber(slide, 15, TOTAL_SLIDES);

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.2, w: 5.5, h: 1.2,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.08,
    line: { color: COLOR_AZURE_DARK, width: 1.5 },
  });
  slide.addText("📄  ファイル: .github/agents/finalize.md\n🧠  データモデル: Claude Opus 4.6", {
    x: 0.7, y: 1.3, w: 5.1, h: 1.0,
    fontSize: 11, fontFace: FONT_FACE, color: COLOR_BLACK, lineSpacingMultiple: 1.5,
  });

  slide.addText("主な処理", {
    x: 0.5, y: 2.7, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });

  slide.addText(bulletList([
    { text: "表紙ページを templates/header.pptx のテンプレートに差し替えます", bold: true },
    { text: "タイトル部分のみ既存のタイトルに変更して適用します", indent: 1 },
    { text: "最終ページに templates/footer.pptx のテンプレートを追加します" },
    { text: ".github/instructions/createpptx.instructions.md の仕様に基づき最終レビューを実施します" },
    { text: "仕様外の箇所があれば修正し、完成版を docs/ ディレクトリに保存します" },
  ]), {
    x: 0.5, y: 3.2, w: 12.3, h: 3.0,
    valign: "top",
  });

  // テンプレート適用の図解
  addIconBox(slide, 1.0, 5.6, 2.5, 1.1, "📑", "header.pptx", COLOR_AZURE_BLUE);
  slide.addText("+", {
    x: 3.7, y: 5.8, w: 0.5, h: 0.7,
    fontSize: 28, fontFace: FONT_FACE, color: COLOR_GRAY, align: "center", valign: "middle",
  });
  addIconBox(slide, 4.4, 5.6, 2.5, 1.1, "📊", "生成済み PPTX", COLOR_ACCENT_ORANGE);
  slide.addText("+", {
    x: 7.1, y: 5.8, w: 0.5, h: 0.7,
    fontSize: 28, fontFace: FONT_FACE, color: COLOR_GRAY, align: "center", valign: "middle",
  });
  addIconBox(slide, 7.8, 5.6, 2.5, 1.1, "📑", "footer.pptx", COLOR_AZURE_BLUE);
  slide.addText("=", {
    x: 10.5, y: 5.8, w: 0.5, h: 0.7,
    fontSize: 28, fontFace: FONT_FACE, color: COLOR_GRAY, align: "center", valign: "middle",
  });
  addIconBox(slide, 11.2, 5.6, 1.8, 1.1, "✨", "完成版", COLOR_ACCENT_GREEN);
})();

// ============================================================
// スライド 16: インストラクションファイルの説明
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "インストラクションファイルの説明");
  addPageNumber(slide, 16, TOTAL_SLIDES);

  slide.addText(bulletList([
    { text: "ファイル: .github/instructions/createpptx.instructions.md", bold: true },
    { text: "PowerPoint 資料作成時の基本的なレイアウトやデザイン条件を定義します" },
  ]), {
    x: 0.5, y: 1.2, w: 12.3, h: 0.9,
    valign: "top",
  });

  const specTable = [
    [
      { text: "項目", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_AZURE_BLUE }, align: "center", valign: "middle" } },
      { text: "内容", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_AZURE_BLUE }, align: "center", valign: "middle" } },
    ],
    [
      { text: "枚数", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "20枚以内", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "スライドサイズ", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "16:9", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "テンプレート", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "Azure Brand Template", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "背景色", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "白色", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "フォント色", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "黒色", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "フォントスタイル", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "Meiryo UI", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
    [
      { text: "文末表現", options: { fontSize: 10, fontFace: FONT_FACE, bold: true, valign: "middle" } },
      { text: "ですます調の敬体", options: { fontSize: 10, fontFace: FONT_FACE, valign: "middle" } },
    ],
  ];
  slide.addTable(specTable, {
    x: 0.5, y: 2.3, w: 8,
    rowH: [0.4, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
    border: { type: "solid", pt: 0.5, color: "E0E0E0" },
    colW: [2.5, 5.5],
  });

  slide.addText(bulletList([
    { text: "強調する部分は太字にします" },
    { text: "写真やアイコンを活用し、視覚的にわかりやすくします" },
    { text: "文字や図形、画像がシートからはみ出ないよう設計します" },
  ]), {
    x: 8.8, y: 2.3, w: 4.2, h: 3.0,
    valign: "top",
  });
})();

// ============================================================
// スライド 17: スキルファイルの説明
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "スキルファイルの説明");
  addPageNumber(slide, 17, TOTAL_SLIDES);

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.2, w: 12.3, h: 1.2,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.08,
    line: { color: COLOR_AZURE_BLUE, width: 1 },
  });
  slide.addText("📁  .github/skills/create-pptx/SKILL.md\n🏷  スキル名: create-pptx", {
    x: 0.7, y: 1.3, w: 11.9, h: 1.0,
    fontSize: 12, fontFace: FONT_FACE, color: COLOR_BLACK, lineSpacingMultiple: 1.5,
  });

  slide.addText("役割", {
    x: 0.5, y: 2.7, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addText(bulletList([
    { text: "PowerPoint を新規に作成する指示があった際に、pptxgenjs を使用して .pptx を作成するための専門知識を提供します", bold: true },
  ]), {
    x: 0.5, y: 3.1, w: 12.3, h: 0.6,
    valign: "top",
  });

  slide.addText("スキルファイルの特徴", {
    x: 0.5, y: 3.8, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });

  // 4つの特徴ボックス
  const features = [
    { icon: "📐", text: "図解や箇条書きの\n活用" },
    { icon: "📝", text: "スライド内容の\n簡潔なまとめ" },
    { icon: "🎨", text: "アイコンや\nイラストの使用" },
    { icon: "📏", text: "1枚のシート内に\n収まるレイアウト" },
  ];
  features.forEach((f, i) => {
    const x = 0.5 + i * 3.15;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 4.5, w: 2.9, h: 1.6,
      fill: { color: COLOR_WHITE }, rectRadius: 0.1,
      line: { color: COLOR_AZURE_BLUE, width: 1 },
      shadow: { type: "outer", blur: 4, offset: 1, color: "CCCCCC", opacity: 0.3 },
    });
    slide.addText(f.icon, {
      x, y: 4.55, w: 2.9, h: 0.7,
      fontSize: 24, fontFace: FONT_FACE, align: "center", valign: "middle",
    });
    slide.addText(f.text, {
      x, y: 5.2, w: 2.9, h: 0.8,
      fontSize: 10, fontFace: FONT_FACE, color: COLOR_BLACK, align: "center", valign: "top",
    });
  });
})();

// ============================================================
// スライド 18: プロンプト・テンプレートファイルの説明
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "プロンプトファイル・テンプレートファイルの説明");
  addPageNumber(slide, 18, TOTAL_SLIDES);

  // プロンプトファイル セクション
  slide.addText("プロンプトファイル", {
    x: 0.5, y: 1.2, w: 6, h: 0.35,
    fontSize: 13, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.6, w: 6, h: 0.5,
    fill: { color: COLOR_LIGHT_GRAY }, rectRadius: 0.06,
    line: { color: COLOR_AZURE_BLUE, width: 1 },
  });
  slide.addText("📁  .github/prompts/pptx-create-env.md", {
    x: 0.7, y: 1.65, w: 5.6, h: 0.4,
    fontSize: 10, fontFace: FONT_FACE, color: COLOR_BLACK,
  });
  slide.addText(bulletList([
    { text: "資料作成指示と実行順序を定義するファイルです", fontSize: 10 },
    { text: "テーマや要件を記述し、4 つのエージェントを順番に実行します", fontSize: 10 },
    { text: "VS Code の Copilot Chat で Run ボタンを押して実行します", fontSize: 10 },
  ]), {
    x: 0.5, y: 2.2, w: 6, h: 1.6,
    valign: "top",
  });

  // テンプレートファイル セクション
  slide.addText("テンプレートファイル", {
    x: 6.8, y: 1.2, w: 6, h: 0.35,
    fontSize: 13, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });

  // header.pptx カード
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.6, w: 5.8, h: 1.6,
    fill: { color: COLOR_WHITE }, rectRadius: 0.08,
    line: { color: COLOR_AZURE_BLUE, width: 1.5 },
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8, y: 1.6, w: 5.8, h: 0.4,
    fill: { color: COLOR_AZURE_BLUE },
  });
  slide.addText("📑  templates/header.pptx", {
    x: 7.0, y: 1.62, w: 5.4, h: 0.35,
    fontSize: 10, fontFace: FONT_FACE, color: COLOR_WHITE, bold: true,
  });
  slide.addText(bulletList([
    { text: "表紙用テンプレートです。タイトル部分はテーマ名に自動更新されます", fontSize: 9 },
  ]), {
    x: 7.0, y: 2.1, w: 5.4, h: 1.0,
    valign: "top",
  });

  // footer.pptx カード
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 3.4, w: 5.8, h: 1.6,
    fill: { color: COLOR_WHITE }, rectRadius: 0.08,
    line: { color: COLOR_AZURE_DARK, width: 1.5 },
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8, y: 3.4, w: 5.8, h: 0.4,
    fill: { color: COLOR_AZURE_DARK },
  });
  slide.addText("📑  templates/footer.pptx", {
    x: 7.0, y: 3.42, w: 5.4, h: 0.35,
    fontSize: 10, fontFace: FONT_FACE, color: COLOR_WHITE, bold: true,
  });
  slide.addText(bulletList([
    { text: "最終ページ用テンプレートです。統一されたデザインで資料を締めくくります", fontSize: 9 },
  ]), {
    x: 7.0, y: 3.9, w: 5.4, h: 1.0,
    valign: "top",
  });

  // タスク順序ステップカード
  const steps = [
    { num: "1", label: "makemd.md", desc: "MD 作成", color: COLOR_AZURE_BLUE },
    { num: "2", label: "checkmd.md", desc: "レビュー", color: COLOR_ACCENT_GREEN },
    { num: "3", label: "createpptx.md", desc: "PPTX 生成", color: COLOR_ACCENT_ORANGE },
    { num: "4", label: "finalize.md", desc: "最終調整", color: COLOR_AZURE_DARK },
  ];
  steps.forEach((s, i) => {
    const x = 0.5 + i * 3.15;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 5.5, w: 2.9, h: 1.0,
      fill: { color: s.color }, rectRadius: 0.1,
    });
    slide.addText(`${s.num}. ${s.label}`, {
      x, y: 5.55, w: 2.9, h: 0.45,
      fontSize: 10, fontFace: FONT_FACE, color: COLOR_WHITE, bold: true, align: "center", valign: "middle",
    });
    slide.addText(s.desc, {
      x, y: 6.0, w: 2.9, h: 0.35,
      fontSize: 9, fontFace: FONT_FACE, color: COLOR_AZURE_LIGHT, align: "center",
    });
    if (i < 3) {
      addArrow(slide, x + 2.95, 5.85, 0.15);
    }
  });
})();

// ============================================================
// スライド 19: 環境構築後の動作確認方法 + 参考リンク
// ============================================================
(() => {
  const slide = pptx.addSlide();
  slide.background = { fill: COLOR_WHITE };
  addTitleBar(slide, "環境構築後の動作確認方法");
  addPageNumber(slide, 19, TOTAL_SLIDES);

  // ステップカード
  const steps = [
    { num: "1", title: "前提条件の確認", desc: "node -v / npm -v でバージョンを確認します" },
    { num: "2", title: "VS Code の設定確認", desc: "Copilot Chat で Agent モードが利用可能か確認します" },
    { num: "3", title: "プロンプト実行", desc: "pptx-create-env.md を開き Run ボタンを実行します" },
    { num: "4", title: "出力の確認", desc: "<テーマ名>/docs/ に .pptx が生成されたか確認します" },
  ];

  steps.forEach((s, i) => {
    const y = 1.2 + i * 0.95;
    // 番号円
    slide.addShape(pptx.shapes.OVAL, {
      x: 0.6, y: y + 0.05, w: 0.55, h: 0.55,
      fill: { color: COLOR_AZURE_BLUE },
    });
    slide.addText(s.num, {
      x: 0.6, y: y + 0.05, w: 0.55, h: 0.55,
      fontSize: 16, fontFace: FONT_FACE, color: COLOR_WHITE, bold: true, align: "center", valign: "middle",
    });
    slide.addText(s.title, {
      x: 1.3, y, w: 3.5, h: 0.35,
      fontSize: 13, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
    });
    slide.addText(s.desc, {
      x: 1.3, y: y + 0.35, w: 6, h: 0.35,
      fontSize: 10, fontFace: FONT_FACE, color: COLOR_GRAY,
    });
  });

  // 参考リンクセクション
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: "100%", h: 0.06,
    fill: { color: COLOR_AZURE_BLUE },
  });
  slide.addText("📚  参考リンク一覧", {
    x: 0.5, y: 5.5, w: 5, h: 0.4,
    fontSize: 13, fontFace: FONT_FACE, color: COLOR_AZURE_DARK, bold: true,
  });

  const links = [
    ["VS Code 公式サイト", "https://code.visualstudio.com/"],
    ["GitHub Copilot ドキュメント", "https://docs.github.com/ja/copilot"],
    ["Node.js 公式サイト", "https://nodejs.org/ja"],
    ["pptxgenjs GitHub", "https://github.com/gitbrent/PptxGenJS"],
    ["VS Code MCP サーバー設定", "https://code.visualstudio.com/docs/copilot/chat/mcp-servers"],
  ];

  const linkTable = [
    [
      { text: "リソース", options: { fontSize: 9, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_AZURE_BLUE }, valign: "middle" } },
      { text: "URL", options: { fontSize: 9, fontFace: FONT_FACE, bold: true, color: COLOR_WHITE, fill: { color: COLOR_AZURE_BLUE }, valign: "middle" } },
    ],
    ...links.map(([name, url]) => [
      { text: name, options: { fontSize: 8, fontFace: FONT_FACE, valign: "middle" } },
      { text: url, options: { fontSize: 8, fontFace: FONT_FACE, color: COLOR_AZURE_BLUE, valign: "middle" } },
    ]),
  ];
  slide.addTable(linkTable, {
    x: 0.5, y: 5.95, w: 12.3,
    rowH: [0.25, 0.22, 0.22, 0.22, 0.22, 0.22],
    border: { type: "solid", pt: 0.5, color: "E0E0E0" },
    colW: [3.5, 8.8],
  });
})();

// ============================================================
// ファイル出力
// ============================================================
const outputDir = path.join(__dirname, "..", "docs");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, "GHCP-PPTX-環境構築手順書.pptx");

pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`✅ PowerPoint ファイルを生成しました: ${outputPath}`);
  })
  .catch((err) => {
    console.error("❌ エラーが発生しました:", err);
    process.exit(1);
  });
