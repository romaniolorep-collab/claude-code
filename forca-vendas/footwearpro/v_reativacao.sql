-- =====================================================================
-- v_reativacao — a "camada de inteligência" do Footwear Pro (etapa 3)
-- ---------------------------------------------------------------------
-- O QUE FAZ: lê as tabelas que você já tem (pedidos, clientes) e devolve
-- as lojas para acionar, JÁ PRIORIZADAS, com o motivo de cada uma.
-- Não é gráfico: é lista de ação (reativação + cross-sell + fidelização).
--
-- SEGURO: é uma VIEW (só leitura sobre as tabelas existentes). Não copia,
-- não altera e não apaga nenhum dado. Se quiser remover: DROP VIEW v_reativacao;
--
-- COMO USAR:
--   1. Cole este arquivo no SQL Editor do Supabase e rode.
--   2. Teste:   select * from v_reativacao;
--   3. No app (Footwear Pro), leia igual às outras tabelas:
--        supabase.from('v_reativacao').select('*')
-- =====================================================================

create or replace view v_reativacao
with (security_invoker = true)          -- respeita as mesmas permissões/RLS das tabelas
as
with ped as (
  select
    regexp_replace(coalesce(cliente_cnpj,''),'\D','','g')      as cnpj_n,
    max(cliente_razao)                                          as razao_pedido,
    count(*)                                                    as n_pedidos,
    coalesce(sum(total_liquido),0)                              as total_liq,
    coalesce(sum(total_pares),0)                                as pares,
    max(data_emissao)                                           as ultima_compra,
    (current_date - max(data_emissao))                          as dias_sem_comprar,
    count(distinct lower(brand))                                as n_marcas,
    string_agg(distinct lower(brand), ', ')                     as marcas
  from pedidos
  where regexp_replace(coalesce(cliente_cnpj,''),'\D','','g') <> ''
  group by 1
)
select
  coalesce(c.razao, p.razao_pedido)               as loja,
  c.cidade,
  c.uf,
  p.n_pedidos,
  round(p.total_liq)::numeric                     as total_liquido,
  p.pares,
  p.ultima_compra,
  p.dias_sem_comprar,
  p.marcas,
  p.n_marcas,
  -- Score 0-100 = valor (até 60) + urgência por dias parados (até 25) + cross-sell (15)
  round(
      least(60, p.total_liq / 1000.0)
    + least(25, greatest(0, p.dias_sem_comprar - 14))
    + case when p.n_marcas = 1 then 15 else 0 end
  )                                               as prioridade,
  -- Motivo legível (o "porquê" de acionar)
  nullif(concat_ws(' · ',
    case when p.dias_sem_comprar >= 45 then 'esfriando ('||p.dias_sem_comprar||' dias)' end,
    case when p.total_liq >= 15000     then 'alto valor (R$ '||round(p.total_liq)||')' end,
    case when p.n_marcas = 1           then 'só compra '||p.marcas||' → oferecer outra marca' end,
    case when p.n_pedidos >= 2         then 'cliente fiel ('||p.n_pedidos||' pedidos)' end
  ), '')                                          as motivo
from ped p
left join clientes c
  on regexp_replace(coalesce(c.cnpj,''),'\D','','g') = p.cnpj_n
order by prioridade desc, p.total_liq desc;

-- Deixa o app (Footwear Pro) ler a view:
grant select on v_reativacao to anon, authenticated;

-- =====================================================================
-- Extensões naturais (mesmo padrão, quando quiser):
--   v_oportunidade_marca  → lojas que compram Reebok e nunca Brooks/HOKA
--   v_clientes_duplicados → cadastros com mesma cidade+valor (ex.: "Gera")
--   v_positivacao         → % da base que comprou vs base dormente (404 lojas)
-- =====================================================================
