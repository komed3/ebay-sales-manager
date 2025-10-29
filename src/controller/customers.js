import { getCustomer, isCustomer } from '../storage.js';

export function customers ( _, res ) {

    res.render( 'customers', {
        path: '/customers', title: 'Kunden'
    } );

}

export function customer ( req, res ) {

    const customer = getCustomer( req.query.nick ?? '' );

    if ( isCustomer( customer ) ) res.render( 'customer', {
        path: '/customers', title: '@' + customer.data.nick,
        data: customer
    } );

    else res.redirect( '/orders' );

}
