import { getOrderStats } from '../storage.js';

export function dashboard ( req, res ) {

    res.render( 'dashboard', {
        path: '/', title: req.t( 'dashboard._meta.title' ),
        stats: getOrderStats()
    } );

}
