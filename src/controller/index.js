import { get as dashboard } from './dashboard.js';
import { get as login } from './auth.js';
import express from 'express';

// Set up routes
const routes = [
    { paths: '{/}', controller: { get: dashboard } },
    { paths: '/login{/}', controller: { get: login } }
];

// Routing paths
const router = express.Router();

router.use( '/', ( req, res, next ) => {

    if ( ( ! req.session || ! req.session.user ) && ! req.path.startsWith( '/login' ) ) res.redirect( '/login/' );
    else next();

} );

routes.forEach( ( route ) => {

    const { paths, controller: { get, post } } = route;

    if ( post ) router.post( paths, post );
    if ( get ) router.get( paths, get );

} );

export { routes, router };
