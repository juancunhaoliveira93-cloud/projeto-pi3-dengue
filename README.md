PROJETO INTEGRADOR III - ANÁLISE DE DENGUE NO BRASIL

DESCRIÇÃO
Este projeto tem como objetivo analisar os casos de dengue no Brasil ao longo dos anos, utilizando dados reais do DATASUS e estimativas populacionais do IBGE.
Os dados são processados, organizados e analisados para gerar informações relevantes sobre a evolução da doença no país.

OBJETIVO
- Analisar a evolução dos casos de dengue por ano
- Identificar padrões nos dados
- Calcular indicadores como total de casos e taxa de incidência
- Gerar visualizações gráficas para interpretação dos dados

ESTRUTURA DO PROJETO

/frontend  
Responsável pela interface do usuário (HTML, CSS e gráficos em JavaScript)  
- Carine: estrutura visual  
- Juan: gráficos e interatividade  

/backend  
Responsável pela API e comunicação com banco de dados  
- Victor: lógica do servidor e integração  

/scripts  
Responsável pelo tratamento dos dados  
- Gustavo: limpeza, organização e análise dos dados do DATASUS  

FUNCIONALIDADE DO SCRIPT
- Leitura dos dados brutos do DATASUS
- Limpeza de dados inconsistentes
- Separação do código IBGE e nome dos municípios
- Transformação dos dados para formato adequado
- Cálculo de casos por ano
- Integração com dados populacionais do IBGE
- Preparação dos dados para análise e visualização

TECNOLOGIAS UTILIZADAS
- Python (Pandas, Matplotlib)
- JavaScript
- HTML/CSS
- Node.js
- Express.js

COMO EXECUTAR

Atualizar projeto:
git pull origin main

Instalar dependências:
npm install

Rodar script:
python scripts/data_cleaning.py

FONTES DE DADOS
- DATASUS
- IBGE

INTEGRANTES
- Gustavo
- Carine
- Juan
- Victor

OBSERVAÇÕES
Os dados populacionais foram ajustados para anos sem estimativa disponível utilizando métodos de aproximação para manter a consistência da análise.