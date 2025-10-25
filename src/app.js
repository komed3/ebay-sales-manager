import { join } from 'node:path';
import express, { static as serveStatic } from 'express';

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

// Listen on port 3000
app.listen( 3000 );
