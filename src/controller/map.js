import { getOrders } from '../storage.js';

export function map ( req, res ) {

    const locations = getOrders().map( o => o.location ? {
        ...o.location, ...{
            type: o.orderType, uuid: o.__uuid,
            number: o.orderNumber,
            name: o.customer.name,
            address: o.customer.address
        }
    } : null ).filter( Boolean );

    res.render( 'map', {
        path: '/map', title: req.t( 'map._meta.title' ),
        data: locations
    } );

}
