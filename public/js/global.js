const __url = new URL( window.location.href );
const __set = { lang: 'en-US', currency: 'EUR', layer: 'carto' };

const formatMoney = ( value, d = 2 ) => new Intl.NumberFormat( __set.lang, {
    style: 'currency', currency: __set.currency, minimumFractionDigits: d
} ).format( value );

const formatPercent = ( value, d = 1 ) => new Intl.NumberFormat( __set.lang, {
    style: 'percent', minimumFractionDigits: d
} ).format( value );

const formatDate = ( date ) => new Date( date ).toLocaleDateString( __set.lang, {
    dateStyle: 'medium'
} );

document.addEventListener( 'DOMContentLoaded', function () {

    __set.lang = document.documentElement.lang || __set.lang;
    __set.currency = document.documentElement.getAttribute( 'currency' ) || __set.currency;
    __set.layer = document.documentElement.getAttribute( 'layer' ) || __set.layer;

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
