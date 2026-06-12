/* map.js - Gerenciador do Mapa do Brasil com Apache ECharts */

let graficoMapa = null;

/**
 * Inicializa o mapa com o GeoJSON fornecido e associa o callback de clique.
 * @param {Object} geojson - O GeoJSON do Brasil.
 * @param {Function} onEstadoClick - Função chamada ao clicar em um estado (retorna a sigla).
 */
function inicializarMapa(geojson, onEstadoClick) {
    const container = document.getElementById('mapaBrasil');
    if (!container) return;

    // Remover qualquer placeholder antigo ou conteúdo anterior
    container.innerHTML = '<div id="mapaEchartsContainer"></div>';

    const dom = document.getElementById('mapaEchartsContainer');
    graficoMapa = echarts.init(dom, 'dark', { renderer: 'canvas', useDirtyRect: false });

    // Registrar o mapa do Brasil com o ECharts
    echarts.registerMap('brasil', geojson);

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(11, 23, 44, 0.95)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            textStyle: {
                color: '#eef4ff',
                fontFamily: 'Inter, sans-serif'
            },
            formatter: function (params) {
                if (!params.data) {
                    return `<strong>${params.name}</strong><br/>Sem dados registrados.`;
                }
                const dados = params.data;
                return `
                    <div style="padding: 4px 8px;">
                        <strong style="font-size: 1rem; color: #fff; display: block; margin-bottom: 6px;">
                            ${dados.estadoNome} (${dados.name})
                        </strong>
                        <span style="color: #9db0d4; display: block; font-size: 0.85rem; margin-bottom: 2px;">
                            • Casos: <strong style="color: #fff">${dados.casos.toLocaleString('pt-BR')}</strong>
                        </span>
                        <span style="color: #9db0d4; display: block; font-size: 0.85rem; margin-bottom: 2px;">
                            • Incidência: <strong style="color: #47b2ff">${dados.value.toFixed(2)}</strong> <small style="font-size: 0.75rem">/100k hab</small>
                        </span>
                        <span style="color: #9db0d4; display: block; font-size: 0.85rem;">
                            • População: <strong style="color: #e6efff">${(dados.populacao / 1000000).toFixed(2)}M</strong>
                        </span>
                    </div>`;
            }
        },
        visualMap: {
            show: true,
            type: 'piecewise',
            left: 'left',
            bottom: 'bottom',
            backgroundColor: 'rgba(11, 23, 44, 0.5)',
            padding: 12,
            borderRadius: 12,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            textStyle: {
                color: '#9db0d4',
                fontFamily: 'Inter, sans-serif',
                fontSize: 11
            },
            pieces: [
                { min: 500, label: 'Alto Risco (>= 500)', color: '#ff4d4d' },
                { min: 100, max: 499.99, label: 'Médio Risco (100 - 500)', color: '#ff9f43' },
                { min: 0.01, max: 99.99, label: 'Baixo Risco (< 100)', color: '#18b47a' },
                { value: 0, label: 'Sem registros / Zerado', color: '#334155' }
            ],
            outOfRange: {
                color: '#334155'
            }
        },
        series: [
            {
                name: 'Incidência de Dengue',
                type: 'map',
                map: 'brasil',
                nameProperty: 'sigla', // Mapeia os dados usando a propriedade 'sigla' do GeoJSON
                roam: true, // Permitir zoom e pan
                scaleLimit: {
                    min: 0.8,
                    max: 2.5
                },
                label: {
                    show: true,
                    color: '#eef4ff',
                    fontSize: 9,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 'bold',
                    formatter: '{b}' // Mostra a sigla do estado
                },
                itemStyle: {
                    areaColor: '#334155',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderWidth: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 4
                },
                emphasis: {
                    label: {
                        show: true,
                        color: '#fff',
                        fontSize: 11
                    },
                    itemStyle: {
                        areaColor: '#2f6fff',
                        borderColor: '#ffffff',
                        borderWidth: 1.5,
                        shadowBlur: 10,
                        shadowColor: 'rgba(47, 111, 255, 0.6)'
                    }
                },
                data: []
            }
        ]
    };

    graficoMapa.setOption(option);

    // Evento de clique
    graficoMapa.on('click', function (params) {
        if (params.name && onEstadoClick) {
            onEstadoClick(params.name);
        }
    });

    // Responsividade
    window.addEventListener('resize', function () {
        if (graficoMapa) {
            graficoMapa.resize();
        }
    });
}

/**
 * Atualiza os dados exibidos no mapa.
 * @param {Array} dadosUFs - Array de objetos no formato: { name: 'UF', value: incidencia, casos: X, populacao: Y, estadoNome: 'Nome' }
 */
function atualizarDadosMapa(dadosUFs) {
    if (!graficoMapa) return;

    graficoMapa.setOption({
        series: [
            {
                data: dadosUFs
            }
        ]
    });
}

/**
 * Destaca visualmente um estado selecionado no mapa por sua sigla.
 * @param {string} sigla - Sigla do estado a ser destacado (ex: 'SP').
 */
function destacarEstadoNoMapa(sigla) {
    if (!graficoMapa) return;

    // Remove destaque anterior de todos os estados
    graficoMapa.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
    });

    if (sigla) {
        // Destaca o estado específico
        graficoMapa.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: sigla
        });
    }
}
