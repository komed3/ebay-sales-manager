import { cwd, config } from './config.js';
import { router } from './controller/index.js';
import { join } from 'node:path';
import express, { static as serveStatic } from 'express';
import session from 'express-session';
import fileUpload from 'express-fileupload';

// Express app
const app = express();

// Set up view engine
app.set( 'views', join( cwd, 'views' ) );
app.set( 'view engine', 'pug' );

// Middlewares
app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );

app.use( fileUpload( {
    useTempFiles: true,
    tempFileDir: join( cwd, 'data/upload/tmp' )
} ) );

app.use( session( {
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8.64e7 }
} ) );

// Serve static files
app.use( '/fonts', serveStatic( join( cwd, 'public/fonts' ) ) );
app.use( '/images', serveStatic( join( cwd, 'public/images' ) ) );
app.use( '/css', serveStatic( join( cwd, 'public/css' ) ) );
app.use( '/js', serveStatic( join( cwd, 'public/js' ) ) );
app.use( '/upload', serveStatic( join( cwd, 'data/upload' ) ) );

// Mount router
app.use( router );

// Listen on port 3000
app.listen( 3000, () => console.log( `Server is running!` ) );
