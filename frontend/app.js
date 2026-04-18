/* Onde Juan vai colocar a lógica de fetch para buscar os dados da API.*/

// app.js

// 1. Função para atualizar os cards de KPI (que a Carine estilizou)
function atualizarKPIs(total, taxa, variacao) {
    document.getElementById('kpiTotalCasos').innerText = total.toLocaleString();
    document.getElementById('kpiTaxaIncidencia').innerText = taxa + ' por 100k';
    document.getElementById('kpiVariacao').innerText = variacao + '%';
}

// 2. Escutar o botão de filtro que está no index.html 
document.getElementById('btnFiltrar').addEventListener('click', () => {
    const periodo = document.getElementById('filtroPeriodo').value;
    const localidade = document.getElementById('filtroLocalidade').value;

    console.log(`Buscando dados para: ${periodo} em ${localidade}...`);
    
    // Por enquanto, apenas simula uma mudança de dados
    atualizarKPIs(15400, 245.8, +12);
});

// Inicialização com valores zerados
atualizarKPIs(0, 0, 0);