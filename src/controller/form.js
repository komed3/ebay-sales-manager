import { getOrder, isOrder, updateOrder } from '../storage.js';

export function form ( req, res ) {

    const order = getOrder( req.query.uuid ?? '' );

    if ( ! req.query.uuid || isOrder( order ) ) res.render( 'form', {
        path: '/form', title: 'Neue Bestellung',
        data: order
    } );

    else res.redirect( '/form' );

}

export async function update ( req, res ) {

    await updateOrder( req.body, req.files );
    res.redirect( '/orders' );

}
