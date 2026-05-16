"""
Gerador de cards Instagram 1080x1080px.
Design: editorial tipográfico — usa foto de produto se disponível em
imagens_produto/{marca}.png, senão usa layout geométrico puro.
"""

import os, io, requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from datetime import datetime

SIZE   = (1080, 1080)
M      = 72   # margem
OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cards_output")
IMGS   = os.path.join(os.path.dirname(os.path.abspath(__file__)), "imagens_produto")
os.makedirs(OUTPUT, exist_ok=True)
os.makedirs(IMGS, exist_ok=True)

PRODUTOS = {
    "hoka": {
        "nome":   ["HOKA", "SPEEDGOAT 7"],
        "tag":    "TRILHA / MAXIMALISMO",
        "quote":  "Mais stack, mais grip,\nmesma leveza lendária.",
        "debate": "Quem usou o 6 — valeu trocar?",
        "accent": (0, 200, 255),
        "bg":     (4, 10, 22),
        "mid":    (8, 20, 40),
    },
    "brooks": {
        "nome":   ["BROOKS", "GHOST 18"],
        "tag":    "NEUTRO / URBANO",
        "quote":  "O tênis que não decepciona\nnunca. A comunidade aprova.",
        "debate": "Confiável é elogio ou é chato demais?",
        "accent": (50, 220, 90),
        "bg":     (4, 14, 6),
        "mid":    (8, 26, 12),
    },
    "reebok": {
        "nome":   ["REEBOK", "FLOATRIDE 5"],
        "tag":    "PERFORMANCE / CUSTO-BENEFÍCIO",
        "quote":  "Voltou querendo brigar\ncom os grandes. De verdade.",
        "debate": "Você daria uma chance à Reebok?",
        "accent": (240, 40, 50),
        "bg":     (18, 4, 4),
        "mid":    (32, 8, 8),
    },
}

# ── Fontes ──────────────────────────────────────────────────────────────────
def F(size, bold=False):
    for p in (
        ["C:/Windows/Fonts/arialbd.ttf",  "C:/Windows/Fonts/bahnschrift.ttf"]  if bold else
        ["C:/Windows/Fonts/arial.ttf",    "C:/Windows/Fonts/segoeui.ttf"]
    ):
        if os.path.exists(p):
            try: return ImageFont.truetype(p, size)
            except: pass
    return ImageFont.load_default()

# ── Primitivas ───────────────────────────────────────────────────────────────
def grad(img, c1, c2, vertical=True):
    d = ImageDraw.Draw(img)
    n = SIZE[1] if vertical else SIZE[0]
    for i in range(n):
        t = i / n
        col = tuple(int(c1[j]*(1-t) + c2[j]*t) for j in range(3))
        if vertical: d.line([(0,i),(SIZE[0],i)], fill=col)
        else:        d.line([(i,0),(i,SIZE[1])], fill=col)

def diag_lines(draw, accent, n=10, alpha=16):
    ar, ag, ab = accent
    for i in range(n):
        off = 50 + i*90
        draw.line([(SIZE[0]-off, SIZE[1]),(SIZE[0], SIZE[1]-off)],
                  fill=(ar,ag,ab,alpha), width=1)

def texto_h(d, t, f):
    return d.textbbox((0,0), t, font=f)[3]

def ml(d, text, x, y, font, fill, gap=12, maxw=None):
    for ln in text.split("\n"):
        if maxw:
            words, cur = ln.split(), ""
            for w in words:
                t = (cur+" "+w).strip()
                if d.textbbox((0,0),t,font=font)[2] > maxw and cur:
                    d.text((x,y), cur, font=font, fill=fill); y += texto_h(d,cur,font)+gap; cur=w
                else: cur=t
            if cur: d.text((x,y),cur,font=font,fill=fill); y+=texto_h(d,cur,font)+gap
        else:
            d.text((x,y),ln,font=font,fill=fill); y+=texto_h(d,ln,font)+gap
    return y

def dots(d, total, active):
    r,gap,aw = 5,18,22
    tw = (total-1)*gap+r*2+aw
    x,y = (SIZE[0]-tw)//2, SIZE[1]-46
    for i in range(total):
        if i==active:
            d.rounded_rectangle([x,y,x+aw,y+r*2], radius=r, fill=(255,255,255,200)); x+=aw+gap
        else:
            d.ellipse([x,y,x+r*2,y+r*2], fill=(70,70,70,160)); x+=r*2+gap

