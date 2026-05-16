$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:3001/')
$listener.Start()
Write-Host "CORS server started at http://localhost:3001"

$htmlPath = "C:\Users\roman\code claude\ibrand-dashboard.html"
$htmlContent = [System.IO.File]::ReadAllText($htmlPath)
$htmlBytes = [System.Text.Encoding]::UTF8.GetBytes($htmlContent)

while ($true) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    # Add CORS headers to allow any origin
    $res.Headers.Add("Access-Control-Allow-Origin", "*")
    $res.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
    $res.Headers.Add("Access-Control-Allow-Headers", "*")
    $res.Headers.Add("Cache-Control", "no-cache")

    if ($req.HttpMethod -eq "OPTIONS") {
        $res.StatusCode = 200
        $res.Close()
        continue
    }

    $res.ContentType = "text/plain; charset=utf-8"
    $res.ContentLength64 = $htmlBytes.Length
    $res.OutputStream.Write($htmlBytes, 0, $htmlBytes.Length)
    $res.Close()
    Write-Host "Served request: $($req.Url)"
}
