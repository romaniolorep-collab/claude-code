$b64 = Get-Content "C:\Users\roman\code claude\full_b64.txt" -Raw
$b64 = $b64.Trim()
$len = $b64.Length
Write-Host "Total length: $len"
$chunkSize = 2762
for ($i = 0; $i -lt 10; $i++) {
    $start = $i * $chunkSize
    $end = [Math]::Min($start + $chunkSize, $len)
    $chunk = $b64.Substring($start, $end - $start)
    [System.IO.File]::WriteAllText("C:\Users\roman\code claude\chunk_$i.txt", $chunk)
    Write-Host "chunk_$i`: $($chunk.Length) chars, starts: $($chunk.Substring(0,[Math]::Min(30,$chunk.Length)))"
}
