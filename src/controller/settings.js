import { getUser, updateUser } from '../storage.js';
import bcrypt from 'bcrypt';

export function settings ( req, res ) {

	const nick = req.session.user.name;
	const user = getUser( nick );

	res.render( 'settings', {
		path: '/settings', title: req.t( 'settings._meta.title' ),
		data: { user }
	} );

}

export async function updateSettings ( req, res ) {

	const nick = req.session.user.name;
	const { mail, password, passwordConfirm, currency, lang, layer } = req.body;

	if ( password && password !== passwordConfirm ) return res.render( 'settings', {
		path: '/settings', title: req.t( 'settings._meta.title' ),
		data: { user: getUser( nick ) },
		error: req.t( 'settings.error.matchPassword' )
	} );

	const payload = { mail, settings: { currency, lang, layer } };

	if ( password ) {

		const hash = await bcrypt.hash( password, 10 );
		payload.pass = hash;

    }

	const updated = updateUser( nick, payload );

	// Update session settings and mail
	req.session.user.mail = updated.mail;
	req.session.user.settings = updated.settings;

	res.render( 'settings', {
		path: '/settings', title: req.t( 'settings._meta.title' ),
		data: { user: updated },
		message: req.t( 'settings.msg.saved' )
	} );

}
