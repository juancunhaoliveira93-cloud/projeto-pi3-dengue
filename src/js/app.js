/* app.js - Lógica Principal Integrada com ECharts */

let dadosGlobais = []; // Histórico completo do JSON

// Populações projetadas por estado (IBGE) para cálculo real de incidência
const populacaoEstados = {
    "AC": 830026,
    "AL": 3127511,
    "AP": 733508,
    "AM": 3941175,
    "BA": 14136417,
    "CE": 8791688,
    "DF": 2817068,
    "ES": 3833486,
    "GO": 7055228,
    "MA": 6775152,
    "MT": 3658814,
    "MS": 2756700,
    "MG": 20538718,
    "PA": 8116132,
    "PB": 3974687,
    "PR": 11443208,
    "PE": 9058155,
    "PI": 3269200,
    "RJ": 16054824,
    "RN": 3302406,
    "RS": 10880506,
    "RO": 1581016,
    "RR": 636300,
    "SC": 7609601,
    "SP": 44420459,
    "SE": 2209558,
    "TO": 1511458
};

// Dicionário de tradução de siglas para nomes completos
const dicionarioEstados = {
    "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas",
    "BA": "Bahia", "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo",
    "GO": "Goiás", "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais", "PA": "Pará", "PB": "Paraíba", "PR": "Paraná",
    "PE": "Pernambuco", "PI": "Piauí", "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul", "RO": "Rondônia", "RR": "Roraima", "SC": "Santa Catarina",
    "SP": "São Paulo", "SE": "Sergipe", "TO": "Tocantins"
};

/**
 * Atualiza os indicadores de KPI da interface.
 */
function atualizarInterface(total, incidencia, variacao) {
    document.getElementById('kpiTotalCasos').innerText = total;
    document.getElementById('kpiTaxaIncidencia').innerText = incidencia;
    
    const kpiVariacaoEl = document.getElementById('kpiVariacao');
    kpiVariacaoEl.innerText = variacao;

    // Ajusta a cor do texto da variação para verde (redução) ou vermelho (aumento)
    if (variacao.startsWith('-')) {
        kpiVariacaoEl.style.color = '#18b47a'; // Verde
    } else if (variacao.startsWith('+')) {
        kpiVariacaoEl.style.color = '#ff4d4d'; // Vermelho
    } else {
        kpiVariacaoEl.style.color = '#7f92b7'; // Neutro
    }
}

/**
 * Atualiza a seção do módulo preditivo.
 */
function atualizarModuloPrevisao(total, incidencia) {
    const container = document.getElementById('containerPrevisao');
    if (!container) return;

    let tendencia = "Estabilidade";
    let cor = "#18b47a";
    let conselho = "Ações rotineiras de combate ao mosquito vetor devem ser mantidas.";

    if (incidencia > 300) {
        tendencia = "Alerta Epidêmico (Alta Incidência)";
        cor = "#ff4d4d"; // Vermelho
        conselho = "Alto risco de transmissão sustentada. Recomenda-se intensificar mutirões de limpeza e pulverização.";
    } else if (incidencia > 100) {
        tendencia = "Alerta Médio (Atenção)";
        cor = "#ff9f43"; // Laranja
        conselho = "Transmissão moderada detectada. Recomenda-se reforçar a conscientização comunitária e visitas residenciais.";
    }

    container.innerHTML = `
        <div style="padding: 20px; border-left: 5px solid ${cor}; background: rgba(255,255,255,0.04); border-radius: 12px; transition: all 0.3s ease;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span class="pulse-dot" style="background-color: ${cor}; box-shadow: 0 0 0 0 ${cor}7f;"></span>
                <strong style="color: ${cor}; font-size: 1.1rem;">${tendencia}</strong>
            </div>
            <p style="margin: 0 0 8px; font-size: 0.95rem; color: #d5e3ff; line-height: 1.6;">
                O modelo estima a classificação epidemiológica com base em uma taxa de <strong>${incidencia.toFixed(1)}</strong> casos/100k hab. (${total.toLocaleString('pt-BR')} casos registrados).
            </p>
            <small style="color: #9db0d4; display: block; font-style: italic; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
                Recomendação: ${conselho}
            </small>
        </div>`;
}

/**
 * Aplica os filtros selecionados, atualiza os gráficos, mapa e KPIs.
 * @param {boolean} suavizado - Se true, não faz rolagem de tela ou alertas.
 */
