$url = 'https://rvehuigjfngtilhmczqs.supabase.co/rest/v1/visitors?limit=1'
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZWh1aWdqZm5ndGlsaG1jenFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjgxNDMsImV4cCI6MjA5MDU0NDE0M30.Q-Ujwh-z3vJnmlOcMIp_mmskk9LwSs9vtd8_Q4hTw8A'
try {
    $r = Invoke-RestMethod -Uri $url -Headers @{apikey=$key; Authorization="Bearer $key"}
    Write-Host "OK - colunas encontradas:"
    if ($r.Count -gt 0) { $r[0].PSObject.Properties.Name }
    else { Write-Host "Tabela vazia" }
} catch {
    Write-Host "ERRO: $($_.Exception.Message)"
    $_.Exception.Response.GetResponseStream() | ForEach-Object {
        $reader = New-Object System.IO.StreamReader($_)
        Write-Host $reader.ReadToEnd()
    }
}
