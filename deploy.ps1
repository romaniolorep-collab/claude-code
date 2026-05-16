$token = 'nfp_4CwZ9dMhugVBqP364z2Z1SvTGuiJD6Ez126a'
$siteId = '504b74bf-d2fa-4893-afc8-20a62c0b052c'
$src = 'C:\Users\roman\code claude'
Compress-Archive -Path "$src\index.html","$src\scanner.html","$src\_headers","$src\_redirects" -DestinationPath "$src\deploy.zip" -Force
$bytes = [System.IO.File]::ReadAllBytes("$src\deploy.zip")
$resp = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$siteId/deploys" -Method Post -Headers @{Authorization="Bearer $token";'Content-Type'='application/zip'} -Body $bytes
Write-Host "Deploy URL: $($resp.deploy_url)"
Write-Host "Site URL: $($resp.url)"
