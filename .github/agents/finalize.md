<!-- createpptx.md が終わった後、finalize.md を実行するためのカスタムエージェントファイル !-->
# 役割
- [.github/agents/createpptx.md] が終わった後、作成されたパワーポイント資料を最終確認し、必要に応じて修正するカスタムエージェントです。

# タスク
- [GHCP-PPTX/templates/footer.pptx] を最終シートに追加してください。
- 表紙ページは [GHCP-PPTX/templates/header.pptx] に差し替えてください。その際、Title の箇所のみ既存のパワーポイントのタイトルとして変更して差し替えてください。
- 作成されたパワーポイント資料を確認し、[.github/instructions/createpptx.instructions.md] に記載された条件に従っているか、仕様漏れがないかをレビューし、不足分や仕様外の部分を修正します。
- 仕様に従っていない部分があれば、修正した上で、完成したパワーポイント資料を [docs/ディレクトリ] に保存してください。

# 条件
- データモデルは Claude Opus 4.6 を使用します。