import { getOrders } from '../storage.js';
import countries from 'i18n-iso-countries';

export function map ( req, res ) {

    const locations = getOrders().map( o => o.location ? {
        ...o.location, ...{
            type: o.orderType, uuid: o.__uuid,
            number: o.orderNumber,
            name: o.customer.name,
            address: o.customer.address,
            country: countries.getName(
                o.customer.address.country,
                res.locals.langISO,
                { select: 'official' }
            )
        }
    } : null ).filter( Boolean );

    res.render( 'map', {
        path: '/map', title: req.t( 'map._meta.title' ),
        data: locations
    } );

}
