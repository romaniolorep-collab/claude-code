// =====================================================================
// Robô de Prospecção — ARQUIVO ÚNICO (Node puro, zero dependência)
// ---------------------------------------------------------------------
// COMO RODAR:
//   1) Instale o Node.js (https://nodejs.org — versão LTS)
//   2) Salve este arquivo numa pasta, ex.: robo.mjs
//   3) No terminal, dentro da pasta, com sua chave do Google Places:
//
//        Windows (PowerShell):
//          $env:GOOGLE_PLACES_KEY="sua_chave"; node robo.mjs
//        Windows (Prompt de Comando / cmd):
//          set GOOGLE_PLACES_KEY=sua_chave && node robo.mjs
//        Mac / Linux:
//          GOOGLE_PLACES_KEY=sua_chave node robo.mjs
//
//   4) Abra no navegador:  http://localhost:4000
//
//   Sem a chave ele roda em modo DEMO (dados fictícios). A chave sai em
//   console.cloud.google.com -> ativar "Places API" -> Credenciais.
// =====================================================================
import { createServer } from 'node:http';

const KEY = process.env.GOOGLE_PLACES_KEY || '';
const PORT = process.env.PORT || 4000;
const DEMO = !KEY;

// A interface (index.html) vai embutida aqui em base64 — por isso é 1 arquivo só.
const HTML_B64 = `
PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0icHQtQlIiPjxoZWFkPjxtZXRhIGNoYXJzZXQ9IlVURi04Ij48bWV0YSBuYW1lPSJ2
aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MSI+PHRpdGxlPlJvYsO0IGRlIFByb3Nw
ZWPDp8OjbzwvdGl0bGU+CjxzdHlsZT4KICA6cm9vdHstLWdyb3VuZDojRUVGMEYzOy0tc3VyZmFjZTojZmZmOy0tc3VyZmFjZS0y
OiNGN0Y4RkE7LS1pbms6IzE3MUIyMTstLWluay1zb2Z0OiM1OTYzNkU7LS1pbmstZmFpbnQ6IzhCOTQ5RTstLWxpbmU6I0U0RTdF
QzstLW5hdjojMTIyODNBOy0tYWNjZW50OiMwRTdDODY7LS1hY2NlbnQtc29mdDojRTFGMUYyOy0tZ29vZDojMkU4QjU3Oy0tZ29v
ZC1zb2Z0OiNFNEYwRTg7LS1zdGFyOiNFMEE1MDA7LS1taW5lOiM4YTZkMGY7LS1taW5lLXNvZnQ6I0YzRUNENjstLXNhbnM6c3lz
dGVtLXVpLC1hcHBsZS1zeXN0ZW0sIlNlZ29lIFVJIixSb2JvdG8sc2Fucy1zZXJpZjstLW1vbm86dWktbW9ub3NwYWNlLE1lbmxv
LG1vbm9zcGFjZTt9CiAgQG1lZGlhIChwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXs6cm9vdHstLWdyb3VuZDojMEUxNDFBOy0t
c3VyZmFjZTojMTYxRDI1Oy0tc3VyZmFjZS0yOiMxQjI0MkQ7LS1pbms6I0U3RUNGMTstLWluay1zb2Z0OiNBNEFFQjg7LS1pbmst
ZmFpbnQ6IzZFN0E4NTstLWxpbmU6IzI2MzEzQjstLW5hdjojMEIxNzIwOy0tYWNjZW50OiMyQUE3QjA7LS1hY2NlbnQtc29mdDoj
MTIzMDMzOy0tZ29vZDojNTdCNjgyOy0tZ29vZC1zb2Z0OiMxNjI0MUM7LS1zdGFyOiNFN0I5M2E7LS1taW5lOiNkNmIzNGI7LS1t
aW5lLXNvZnQ6IzI0MWYxMjt9fQogICp7Ym94LXNpemluZzpib3JkZXItYm94O31ib2R5e21hcmdpbjowO2JhY2tncm91bmQ6dmFy
KC0tZ3JvdW5kKTtjb2xvcjp2YXIoLS1pbmspO2ZvbnQtZmFtaWx5OnZhcigtLXNhbnMpO2ZvbnQtc2l6ZToxNXB4O30KICAubmF2
e2JhY2tncm91bmQ6dmFyKC0tbmF2KTtjb2xvcjojZmZmO3BhZGRpbmc6MTNweCAyMHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVt
czpjZW50ZXI7Z2FwOjEwcHg7fQogIC5uYXYgYntiYWNrZ3JvdW5kOnZhcigtLWFjY2VudCk7d2lkdGg6MzBweDtoZWlnaHQ6MzBw
eDtib3JkZXItcmFkaXVzOjhweDtkaXNwbGF5OmdyaWQ7cGxhY2UtaXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxcmVtO30KICAubmF2
IGgxe21hcmdpbjowO2ZvbnQtc2l6ZToxLjA1cmVtO2ZvbnQtd2VpZ2h0OjgwMDt9CiAgLm5hdiAuZGVtb3ttYXJnaW4tbGVmdDph
dXRvO2ZvbnQtc2l6ZTouNjJyZW07Zm9udC1mYW1pbHk6dmFyKC0tbW9ubyk7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRl
ci1zcGFjaW5nOi4wNmVtO2JhY2tncm91bmQ6IzdhNWExMjtjb2xvcjojZmZlOWIwO3BhZGRpbmc6NHB4IDlweDtib3JkZXItcmFk
aXVzOjk5OXB4O30KICAud3JhcHttYXgtd2lkdGg6NzQwcHg7bWFyZ2luOjAgYXV0bztwYWRkaW5nOjE4cHg7fQogIC5zZWFyY2h7
YmFja2dyb3VuZDp2YXIoLS1zdXJmYWNlKTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWxpbmUpO2JvcmRlci1yYWRpdXM6MTRweDtw
YWRkaW5nOjE0cHg7ZGlzcGxheTpmbGV4O2dhcDoxMHB4O2ZsZXgtd3JhcDp3cmFwO2JveC1zaGFkb3c6MCA2cHggMjBweCByZ2Jh
KDE4LDQwLDU4LC4wOCk7fQogIC5mbGR7ZmxleDoxO21pbi13aWR0aDoxNTBweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246
Y29sdW1uO2dhcDo0cHg7fQogIC5mbGQgbGFiZWx7Zm9udC1zaXplOi42NnJlbTtmb250LWZhbWlseTp2YXIoLS1tb25vKTt0ZXh0
LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjA2ZW07Y29sb3I6dmFyKC0taW5rLWZhaW50KTt9CiAgLmZsZCBp
bnB1dCwuZmxkIHNlbGVjdHtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWxpbmUpO2JvcmRlci1yYWRpdXM6OXB4O3BhZGRpbmc6MTBw
eCAxMnB4O2ZvbnQtc2l6ZTouOTRyZW07YmFja2dyb3VuZDp2YXIoLS1zdXJmYWNlLTIpO2NvbG9yOnZhcigtLWluayk7fQogIC5m
bGQgaW5wdXQ6Zm9jdXMsLmZsZCBzZWxlY3Q6Zm9jdXN7b3V0bGluZToycHggc29saWQgdmFyKC0tYWNjZW50KTt9CiAgLmhpbnR7
Zm9udC1zaXplOi42OHJlbTtjb2xvcjp2YXIoLS1pbmstZmFpbnQpO30KICAuZ297YWxpZ24tc2VsZjpmbGV4LWVuZDtiYWNrZ3Jv
dW5kOnZhcigtLWFjY2VudCk7Y29sb3I6I2ZmZjtib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOjlweDtwYWRkaW5nOjExcHggMjBw
eDtmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOi45NXJlbTtjdXJzb3I6cG9pbnRlcjt9CiAgLmZpbHRlcnN7ZGlzcGxheTpmbGV4
O2dhcDoxNHB4O2ZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmNlbnRlcjttYXJnaW46MTRweCAycHggNHB4O2ZvbnQtc2l6ZTou
ODRyZW07Y29sb3I6dmFyKC0taW5rLXNvZnQpO30KICAuZmlsdGVycyBzZWxlY3R7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1saW5l
KTtib3JkZXItcmFkaXVzOjhweDtwYWRkaW5nOjVweCA4cHg7YmFja2dyb3VuZDp2YXIoLS1zdXJmYWNlKTtjb2xvcjp2YXIoLS1p
bmspO2ZvbnQtc2l6ZTouODNyZW07fQogIC5maWx0ZXJzIGxhYmVse2Rpc3BsYXk6aW5saW5lLWZsZXg7Z2FwOjVweDthbGlnbi1p
dGVtczpjZW50ZXI7Y3Vyc29yOnBvaW50ZXI7fQogIC5iYXJ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5
LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjttYXJnaW46MTJweCAycHggOHB4O2dhcDoxMHB4O2ZsZXgtd3JhcDp3cmFwO30KICAuYmFy
IC5je2ZvbnQtc2l6ZTouODVyZW07Y29sb3I6dmFyKC0taW5rLXNvZnQpO30KICAuYmFyIC5jIGJ7Y29sb3I6dmFyKC0taW5rKTt9
CiAgLnJvdGF7YmFja2dyb3VuZDp2YXIoLS1uYXYpO2NvbG9yOiNmZmY7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czo5cHg7cGFk
ZGluZzo5cHggMTVweDtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOi44M3JlbTtjdXJzb3I6cG9pbnRlcjt9CiAgLnJvdGE6ZGlz
YWJsZWR7b3BhY2l0eTouNDtjdXJzb3I6ZGVmYXVsdDt9CiAgLmNpdHloZHJ7Zm9udC1mYW1pbHk6dmFyKC0tbW9ubyk7Zm9udC1z
aXplOi43MnJlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjA4ZW07Y29sb3I6dmFyKC0taW5rLWZh
aW50KTttYXJnaW46MTZweCAycHggOHB4O2ZvbnQtd2VpZ2h0OjcwMDt9CiAgLmNhcmR7YmFja2dyb3VuZDp2YXIoLS1zdXJmYWNl
KTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWxpbmUpO2JvcmRlci1yYWRpdXM6MTNweDtwYWRkaW5nOjEzcHggMTVweDttYXJnaW4t
Ym90dG9tOjEwcHg7fQogIC5jYXJkLm1pbmV7b3BhY2l0eTouNzt9CiAgLnRvcHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Zmxl
eC1zdGFydDtnYXA6MTJweDt9CiAgLmNoa3t3aWR0aDoyMnB4O2hlaWdodDoyMnB4O2ZsZXg6bm9uZTttYXJnaW4tdG9wOjJweDth
Y2NlbnQtY29sb3I6dmFyKC0tYWNjZW50KTt9CiAgLm5te2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6MXJlbTtkaXNwbGF5OmZs
ZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7ZmxleC13cmFwOndyYXA7fQogIC5iYWRnZXtmb250LXNpemU6LjY2cmVtO2Zv
bnQtd2VpZ2h0OjcwMDtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnZhcigtLW1pbmUtc29m
dCk7Y29sb3I6dmFyKC0tbWluZSk7Ym9yZGVyOjFweCBkYXNoZWQgY3VycmVudENvbG9yO30KICAuYmFkZ2UubmV3e2JhY2tncm91
bmQ6dmFyKC0tZ29vZC1zb2Z0KTtjb2xvcjp2YXIoLS1nb29kKTtib3JkZXI6bm9uZTt9CiAgLmFkZHJ7Y29sb3I6dmFyKC0taW5r
LWZhaW50KTtmb250LXNpemU6LjgycmVtO21hcmdpbi10b3A6MnB4O30KICAubWV0YXtkaXNwbGF5OmZsZXg7Z2FwOjEycHg7YWxp
Z24taXRlbXM6Y2VudGVyO21hcmdpbi10b3A6N3B4O2ZvbnQtc2l6ZTouODJyZW07ZmxleC13cmFwOndyYXA7fQogIC5zdGFye2Nv
bG9yOnZhcigtLXN0YXIpO2ZvbnQtd2VpZ2h0OjcwMDt9CiAgLm9wZW57Y29sb3I6dmFyKC0tZ29vZCk7Zm9udC13ZWlnaHQ6NjAw
O30uY2xvc2Vke2NvbG9yOiNiMzU0MWU7Zm9udC13ZWlnaHQ6NjAwO30KICAuc3B7ZmxleDoxO30KICAuZGV0e21hcmdpbi10b3A6
MTFweDtwYWRkaW5nLXRvcDoxMHB4O2JvcmRlci10b3A6MXB4IGRhc2hlZCB2YXIoLS1saW5lKTtmb250LXNpemU6Ljg1cmVtO2Rp
c3BsYXk6bm9uZTt9CiAgLmRldC5vbntkaXNwbGF5OmJsb2NrO30KICAuZGV0IC5yb3d7ZGlzcGxheTpmbGV4O2dhcDo4cHg7bWFy
Z2luLWJvdHRvbTo0cHg7fS5kZXQgLmt7Y29sb3I6dmFyKC0taW5rLWZhaW50KTt3aWR0aDo3MHB4O2ZsZXg6bm9uZTt9CiAgLmFj
dHN7ZGlzcGxheTpmbGV4O2dhcDo3cHg7bWFyZ2luLXRvcDoxMHB4O2ZsZXgtd3JhcDp3cmFwO30KICAuYntib3JkZXI6MXB4IHNv
bGlkIHZhcigtLWxpbmUpO2JhY2tncm91bmQ6dmFyKC0tc3VyZmFjZS0yKTtjb2xvcjp2YXIoLS1pbmstc29mdCk7Ym9yZGVyLXJh
ZGl1czo4cHg7cGFkZGluZzo3cHggMTJweDtmb250LXNpemU6LjhyZW07Zm9udC13ZWlnaHQ6NjAwO2N1cnNvcjpwb2ludGVyO30K
ICAuYi53YXtiYWNrZ3JvdW5kOiMyNUQzNjY7Y29sb3I6IzBhM2QxZjtib3JkZXI6bm9uZTt9CiAgLmIucHtiYWNrZ3JvdW5kOnZh
cigtLWFjY2VudCk7Y29sb3I6I2ZmZjtib3JkZXI6bm9uZTt9CiAgLmVtcHR5e3RleHQtYWxpZ246Y2VudGVyO2NvbG9yOnZhcigt
LWluay1mYWludCk7cGFkZGluZzozMHB4O30KICAubG9hZGluZ3t0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjp2YXIoLS1pbmstZmFp
bnQpO3BhZGRpbmc6MjBweDt9Cjwvc3R5bGU+PC9oZWFkPjxib2R5Pgo8ZGl2IGNsYXNzPSJuYXYiPjxiPvCfpJY8L2I+PGgxPlJv
YsO0IGRlIFByb3NwZWPDp8OjbzwvaDE+PHNwYW4gY2xhc3M9ImRlbW8iIGlkPSJkZW1vVGFnIj5kZW1vPC9zcGFuPjwvZGl2Pgo8
ZGl2IGNsYXNzPSJ3cmFwIj4KICA8ZGl2IGNsYXNzPSJzZWFyY2giPgogICAgPGRpdiBjbGFzcz0iZmxkIj48bGFiZWw+VGlwbyBk
ZSBsb2phPC9sYWJlbD48aW5wdXQgaWQ9InRpcG8iIHZhbHVlPSJsb2phcyBkZSBjYWzDp2FkbyIgcGxhY2Vob2xkZXI9ImxvamFz
IGRlIGNhbMOnYWRvIGVzcG9ydGl2byI+PC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJmbGQiPjxsYWJlbD5Mb2NhbCAodsOhcmlhcyBj
aWRhZGVzOiBzZXBhcmUgcG9yIHbDrXJndWxhKTwvbGFiZWw+PGlucHV0IGlkPSJsb2NhbCIgdmFsdWU9Ik1hcmluZ8OhLCBDaWFu
b3J0ZSIgcGxhY2Vob2xkZXI9Ik1hcmluZ8OhLCBDaWFub3J0ZSwgVW11YXJhbWEiPjwvZGl2PgogICAgPGJ1dHRvbiBjbGFzcz0i
Z28iIG9uY2xpY2s9ImJ1c2NhcigpIj7wn5SOIEJ1c2NhcjwvYnV0dG9uPgogIDwvZGl2PgoKICA8ZGl2IGNsYXNzPSJmaWx0ZXJz
IiBpZD0iZmlsdGVycyIgc3R5bGU9ImRpc3BsYXk6bm9uZSI+CiAgICA8c3Bhbj5GaWx0cmFyOjwvc3Bhbj4KICAgIDxsYWJlbD5O
b3RhIG3DrW4uIDxzZWxlY3QgaWQ9ImZOb3RhIiBvbmNoYW5nZT0icmVuZGVyKCkiPjxvcHRpb24gdmFsdWU9IjAiPnF1YWxxdWVy
PC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iMy41Ij4zLDUrPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT0iNCI+NCwwKzwvb3B0aW9uPjxv
cHRpb24gdmFsdWU9IjQuNSI+NCw1Kzwvb3B0aW9uPjwvc2VsZWN0PjwvbGFiZWw+CiAgICA8bGFiZWw+PGlucHV0IHR5cGU9ImNo
ZWNrYm94IiBpZD0iZkFiZXJ0YSIgb25jaGFuZ2U9InJlbmRlcigpIj4gc8OzIGFiZXJ0YXM8L2xhYmVsPgogICAgPGxhYmVsPjxp
bnB1dCB0eXBlPSJjaGVja2JveCIgaWQ9ImZNaW5lIiBjaGVja2VkIG9uY2hhbmdlPSJyZW5kZXIoKSI+IGVzY29uZGVyIGFzIHF1
ZSBqw6Egc8OjbyBtaW5oYXM8L2xhYmVsPgogICAgPGxhYmVsPk9yZGVtIDxzZWxlY3QgaWQ9ImZPcmQiIG9uY2hhbmdlPSJyZW5k
ZXIoKSI+PG9wdGlvbiB2YWx1ZT0ibm90YSI+bWVsaG9yIG5vdGE8L29wdGlvbj48b3B0aW9uIHZhbHVlPSJhdmFsIj5tYWlzIGF2
YWxpYcOnw7Vlczwvb3B0aW9uPjwvc2VsZWN0PjwvbGFiZWw+CiAgPC9kaXY+CgogIDxkaXYgY2xhc3M9ImJhciI+CiAgICA8ZGl2
IGNsYXNzPSJjIiBpZD0iY29udCI+SW5mb3JtZSB0aXBvIGUgbG9jYWwgKHBvZGUgc2VyIHbDoXJpYXMgY2lkYWRlcykgZSBjbGlx
dWUgZW0gQnVzY2FyLjwvZGl2PgogICAgPGJ1dHRvbiBjbGFzcz0icm90YSIgaWQ9InJvdGFCdG4iIGRpc2FibGVkIG9uY2xpY2s9
InJvdGEoKSI+8J+Xuu+4jyBSb3RhICgwKTwvYnV0dG9uPgogIDwvZGl2PgogIDxkaXYgaWQ9Imxpc3QiPjwvZGl2Pgo8L2Rpdj4K
PHNjcmlwdD4KY29uc3QgREVNTyA9IF9fREVNT19fOwpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtb1RhZycpLnN0eWxlLmRp
c3BsYXkgPSBERU1PID8gJycgOiAnbm9uZSc7Ci8vIEJhc2UgZGUgImrDoSBjbGllbnRlcyIgKG5vIGRlbW8sIGFsZ3VucyBub21l
cyByZWFpcyBzZXVzKS4gTm8gbW9kbyByZWFsLAovLyBvIHNlcnZpZG9yIG1hcmNhcmlhIGNvbXBhcmFuZG8gY29tIG9zIGNsaWVu
dGVzIGRvIEZvb3R3ZWFyIFByby4KY29uc3QgTU9DSz1bCiB7Y2lkYWRlOidNYXJpbmfDoScsbm9tZTonQ2Fsw6dhZG9zIFBhc3Nv
IEZpcm1lJyxlbmRlcmVjbzonQXYuIEJyYXNpbCwgMTIwMCAtIENlbnRybywgTWFyaW5nw6EgLSBQUicsbm90YTo0LjYsYXZhbGlh
Y29lczoyMTQsdGVsZWZvbmU6Jyg0NCkgMzAyNS0xMTgwJyxzaXRlOidwYXNzb2Zpcm1lLmNvbS5icicsaG9yYXJpbzonU2Vn4oCT
U2V4IDA54oCTMTggwrcgU8OhYiAwOeKAkzEzJyxhYmVydG86dHJ1ZSxtaW5lOmZhbHNlLHBsYWNlX2lkOidkMSd9LAoge2NpZGFk
ZTonTWFyaW5nw6EnLG5vbWU6J1Nwb3J0IENlbnRlciBDYWzDp2Fkb3MnLGVuZGVyZWNvOidBdi4gQ29sb21ibywgNTAwMCAtIFpv
bmEgNywgTWFyaW5nw6EgLSBQUicsbm90YTo0LjIsYXZhbGlhY29lczo5OCx0ZWxlZm9uZTonKDQ0KSAzMjI2LTQ0NzcnLHNpdGU6
JycsaG9yYXJpbzonU2Vn4oCTU8OhYiAwOeKAkzE5JyxhYmVydG86dHJ1ZSxtaW5lOmZhbHNlLHBsYWNlX2lkOidkMid9LAoge2Np
ZGFkZTonTWFyaW5nw6EnLG5vbWU6J0xvamEgZG8gVMOqbmlzIE1hcmluZ8OhJyxlbmRlcmVjbzonUi4gTsOpbyBBbHZlcyBNYXJ0
aW5zLCAzMTAwIC0gQ2VudHJvLCBNYXJpbmfDoSAtIFBSJyxub3RhOjQuOCxhdmFsaWFjb2VzOjQwMix0ZWxlZm9uZTonKDQ0KSAz
MjIyLTkwMTAnLHNpdGU6J2xvamFkb3RlbmlzLmNvbScsaG9yYXJpbzonU2Vn4oCTU2V4IDA54oCTMTgnLGFiZXJ0bzpmYWxzZSxt
aW5lOmZhbHNlLHBsYWNlX2lkOidkMyd9LAoge2NpZGFkZTonTWFyaW5nw6EnLG5vbWU6J0NvcnJpZGEgJiBDaWEnLGVuZGVyZWNv
OidBdi4gQ2Vycm8gQXp1bCwgODUwIC0gWm9uYSAyLCBNYXJpbmfDoSAtIFBSJyxub3RhOjQuMSxhdmFsaWFjb2VzOjYzLHRlbGVm
b25lOicoNDQpIDk5OTg4LTIyMTEnLHNpdGU6JycsaG9yYXJpbzonU2Vn4oCTU8OhYiAxMOKAkzE5JyxhYmVydG86dHJ1ZSxtaW5l
OmZhbHNlLHBsYWNlX2lkOidkNCd9LAoge2NpZGFkZTonTWFyaW5nw6EnLG5vbWU6J0R5dXAgQXJ0LiBFc3BvcnRpdm9zJyxlbmRl
cmVjbzonQXYuIE1hbmRhY2FydSwgMTYwMCAtIE1hcmluZ8OhIC0gUFInLG5vdGE6NC4zLGF2YWxpYWNvZXM6MTI3LHRlbGVmb25l
OicoNDQpIDMwMTEtNTU2Nicsc2l0ZTonJyxob3JhcmlvOidTZWfigJNTw6FiIDA54oCTMTknLGFiZXJ0bzp0cnVlLG1pbmU6dHJ1
ZSxwbGFjZV9pZDonZDUnfSwKIHtjaWRhZGU6J0NpYW5vcnRlJyxub21lOidOZXdwYWNlIFNwb3J0cycsZW5kZXJlY286J0F2LiBC
cmFzaWwsIDgwMCAtIENlbnRybywgQ2lhbm9ydGUgLSBQUicsbm90YTo0LjUsYXZhbGlhY29lczoxNTAsdGVsZWZvbmU6Jyg0NCkg
OTg0NTktMjIyNScsc2l0ZTonJyxob3JhcmlvOidTZWfigJNTw6FiIDA54oCTMTknLGFiZXJ0bzp0cnVlLG1pbmU6dHJ1ZSxwbGFj
ZV9pZDonZDYnfSwKIHtjaWRhZGU6J0NpYW5vcnRlJyxub21lOidBbW9yaW0gQ2Fsw6dhZG9zJyxlbmRlcmVjbzonUi4gUGlxdWly
aSwgMjAwIC0gQ2lhbm9ydGUgLSBQUicsbm90YTo0LjAsYXZhbGlhY29lczo1NSx0ZWxlZm9uZTonJyxzaXRlOicnLGhvcmFyaW86
J1NlZ+KAk1NleCAwOeKAkzE4JyxhYmVydG86dHJ1ZSxtaW5lOnRydWUscGxhY2VfaWQ6J2Q3J30sCiB7Y2lkYWRlOidDaWFub3J0
ZScsbm9tZTonQ2lhbm9ydGUgU3BvcnQgQ2Fsw6dhZG9zJyxlbmRlcmVjbzonQXYuIEFtw6lyaWNhLCAxNTAwIC0gQ2lhbm9ydGUg
LSBQUicsbm90YTo0LjQsYXZhbGlhY29lczo4OCx0ZWxlZm9uZTonKDQ0KSAzNjI5LTExMjInLHNpdGU6JycsaG9yYXJpbzonU2Vn
4oCTU8OhYiAwOeKAkzE5JyxhYmVydG86dHJ1ZSxtaW5lOmZhbHNlLHBsYWNlX2lkOidkOCd9LAoge2NpZGFkZTonQ2lhbm9ydGUn
LG5vbWU6J1TDqm5pcyAmIE1vZGEgQ2lhbm9ydGUnLGVuZGVyZWNvOidSLiBHdWFwb3LDqSwgMzQwIC0gQ2lhbm9ydGUgLSBQUics
bm90YTozLjcsYXZhbGlhY29lczoyOSx0ZWxlZm9uZTonJyxzaXRlOicnLGhvcmFyaW86J1NlZ+KAk1NleCAwOeKAkzE4JyxhYmVy
dG86ZmFsc2UsbWluZTpmYWxzZSxwbGFjZV9pZDonZDknfSwKXTsKbGV0IGxlYWRzPVtdOyBjb25zdCBjYXJ0ZWlyYT1uZXcgU2V0
KCk7Cgphc3luYyBmdW5jdGlvbiBidXNjYXIoKXsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdCcpLmlubmVySFRNTD0n
PGRpdiBjbGFzcz0ibG9hZGluZyI+8J+kliBidXNjYW5kb+KApjwvZGl2Pic7CiAgY29uc3QgdGlwbz1kb2N1bWVudC5nZXRFbGVt
ZW50QnlJZCgndGlwbycpLnZhbHVlLnRyaW0oKTsKICBjb25zdCBsb2NhbD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYWwn
KS52YWx1ZS50cmltKCk7CiAgdHJ5ewogICAgaWYoREVNTyl7IGF3YWl0IG5ldyBQcm9taXNlKHI9PnNldFRpbWVvdXQociw0NTAp
KTsgbGVhZHM9TU9DSy5tYXAoeD0+KHsuLi54fSkpOyB9CiAgICBlbHNlewogICAgICBjb25zdCByPWF3YWl0IGZldGNoKGAvYXBp
L2J1c2Nhcj90aXBvPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRpcG8pfSZsb2NhbD0ke2VuY29kZVVSSUNvbXBvbmVudChsb2NhbCl9
YCk7CiAgICAgIGNvbnN0IGo9YXdhaXQgci5qc29uKCk7IGlmKGouZXJybykgdGhyb3cgbmV3IEVycm9yKGouZXJybyk7IGxlYWRz
PWoubGVhZHM7CiAgICB9CiAgICBjYXJ0ZWlyYS5jbGVhcigpOyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVycycpLnN0
eWxlLmRpc3BsYXk9J2ZsZXgnOyByZW5kZXIoKTsKICB9Y2F0Y2goZSl7IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0Jyku
aW5uZXJIVE1MPSc8ZGl2IGNsYXNzPSJlbXB0eSI+RXJybzogJytlLm1lc3NhZ2UrJzwvZGl2Pic7IH0KfQoKYXN5bmMgZnVuY3Rp
b24gZGV0YWxoZXMoaWQpewogIGNvbnN0IGJveD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGV0XycraWQpOwogIGlmKGJveC5j
bGFzc0xpc3QuY29udGFpbnMoJ29uJykpeyBib3guY2xhc3NMaXN0LnJlbW92ZSgnb24nKTsgcmV0dXJuOyB9CiAgYm94LmNsYXNz
TGlzdC5hZGQoJ29uJyk7CiAgY29uc3QgbD1sZWFkcy5maW5kKHg9PngucGxhY2VfaWQ9PT1pZCk7CiAgbGV0IGQ9e3RlbGVmb25l
OmwudGVsZWZvbmUsc2l0ZTpsLnNpdGUsaG9yYXJpbzpsLmhvcmFyaW99OwogIGlmKCFERU1PICYmICFsLnRlbGVmb25lKXsgYm94
LmlubmVySFRNTD0nY2FycmVnYW5kb+KApic7IGQ9YXdhaXQgKGF3YWl0IGZldGNoKGAvYXBpL2RldGFsaGVzP3BsYWNlX2lkPSR7
ZW5jb2RlVVJJQ29tcG9uZW50KGlkKX1gKSkuanNvbigpOyBPYmplY3QuYXNzaWduKGwsZCk7IH0KICBib3guaW5uZXJIVE1MPWAK
ICAgIDxkaXYgY2xhc3M9InJvdyI+PHNwYW4gY2xhc3M9ImsiPvCfk54gRm9uZTwvc3Bhbj48c3Bhbj4ke2QudGVsZWZvbmV8fCfi
gJQgKHNlbSBjb250YXRvKSd9PC9zcGFuPjwvZGl2PgogICAgPGRpdiBjbGFzcz0icm93Ij48c3BhbiBjbGFzcz0iayI+8J+MkCBT
aXRlPC9zcGFuPjxzcGFuPiR7ZC5zaXRlfHwn4oCUJ308L3NwYW4+PC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJyb3ciPjxzcGFuIGNs
YXNzPSJrIj7wn5WQIEhvcsOhcmlvPC9zcGFuPjxzcGFuPiR7ZC5ob3JhcmlvfHwn4oCUJ308L3NwYW4+PC9kaXY+CiAgICA8ZGl2
IGNsYXNzPSJhY3RzIj4KICAgICAgJHtkLnRlbGVmb25lP2A8YnV0dG9uIGNsYXNzPSJiIHdhIiBvbmNsaWNrPSJ6YXAoJyR7aWR9
JykiPvCfk7IgV2hhdHNBcHA8L2J1dHRvbj5gOicnfQogICAgICA8YnV0dG9uIGNsYXNzPSJiIHAiIG9uY2xpY2s9InNhbHZhcign
JHtpZH0nKSI+4p6VIFNhbHZhciBuYSBjYXJ0ZWlyYTwvYnV0dG9uPgogICAgPC9kaXY+YDsKfQpmdW5jdGlvbiB6YXAoaWQpeyBj
b25zdCBsPWxlYWRzLmZpbmQoeD0+eC5wbGFjZV9pZD09PWlkKTsgY29uc3QgdD0obC50ZWxlZm9uZXx8JycpLnJlcGxhY2UoL1xE
L2csJycpOyB3aW5kb3cub3BlbignaHR0cHM6Ly93YS5tZS8nKyh0Lmxlbmd0aDw9MTE/JzU1Jyt0OnQpLCdfYmxhbmsnKTsgfQpm
dW5jdGlvbiBzYWx2YXIoaWQpeyBjYXJ0ZWlyYS5hZGQoaWQpOyByZW5kZXIoKTsgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rl
dF8nK2lkKT8uY2xhc3NMaXN0LmFkZCgnb24nKTsgfQpmdW5jdGlvbiByb3RhKCl7CiAgY29uc3QgcGFyYWRhcz1bLi4uY2FydGVp
cmFdLm1hcChpZD0+bGVhZHMuZmluZCh4PT54LnBsYWNlX2lkPT09aWQpPy5lbmRlcmVjbykuZmlsdGVyKEJvb2xlYW4pOwogIGlm
KHBhcmFkYXMubGVuZ3RoKSB3aW5kb3cub3BlbignaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL2Rpci8nK3BhcmFkYXMubWFw
KGVuY29kZVVSSUNvbXBvbmVudCkuam9pbignLycpLCdfYmxhbmsnKTsKfQoKZnVuY3Rpb24gZmlsdHJhZG9zKCl7CiAgY29uc3Qg
bm90YT0rZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZOb3RhJykudmFsdWU7CiAgY29uc3Qgc29BYmVydGE9ZG9jdW1lbnQuZ2V0
RWxlbWVudEJ5SWQoJ2ZBYmVydGEnKS5jaGVja2VkOwogIGNvbnN0IGVzY01pbmU9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZN
aW5lJykuY2hlY2tlZDsKICBjb25zdCBvcmQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZPcmQnKS52YWx1ZTsKICBsZXQgYT1s
ZWFkcy5maWx0ZXIobD0+KGwubm90YXx8MCk+PW5vdGEgJiYgKCFzb0FiZXJ0YSB8fCBsLmFiZXJ0byE9PWZhbHNlKSAmJiAoIWVz
Y01pbmUgfHwgIWwubWluZSkpOwogIGEuc29ydCgoeCx5KT0+IG9yZD09PSdhdmFsJyA/ICh5LmF2YWxpYWNvZXN8fDApLSh4LmF2
YWxpYWNvZXN8fDApIDogKHkubm90YXx8MCktKHgubm90YXx8MCkpOwogIHJldHVybiBhOwp9CmZ1bmN0aW9uIHJlbmRlcigpewog
IGNvbnN0IHJiPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3RhQnRuJyk7IHJiLnRleHRDb250ZW50PWDwn5e677iPIFJvdGEg
KCR7Y2FydGVpcmEuc2l6ZX0pYDsgcmIuZGlzYWJsZWQ9Y2FydGVpcmEuc2l6ZT09PTA7CiAgY29uc3Qgbm92YXM9bGVhZHMuZmls
dGVyKGw9PiFsLm1pbmUpLmxlbmd0aCwgbWluaGFzPWxlYWRzLmZpbHRlcihsPT5sLm1pbmUpLmxlbmd0aCwgc2VtVGVsPWxlYWRz
LmZpbHRlcihsPT4hbC50ZWxlZm9uZSkubGVuZ3RoOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250JykuaW5uZXJIVE1M
PSBsZWFkcy5sZW5ndGgKICAgID8gYDxiPiR7bm92YXN9PC9iPiBub3ZhcyDCtyAke21pbmhhc30gasOhIHN1YXMgwrcgJHtzZW1U
ZWx9IHNlbSB0ZWxlZm9uZSR7REVNTz8nIMK3IDxpPihleGVtcGxvIGZpY3TDrWNpbyk8L2k+JzonJ31gCiAgICA6ICdOZW5odW1h
IGxvamEgZW5jb250cmFkYS4nOwogIGNvbnN0IGFycj1maWx0cmFkb3MoKTsKICBjb25zdCBjaWRhZGVzPVsuLi5uZXcgU2V0KGFy
ci5tYXAobD0+bC5jaWRhZGUpLmZpbHRlcihCb29sZWFuKSldOwogIGNvbnN0IG11bHRpPWNpZGFkZXMubGVuZ3RoPjE7CiAgbGV0
IGh0bWw9Jyc7CiAgY29uc3QgZ3J1cG9zID0gbXVsdGkgPyBjaWRhZGVzLm1hcChjPT5bYywgYXJyLmZpbHRlcihsPT5sLmNpZGFk
ZT09PWMpXSkgOiBbW251bGwsIGFycl1dOwogIGZvcihjb25zdCBbY2lkLCBpdGVtc10gb2YgZ3J1cG9zKXsKICAgIGlmKGNpZCkg
aHRtbCs9YDxkaXYgY2xhc3M9ImNpdHloZHIiPvCfk40gJHtjaWR9IMK3ICR7aXRlbXMubGVuZ3RofTwvZGl2PmA7CiAgICBodG1s
Kz1pdGVtcy5tYXAobD0+ewogICAgICBjb25zdCBpZD1sLnBsYWNlX2lkOwogICAgICByZXR1cm4gYDxkaXYgY2xhc3M9ImNhcmQg
JHtsLm1pbmU/J21pbmUnOicnfSI+CiAgICAgICAgPGRpdiBjbGFzcz0idG9wIj4KICAgICAgICAgIDxpbnB1dCB0eXBlPSJjaGVj
a2JveCIgY2xhc3M9ImNoayIgJHtjYXJ0ZWlyYS5oYXMoaWQpPydjaGVja2VkJzonJ30gb25jaGFuZ2U9InRoaXMuY2hlY2tlZD9j
YXJ0ZWlyYS5hZGQoJyR7aWR9Jyk6Y2FydGVpcmEuZGVsZXRlKCcke2lkfScpO3JlbmRlcigpIj4KICAgICAgICAgIDxkaXYgc3R5
bGU9ImZsZXg6MSI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9Im5tIj4ke2wubm9tZX0gJHtsLm1pbmU/JzxzcGFuIGNsYXNzPSJi
YWRnZSI+asOhIMOpIHNldSBjbGllbnRlPC9zcGFuPic6JzxzcGFuIGNsYXNzPSJiYWRnZSBuZXciPm5vdmE8L3NwYW4+J308L2Rp
dj4KICAgICAgICAgICAgPGRpdiBjbGFzcz0iYWRkciI+JHtsLmVuZGVyZWNvfHwnJ308L2Rpdj4KICAgICAgICAgICAgPGRpdiBj
bGFzcz0ibWV0YSI+CiAgICAgICAgICAgICAgJHtsLm5vdGE/YDxzcGFuIGNsYXNzPSJzdGFyIj7imIUgJHtTdHJpbmcobC5ub3Rh
KS5yZXBsYWNlKCcuJywnLCcpfTwvc3Bhbj48c3BhbiBzdHlsZT0iY29sb3I6dmFyKC0taW5rLWZhaW50KSI+KCR7bC5hdmFsaWFj
b2VzfSk8L3NwYW4+YDonJ30KICAgICAgICAgICAgICAke2wuYWJlcnRvPT09dHJ1ZT8nPHNwYW4gY2xhc3M9Im9wZW4iPuKXjyBh
YmVydG88L3NwYW4+JzpsLmFiZXJ0bz09PWZhbHNlPyc8c3BhbiBjbGFzcz0iY2xvc2VkIj7il48gZmVjaGFkbzwvc3Bhbj4nOicn
fQogICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSJzcCI+PC9zcGFuPgogICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9ImIiIG9u
Y2xpY2s9ImRldGFsaGVzKCcke2lkfScpIj5EZXRhbGhlcyDilr48L2J1dHRvbj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAg
ICAgIDxkaXYgY2xhc3M9ImRldCIgaWQ9ImRldF8ke2lkfSI+PC9kaXY+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4K
ICAgICAgPC9kaXY+YDsKICAgIH0pLmpvaW4oJycpOwogIH0KICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdCcpLmlubmVy
SFRNTD0gYXJyLmxlbmd0aD8gaHRtbCA6ICc8ZGl2IGNsYXNzPSJlbXB0eSI+TmVuaHVtYSBsb2phIHBhc3NhIG5vcyBmaWx0cm9z
LiBBZnJvdXhlIG9zIGZpbHRyb3MgYWNpbWEuPC9kaXY+JzsKfQo8L3NjcmlwdD48L2JvZHk+PC9odG1sPgo=
`;
const HTML = Buffer.from(HTML_B64.replace(/\s+/g, ''), 'base64').toString('utf8');

