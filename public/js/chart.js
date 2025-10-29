function renderReportChart ( ctx, data ) {

    data = Object.fromEntries( Object.entries( data ).reverse().slice( 0, 24 ).reverse() );

    const labels = [];
    const totalShipping = [];
    const totalFees = [];
    const totalRefund = [];
    const totalProfit = [];
    const profitMargin = [];

    for ( const [ label, row ] of Object.entries( data ) ) {

        labels.push( label.replaceAll( '-', '/' ) );
        totalShipping.push( row.totalShipping );
        totalFees.push( row.totalFees );
        totalRefund.push( row.totalRefund );
        totalProfit.push( row.totalProfit );
        profitMargin.push( row.profitMargin );

    }

    new Chart( ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [ {
                data: profitMargin,
                type: 'line',
                yAxisID: 'y2',
                label: 'Gewinnmarge',
                pointRadius: 6,
                pointHoverRadius: 6,
                tension: 0.3,
                backgroundColor: '#fff',
                hoverBackgroundColor: '#fff',
                borderColor: '#000',
                borderWidth: 2,
                hoverBorderWidth: 2
            }, {
                data: totalShipping,
                stack: 'finances',
                label: 'Versandkosten',
                backgroundColor: '#ffbb00',
                hoverBackgroundColor: '#ffbb00',
                borderWidth: 0
            }, {
                data: totalFees,
                stack: 'finances',
                label: 'Gebühren',
                backgroundColor: '#fb6542',
                hoverBackgroundColor: '#fb6542',
                borderWidth: 0
            }, {
                data: totalRefund,
                stack: 'finances',
                label: 'Erstattungen',
                backgroundColor: '#698bbe',
                hoverBackgroundColor: '#698bbe',
                borderWidth: 0
            }, {
                data: totalProfit,
                stack: 'finances',
                label: 'Gewinn',
                backgroundColor: '#78ac4c',
                hoverBackgroundColor: '#78ac4c',
                borderWidth: 0
            } ]
        },
        options: {
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 15 },
                        boxWidth: 24
                    }
                },
                tooltip: {
                    padding: { top: 10, left: 12, right: 16, bottom: 10 },
                    titleColor: '#000',
                    bodyColor: '#000',
                    backgroundColor: '#fff',
                    borderColor: '#d5d6d7',
                    borderWidth: 1,
                    cornerRadius: 5,
                    boxPadding: 4,
                    callbacks: {
                        label: ctx => `${ ctx.dataset.label }: ${ ( ctx.datasetIndex == 0
                            ? formatPercent( ctx.raw / 100 )
                            : formatMoney( ctx.raw )
                        ) }`
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false },
                    border: { color: '#d5d6d7' }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { maxTicksLimit: 8, callback: v => formatMoney( v, 0 ) },
                    grid: { color: '#d5d6d7' },
                    border: { dash: [ 5, 5 ], color: '#d5d6d7' }
                },
                y2: {
                    position: 'right',
                    min: 0, max: 100,
                    ticks: { maxTicksLimit: 6, callback: v => formatPercent( v / 100, 0 ) },
                    grid: { drawOnChartArea: false, color: '#d5d6d7' },
                    border: { color: '#d5d6d7' }
                }
            }
        }
    } );

}

function renderMarginChart ( ctx, data ) {

    new Chart( ctx, {
        type: 'doughnut',
        data: {
            datasets: [ {
                data: [
                    { x: 'Versand', value: data.shippingRevenue },
                    { x: 'Abholung', value: data.pickupRevenue }
                ],
                backgroundColor: [ '#2f88ff', '#1060d6' ],
                hoverBackgroundColor: [ '#2f88ff', '#1060d6' ],
                borderColor: '#fff',
                hoverBorderColor: '#fff',
                borderWidth: 3,
                borderRadius: 12
            }, {
                data: [
                    { x: 'Gewinn', value: data.totalProfit },
                    { x: 'Versandkosten', value: data.totalShipping },
                    { x: 'Gebühren', value: data.totalFees },
                    { x: 'Rückerstattung', value: data.totalRefund }
                ],
                backgroundColor: [ '#78ac4c', '#ffbb00', '#fb6542', '#698bbe' ],
                hoverBackgroundColor: [ '#78ac4c', '#ffbb00', '#fb6542', '#698bbe' ],
                borderColor: '#fff',
                hoverBorderColor: '#fff',
                borderWidth: 3,
                borderRadius: 12
            }, {
                data: [
                    { x: 'Profitmarge', value: data.profitMargin },
                    { value: 100 - data.profitMargin }
                ],
                backgroundColor: [ '#000', 'rgba( 0 0 0 / 0 )' ],
                hoverBackgroundColor: [ '#000', 'rgba( 0 0 0 / 0 )' ],
                borderColor: '#fff',
                hoverBorderColor: '#fff',
                borderWidth: 3,
                borderRadius: 12
            } ]
        },
        options: {
            cutout: '40%',
            plugins: {
                legend: {
                    position: 'left',
                    labels: {
                        font: { size: 15 },
                        boxWidth: 24,
                        generateLabels: () => [
                            { text: 'Versand', fillStyle: '#2f88ff' },
                            { text: 'Abholung', fillStyle: '#1060d6' },
                            { text: 'Gewinn', fillStyle: '#78ac4c' },
                            { text: 'Versandkosten', fillStyle: '#ffbb00' },
                            { text: 'Gebühren', fillStyle: '#fb6542' },
                            { text: 'Rückerstattung', fillStyle: '#698bbe' },
                            { text: 'Profitmarge', fillStyle: '#000' }
                        ]
                    }
                },
                tooltip: {
                    padding: { top: 10, left: 12, right: 16, bottom: 10 },
                    titleColor: '#000',
                    bodyColor: '#000',
                    backgroundColor: '#fff',
                    borderColor: '#d5d6d7',
                    borderWidth: 1,
                    cornerRadius: 5,
                    boxPadding: 4,
                    filter: ctx => ! ( ctx.datasetIndex == 2 && ctx.dataIndex == 1 ),
                    callbacks: {
                        label: ctx => `${ ctx.raw.x }: ${ ( ctx.datasetIndex == 2
                            ? formatPercent( ctx.raw.value / 100 )
                            : formatMoney( ctx.raw.value )
                        ) }`
                    }
                }
            }
        }
    } );

}

document.addEventListener( 'DOMContentLoaded', function () {

    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.offset = true;
    Chart.defaults.clip = false;
    Chart.defaults.layout.padding = 6;
    Chart.defaults.animation = false;

    Chart.defaults.font.family = 'SUSE, sans-serif';
    Chart.defaults.font.size = 14;
    Chart.defaults.font.weight = 400;
    Chart.defaults.color = '#000';

    document.querySelectorAll( '.chart-container' ).forEach( el => {

        const data = JSON.parse( el.querySelector( '.chartdata' ).textContent );
        const ctx = el.querySelector( '.chart' );

        switch ( el.getAttribute( 'chart-type' ) ) {
            case 'report': renderReportChart( ctx, data ); break;
            case 'margin': renderMarginChart( ctx, data ); break;
        }

    } );

} );
