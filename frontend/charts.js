/* Onde Juan vai configurar os gráficos de série temporal e mapas.*/
// charts.js
const ctx = document.getElementById('graficoTemporal').getContext('2d');

// Dados fictícios para o Gustavo e Victor verem como o gráfico se comporta
const dadosIniciais = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
        label: 'Casos Notificados (2023)',
        data: [500, 1200, 3000, 4500, 2800, 1500], // Simulação de pico sazonal [cite: 13]
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};

const meuGrafico = new Chart(ctx, {
    type: 'line',
    data: dadosIniciais,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Tendência Epidemiológica da Dengue'
            }
        }
    }
});