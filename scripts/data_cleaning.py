# =================================================================
# GUSTAVO - SCRIPT DE LIMPEZA E TRATAMENTO DE DADOS (DATASUS)
# =================================================================

# 1. COLETA: Carregar os arquivos CSV/tabulares baixados do DATASUS[cite: 34].

# 2. LIMPEZA:
# - Remover registros com valores ausentes (NaN)[cite: 38].
# - Padronizar nomes de municípios (Remover acentos e letras maiúsculas/minúsculas).
# - Tratar duplicidades de notificações[cite: 38].

# 3. TRANSFORMAÇÃO:
# - Criar a coluna 'taxa_incidencia' (Casos / População * 100.000).
# - Segmentar os dados por 'faixa_etaria' e 'periodo' (Mês/Ano)[cite: 34, 49].

# 4. EXPORTAÇÃO:
# - Gerar um arquivo .csv limpo ou enviar direto para o PostgreSQL (tabela 'notificacoes_dengue').

print("Aguardando dados brutos do DATASUS para iniciar a limpeza...")