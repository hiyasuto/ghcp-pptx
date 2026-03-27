$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$instructionDir = Join-Path $repoRoot ".github\instructions"
$manualStageDir = Join-Path $repoRoot ".github\agents"
$manualPromptDir = Join-Path $repoRoot ".github\prompts"

Write-Host "== ghcp-pptx CLI-only verification ==" -ForegroundColor Cyan

$copilotCommand = Get-Command copilot -ErrorAction SilentlyContinue
if (-not $copilotCommand) {
    throw "GitHub Copilot CLI (copilot) が見つかりません。先にインストールしてください。"
}

Write-Host "Copilot CLI:" (copilot --version)
Write-Host "Copilot path:" $copilotCommand.Source

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
    Write-Host "Node.js:" (node --version)
} else {
    Write-Warning "Node.js が見つかりません。PptxGenJS での deck 生成時に必要です。"
}

Write-Host ""
Write-Host "Auto-loaded custom instructions:" -ForegroundColor Green
$autoLoaded = @(
    Join-Path $repoRoot "AGENTS.md"
    Join-Path $repoRoot ".github\copilot-instructions.md"
)
$autoLoaded += Get-ChildItem -Path $instructionDir -Filter "*.instructions.md" -Recurse | Select-Object -ExpandProperty FullName
$autoLoaded | ForEach-Object {
    if (Test-Path $_) {
        Write-Host " -" $_
    }
}

Write-Host ""
Write-Host "Manual @ reference files:" -ForegroundColor Yellow
foreach ($dir in @($manualStageDir, $manualPromptDir)) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -File -Recurse | ForEach-Object {
            Write-Host " -" $_.FullName
        }
    }
}

Write-Host ""
Write-Host "Notes:" -ForegroundColor Cyan
Write-Host " - .github/agents は Copilot CLI の /agent 機能ではありません。"
Write-Host " - .github/agents と .github/prompts は、使うときに @path で明示してください。"
Write-Host " - この repo の必須ルールは .github/instructions 配下に集約しています。"
