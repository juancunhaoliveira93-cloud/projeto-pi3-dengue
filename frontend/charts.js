/* Onde Juan vai configurar os gráficos de série temporal e mapas.*/
// charts.js
// charts.js - Responsável por desenhar o gráfico

const ctx = document.getElementById('graficoTemporal').getContext('2d');

// Criamos a variável 'meuGrafico' fora para podermos atualizá-la depois
let meuGrafico;

function inicializarGrafico(labels, dados) {
    meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Ex: ['Jan', 'Fev', 'Mar']
            datasets: [{
                label: 'Casos Notificados',
                data: dados, // Ex: [500, 1200, 3000]
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tendência Epidemiológica da Dengue no Brasil'
                }
            }
        }
    });
}

// Inicializa com dados fictícios para você e a Carine testarem o layout
inicializarGrafico(['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], [100, 400, 900, 1500, 800]);