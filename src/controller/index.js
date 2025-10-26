import { get as login, post as auth } from './auth.js';
import { get as dashboard } from './dashboard.js';
import express from 'express';

// Set up routes
const routes = [
    { paths: '{/}', controller: { get: dashboard } },
    { paths: '/login{/}', controller: { get: login, post: auth } }
];

// Init router
const router = express.Router();

// Ensure secured login
router.use( '/', ( req, res, next ) => {

    if ( ( ! req.session || ! req.session.user ) && ! req.path.startsWith( '/login' ) ) res.redirect( '/login/' );
    else next();

} );

// Routing paths
routes.forEach( ( route ) => {

    const { paths, controller: { get, post } } = route;

    if ( post ) router.post( paths, post );
    if ( get ) router.get( paths, get );

} );

export { routes, router };
