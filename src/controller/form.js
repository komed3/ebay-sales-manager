import { getCoordinates, sanitizeData, updateOrder } from '../storage.js';

export function form ( _, res ) { res.render( 'form', { path: '/form', title: 'Neue Bestellung' } ) }

export async function update ( req, res ) {

    const data = sanitizeData( req.body );
    const address = [
        data.customer?.address?.street,
        data.customer?.address?.zipCode,
        data.customer?.address?.city
    ].filter( Boolean ).join( ', ' );

    const coords = await getCoordinates( address );
    updateOrder( { ...data, ...{ location: coords } } );

    res.redirect( '/orders' );

}