// ---- "carteira" do rep (no real, viria dos clientes do Footwear Pro) ----
const MINHAS = ['dyup art. esportivos', 'newpace sports', 'amorim calcados'];
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const ehMinha = (nome) => MINHAS.includes(norm(nome));

// ---- dados fictícios (modo demo, sem chave) ----
const MOCK = [
  { cidade: 'Maringá', nome: 'Calçados Passo Firme', endereco: 'Av. Brasil, 1200 - Centro, Maringá - PR', nota: 4.6, avaliacoes: 214, telefone: '(44) 3025-1180', site: 'passofirme.com.br', horario: 'Seg–Sex 09–18 · Sáb 09–13', aberto: true, mine: false, place_id: 'demo1' },
  { cidade: 'Maringá', nome: 'Sport Center Calçados', endereco: 'Av. Colombo, 5000 - Zona 7, Maringá - PR', nota: 4.2, avaliacoes: 98, telefone: '(44) 3226-4477', site: '', horario: 'Seg–Sáb 09–19', aberto: true, mine: false, place_id: 'demo2' },
  { cidade: 'Maringá', nome: 'Loja do Tênis Maringá', endereco: 'R. Néo Alves Martins, 3100 - Centro, Maringá - PR', nota: 4.8, avaliacoes: 402, telefone: '(44) 3222-9010', site: 'lojadotenis.com', horario: 'Seg–Sex 09–18', aberto: false, mine: false, place_id: 'demo3' },
  { cidade: 'Maringá', nome: 'Corrida & Cia', endereco: 'Av. Cerro Azul, 850 - Zona 2, Maringá - PR', nota: 4.1, avaliacoes: 63, telefone: '(44) 99988-2211', site: '', horario: 'Seg–Sáb 10–19', aberto: true, mine: false, place_id: 'demo4' },
  { cidade: 'Maringá', nome: 'Dyup Art. Esportivos', endereco: 'Av. Mandacaru, 1600 - Maringá - PR', nota: 4.3, avaliacoes: 127, telefone: '(44) 3011-5566', site: '', horario: 'Seg–Sáb 09–19', aberto: true, mine: true, place_id: 'demo5' },
  { cidade: 'Cianorte', nome: 'Newpace Sports', endereco: 'Av. Brasil, 800 - Centro, Cianorte - PR', nota: 4.5, avaliacoes: 150, telefone: '(44) 98459-2225', site: '', horario: 'Seg–Sáb 09–19', aberto: true, mine: true, place_id: 'demo6' },
  { cidade: 'Cianorte', nome: 'Amorim Calçados', endereco: 'R. Piquiri, 200 - Cianorte - PR', nota: 4.0, avaliacoes: 55, telefone: '', site: '', horario: 'Seg–Sex 09–18', aberto: true, mine: true, place_id: 'demo7' },
  { cidade: 'Cianorte', nome: 'Cianorte Sport Calçados', endereco: 'Av. América, 1500 - Cianorte - PR', nota: 4.4, avaliacoes: 88, telefone: '(44) 3629-1122', site: '', horario: 'Seg–Sáb 09–19', aberto: true, mine: false, place_id: 'demo8' },
  { cidade: 'Cianorte', nome: 'Tênis & Moda Cianorte', endereco: 'R. Guaporé, 340 - Cianorte - PR', nota: 3.7, avaliacoes: 29, telefone: '', site: '', horario: 'Seg–Sex 09–18', aberto: false, mine: false, place_id: 'demo9' },
];

