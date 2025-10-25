import { join } from 'node:path';
import express, { static as serveStatic } from 'express';
import { router } from './controller/index.js';

const cwd = process.cwd();
const app = express();

// Set up view engine
app.set( 'views', join( cwd, 'views' ) );
app.set( 'view engine', 'pug' );

// Serve static files
app.use( '/fonts', serveStatic( join( cwd, 'public/fonts' ) ) );
app.use( '/images', serveStatic( join( cwd, 'public/images' ) ) );
app.use( '/css', serveStatic( join( cwd, 'public/css' ) ) );
app.use( '/js', serveStatic( join( cwd, 'public/js' ) ) );

// Routing
router.forEach( ( route ) => {

    const { paths, controller: { get, post } } = route;

    if ( post ) app.post( paths, post );
    if ( get ) app.get( paths, get );

} );

// Listen on port 3000
app.listen( 3000 );
