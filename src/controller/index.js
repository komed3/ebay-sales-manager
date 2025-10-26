import { get as dashboard } from './dashboard.js';
import express from 'express';

// Set up routes
const routes = [ {
    paths: '{/}',
    controller: {
        get: dashboard
    }
} ];

// Routing paths
const router = express.Router();

routes.forEach( ( route ) => {

    const { paths, controller: { get, post } } = route;

    if ( post ) router.post( paths, post );
    if ( get ) router.get( paths, get );

} );

export { routes, router };