# ── Carrega foto de produto ──────────────────────────────────────────────────
def load_foto(key):
    for ext in [".png",".jpg",".jpeg",".webp"]:
        p = os.path.join(IMGS, key+ext)
        if os.path.exists(p) and os.path.getsize(p) > 50_000:
            try:
                img = Image.open(p).convert("RGBA")
                w,h = img.size
                # Descarta imagens claramente erradas (pessoas nuas, sem produto)
                # Aceita apenas se parecer produto de calçado (formato quadrado ou vertical)
                ratio = min(w,h)/max(w,h)
                if ratio > 0.45 and w >= 400:
                    return img
            except: pass
    return None

def compor_foto(base_img, foto, bg_color):
    """
    Redimensiona foto para preencher metade direita do card,
    com fade gradiente para o fundo escuro na esquerda.
    """
    fw, fh = foto.size
    # Crop quadrado centralizado
    side = min(fw, fh)
    foto_sq = foto.crop(((fw-side)//2, (fh-side)//2, (fw+side)//2, (fh+side)//2))

    target = int(SIZE[0] * 0.62)
    foto_r = foto_sq.resize((target, target), Image.LANCZOS).convert("RGBA")
    nw, nh = foto_r.size

    # Máscara: fade na esquerda
    mask = Image.new("L", (nw,nh), 255)
    md = ImageDraw.Draw(mask)
    fade = int(nw * 0.55)
    for i in range(fade):
        md.line([(i,0),(i,nh)], fill=int(255*(i/fade)**1.6))
    foto_r.putalpha(mask)

    fx = SIZE[0] - nw + 10
    fy = (SIZE[1] - nh) // 2

    # Sombra suave
    sombra = Image.new("RGBA", SIZE, (0,0,0,0))
    sombra.paste(foto_r, (fx+14, fy+14))
    sombra = sombra.filter(ImageFilter.GaussianBlur(22))
    result = Image.alpha_composite(base_img.convert("RGBA"), sombra)
    result.paste(foto_r, (fx, fy), foto_r)
    return result.convert("RGB")

# ── Slide 1: Hook ────────────────────────────────────────────────────────────
def slide_hook(idx):
    img = Image.new("RGB", SIZE, (5,5,12))
    grad(img, (5,5,12), (14,12,28))
    d = ImageDraw.Draw(img.convert("RGBA"))
    img = img.convert("RGBA")
    d = ImageDraw.Draw(img)
    diag_lines(d, (255,130,0), 12, 20)

    # Número fantasma
    fn = F(360, True)
    d.text((SIZE[0]-400, -90), "01", font=fn, fill=(255,130,0,7))

    # Barra accent
    d.rectangle([M, 180, M+88, 188], fill=(255,130,0,220))

    y = 218
    ft = F(108, True)
    for ln in ["3 marcas.", "Apostas", "diferentes.", "2026."]:
        d.text((M, y), ln, font=ft, fill=(255,255,255,245))
        y += texto_h(d, ln, ft) + 2

    d.text((M, y+30), "Uma acertou em cheio.", font=F(38), fill=(130,130,130,210))
    d.line([(M, SIZE[1]-128),(SIZE[0]-M, SIZE[1]-128)], fill=(28,28,28,180), width=1)
    d.text((M, SIZE[1]-106), "HOKA  ·  BROOKS  ·  REEBOK", font=F(22), fill=(60,60,60,220))
    dots(d, 5, idx)
    return img.convert("RGB")

# ── Slides 2-4: Produto ──────────────────────────────────────────────────────
def slide_marca(key, data, idx):
    bg, mid, accent = data["bg"], data["mid"], data["accent"]
    ar, ag, ab = accent

    img = Image.new("RGB", SIZE, bg)
    grad(img, bg, mid)

    foto = load_foto(key)
    if foto:
        img = compor_foto(img, foto, bg)

    img = img.convert("RGBA")
    d = ImageDraw.Draw(img)

    if not foto:
        # Sem foto: padrão geométrico sutil no canto direito inferior
        # Grade de pontos pequenos (discreta, não invade texto)
        grid_x0 = int(SIZE[0] * 0.72)
        grid_y0 = int(SIZE[1] * 0.38)
        cell = 42
        dot = 7
        for ix in range(9):
            for iy in range(15):
                px = grid_x0 + ix * cell
                py = grid_y0 + iy * cell
                if px < SIZE[0]-10 and py < SIZE[1]-60:
                    d.ellipse([px, py, px+dot, py+dot], fill=(ar,ag,ab,28))
        diag_lines(d, accent, 14, 20)

    # Faixa accent lateral
    d.rectangle([0, 0, 7, SIZE[1]], fill=(*accent, 255))

    # Número fantasma
    fn = F(280, True)
    num = str(idx)
    bw = d.textbbox((0,0),num,font=fn)[2]
    d.text((SIZE[0]-bw-M+20, SIZE[1]-d.textbbox((0,0),num,font=fn)[3]-55),
           num, font=fn, fill=(*accent, 15))

    # Tag
    d.text((M+16, 58), data["tag"], font=F(18), fill=(ar,ag,ab,140))

    # Nome produto — duas linhas, destaque máximo
    fn_nome = F(96, True)
    y = 98
    for ln in data["nome"]:
        for ox,oy in [(-2,-2),(2,2)]:  # mini sombra
            d.text((M+16+ox, y+oy), ln, font=fn_nome, fill=(0,0,0,90))
        d.text((M+16, y), ln, font=fn_nome, fill=(*accent, 255))
        y += texto_h(d, ln, fn_nome) + 0

    d.text((M+16, y+12), "LANÇAMENTO 2026", font=F(18), fill=(55,55,55,200))
    y += 44
    d.rectangle([M+16, y, SIZE[0]//2+60, y+1], fill=(42,42,42,200))
    y += 20

    # Quote
    y = ml(d, data["quote"], M+16, y, F(37), (200,200,200,230), gap=10,
           maxw=SIZE[0]//2+50)

    # Barra debate
    y += 28
    d.rectangle([M+16, y, M+20, y+52], fill=(*accent, 190))
    ml(d, data["debate"], M+30, y+10, F(27), (105,105,105,210), gap=7,
       maxw=SIZE[0]//2+30)

    dots(d, 5, idx)
    return img.convert("RGB")

# ── Slide 5: CTA ─────────────────────────────────────────────────────────────
def slide_cta(idx):
    img = Image.new("RGB", SIZE, (5,5,5))
    grad(img, (5,5,5), (20,20,20))
    img = img.convert("RGBA")
    d = ImageDraw.Draw(img)

    d.rectangle([M, 280, M+90, 289], fill=(190,190,190,200))

    ft = F(104, True)
    y = 314
    for ln in ["Fiel à marca", "ou vai atrás", "da tecnologia?"]:
        d.text((M, y), ln, font=ft, fill=(255,255,255,245))
        y += texto_h(d, ln, ft) + 3

    d.text((M, y+30), "Me conta nos comentários  👇", font=F(36), fill=(80,80,80,210))
    y += 96
    d.polygon([(M,y),(M+50,y),(M+25,y+32)], fill=(38,38,38,210))

    dots(d, 5, idx)
    return img.convert("RGB")

# ── Main ──────────────────────────────────────────────────────────────────────
def gerar():
    ts = datetime.now().strftime("%Y%m%d_%H%M")
    pasta = os.path.join(OUTPUT, f"post_{ts}")
    os.makedirs(pasta, exist_ok=True)

    jobs = [
        (0,"hook",None),(1,"marca","hoka"),(2,"marca","brooks"),
        (3,"marca","reebok"),(4,"cta",None),
    ]

    for idx, tipo, key in jobs:
        print(f"Slide {idx+1}...")
        if tipo=="hook":    img = slide_hook(idx)
        elif tipo=="marca": img = slide_marca(key, PRODUTOS[key], idx)
        else:               img = slide_cta(idx)
        nome = f"slide_{idx+1:02d}_{tipo}{('_'+key) if key else ''}.png"
        img.save(os.path.join(pasta, nome), "PNG", dpi=(300,300))
        print(f"  OK: {nome}")

    print(f"\nPronto: {pasta}")
    os.startfile(pasta)
    return pasta

if __name__ == "__main__":
    gerar()
