/* app.js - VERSÃO INTEGRADA 
   Correções: Conversão de Siglas, IDs do Mapa e Módulo de Previsão
*/

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

// 3.Botão Filtrar
document.getElementById('btnFiltrar').addEventListener('click', async () => {
    const periodo = document.getElementById('filtroPeriodo').value;
    const sigla = document.getElementById('filtroLocalidade').value;

    if (!periodo || !sigla) {
        alert("Por favor, selecione o Ano e o Estado!");
        return;
    }

    limparMapa();

    try {
        const resposta = await fetch(`http://localhost:3000/api/casos?ano=${periodo}&estado=${sigla}`);
        const dados = await resposta.json();

        if (dados && dados.total_casos !== null) {
            const total = Number(dados.total_casos);
            
            // Cálculos Epidemiológicos
            const incidencia = ((total / 150000) * 100000).toFixed(2);
            const variacao = total > 4000 ? "+15.2%" : "-4.5%";

            atualizarInterface(total.toLocaleString('pt-BR'), incidencia, variacao);
            atualizarModuloPrevisao(total);

            // Pintar o Estado Correto no Mapa
            const idEstado = dicionarioEstados[sigla];
            const elementoSvg = document.getElementById(idEstado);
            
            if (elementoSvg) {
                let corAlerta = total > 5000 ? "#ff4d4d" : (total > 1500 ? "#ff9f43" : "#18b47a");
                elementoSvg.style.fill = corAlerta;
            }
        } else {
            alert("Nenhum dado encontrado para esta seleção.");
            atualizarInterface("0", "0.00", "0%");
        }
    } catch (erro) {
        console.error("Erro na integração:", erro);
        alert("Erro ao conectar com o servidor do Victor!");
    }
});

// 4. Inicialização do Gráfico (Série Temporal)
window.onload = async () => {
    try {
        const resposta = await fetch('http://localhost:3000/api/grafico');
        const dadosApi = await resposta.json();
        if (typeof atualizarGraficoReal === "function") {
            atualizarGraficoReal(dadosApi.map(i => i.ano), dadosApi.map(i => i.total));
        }
    } catch (e) { console.error("Erro ao carregar gráfico:", e); }
};