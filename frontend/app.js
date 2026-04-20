/* Onde Juan vai colocar a lógica de fetch para buscar os dados da API.*/

// app.js - Responsável pela lógica e botões

// 1. Função para atualizar os cards de texto (KPIs)
function atualizarKPIs(total, taxa, variacao) {
    // Esses IDs devem ser iguais aos que estão no seu index.html
    document.getElementById('kpiTotalCasos').innerText = total.toLocaleString();
    document.getElementById('kpiTaxaIncidencia').innerText = taxa;
    document.getElementById('kpiVariacao').innerText = variacao + '%';
}

// 2. Lógica do Botão de Filtro
document.getElementById('btnFiltrar').addEventListener('click', () => {
    const periodo = document.getElementById('filtroPeriodo').value;
    const localidade = document.getElementById('filtroLocalidade').value;

    console.log("Filtro acionado para:", localidade, periodo);
    
    // Por enquanto, apenas simulamos uma mudança para teste
    // No futuro, aqui chamaremos a API do Victor
    atualizarKPIs(5000, "150 por 100k", "+10");
    alert("Buscando dados de " + localidade + "... (Aguardando API do Victor)");
});

// Valores iniciais ao carregar a página
atualizarKPIs(0, 0, 0);