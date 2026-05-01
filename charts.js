
// charts.js
// charts.js - Responsável por desenhar o gráfico

/* charts.js - Configuração visual dos gráficos */

const ctx = document.getElementById('graficoTemporal').getContext('2d');
let meuGrafico; // Variável global para controlar a instância do gráfico

function atualizarGraficoReal(labels, dados) {
    // Se o gráfico já existir na tela, nós o "destruímos" antes de criar o novo
    // Isso evita o erro de sobreposição (ficar um gráfico por cima do outro)
    if (meuGrafico) {
        meuGrafico.destroy();
    }

    meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Casos Confirmados (Série Histórica)',
                data: dados, 
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Formata os números no eixo Y para o padrão brasileiro
                        callback: function(value) {
                            return value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}