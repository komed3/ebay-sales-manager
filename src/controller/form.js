import { getOrder, updateOrder } from '../storage.js';

export function form ( req, res ) {

    res.render( 'form', {
        path: '/form', title: 'Neue Bestellung',
        data: getOrder( req.query.uuid ?? '' )
    } );

}

export async function update ( req, res ) {

    await updateOrder( req.body );
    res.redirect( '/orders' );

}
