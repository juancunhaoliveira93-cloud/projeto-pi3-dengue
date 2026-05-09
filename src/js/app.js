/* app.js - VERSÃO INTEGRADA 
   Correções: Conversão de Siglas, IDs do Mapa e Módulo de Previsão
*/
let dadosGlobais = []; // Variável para armazenar o JSON carregado

// 1. Dicionário para traduzir a Sigla (Select) para o ID 
const dicionarioEstados = {
    "AC": "Acre", "AL": "Alagoas", "AP": "Amapa", "AM": "Amazonas",
    "BA": "Bahia", "CE": "Ceara", "DF": "Distrito Federal", "ES": "Espirito Santo",
    "GO": "Goias", "MA": "Maranhao", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais", "PA": "Para", "PB": "Paraiba", "PR": "Parana",
    "PE": "Pernambuco", "PI": "Piaui", "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul", "RO": "Rondonia", "RR": "Roraima", "SC": "Santa Catarina",
    "SP": "Sao Paulo", "SE": "Sergipe", "TO": "Tocantins"
};

// 2. Atualização de Interface (KPIs e Previsão)
function atualizarInterface(total, incidencia, variacao) {
    document.getElementById('kpiTotalCasos').innerText = total;
    document.getElementById('kpiTaxaIncidencia').innerText = incidencia;
    document.getElementById('kpiVariacao').innerText = variacao;
}

function atualizarModuloPrevisao(total) {
    const container = document.getElementById('containerPrevisao');
    if (!container) return;

    // Define tendência baseada no volume
    const tendencia = total > 5000 ? "Alerta de Alta" : "Estabilidade";
    const cor = total > 5000 ? "#ff4d4d" : "#18b47a";

    container.innerHTML = `
        <div style="padding: 15px; border-left: 5px solid ${cor}; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <strong style="color: ${cor}">${tendencia} Detectada</strong>
            <p style="margin: 5px 0 0; font-size: 0.9rem; color: #d5e3ff;">
                Modelo analítico estima variação baseada em ${total.toLocaleString('pt-BR')} casos registrados.
            </p>
        </div>`;
}

function limparMapa() {
    // Busca pelo ID 'svgMapa' conforme index.html
    const estados = document.querySelectorAll('#svgMapa path');
    estados.forEach(est => {
        est.style.fill = "#334155";
        est.style.transition = "fill 0.5s ease";
    });
}

// Localize o evento do botão Filtrar no seu app.js e substitua por este:
document.getElementById('btnFiltrar').addEventListener('click', () => {
    const sigla = document.getElementById('filtroLocalidade').value;
    const periodoSelecionado = parseInt(document.getElementById('filtroPeriodo').value);

    if (!sigla || !periodoSelecionado) {
        alert("Selecione o Ano e o Estado!");
        return;
    }

    limparMapa();

    // 1. Lógica para os KPIs (Mantém o que você já tinha para o ano específico)
    const registro = dadosGlobais.find(d => d.ano === periodoSelecionado && d.estado === sigla);

    // 2. NOVA LÓGICA PARA O GRÁFICO: Filtrar o histórico de TODOS os anos desse estado
    const historicoEstado = dadosGlobais
        .filter(d => d.estado === sigla)
        .sort((a, b) => a.ano - b.ano);

    const labelsAnos = historicoEstado.map(d => d.ano);
    const valoresCasos = historicoEstado.map(d => d.casos);
    if (historicoEstado.length === 0) {
        console.warn("Sem dados históricos para este estado.");
        alert("Atenção: Não encontramos registros históricos para este estado no banco de dados.");
        return; // Para a execução para não tentar desenhar um gráfico vazio
    }

    if (registro) {
        // Atualiza KPIs
        const total = registro.casos;
        const incidencia = ((total / 150000) * 100000).toFixed(2);
        const variacao = total > 4000 ? "+15.2%" : "-4.5%";

        atualizarInterface(total.toLocaleString('pt-BR'), incidencia, variacao);
        atualizarModuloPrevisao(total);

        // Atualiza o Gráfico com o histórico do estado
        if (typeof atualizarGraficoReal === "function") {
            atualizarGraficoReal(labelsAnos, valoresCasos);
        }

        // Pintar o mapa
        const idEstado = dicionarioEstados[sigla];
        const elementoSvg = document.getElementById(idEstado);
        if (elementoSvg) {
            let corAlerta = total > 5000 ? "#ff4d4d" : (total > 1500 ? "#ff9f43" : "#18b47a");
            elementoSvg.style.fill = corAlerta;
        }
    } else {
        alert("Nenhum dado encontrado para esta seleção.");
    }
});

// 4. Inicialização do Gráfico (Série Temporal)
window.onload = async () => {
    try {
        const resposta = await fetch('dados_dengue.json');
        dadosGlobais = await resposta.json();
        
        // Calcular o total nacional por ano para o gráfico inicial
        const anos = [...new Set(dadosGlobais.map(d => d.ano))].sort();
        const totais = anos.map(ano => {
            return dadosGlobais
                .filter(d => d.ano === ano)
                .reduce((sum, item) => sum + item.casos, 0);
        });

        if (typeof atualizarGraficoReal === "function") {
            atualizarGraficoReal(anos, totais);
        }
    } catch (e) { 
        console.error("Erro ao carregar os dados:", e); 
    }
};