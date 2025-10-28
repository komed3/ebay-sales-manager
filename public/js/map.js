document.addEventListener( 'DOMContentLoaded', function () {

    document.querySelectorAll( '.map-container' ).forEach( el => {

        const locations = JSON.parse( el.querySelector( '.mapdata' ).textContent );
        const container = el.querySelector( '.map' );

        const map = L.map( container ).setView( [ 51.163361, 10.447683 ], 6 );
        map.attributionControl.setPrefix( false );

        L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        } ).addTo( map );

    } );

} );
