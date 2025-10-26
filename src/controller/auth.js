import { config } from '../config.js';
import bcrypt from 'bcrypt';

export function login ( _, res ) { res.render( 'login' ) }

export function logout ( req, res ) { req.session.destroy(
    () => res.redirect( '/login/' )
) }

export async function auth ( req, res ) {

    const { username, password } = req.body;

    if ( ! username || ! password ) return res.render( 'login', {
        error: 'Bitte Benutzername und Passwort angeben.'
    } );

    // Get the password hash
    const envKey = `PASSWORD__${ username.toUpperCase() }`;
    const storedHash = config[ envKey ];

    if ( ! storedHash ) return res.render( 'login', {
        error: 'Unbekannter Benutzer.'
    } );

    // Check the password
    const valid = await bcrypt.compare( password, storedHash );

    if ( ! valid ) return res.render( 'login', {
        error: 'Falsches Passwort.'
    } );

    // Success
    req.session.user = { name: username };
    res.redirect( '/' );

}
