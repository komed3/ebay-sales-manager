import { getOrderStats } from '../storage.js';

export function dashboard ( _, res ) {

    res.render( 'dashboard', {
        path: '/', title: 'Dashboard',
        stats: getOrderStats()
    } );

}
