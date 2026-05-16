param([int]$i)
$chunk = [System.IO.File]::ReadAllText("C:\Users\roman\code claude\chunk_$i.txt")
[Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($chunk))
