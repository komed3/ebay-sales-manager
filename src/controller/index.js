import { login, logout, auth } from './auth.js';
import { commission } from './commission.js';
import { dashboard } from './dashboard.js';
import { form, update } from './form.js';
import { map } from './map.js';
import { orders } from './orders.js';
import { reports } from './reports.js';
import { settings } from './settings.js';
import { stats } from './stats.js';
import express from 'express';

// Set up routes
const routes = [
    { paths: '{/}', controller: { get: dashboard } },
    { paths: '/login{/}', controller: { get: login, post: auth } },
    { paths: '/logout{/}', controller: { get: logout } },
    { paths: '/settings{/}', controller: { get: settings } },
    { paths: '/form{/}', controller: { get: form, post: update } },
    { paths: '/orders{/}', controller: { get: orders } },
    { paths: '/stats{/}', controller: { get: stats } },
    { paths: '/map{/}', controller: { get: map } },
    { paths: '/commission{/}', controller: { get: commission } },
    { paths: '/reports{/}', controller: { get: reports } }
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

// Routing paths
routes.forEach( ( route ) => {

    const { paths, controller: { get, post } } = route;

    if ( post ) router.post( paths, post );
    if ( get ) router.get( paths, get );

} );

// Handle unknown paths
router.get( '/{*splat}', ( _, res ) => res.redirect( '/' ) );

export { routes, router };
