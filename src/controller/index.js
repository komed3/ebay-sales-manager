import { getUser } from '../storage.js';
import { login, logout, auth } from './auth.js';
import { customer, customers } from './customers.js';
import { dashboard } from './dashboard.js';
import { exportData } from './export.js';
import { form, trash, update } from './form.js';
import { map } from './map.js';
import { orders, order } from './orders.js';
import { report } from './report.js';
import { settings, updateSettings } from './settings.js';
import { stats } from './stats.js';
import express from 'express';

// Set up routes
const routes = [
    { paths: '{/}', controller: { get: dashboard } },
    { paths: '/login{/}', controller: { get: login, post: auth } },
    { paths: '/logout{/}', controller: { get: logout } },
    { paths: '/settings{/}', controller: { get: settings, post: updateSettings } },
    { paths: '/form{/}', controller: { get: form, post: update } },
    { paths: '/orders{/}', controller: { get: orders } },
    { paths: '/order{/}', controller: { get: order } },
    { paths: '/customers{/}', controller: { get: customers } },
    { paths: '/customer{/}', controller: { get: customer } },
    { paths: '/stats{/}', controller: { get: stats } },
    { paths: '/map{/}', controller: { get: map } },
    { paths: '/report{/}', controller: { get: report } },
    { paths: '/export{/}', controller: { get: exportData } },
    { paths: '/delete{/}', controller: { get: trash } }
];

// Init router
const router = express.Router();

// Ensure secured login
router.use( '/', ( req, res, next ) => {

    const isLoginPath = req.path.startsWith( '/login' );

    if ( ! req.session?.user && ! isLoginPath ) {
        return res.redirect( '/login/' );
    }

    next();

} );

// Expose current user settings globally for templates
router.use( ( req, res, next ) => {

    const nick = req.session?.user?.name;

    if ( nick ) {

        const user = getUser( nick );
        res.locals.currentUser = { name: nick, mail: user?.mail };
        res.locals.lang = user?.settings?.lang || 'de-DE';
        res.locals.currency = user?.settings?.currency || 'EUR';
        res.locals.layer = user?.settings?.layer || 'carto';

    } else {

        res.locals.currentUser = null;
        res.locals.lang = 'de-DE';
        res.locals.currency = 'EUR';
        res.locals.layer = 'carto';

    }

    next();

} );

// Routing paths
routes.forEach( ( route ) => {

    const { paths, controller: { get, post } } = route;

    if ( post ) router.post( paths, post );
    if ( get ) router.get( paths, get );

} );

// Handle unknown paths
router.get( '/{*splat}', ( _, res ) => res.redirect( '/' ) );

export { routes, router };
