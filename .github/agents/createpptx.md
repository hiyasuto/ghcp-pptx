# Copilot CLI stage: createpptx

このファイルは、チェック済み Markdown から `.pptx` を生成するときの stage 定義です。

## 役割
- `<テーマ名>/md/<テーマ名>.md` をもとに、PptxGenJS で PowerPoint 資料を作成します。

## 入力
- `<テーマ名>/md/<テーマ名>.md`
- `<テーマ名>/md/<テーマ名>-Checked.md`
- `.github/instructions/createpptx.instructions.md`

## 出力
- `<テーマ名>/js/create-slide.js`
- `<テーマ名>/docs/<テーマ名>.pptx`

## 作業内容
- PowerPoint 作成前に `node --version` で Node.js のバージョンを確認します。
- 必要なら `<テーマ名>/package.json` を作成し、`pptxgenjs` を導入します。
- `package.json` には `build:pptx` などの再実行可能な script を追加します。
- Markdown からスライドを生成する `create-slide.js` を作成します。
- スクリプトを実行し、`.pptx` が出力されることを確認します。
- 外部参照したリンク先の内容は資料後半の `参考リンク` スライドにまとめます。
- 提案書なら CTA スライドと、必要に応じて付録スライドも残します。

## 補足
- 直接 `createpptx` だけを依頼された場合でも、Markdown の内容に明らかな欠落があれば簡易レビューを行います。
- 図解が必要な箇所は、PptxGenJS の図形や表を使って表現します。
- 一度生成した deck は `npm run build:pptx` で再生成できる状態にします。
