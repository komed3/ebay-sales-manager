import { getOrderDates, getOrderStats, getReports } from '../storage.js';

export function stats ( _, res ) {

    res.render( 'stats', {
        path: '/stats', title: 'Statistik',
        reports: getReports(),
        stats: getOrderStats(),
        dates: getOrderDates()
    } );

}
