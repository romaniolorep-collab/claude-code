import requests

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"

urls_teste = [
    ("hoka CDN", "https://www.hoka.com/on/demandware.static/-/Sites-hoka-master-catalog/default/dw8e9d8bcc/images/large/1141100-BVBL_1.png", "https://www.hoka.com/"),
    ("brooks CDN", "https://www.brooksrunning.com/on/demandware.static/-/Sites-brooks-master-catalog/default/images/large/120381_462_lf.png", "https://www.brooksrunning.com/"),
    ("reebok CDN", "https://assets.reebok.com/images/h_840,f_auto,q_auto/floatride-energy-5-shoes.jpg", "https://www.reebok.com/"),
]

for nome, url, referer in urls_teste:
    try:
        r = requests.get(url, headers={
            "User-Agent": UA,
            "Referer": referer,
            "Accept": "image/avif,image/webp,image/apng,image/*",
            "Accept-Language": "en-US,en;q=0.9",
        }, timeout=10)
        print(f"{nome}: status={r.status_code} size={len(r.content)//1024}kb content-type={r.headers.get('content-type','?')[:30]}")
    except Exception as e:
        print(f"{nome}: ERRO {e}")
