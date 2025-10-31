import { getUser } from '../storage.js';
import bcrypt from 'bcrypt';

export function login ( _, res ) { res.render( 'login' ) }

export async function auth ( req, res ) {

    const { username, password } = req.body;

    if ( ! username || ! password ) return res.render( 'login', {
        error: req.t( 'auth.error.missingInput' )
    } );

    // Get user from storage
    const user = getUser( username );

    if ( ! user ) return res.render( 'login', {
        error: req.t( 'auth.error.unknownUser' )
    } );

    // Check the password
    const valid = await bcrypt.compare( password, user.pass );

    if ( ! valid ) return res.render( 'login', {
        error: req.t( 'auth.error.wrongPassword' )
    } );

    // Success
    req.session.user = {
        name: username,
        mail: user.mail,
        settings: user.settings || {}
    };

    res.redirect( '/' );

}

export function logout ( req, res ) {

    // Destroy current session
    req.session = null;

    res.clearCookie( 'connect.sid' );
    res.redirect( '/login' );

}
