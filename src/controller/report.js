import { getReport, getReportsList } from '../storage.js';

export function report ( req, res ) {

    const list = getReportsList();
    const report = getReport( req.query.month ?? '' );

    if ( ! report ) {

        if ( list.length ) res.redirect( '/report?month=' + list.at( -1 ) );
        else res.redirect( '/' );

    } else {

        const label = new Date( req.query.month + '-01' ).toLocaleDateString( 'de-DE', {
            month: 'long', year: 'numeric'
        } );

        res.render( 'report', {
            path: '/report', title: 'Finanzbericht für ' + label,
            list: list,
            report: {
                name: req.query.month,
                label: label,
                data: report
            }
        } );

    }

}
