# Automated Vercel Deployment Script
# This script sets up environment variables and deploys to Vercel

Write-Host "🚀 Starting Vercel Deployment Setup..." -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found .env file" -ForegroundColor Green

# Read environment variables from .env
$envVars = @{}
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

Write-Host "`n📝 Found $($envVars.Count) environment variables" -ForegroundColor Green

# Display variables (hide sensitive values)
Write-Host "`nEnvironment Variables:" -ForegroundColor Yellow
foreach ($key in $envVars.Keys) {
    $displayValue = if ($envVars[$key].Length -gt 20) { 
        $envVars[$key].Substring(0, 15) + "..." 
    } else { 
        $envVars[$key] 
    }
    Write-Host "  $key = $displayValue" -ForegroundColor Gray
}

Write-Host "`n⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "  1. This project uses SQLite which won't work on Vercel serverless" -ForegroundColor Yellow
Write-Host "  2. You'll need to migrate to a cloud database (Turso, Vercel Postgres, etc.)" -ForegroundColor Yellow
Write-Host "  3. Environment variables will be set during deployment" -ForegroundColor Yellow

Write-Host "`n🔧 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "Follow the prompts to configure your deployment.`n" -ForegroundColor Gray

# Deploy with Vercel CLI
# The CLI will interactively ask for environment variables if not already set
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Check deployment URL provided by Vercel" -ForegroundColor Gray
    Write-Host "  2. Verify environment variables in Vercel Dashboard" -ForegroundColor Gray
    Write-Host "  3. Consider migrating from SQLite to a cloud database" -ForegroundColor Gray
    Write-Host "  4. Test your application thoroughly" -ForegroundColor Gray
} else {
    Write-Host "`n❌ Deployment failed. Check the errors above." -ForegroundColor Red
}
