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
                label: I18N.chart.margin,
                pointRadius: 6,
                pointHoverRadius: 6,
                tension: 0.3,
                backgroundColor: '#fff',
                hoverBackgroundColor: '#fff',
                borderColor: '#000',
                borderWidth: 2,
                hoverBorderWidth: 2,
                clip: false
            }, {
                data: totalShipping,
                stack: 'finances',
                label: I18N.chart.shippingCosts,
                backgroundColor: '#ffbb00',
                hoverBackgroundColor: '#ffbb00',
                borderWidth: 0
            }, {
                data: totalFees,
                stack: 'finances',
                label: I18N.chart.fees,
                backgroundColor: '#fb6542',
                hoverBackgroundColor: '#fb6542',
                borderWidth: 0
            }, {
                data: totalRefund,
                stack: 'finances',
                label: I18N.chart.refund,
                backgroundColor: '#698bbe',
                hoverBackgroundColor: '#698bbe',
                borderWidth: 0
            }, {
                data: totalProfit,
                stack: 'finances',
                label: I18N.chart.profit,
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
                    { x: I18N.chart.shipping, value: data.shippingRevenue },
                    { x: I18N.chart.pickup, value: data.pickupRevenue }
                ],
                backgroundColor: [ '#2f88ff', '#1060d6' ],
                hoverBackgroundColor: [ '#2f88ff', '#1060d6' ],
                borderColor: '#fff',
                hoverBorderColor: '#fff',
                borderWidth: 3,
                borderRadius: 12
            }, {
                data: [
                    { x: I18N.chart.profit, value: data.totalProfit },
                    { x: I18N.chart.shippingCosts, value: data.totalShipping },
                    { x: I18N.chart.fees, value: data.totalFees },
                    { x: I18N.chart.refund, value: data.totalRefund }
                ],
                backgroundColor: [ '#78ac4c', '#ffbb00', '#fb6542', '#698bbe' ],
                hoverBackgroundColor: [ '#78ac4c', '#ffbb00', '#fb6542', '#698bbe' ],
                borderColor: '#fff',
                hoverBorderColor: '#fff',
                borderWidth: 3,
                borderRadius: 12
            }, {
                data: [
                    { x: I18N.chart.margin, value: data.profitMargin },
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
                            { text: I18N.chart.shipping, fillStyle: '#2f88ff' },
                            { text: I18N.chart.pickup, fillStyle: '#1060d6' },
                            { text: I18N.chart.profit, fillStyle: '#78ac4c' },
                            { text: I18N.chart.shippingCosts, fillStyle: '#ffbb00' },
                            { text: I18N.chart.fees, fillStyle: '#fb6542' },
                            { text: I18N.chart.refund, fillStyle: '#698bbe' },
                            { text: I18N.chart.margin, fillStyle: '#000' }
                        ]
                    }
                },
                tooltip: {
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

function renderFlowChart ( ctx, data ) {

    const labels = {
        order: { label: 'Bestellung', color: '#ccc' },
        shipping: { label: 'Versand', color: '#89b5f6' },
        pickup: { label: 'Abholung', color: '#89b5f6' },
        profit: { label: 'Gewinn', color: '#9fc67e' },
        shippingCost: { label: 'Versandkosten', color: '#ffcf4d' },
        fees: { label: 'Gebühren', color: '#fda28d' },
        refund: { label: 'Rückerstattung', color: '#c2d0e4' }
    };

    const flowMap = new Map();

    function addFlow ( from, to, flow ) {

        const key = `${from}-${to}`;

        if ( flowMap.has( key ) ) flowMap.get( key ).flow += flow;
        else flowMap.set( key, { from, to, flow } );

    }

    for ( const o of data ) {

        addFlow( '#' + o.orderNumber, o.orderType, o.revenue );

        if ( o.profit > 0 ) addFlow( o.orderType, 'profit', o.profit );
        if ( o.shipping > 0 ) addFlow( o.orderType, 'shippingCost', o.shipping );
        if ( o.fees > 0 ) addFlow( o.orderType, 'fees', o.fees );
        if ( o.refund > 0 ) addFlow( o.orderType, 'refund', o.refund );

    }

    const flows = Array.from( flowMap.values() );

    new Chart( ctx, {
        type: 'sankey',
        data: {
            datasets: [ {
                label: 'Bestellungen',
                labels: Object.fromEntries(
                    Object.entries( labels ).map( ( [ k, v ] ) => [ k, v.label ] )
                ),
                data: flows,
                colorFrom: c => labels[ c.raw.from ]?.color || '#ccc',
                colorTo: c => labels[ c.raw.to ]?.color || '#ccc',
                hoverColorFrom: c => labels[ c.raw.from ]?.color || '#ccc',
                hoverColorTo: c => labels[ c.raw.to ]?.color || '#ccc',
                colorMode: 'gradient',
                alpha: 1,
                nodeWidth: 20,
                nodePadding: 10,
                borderColor: '#fff',
                borderWidth: 16,
                font: { weight: 'bold' }
            } ]
        },
        options: {
            plugins: {
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: ctx => `${ labels[ ctx.raw.to ]?.label ?? ctx.raw.to }: ${ formatMoney( ctx.raw.flow ) }`
                    }
                }
            }
        }
    } );

}

document.addEventListener( 'DOMContentLoaded', function () {

    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.offset = false;
    Chart.defaults.layout.padding = 0;

    Chart.defaults.font.family = 'SUSE, sans-serif';
    Chart.defaults.font.size = 14;
    Chart.defaults.font.weight = 400;
    Chart.defaults.color = '#000';

    Chart.defaults.transitions = { active: { animation: { duration: 0 } } };
    Chart.defaults.animations = {
        x: { duration: 0 },
        y: { duration: 150, easing: 'easeOutBack' }
    };

    Chart.defaults.plugins.tooltip.padding = { top: 10, left: 12, right: 16, bottom: 10 };
    Chart.defaults.plugins.tooltip.animation = { duration: 150, easing: 'easeOutBack' };
    Chart.defaults.plugins.tooltip.titleColor = '#000';
    Chart.defaults.plugins.tooltip.bodyColor = '#000';
    Chart.defaults.plugins.tooltip.backgroundColor = '#fff';
    Chart.defaults.plugins.tooltip.borderColor = '#d5d6d7';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 5;
    Chart.defaults.plugins.tooltip.boxPadding = 4;

    document.querySelectorAll( '.chart-container' ).forEach( el => {

        const data = JSON.parse( el.querySelector( '.chartdata' ).textContent );
        const type = el.getAttribute( 'chart-type' );
        const ctx = el.querySelector( '.chart' );

        ctx.classList.add( type );

        switch ( type ) {
            case 'report': renderReportChart( ctx, data ); break;
            case 'margin': renderMarginChart( ctx, data ); break;
            case 'flow': renderFlowChart( ctx, data ); break;
        }

    } );

} );
