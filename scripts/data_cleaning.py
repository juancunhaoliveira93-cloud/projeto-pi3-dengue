import pandas as pd
import matplotlib.pyplot as plt

# =========================
# 1. CARREGAR DADOS
# =========================

# Ajustado para ler da pasta data_raw
df = pd.read_csv(
    "data_raw/sinannet_cnv_denguebbr150315131_196_102_253.csv",
    sep=";",
    encoding="latin1",
    skiprows=3,
    engine="python"
)

# =========================
# 2. LIMPEZA
# =========================

# remover município inválido
df = df[df["Municipio de notificacao"] != "MUNICIPIO IGNORADO - RO"]

# substituir "-" por 0
df = df.replace("-", 0)

# converter colunas de anos
colunas_anos = df.columns[1:]
df[colunas_anos] = df[colunas_anos].apply(pd.to_numeric)

# separar código e nome (forma mais segura)
df[["codigo_ibge", "municipio"]] = df["Municipio de notificacao"].str.extract(r"(\d+)\s+(.*)")

# converter código
df["codigo_ibge"] = pd.to_numeric(df["codigo_ibge"], errors="coerce")

# remover inválidos
df = df.dropna(subset=["codigo_ibge"])
df["codigo_ibge"] = df["codigo_ibge"].astype(int)

# remover coluna antiga
df = df.drop(columns=["Municipio de notificacao"])

# resetar índice
df = df.reset_index(drop=True)

# =========================
# 3. TRANSFORMAR (MELT)
# =========================

df_melt = df.melt(
    id_vars=["codigo_ibge", "municipio"],
    var_name="ano",
    value_name="casos"
)

# remover coluna "Total"
df_melt = df_melt[df_melt["ano"] != "Total"]

# converter ano
df_melt["ano"] = df_melt["ano"].astype(int)

# salvar arquivo tratado na pasta scripts (fora da data_raw)
df_melt.to_csv("dengue_tratado.csv", index=False)

# =========================
# 4. ANÁLISE
# =========================

casos_por_ano = df_melt.groupby("ano")["casos"].sum()

print("Resumo de casos por ano:")
print(casos_por_ano)

# =========================
# 5. GRÁFICO
# =========================

plt.figure(figsize=(10,5))

plt.plot(casos_por_ano.index, casos_por_ano.values, marker="o")

# adicionar números nos pontos
for x, y in casos_por_ano.items():
    plt.text(x, y + 50000, f"{int(y):,}", ha='center')

plt.title("Casos de Dengue por Ano no Brasil")
plt.xlabel("Ano")
plt.ylabel("Casos")

# evitar notação científica
plt.ticklabel_format(style='plain', axis='y')

plt.grid()

# Opcional: Salvar o gráfico como imagem para o relatório
# plt.savefig("grafico_dengue_brasil.png")

print("\nExibindo gráfico... Feche a janela do gráfico para encerrar o script.")
plt.show()

# ================================================================
# LEITURA DE POPULAÇÃO (Ajustado para data_raw)
# ================================================================

try:
    pop2021 = pd.read_csv(
        "data_raw/estimativa_dou_2021(Municípios).csv",
        sep=";",
        encoding="latin1",
        engine="python",
        skiprows=3,
        on_bad_lines="skip"
    )
    print("\nDados de População 2021 carregados com sucesso!")
    print(pop2021.columns)
except FileNotFoundError:
    print("\nErro: Arquivo de população 2021 não encontrado em data_raw/")

try:
    pop2024 = pd.read_csv(
        "data_raw/estimativa_dou_2024(BRASIL E UFs).csv",
        sep=";",
        encoding="latin1",
        engine="python",
        skiprows=3,
        on_bad_lines="skip"
    )
    print("Dados de População 2024 carregados com sucesso!")
except FileNotFoundError:
    print("Erro: Arquivo de população 2024 não encontrado em data_raw/")