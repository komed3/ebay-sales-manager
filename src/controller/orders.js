import { filterOrders, getOrder, isOrder } from '../storage.js';

export function orders ( req, res ) {

    const { results, max } = filterOrders( req.query ?? {} );

    res.render( 'orders', {
        path: '/orders', title: 'Bestellungen',
        query: req.query ?? {},
        data: results,
        pagination: {
            limit: req.query?.limit || 32,
            offset: req.query?.offset || 0,
            max: max
        }
    } );

}

export function order ( req, res ) {

    const order = getOrder( req.query.uuid ?? '' );

    if ( isOrder( order ) ) res.render( 'order', {
        path: '/order', title: `Bestellung`,
        data: order
    } );

    else res.redirect( '/orders' );

}
