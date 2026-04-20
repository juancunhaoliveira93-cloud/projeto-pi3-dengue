/* Onde Juan vai colocar a lógica de fetch para buscar os dados da API.*/

// app.js - Atualizado para ler os novos filtros

document.getElementById('btnFiltrar').addEventListener('click', () => {
    // 1. Captura o que o usuário selecionou nas caixas que você preencheu
    const periodo = document.getElementById('filtroPeriodo').value;
    const localidade = document.getElementById('filtroLocalidade').value;

    // 2. Verifica se o usuário selecionou algo
    if (periodo === "" || localidade === "") {
        alert("Por favor, selecione um período e um estado!");
        return;
    }

    console.log(`Buscando dados reais de ${localidade} no ano de ${periodo}...`);
    
    // 3. Por enquanto, simulamos uma mudança nos cards
    // Quando o Victor entregar a API, os dados virão de lá
    if (localidade === "ES") {
        atualizarKPIs("12.450", "310 por 100k", "+5");
    } else {
        atualizarKPIs("45.800", "150 por 100k", "-2");
    }

    alert(`Dados de ${localidade} para o ano ${periodo} atualizados!`);
});