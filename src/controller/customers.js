import { filterCustomers, getCustomer, isCustomer } from '../storage.js';

export function customers ( req, res ) {

    const { results, max } = filterCustomers( req.query ?? {} );

    res.render( 'customers', {
        path: '/customers', title: req.t( 'customers._meta.title' ),
        query: req.query ?? {},
        data: results,
        pagination: {
            limit: req.query?.limit || 32,
            offset: req.query?.offset || 0,
            max: max
        }
    } );

}

export function customer ( req, res ) {

    const customer = getCustomer( req.query.nick ?? '' );

    if ( isCustomer( customer ) ) res.render( 'customer', {
        path: '/customers', title: '@' + customer.data.nick,
        data: customer
    } );

    else res.redirect( '/customers' );

}
