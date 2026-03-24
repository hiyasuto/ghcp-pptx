/**
 * merge-slides.js
 * header.pptx (タイトル変更済み) + 生成コンテンツスライド + footer.pptx を
 * 1 つの PPTX ファイルにマージするスクリプト。
 *
 * PPTX は ZIP 形式のため、JSZip で内部 XML を操作して結合します。
 */

const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

// --- パス設定 ---
const TEMPLATES_DIR = path.join(__dirname, "..", "..", "templates");
const HEADER_PATH = path.join(TEMPLATES_DIR, "header.pptx");
const FOOTER_PATH = path.join(TEMPLATES_DIR, "footer.pptx");
const CONTENT_PATH = path.join(__dirname, "..", "docs", "GHCP-PPTX-環境構築手順書.pptx");
const OUTPUT_PATH = path.join(__dirname, "..", "docs", "GHCP-PPTX-環境構築手順書.pptx");

const TITLE_TEXT = "GHCP-PPTX 環境構築手順書";

// --- XML ヘルパー ---

/** presentation.xml.rels から最大 rId 番号を取得 */
function getMaxRId(relsXml) {
  const matches = relsXml.match(/rId(\d+)/g) || [];
  let max = 0;
  for (const m of matches) {
    const num = parseInt(m.replace("rId", ""), 10);
    if (num > max) max = num;
  }
  return max;
}

/** [Content_Types].xml にスライドの Override を追加 */
function addSlideContentType(ctXml, slideNum) {
  const override = `<Override PartName="/ppt/slides/slide${slideNum}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
  if (ctXml.includes(`/ppt/slides/slide${slideNum}.xml"`)) return ctXml;
  return ctXml.replace("</Types>", `${override}\n</Types>`);
}

/** presentation.xml に sldId を追加 */
function addSldId(presXml, slideId, rId) {
  const entry = `<p:sldId id="${slideId}" r:id="${rId}"/>`;
  return presXml.replace("</p:sldIdLst>", `${entry}</p:sldIdLst>`);
}

/** presentation.xml.rels にスライド Relationship を追加 */
function addSlideRel(relsXml, rId, slideNum) {
  const rel = `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${slideNum}.xml"/>`;
  return relsXml.replace("</Relationships>", `${rel}\n</Relationships>`);
}

/**
 * スライドの .rels からレイアウト参照先を取得
 */
function getLayoutTarget(relsXml) {
  const match = relsXml.match(/Target="([^"]*slideLayout[^"]*)"/);
  return match ? match[1] : null;
}