// ---- Google Places (modo real) — uma busca por cidade ----
async function buscarGoogle(tipo, local) {
  const cidades = local.split(',').map((s) => s.trim()).filter(Boolean);
  if (!cidades.length) cidades.push('');
  const lotes = await Promise.all(cidades.map((cid) => buscarCidade(tipo, cid)));
  return lotes.flat();
}

async function buscarCidade(tipo, cidade) {
  const q = encodeURIComponent(`${tipo} em ${cidade}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&language=pt-BR&region=br&key=${KEY}`;
  const r = await fetch(url);
  const j = await r.json();
  if (j.status !== 'OK' && j.status !== 'ZERO_RESULTS') throw new Error(j.error_message || j.status);
  return (j.results || []).map((p) => ({
    cidade,
    nome: p.name,
    endereco: p.formatted_address,
    nota: p.rating ?? null,
    avaliacoes: p.user_ratings_total ?? 0,
    aberto: p.opening_hours?.open_now ?? null,
    mine: ehMinha(p.name),
    place_id: p.place_id,
    telefone: '', site: '', horario: '',
  }));
}

async function detalhesGoogle(placeId) {
  const fields = 'formatted_phone_number,website,opening_hours,url';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=pt-BR&key=${KEY}`;
  const r = await fetch(url);
  const j = await r.json();
  const d = j.result || {};
  return {
    telefone: d.formatted_phone_number || '',
    site: (d.website || '').replace(/^https?:\/\//, '').replace(/\/$/, ''),
    horario: (d.opening_hours?.weekday_text || []).join(' · '),
    maps: d.url || '',
  };
}

function json(res, code, data) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (u.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(HTML.replace('__DEMO__', DEMO ? 'true' : 'false'));
    }
    if (u.pathname === '/api/buscar') {
      const tipo = u.searchParams.get('tipo') || 'lojas de calçado';
      const local = u.searchParams.get('local') || '';
      if (DEMO) return json(res, 200, { demo: true, leads: MOCK });
      return json(res, 200, { demo: false, leads: await buscarGoogle(tipo, local) });
    }
    if (u.pathname === '/api/detalhes') {
      const id = u.searchParams.get('place_id');
      if (DEMO) {
        const m = MOCK.find((x) => x.place_id === id) || {};
        return json(res, 200, { telefone: m.telefone, site: m.site, horario: m.horario });
      }
      return json(res, 200, await detalhesGoogle(id));
    }
    res.writeHead(404); res.end('não encontrado');
  } catch (e) {
    json(res, 500, { erro: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`Robô de prospecção em http://localhost:${PORT}  (modo ${DEMO ? 'DEMO — dados fictícios' : 'REAL — Google Places'})`);
});
