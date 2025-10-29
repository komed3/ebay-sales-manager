import { getReport, getReportsList } from '../storage.js';

export function reports ( req, res ) {

    const list = getReportsList();
    const report = getReport( req.query.month ?? '' );

    if ( ! report ) {

        if ( list.length ) res.redirect( '/reports?month=' + list.at( -1 ) );
        else res.redirect( '/' );

    } else {

        res.render( 'reports', {
            path: '/reports', title: 'Reporte & Export',
            list: list,
            report: {
                name: req.query.month,
                label: new Date( req.query.month + '-01' ).toLocaleDateString( 'de-DE', {
                    month: 'long', year: 'numeric'
                } ),
                data: report
            }
        } );

    }

}
