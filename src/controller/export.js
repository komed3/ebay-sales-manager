import { getCustomer, getOrder, getReport, isCustomer, isOrder } from '../storage.js';

export function exportData ( req, res ) {

    const { uuid, customer, report } = req.query;
    let filename, data;

    if ( uuid ) {

        if ( ! isOrder( data = getOrder( uuid ) ) ) return res.redirect( '/orders' );
        filename = `order-${uuid}.json`;

    } else if ( customer ) {

        if ( ! isCustomer( data = getCustomer( customer ) ) ) return res.redirect( '/customers' );
        filename = `customer-${customer}.json`;

    } else if ( report ) {

        if ( ! ( data = getReport( report ) ) ) return res.redirect( '/report' );
        filename = `report-${report}.json`;

    } else {

        return res.redirect( '/' );

    }

    // Generate JSON file and send as download
    res.setHeader( 'Content-Disposition', `attachment; filename="${filename}"` );
    res.setHeader( 'Content-Type', 'application/json; charset=utf-8' );
    res.send( JSON.stringify( data, null, 2 ) );

}
