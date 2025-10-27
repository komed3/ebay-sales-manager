import { sanitizeData, updateOrder } from '../storage';

export function form ( _, res ) { res.render( 'form', { path: '/form', title: 'Neue Bestellung' } ) }

export function update ( req, res ) {

    const data = sanitizeData( req.body );
    updateOrder( data );

    res.redirect( '/orders' );

}
