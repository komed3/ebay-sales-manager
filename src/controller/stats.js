import { getAnnualReports, getOrderDates, getOrderStats, getReports } from '../storage.js';

export function stats ( req, res ) {

    const query = { ...{ type: 'monthly' }, ...req.query };

    res.render( 'stats', {
        path: '/stats', title: 'Statistik',
        query: query,
        reports: query.type === 'annual' ? getAnnualReports() : getReports(),
        stats: getOrderStats(),
        dates: getOrderDates()
    } );

}
