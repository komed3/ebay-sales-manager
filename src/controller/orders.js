import { getOrder, getOrders, isOrder } from '../storage.js';

export function orders ( req, res ) {

    res.render( 'orders', {
        path: '/orders', title: 'Bestellungen',
        query: req.query ?? {},
        data: getOrders( req.query ?? {} )
    } );

}

export function order ( req, res ) {

    const order = getOrder( req.query.uuid ?? '' );

    if ( isOrder( order ) ) res.render( 'orders', {
        path: '/order', title: order.orderNumber,
        data: order
    } );

    else res.redirect( '/orders' );

}
