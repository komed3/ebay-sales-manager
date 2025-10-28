const __url = new URL( window.location.href );
const formatMoney = ( value ) => new Intl.NumberFormat( 'de-DE', { style: 'currency', currency: 'EUR' } ).format( value );
const formatDate = ( date ) => new Date( date ).toLocaleDateString( 'de-DE', { dateStyle: 'medium' } );

document.addEventListener( 'DOMContentLoaded', function () {

    document.querySelectorAll( 'money' ).forEach( el => {
        el.textContent = formatMoney( el.textContent );
    } );

    document.querySelectorAll( 'date' ).forEach( el => {
        el.textContent = formatDate( el.textContent );
    } );

} );
