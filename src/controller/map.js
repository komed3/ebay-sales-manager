import { getOrders } from '../storage.js';

export function map ( _, res ) {

    const locations = getOrders().map( o => o.location ? {
        ...o.location, ...{ type: o.orderType, uuid: o.__uuid }
    } : null ).filter( Boolean );

    res.render( 'map', {
        path: '/map', title: 'Karte',
        data: locations
    } );

}
