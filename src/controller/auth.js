import bcrypt from 'bcrypt';
import { getUser } from '../storage.js';

export function login ( _, res ) { res.render( 'login' ) }

export function logout ( req, res ) { req.session.destroy(
    () => res.redirect( '/login/' )
) }

export async function auth ( req, res ) {

    const { username, password } = req.body;

    if ( ! username || ! password ) return res.render( 'login', {
        error: 'Bitte Benutzername und Passwort angeben.'
    } );

    // Get user from storage
    const user = getUser( username );

    if ( ! user ) return res.render( 'login', {
        error: 'Unbekannter Benutzer.'
    } );

    // Check the password
    const valid = await bcrypt.compare( password, user.pass );

    if ( ! valid ) return res.render( 'login', {
        error: 'Falsches Passwort.'
    } );

    // Success
    req.session.user = {
        name: username,
        mail: user.mail,
        settings: user.settings || {}
    };

    res.redirect( '/' );

}
