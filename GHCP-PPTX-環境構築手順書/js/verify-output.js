const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

async function verify() {
  const pptxPath = path.join(__dirname, "..", "docs", "GHCP-PPTX-環境構築手順書.pptx");
  const data = fs.readFileSync(pptxPath);
  const zip = await JSZip.loadAsync(data);

  // presentation.xml からスライド数を確認
  const presXml = await zip.file("ppt/presentation.xml").async("string");
  const sldIdMatches = presXml.match(/<p:sldId[^/]*\/>/g) || [];
  console.log(`📊 スライド数: ${sldIdMatches.length}`);

  // スライドサイズ確認
  const sldSzMatch = presXml.match(/<p:sldSz[^>]*\/>/);
  if (sldSzMatch) {
    const cx = sldSzMatch[0].match(/cx="(\d+)"/);
    const cy = sldSzMatch[0].match(/cy="(\d+)"/);
    if (cx && cy) {
      const widthInch = parseInt(cx[1]) / 914400;
      const heightInch = parseInt(cy[1]) / 914400;
      const ratio = (widthInch / heightInch).toFixed(2);
      console.log(`📐 スライドサイズ: ${widthInch.toFixed(1)}" x ${heightInch.toFixed(1)}" (${ratio} ≈ ${ratio > 1.7 ? '16:9 ✓' : '4:3'})`);
    }
  }

  // 各スライドの存在確認
  let slideNum = 1;
  while (zip.file(`ppt/slides/slide${slideNum}.xml`)) {
    slideNum++;
  }
  console.log(`📄 実際のスライドファイル数: ${slideNum - 1}`);

  // スライド 1 (header) のタイトルを確認
  const slide1 = await zip.file("ppt/slides/slide1.xml").async("string");
  const titleMatch = slide1.match(/<a:t>([^<]*環境構築手順書[^<]*)<\/a:t>/);
  if (titleMatch) {
    console.log(`📝 表紙タイトル: "${titleMatch[1]}" ✓`);
  } else {
    console.log(`⚠ 表紙タイトルが見つかりません`);
    // "Title" がまだ残っていないか確認
    if (slide1.includes("<a:t>Title</a:t>")) {
      console.log(`  ❌ "Title" テキストが残っています`);
    }
  }

  // スライド 2 のタイトルバー確認 (目次であること)
  const slide2 = await zip.file("ppt/slides/slide2.xml")?.async("string");
  if (slide2 && slide2.includes("目次")) {
    console.log(`📝 スライド 2: 目次 ✓`);
  }

  // 最終スライド (footer) の確認
  const lastSlideNum = slideNum - 1;
  const lastSlide = await zip.file(`ppt/slides/slide${lastSlideNum}.xml`)?.async("string");
  if (lastSlide) {
    // footer.pptx の特徴: 背景色や免責テキスト
    if (lastSlide.includes("bgPr") || lastSlide.includes("microsoft.com")) {
      console.log(`📝 最終スライド (${lastSlideNum}): footer テンプレート ✓`);
    } else {
      console.log(`⚠ 最終スライド (${lastSlideNum}): footer テンプレートの特徴が見つかりません`);
    }
  }

  // 背景色チェック (コンテンツスライドで白背景)
  let whiteCount = 0;
  for (let i = 2; i < lastSlideNum; i++) {
    const slideXml = await zip.file(`ppt/slides/slide${i}.xml`)?.async("string");
    if (slideXml && slideXml.includes("FFFFFF")) {
      whiteCount++;
    }
  }
  console.log(`🎨 白背景のコンテンツスライド: ${whiteCount} / ${lastSlideNum - 2}`);

  // フォント確認
  const slide3 = await zip.file("ppt/slides/slide3.xml")?.async("string");
  if (slide3 && slide3.includes("Meiryo UI")) {
    console.log(`🔤 フォント: Meiryo UI ✓`);
  }

  console.log("\n✅ 検証完了");
}

verify().catch(console.error);
