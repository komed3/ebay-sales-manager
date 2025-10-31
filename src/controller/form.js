import { deleteOrder, getOrder, isOrder, updateOrder } from '../storage.js';
import countries from 'i18n-iso-countries';

export function form ( req, res ) {

    const order = getOrder( req.query.uuid ?? '' );

    if ( ! req.query.uuid || isOrder( order ) ) res.render( 'form', {
        path: '/form', title: req.t( 'form._meta.title' ),
        countries: countries.getNames( res.locals.langISO, { select: 'official' } ),
        data: order
    } );

    else res.redirect( '/form' );

}

export async function update ( req, res ) {

    const uuid = await updateOrder( req.body, req.files );
    res.redirect( '/order?uuid=' + uuid );

}

export function trash ( req, res ) {

    deleteOrder( req.query.uuid ?? '' );
    res.redirect( '/orders' );

}
