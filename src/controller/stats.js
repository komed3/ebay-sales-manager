import { getOrderDates, getOrderStats } from '../storage.js';

export function stats ( _, res ) {

    res.render( 'stats', {
        path: '/stats', title: 'Statistik',
        stats: getOrderStats(),
        dates: getOrderDates()
    } );

}