function aplicarFiltros(suavizado = false) {
    const sigla = document.getElementById('filtroLocalidade').value;
    const periodoSelecionado = parseInt(document.getElementById('filtroPeriodo').value);

    if (!sigla || !periodoSelecionado) {
        if (!suavizado) alert("Selecione o Ano e o Estado!");
        return;
    }

    // 1. Encontrar o registro atual
    const registro = dadosGlobais.find(d => d.ano === periodoSelecionado && d.estado === sigla);

    // 2. Filtrar o histórico temporal para o gráfico de linha do estado selecionado
    const historicoEstado = dadosGlobais
        .filter(d => d.estado === sigla)
        .sort((a, b) => a.ano - b.ano);

    const labelsAnos = historicoEstado.map(d => d.ano);
    const valoresCasos = historicoEstado.map(d => d.casos);

    if (historicoEstado.length === 0) {
        if (!suavizado) alert("Não encontramos registros históricos para este estado.");
        return;
    }

    // 3. Atualizar KPIs se houver registro para o ano específico
    if (registro) {
        const total = registro.casos;
        const pop = populacaoEstados[sigla] || 100000;
        const incidenciaReal = (total / pop) * 100000;

        // Calcular Variação Real YoY
        const registroAnterior = dadosGlobais.find(d => d.ano === (periodoSelecionado - 1) && d.estado === sigla);
        let variacaoReal = "N/A";
        if (registroAnterior && registroAnterior.casos > 0) {
            const calcVariacao = ((total - registroAnterior.casos) / registroAnterior.casos) * 100;
            variacaoReal = (calcVariacao > 0 ? "+" : "") + calcVariacao.toFixed(1) + "%";
        } else if (registroAnterior && registroAnterior.casos === 0) {
            variacaoReal = total > 0 ? "+100%" : "0%";
        }

        atualizarInterface(
            total.toLocaleString('pt-BR'),
            incidenciaReal.toFixed(2),
            variacaoReal
        );

        atualizarModuloPrevisao(total, incidenciaReal);

        // Atualizar o gráfico de linha temporal
        if (typeof atualizarGraficoReal === "function") {
            atualizarGraficoReal(labelsAnos, valoresCasos);
        }
    } else {
        // Se não houver dados específicos para o ano
        atualizarInterface("0", "0.00", "0.0%");
        if (typeof atualizarGraficoReal === "function") {
            atualizarGraficoReal(labelsAnos, valoresCasos);
        }
    }

    // 4. Atualizar todo o mapa com as cores de incidência de cada estado para o ano selecionado
    const dadosFiltradosAno = dadosGlobais.filter(d => d.ano === periodoSelecionado);
    const dadosMapa = dadosFiltradosAno.map(d => {
        const pop = populacaoEstados[d.estado] || 100000;
        const inc = (d.casos / pop) * 100000;
        return {
            name: d.estado, // Associa à sigla do GeoJSON
            value: inc, // Incidência determina a faixa de cor no visualMap
            casos: d.casos,
            populacao: pop,
            estadoNome: dicionarioEstados[d.estado] || d.estado
        };
    });

    atualizarDadosMapa(dadosMapa);

    // Destacar o estado que foi ativamente selecionado
    destacarEstadoNoMapa(sigla);
}

// Vincula o clique do botão de filtrar
document.getElementById('btnFiltrar').addEventListener('click', () => aplicarFiltros(false));

// Inicialização da Página
window.onload = async () => {
    try {
        // 1. Carregar base de dados de dengue
        const respostaDengue = await fetch('dados_dengue.json');
        dadosGlobais = await respostaDengue.json();

        // 2. Carregar arquivo GeoJSON dos estados
        const respostaGeo = await fetch('src/js/brazil-states.json');
        const geojson = await respostaGeo.json();

        // 3. Inicializar o mapa do ECharts passando o GeoJSON e a ação de clique
        inicializarMapa(geojson, (siglaClicada) => {
            // Callback: ao clicar no estado do mapa, atualiza o dropdown e filtra
            const seletor = document.getElementById('filtroLocalidade');
            if (seletor) {
                seletor.value = siglaClicada;
                aplicarFiltros(true);
            }
        });

        // 4. Determinar o ano mais recente na base para pré-selecionar
        const anosDisponiveis = [...new Set(dadosGlobais.map(d => d.ano))].sort((a, b) => b - a);
        const anoMaisRecente = anosDisponiveis[0] || 2024;

        // Pré-selecionar Ano Recente e Estado de São Paulo como padrão
        document.getElementById('filtroPeriodo').value = anoMaisRecente;
        document.getElementById('filtroLocalidade').value = 'SP';

        // Executar filtro inicial
        aplicarFiltros(true);

    } catch (e) {
        console.error("Erro na inicialização da aplicação:", e);
    }
};