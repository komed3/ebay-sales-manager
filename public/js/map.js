document.addEventListener( 'DOMContentLoaded', function () {

    document.querySelectorAll( '.map-container' ).forEach( el => {

        const locations = JSON.parse( el.querySelector( '.mapdata' ).textContent );
        const container = el.querySelector( '.map' );

        const map = L.map( container ).setView( [ 51.163361, 10.447683 ], 6 );
        const markers = L.featureGroup();

        map.attributionControl.setPrefix( false );

        switch ( __set.layer ) {

            case 'carto':
                L.tileLayer( 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
                    subdomains: 'abcd',
                    attribution: '&copy; Copyright by Carto &amp; OSM',
                    minZoom: 5, maxZoom: 18
                } ).addTo( map );
                break;

            case 'osm':
                L.tileLayer( 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; Copyright by OSM',
                    minZoom: 5, maxZoom: 18
                } ).addTo( map );
                break;

        }

        locations.forEach( entry => {

            L.marker( [ entry.lat, entry.lon ], { icon: L.divIcon( {
                iconSize: [ 30, 30 ],
                className: 'map-marker',
                html: `<img src="/images/icons/${entry.type}.svg" alt="marker" />`
            } ) } ).bindPopup( `
                <b>#${entry.number}</b><br />
                ${entry.name}<br />${entry.address.street}<br />${entry.address.zipCode} ${entry.address.city}<br />
                <a href="${ new URL( '/order?uuid=' + entry.uuid, __url ).toString() }">Weitere Details</a>
            ` ).addTo( markers );

        } );

        markers.addTo( map );
        map.fitBounds( markers.getBounds(), {
            padding: [ 40, 40 ],
            maxZoom: 12
        } );

    } );

} );
