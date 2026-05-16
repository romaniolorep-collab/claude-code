"""
Script principal — executa tudo automaticamente:
1. Busca fotos dos produtos (se nao houver localmente)
2. Gera os 5 cards PNG 1080x1080
3. Posta no Instagram como carrossel

Uso:
  python rodar_tudo.py           # gera e posta
  python rodar_tudo.py --so-cards  # so gera os cards, nao posta
  python rodar_tudo.py --login     # faz novo login no Instagram antes de postar
"""

import subprocess, sys, os

BASE = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[1:]
so_cards   = "--so-cards" in args
forcar_login = "--login" in args

def run(script, extra_args=[]):
    resultado = subprocess.run(
        [sys.executable, os.path.join(BASE, script)] + extra_args,
        check=False
    )
    return resultado.returncode == 0

print("=" * 52)
print("  POST INSTAGRAM — MARCAS RUNNING 2026")
print("=" * 52)

print("\n[1/3] Buscando fotos dos produtos...")
run("buscar_fotos.py")

print("\n[2/3] Gerando cards...")
ok = run("gerar_cards.py")
if not ok:
    print("Erro ao gerar cards. Verifique gerar_cards.py.")
    sys.exit(1)

if so_cards:
    print("\nCards gerados. Postagem ignorada (--so-cards).")
    sys.exit(0)

print("\n[3/3] Postando no Instagram...")
extra = ["--login"] if forcar_login else []
ok = run("postar_instagram.py", extra)
if ok:
    print("\nPronto! Post publicado no Instagram.")
else:
    print("\nCards gerados mas postagem falhou. Rode:")
    print("  python postar_instagram.py --login")
