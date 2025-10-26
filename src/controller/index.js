import { login, logout, auth } from './auth.js';
import { dashboard } from './dashboard.js';
import express from 'express';

// Set up routes
const routes = [
    { paths: '{/}', controller: { get: dashboard } },
    { paths: '/login{/}', controller: { get: login, post: auth } },
    { paths: '/logout{/}', controller: { get: logout } }
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

export { routes, router };
