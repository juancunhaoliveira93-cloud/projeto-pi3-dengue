/* Onde Juan vai colocar a lógica de fetch para buscar os dados da API.*/

// app.js - Atualizado para ler os novos filtros

/* app.js - Lógica de integração com a API */

// 1. Função para atualizar os números nos cards (KPIs)
function atualizarKPIs(total, incidencia, variacao) {
    document.getElementById('kpiTotalCasos').innerText = total;
    document.getElementById('kpiTaxaIncidencia').innerText = incidencia;
    document.getElementById('kpiVariacao').innerText = variacao;
}

// 2. Evento do Botão Filtrar
document.getElementById('btnFiltrar').addEventListener('click', async () => {
    const periodo = document.getElementById('filtroPeriodo').value;
    const localidade = document.getElementById('filtroLocalidade').value;

    if (periodo === "" || localidade === "") {
        alert("Por favor, selecione um período e um estado!");
        return;
    }

    console.log(`Buscando dados reais na API para: ${localidade} em ${periodo}...`);

    try {
        // Chamada para a API do Victor (Rodando no servidor local)
        const resposta = await fetch(`http://localhost:3000/api/casos?ano=${periodo}&estado=${localidade}`);
        
        if (!resposta.ok) throw new Error("Erro na rede");
        
        const dados = await resposta.json();

        if (dados && dados.total_casos !== null) {
            const totalFormatado = Number(dados.total_casos).toLocaleString('pt-BR');
            // Atualiza os cards com os dados reais
            atualizarKPIs(totalFormatado, "Calculando...", "Verificando...");
        } else {
            atualizarKPIs("0", "N/A", "0%");
            alert("Nenhum dado encontrado para essa seleção.");
        }

    } catch (erro) {
        console.error("Erro ao buscar dados da API:", erro);
        alert("Erro: Verifique se o Victor ligou o servidor (node server.js).");
    }
});

// 3. Função para carregar os dados do gráfico ao abrir a página
async function carregarDadosGrafico() {
    try {
        const resposta = await fetch('http://localhost:3000/api/grafico');
        const dadosApi = await resposta.json();

        // Mapeia os dados para o formato do Chart.js
        const anos = dadosApi.map(item => item.ano);
        const totais = dadosApi.map(item => item.total);

        // Chama a função que está no outro arquivo (charts.js)
        atualizarGraficoReal(anos, totais);

    } catch (erro) {
        console.error("Erro ao carregar gráfico inicial:", erro);
    }
}

// Inicializa o gráfico assim que a página termina de carregar
window.onload = carregarDadosGrafico;