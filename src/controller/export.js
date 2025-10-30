import { getCustomer, getOrder, getReport, isCustomer, isOrder } from '../storage.js';

export function exportData ( req, res ) {

    if ( req.query.uuid ) {

        const order = getOrder( req.query.uuid );

        if ( isOrder( order ) ) res.json( order );
        else res.redirect( '/orders' );

    } else if ( req.query.customer ) {

        const customer = getCustomer( req.query.customer );

        if ( isCustomer( customer ) ) res.json( customer );
        else res.redirect( '/customers' );

    } else if ( req.query.report ) {

        const report = getReport( req.query.report );
        if ( report ) res.json( report );
        else res.redirect( '/report' );

    } else {

        res.redirect( '/' );

    }

}
