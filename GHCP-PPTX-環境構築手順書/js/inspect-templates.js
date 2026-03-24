const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

async function inspectPptx(filePath) {
  const data = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(data);

  console.log(`\n=== ${path.basename(filePath)} ===`);

  // List all files
  console.log("\n--- Files in archive ---");
  zip.forEach((relativePath) => {
    console.log(`  ${relativePath}`);
  });

  // Read presentation.xml
  const presXml = await zip.file("ppt/presentation.xml")?.async("string");
  if (presXml) {
    console.log("\n--- presentation.xml (slide refs) ---");
    const slideRefs = presXml.match(/<p:sldIdLst>[\s\S]*?<\/p:sldIdLst>/);
    if (slideRefs) console.log(slideRefs[0]);
  }

  // Read each slide
  let slideNum = 1;
  while (true) {
    const slideFile = zip.file(`ppt/slides/slide${slideNum}.xml`);
    if (!slideFile) break;
    const slideXml = await slideFile.async("string");
    console.log(`\n--- slide${slideNum}.xml ---`);
    console.log(slideXml.substring(0, 3000));
    if (slideXml.length > 3000) console.log("... (truncated)");

    // Check rels
    const relsFile = zip.file(`ppt/slides/_rels/slide${slideNum}.xml.rels`);
    if (relsFile) {
      const relsXml = await relsFile.async("string");
      console.log(`\n--- slide${slideNum}.xml.rels ---`);
      console.log(relsXml);
    }
    slideNum++;
  }

  // Check media files
  const mediaFiles = [];
  zip.forEach((relativePath) => {
    if (relativePath.startsWith("ppt/media/")) {
      mediaFiles.push(relativePath);
    }
  });
  if (mediaFiles.length > 0) {
    console.log("\n--- Media files ---");
    mediaFiles.forEach((f) => console.log(`  ${f}`));
  }

  // Check slide size
  if (presXml) {
    const sldSz = presXml.match(/<p:sldSz[^>]*\/>/);
    if (sldSz) {
      console.log("\n--- Slide size ---");
      console.log(sldSz[0]);
    }
  }
}

async function main() {
  const templatesDir = path.join(__dirname, "..", "..", "templates");
  await inspectPptx(path.join(templatesDir, "header.pptx"));
  await inspectPptx(path.join(templatesDir, "footer.pptx"));
}

main().catch(console.error);
