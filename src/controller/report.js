import { getReport, getReportsList } from '../storage.js';

export function report ( req, res ) {

    const list = getReportsList();
    const report = getReport( req.query.month ?? '' );

    if ( ! report ) {

        if ( list.length ) res.redirect( '/report?month=' + list[ 0 ] );
        else res.redirect( '/' );

    } else {

        const label = new Date( req.query.month + '-01' ).toLocaleDateString( res.locals.lang, {
            month: 'long', year: 'numeric'
        } );

        res.render( 'report', {
            path: '/report', title: req.t( 'report.title', { report: label } ),
            list: list,
            report: {
                name: req.query.month,
                label: label,
                data: report
            }
        } );

    }

}
