@echo off
cd /d "%~dp0"

start "Magic MCP" cmd /c npx -y @smithery/cli@latest run @21st-dev/magic-mcp --key 663ec88a-3b50-43c1-a6e3-4686291def5e
start "Brave Search" cmd /c npx -y @smithery/cli@latest run @smithery-ai/brave-search --key 663ec88a-3b50-43c1-a6e3-4686291def5e
start "Game Engine" cmd /c npx -y @smithery/cli@latest run @mahecode/game-engine-mcp --key 663ec88a-3b50-43c1-a6e3-4686291def5e
start "FS" cmd /c npx -y @smithery/cli@latest run @bunasQ/fs --key 663ec88a-3b50-43c1-a6e3-4686291def5e
start "Puppeteer" cmd /c npx -y @smithery/cli@latest run @smithery-ai/puppeteer --key 663ec88a-3b50-43c1-a6e3-4686291def5e
start "Sequential Thinking" cmd /c npx -y @smithery/cli@latest run @smithery-ai/server-sequential-thinking