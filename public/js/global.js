const __url = new URL( window.location.href );

const formatMoney = ( value, d = 2 ) => new Intl.NumberFormat( 'de-DE', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: d
} ).format( value );

const formatPercent = ( value, d = 1 ) => new Intl.NumberFormat( 'de-DE', {
    style: 'percent', minimumFractionDigits: d
} ).format( value );

const formatDate = ( date ) => new Date( date ).toLocaleDateString( 'de-DE', {
    dateStyle: 'medium'
} );

document.addEventListener( 'DOMContentLoaded', function () {

    document.querySelectorAll( 'money' ).forEach( el => {
        el.textContent = formatMoney( el.textContent );
    } );

    document.querySelectorAll( 'pct' ).forEach( el => {
        const value = parseFloat( el.textContent );
        el.textContent = formatPercent( Math.abs( value ) > 1 ? value / 100 : value );
    } );

    document.querySelectorAll( 'date' ).forEach( el => {
        el.textContent = formatDate( el.textContent );
    } );

} );
