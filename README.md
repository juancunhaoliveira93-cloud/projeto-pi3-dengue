# Painel Analítico: Análise de Casos de Dengue no Brasil 🦟📊

[![Status do Projeto](https://img.shields.io/badge/Status-MVP%20Concluído-success)](#)
[![Licença](https://img.shields.io/badge/License-MIT-blue.svg)](#)

Este repositório contém o Produto Mínimo Viável (MVP) desenvolvido para o Projeto Integrador III. A solução consiste em um painel analítico (dashboard) interativo para o monitoramento, visualização e análise da série histórica de casos de dengue no Brasil, integrando dados de notificações do SINAN com estimativas populacionais do IBGE.

---

## 🎥 Demonstração do Produto (Entrega 3)

**[👉 CLIQUE AQUI PARA ASSISTIR AO VÍDEO DE DEMONSTRAÇÃO 👈](https://github.com/juancunhaoliveira93-cloud/projeto-pi3-dengue/tree/main/videos)** 

---

## 👥 Equipe Desenvolvedora (Alunos TADS - FAESA)
* Carine dos Santos de Santana
* Gustavo Cardoso Lima
* Juan Carlos Oliveira da Cunha
* Victor Fermiano Nascimento

---

## ⚙️ Pipeline de Dados: O Script de Tratamento (`data_cleaning.py`)

O coração do processamento de dados deste projeto é o script `data_cleaning.py`. Ele foi desenvolvido para automatizar a ingestão, limpeza e modelagem dos dados brutos de saúde pública antes que eles sejam consumidos pela interface web.

### 1. Pré-requisitos e Dependências
Para que o script funcione corretamente, você deve ter o **Python 3.x** instalado em sua máquina, além das seguintes bibliotecas de manipulação de dados e visualização:

* **Pandas**: Para a carga, limpeza e manipulação das tabelas de dados.
* **Matplotlib**: Para a geração do gráfico consolidado de validação interna.

Você pode instalar todas as dependências executando o seguinte comando no seu terminal:
```bash
pip install pandas matplotlib
```
2. Estrutura de Arquivos Necessária
O script foi desenhado para buscar arquivos locais específicos de dados brutos (Data Raw). Certifique-se de manter os dados brutos dentro da pasta “data_raw/“que deve está dentro da pasta “scripts/"

3. Como Executar o Script
Com as dependências instaladas e os arquivos brutos em suas respectivas pastas, abra o seu terminal ou prompt de comando na raiz do projeto e execute:
```bash
python data_cleaning.py
```
4. O que o Script Faz (Fluxo de Execução)
Quando você executa o comando, o script realiza as seguintes operações de forma sequencial:

1. Ingestão de Dados Brutos: Carrega o arquivo do SINAN ignorando o cabeçalho descritivo do Datasus (skiprows=3) e aplicando o encoding correto (latin1).

2. Filtragem e Higienização: Remove registros de municípios corrompidos ou inválidos (como "MUNICIPIO IGNORADO - RO").

3. Tratamento de Dados Ausentes: Localiza caracteres de omissão de dados padrão do sistema ("-") e os substitui por 0, convertendo todas as colunas de anos para o formato numérico correto.

4. Segregação de Entidades por Regex: Utiliza Expressões Regulares para quebrar o campo de texto bruto em duas colunas estruturadas: codigo_ibge (numérico) e municipio (texto).

5. Agrupamento e Consolidação: Consolida a soma de casos nacionais por ano para validar a integridade histórica.

6. Cruzamento Populacional: Tenta ler as tabelas de estimativas do IBGE de 2021 e 2024 para calcular as taxas reais de incidência por 100 mil habitantes.

7. Saída Gráfica de Validação: Abre uma janela interativa do Matplotlib exibindo a curva histórica da dengue no Brasil para validação visual dos dados tratados. O script aguarda o fechamento desta janela para encerrar o ciclo com sucesso.

💻 Interface Web: Como Executar o Frontend

O dashboard consome a base de dados em formato JSON e renderiza os gráficos interativos diretamente no navegador do usuário.

1. Requisito Especial (Servidor Local)
Como o projeto faz o uso de requisições assíncronas utilizando a API fetch() do JavaScript para carregar as malhas geográficas (brazil-states.json) e os dados estatísticos (dados_dengue.json), os navegadores bloqueiam o carregamento direto se você tentar apenas dar dois cliques no arquivo index.html (erro de CORS).

Portanto, é obrigatório rodar a aplicação a partir de um ambiente de servidor local.

2. Passo a Passo para Rodar a Interface
Abra a pasta do projeto no Visual Studio Code (VSCode).

Instale a extensão Live Server (caso ainda não possua).

Clique no botão "Go Live" localizado na barra inferior do VSCode, ou clique com o botão direito sobre o arquivo index.html e selecione Open with Live Server.

O navegador abrirá automaticamente o painel no endereço http://127.0.0.1:5500/index.html.

Alternativa via terminal (caso prefira usar o próprio Python como servidor local): python -m http.server 8000 Depois, acesse no navegador: http://localhost:8000

🛠️ Tecnologias e Bibliotecas Utilizadas no MVP
Arquitetura Base: HTML5, CSS3 (com Grid, Flexbox e variáveis de tema), Vanilla JavaScript (ES6+).

Mapas Coropléticos: Apache ECharts (v5.4.3), integrado dinamicamente a arquivos de dados geográficos em formato GeoJSON para mapear os índices epidêmicos estado por estado.

Gráficos de Linha e Séries Temporais: Chart.js, utilizado para plotar o histórico evolutivo de casos com ferramentas de manipulação de instâncias (.destroy()) para evitar vazamento de memória ou sobreposição de gráficos durante a filtragem de dados.

Framework Visual Auxiliar: Bootstrap 5 (utilizado pontualmente para estruturas de espaçamento e alinhamento).