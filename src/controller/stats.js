import { getAnnualReports, getMonthlyReports, getOrderDates, getOrderStats } from '../storage.js';

export function stats ( req, res ) {

    const query = { ...{ type: 'monthly' }, ...req.query };

    res.render( 'stats', {
        path: '/stats', title: req.t( 'stats._meta.title' ),
        query: query,
        reports: query.type === 'annual' ? getAnnualReports() : getMonthlyReports(),
        stats: getOrderStats(),
        dates: getOrderDates()
    } );

}
