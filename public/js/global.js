const __url = new URL( window.location.href );

const formatMoney = ( value ) => new Intl.NumberFormat( 'de-DE', { style: 'currency', currency: 'EUR' } ).format( value );
const formatPercent = ( value ) => new Intl.NumberFormat( 'de-DE', { style: 'percent', minimumFractionDigits: 1 } ).format( value );
const formatDate = ( date ) => new Date( date ).toLocaleDateString( 'de-DE', { dateStyle: 'medium' } );

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