// --- メイン処理 ---
async function merge() {
  console.log("📦 PPTX マージを開始します…");

  // 1. ファイル読み込み
  const headerBuf = fs.readFileSync(HEADER_PATH);
  const contentBuf = fs.readFileSync(CONTENT_PATH);
  const footerBuf = fs.readFileSync(FOOTER_PATH);

  const headerZip = await JSZip.loadAsync(headerBuf);
  const contentZip = await JSZip.loadAsync(contentBuf);
  const footerZip = await JSZip.loadAsync(footerBuf);

  // ベースは header.pptx (Azure Brand Template の全リソースを含む)
  const outputZip = await JSZip.loadAsync(headerBuf);

  // 2. header.pptx のスライド 1 のタイトルを変更
  let slide1Xml = await outputZip.file("ppt/slides/slide1.xml").async("string");
  slide1Xml = slide1Xml.replace(/<a:t>Title<\/a:t>/g, `<a:t>${TITLE_TEXT}</a:t>`);
  outputZip.file("ppt/slides/slide1.xml", slide1Xml);
  console.log("✅ header.pptx のタイトルを変更しました");

  // 3. presentation.xml と rels を取得
  let presXml = await outputZip.file("ppt/presentation.xml").async("string");
  let presRels = await outputZip.file("ppt/_rels/presentation.xml.rels").async("string");
  let contentTypes = await outputZip.file("[Content_Types].xml").async("string");

  // 現在の最大 rId と sldId を取得
  let maxRId = getMaxRId(presRels);
  // sldId は大きい値を使用 (衝突防止)
  let nextSldId = 3000;

  // コンテンツ PPTX のスライド数を確認
  let contentSlideCount = 0;
  while (contentZip.file(`ppt/slides/slide${contentSlideCount + 1}.xml`)) {
    contentSlideCount++;
  }
  console.log(`📄 コンテンツスライド数: ${contentSlideCount}`);

  // 4. コンテンツスライドを追加 (全スライド)
  // header のレイアウトの 1 つを参照先として使用
  // slideLayout1.xml を使用 (Azure Brand Template の基本レイアウト)
  const contentLayoutTarget = "../slideLayouts/slideLayout1.xml";

  for (let i = 1; i <= contentSlideCount; i++) {
    const dstSlideNum = i + 1; // header が slide1 なのでコンテンツは slide2 から
    const rId = `rId${++maxRId}`;

    // スライド XML をコピー
    const slideXml = await contentZip.file(`ppt/slides/slide${i}.xml`).async("string");
    outputZip.file(`ppt/slides/slide${dstSlideNum}.xml`, slideXml);

    // スライドの rels を作成 (レイアウト参照のみ)
    const slideRels =
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
      `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="${contentLayoutTarget}"/>` +
      `</Relationships>`;
    outputZip.file(`ppt/slides/_rels/slide${dstSlideNum}.xml.rels`, slideRels);

    // presentation.xml に sldId を追加
    presXml = addSldId(presXml, nextSldId++, rId);

    // presentation.xml.rels に Relationship を追加
    presRels = addSlideRel(presRels, rId, dstSlideNum);

    // [Content_Types].xml に Override を追加
    contentTypes = addSlideContentType(contentTypes, dstSlideNum);
  }
  console.log(`✅ コンテンツスライド ${contentSlideCount} 枚を追加しました`);

  // 5. footer スライドを追加
  const footerDstNum = contentSlideCount + 2; // header(1) + content(N) + 1
  const footerRId = `rId${++maxRId}`;

  // footer のスライド XML をコピー
  const footerSlideXml = await footerZip.file("ppt/slides/slide1.xml").async("string");
  outputZip.file(`ppt/slides/slide${footerDstNum}.xml`, footerSlideXml);

  // footer のスライド rels を読み込んでコピー
  const footerSlideRelsFile = footerZip.file("ppt/slides/_rels/slide1.xml.rels");
  if (footerSlideRelsFile) {
    let footerRelsXml = await footerSlideRelsFile.async("string");
    // レイアウト参照先を調整 (footer のレイアウトは header と同じテンプレートなので対応するものを使用)
    // footer は slideLayout145 を使用 — header にも slideLayout145 が存在するかチェック
    const footerLayoutTarget = getLayoutTarget(footerRelsXml);
    if (footerLayoutTarget) {
      const layoutFileName = footerLayoutTarget.split("/").pop();
      const layoutExists = outputZip.file(`ppt/slideLayouts/${layoutFileName}`);
      if (!layoutExists) {
        // レイアウトが存在しない場合は slideLayout1 にフォールバック
        footerRelsXml = footerRelsXml.replace(footerLayoutTarget, contentLayoutTarget);
      }
    }
    outputZip.file(`ppt/slides/_rels/slide${footerDstNum}.xml.rels`, footerRelsXml);
  }

  // footer のメディアファイルをコピー (image39.png など header にないもの)
  const footerRelsXml = footerSlideRelsFile
    ? await footerSlideRelsFile.async("string")
    : "";
  const imageMatches = footerRelsXml.match(/Target="\.\.\/media\/([^"]+)"/g) || [];
  for (const match of imageMatches) {
    const fileName = match.match(/media\/([^"]+)/)[1];
    const mediaPath = `ppt/media/${fileName}`;
    if (!outputZip.file(mediaPath)) {
      const footerMedia = footerZip.file(mediaPath);
      if (footerMedia) {
        const mediaData = await footerMedia.async("nodebuffer");
        outputZip.file(mediaPath, mediaData);
        console.log(`  📎 メディアファイルをコピー: ${fileName}`);
      }
    }
  }

  // presentation.xml に footer の sldId を追加
  presXml = addSldId(presXml, nextSldId++, footerRId);
  presRels = addSlideRel(presRels, footerRId, footerDstNum);
  contentTypes = addSlideContentType(contentTypes, footerDstNum);
  console.log(`✅ footer スライドを追加しました (スライド ${footerDstNum})`);

  // 6. 更新した XML をZIPに書き戻す
  outputZip.file("ppt/presentation.xml", presXml);
  outputZip.file("ppt/_rels/presentation.xml.rels", presRels);
  outputZip.file("[Content_Types].xml", contentTypes);

  // 7. 出力
  const outputBuf = await outputZip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, outputBuf);

  const totalSlides = footerDstNum;
  console.log(`\n🎉 マージ完了! 合計 ${totalSlides} 枚のスライド`);
  console.log(`📁 出力先: ${OUTPUT_PATH}`);
}

merge().catch((err) => {
  console.error("❌ マージエラー:", err);
  process.exit(1);
});
