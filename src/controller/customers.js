export function customers ( _, res ) {

    res.render( 'customers', {
        path: '/customers', title: 'Kunden'
    } );

}

export function customer ( _, res ) {

    res.render( 'customer', {
        path: '/customer', title: ''
    } );

}
