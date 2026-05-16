$token = 'nfp_BypBZiLNaDKxHA422pYx6oasKV71PSzwb7bd'
$src = 'C:\Users\roman\code claude'
$siteId = 'a53e6980-0a76-48c0-87ca-1aa34cc8e22f'

# Deploy do ZIP
$bytes = [System.IO.File]::ReadAllBytes("$src\scanner_deploy.zip")
$resp = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$siteId/deploys" `
  -Method Post -Headers @{Authorization="Bearer $token"; 'Content-Type'='application/zip'} `
  -Body $bytes
Write-Host "Deploy URL: $($resp.deploy_url)"
Write-Host "Site URL: https://ibrand-scanner.netlify.app"
