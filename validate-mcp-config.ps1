#!/usr/bin/env pwsh

# MCP Server Configuration Validator
# This script validates your MCP server configuration

Write-Host "🔍 MCP Server Configuration Validator" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if VS Code settings file exists
$settingsPath = "$env:APPDATA\Code - Insiders\User\settings.json"
if (-not (Test-Path $settingsPath)) {
    Write-Host "❌ VS Code settings file not found at: $settingsPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found VS Code settings file" -ForegroundColor Green

# Read and parse JSON
try {
    $settings = Get-Content $settingsPath | ConvertFrom-Json
    Write-Host "✅ Successfully parsed settings.json" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to parse settings.json: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check for MCP configuration
if (-not $settings.mcp) {
    Write-Host "❌ No 'mcp' configuration found in settings" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found MCP configuration section" -ForegroundColor Green

# Check for servers
if (-not $settings.mcp.servers) {
    Write-Host "❌ No 'servers' section found in MCP configuration" -ForegroundColor Red
    exit 1
}

$serverCount = ($settings.mcp.servers | Get-Member -MemberType NoteProperty).Count
Write-Host "✅ Found $serverCount MCP servers configured" -ForegroundColor Green

# Validate each server
Write-Host "`n🔧 Validating individual servers:" -ForegroundColor Yellow

$settings.mcp.servers | Get-Member -MemberType NoteProperty | ForEach-Object {
    $serverName = $_.Name
    $server = $settings.mcp.servers.$serverName
    
    Write-Host "`n  📡 $serverName" -ForegroundColor White
    
    # Check if server has command or url
    if ($server.command -or $server.url) {
        if ($server.command) {
            Write-Host "    ✅ Command: $($server.command)" -ForegroundColor Green
            
            # Check if command exists
            try {
                $null = Get-Command $server.command -ErrorAction Stop
                Write-Host "    ✅ Command executable found" -ForegroundColor Green
            } catch {
                Write-Host "    ⚠️  Command executable not found in PATH" -ForegroundColor Yellow
            }
        }
        
        if ($server.url) {
            Write-Host "    ✅ URL: $($server.url)" -ForegroundColor Green
        }
        
        if ($server.args) {
            Write-Host "    ✅ Arguments configured ($($server.args.Count) args)" -ForegroundColor Green
        }
        
        if ($server.env) {
            Write-Host "    ✅ Environment variables configured" -ForegroundColor Green
        }
    } else {
        Write-Host "    ❌ No command or URL specified" -ForegroundColor Red
    }
}

# Check for common issues
Write-Host "`n🔍 Checking for common issues:" -ForegroundColor Yellow

# Check for duplicate mcpServers section
if ($settings.mcpServers) {
    Write-Host "  ⚠️  Found deprecated 'mcpServers' section - consider removing" -ForegroundColor Yellow
}

# Check for consistent API key usage
$apiKeyPattern = "a6f8d215-b80d-4521-8d8d-bdeaa6384b02"
$serversWithKey = 0
$settings.mcp.servers | Get-Member -MemberType NoteProperty | ForEach-Object {
    $server = $settings.mcp.servers.$($_.Name)
    if ($server.args -and ($server.args -contains $apiKeyPattern)) {
        $serversWithKey++
    }
}

if ($serversWithKey -gt 0) {
    Write-Host "  ✅ Found $serversWithKey servers using consistent API key" -ForegroundColor Green
}

Write-Host "`n🎉 Validation complete!" -ForegroundColor Cyan
Write-Host "Your MCP server configuration appears to be properly formatted." -ForegroundColor Green
