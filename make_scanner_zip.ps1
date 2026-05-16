$src = 'C:\Users\roman\code claude'
$zipPath = $src + '\scanner_deploy.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, ($src + '\scanner.html'), 'index.html')
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, ($src + '\_headers'), '_headers')
$zip.Dispose()
Write-Host 'ZIP criado'
