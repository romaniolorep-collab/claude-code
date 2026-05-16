import requests, re, json

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"

# Passo 1: busca VQD
r = requests.get("https://duckduckgo.com/", params={"q": "hoka speedgoat 7 shoe", "iax": "images", "ia": "images"},
                 headers={"User-Agent": UA}, timeout=10)
print("Status:", r.status_code, "| Tamanho:", len(r.text))

m = re.search(r"vqd=([\d-]+)", r.text)
if m:
    vqd = m.group(1)
    print("VQD:", vqd)
    # Passo 2: busca imagens
    r2 = requests.get("https://duckduckgo.com/i.js", params={
        "q": "hoka speedgoat 7 shoe product", "vqd": vqd, "o": "json", "f": ",,,,,",
    }, headers={"User-Agent": UA, "Referer": "https://duckduckgo.com/"}, timeout=10)
    print("Status imagens:", r2.status_code)
    print("Resposta (primeiros 300):", r2.text[:300])
else:
    print("VQD nao encontrado. Trecho do HTML:")
    print(r.text[:500])
