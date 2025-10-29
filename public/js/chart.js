function renderReportChart ( ctx, data ) {

    const labels = [];
    const totalShipping = [];
    const totalFees = [];
    const totalRefund = [];
    const totalProfit = [];
    const profitMargin = [];

    for ( const [ label, row ] of Object.entries( data ) ) {

        labels.push( label );
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
                label: 'Gewinnmarge (%)',
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
                backgroundColor: '#9f73ad',
                hoverBackgroundColor: '#9f73ad',
                borderWidth: 0
            }, {
                data: totalFees,
                stack: 'finances',
                label: 'Verkaufsgebühren',
                backgroundColor: '#da6f88',
                hoverBackgroundColor: '#da6f88',
                borderWidth: 0
            }, {
                data: totalRefund,
                stack: 'finances',
                label: 'Rückerstattungen',
                backgroundColor: '#cfa75c',
                hoverBackgroundColor: '#cfa75c',
                borderWidth: 0
            }, {
                data: totalProfit,
                stack: 'finances',
                label: 'Gewinn / Einnahmen',
                backgroundColor: '#4cb96d',
                hoverBackgroundColor: '#4cb96d',
                borderWidth: 0
            } ]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    titleColor: '#000',
                    bodyColor: '#000',
                    backgroundColor: '#fff',
                    borderColor: '#d5d6d7',
                    borderWidth: 1,
                    callbacks: {
                        title: ctx => ctx[ 0 ].label.replace( '-', ' / ' ),
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
            ticks: { color: 'var(--text-muted)', font: { family: 'var(--font-sans)' } },
            grid: { display: false }
            },
            y: {
            stacked: true,
            beginAtZero: true,
            ticks: { color: 'var(--text-muted)', font: { family: 'var(--font-sans)' }, callback: v => v + ' €' },
            grid: { color: 'rgba(0,0,0,0.05)' }
            },
            y2: {
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false },
            ticks: { color: 'var(--green)', callback: v => v + '%' }
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
    Chart.defaults.interaction = { mode: 'index', intersect: false };

    Chart.defaults.font.family = 'SUSE, sans-serif';
    Chart.defaults.font.size = 15;
    Chart.defaults.font.weight = 400;
    Chart.defaults.color = '#000';

    document.querySelectorAll( '.chart-container' ).forEach( el => {

        const data = JSON.parse( el.querySelector( '.chartdata' ).textContent );
        const ctx = el.querySelector( '.chart' );

        switch ( el.getAttribute( 'chart-type' ) ) {
            case 'report': renderReportChart( ctx, data ); break;
        }

    } );

} );
