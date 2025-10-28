import { filterOrders, getOrder, isOrder } from '../storage.js';

export function orders ( req, res ) {

    res.render( 'orders', {
        path: '/orders', title: 'Bestellungen',
        query: req.query ?? {},
        data: filterOrders( req.query ?? {} )
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
