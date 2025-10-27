import { getCoordinates, getOrderData, sanitizeData, updateOrder } from '../storage.js';

export function form ( req, res ) {

    res.render( 'form', {
        path: '/form', title: 'Neue Bestellung',
        data: getOrderData( req.query.uuid ?? '' )
    } );

}

export async function update ( req, res ) {

    const data = sanitizeData( req.body );
    const coords = await getCoordinates( [
        data.customer?.address?.street,
        data.customer?.address?.zipCode,
        data.customer?.address?.city
    ].filter( Boolean ).join( ', ' ) );

    updateOrder( { ...data, ...{ location: coords } } );
    res.redirect( '/orders' );

}
