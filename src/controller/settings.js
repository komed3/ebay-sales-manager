import { getUser, updateUser } from '../storage.js';
import bcrypt from 'bcrypt';

export function settings ( req, res ) {

	const nick = req.session.user.name;
	const user = getUser( nick );

	res.render( 'settings', {
		path: '/settings', title: 'Einstellungen',
		data: { user }
	} );

}

export async function updateSettings ( req, res ) {

	const nick = req.session.user.name;
	const { mail, password, passwordConfirm, currency, lang, layer } = req.body;

	if ( password && password !== passwordConfirm ) return res.render( 'settings', {
		path: '/settings', title: 'Einstellungen',
		data: { user: getUser( nick ) },
		error: 'Passwörter stimmen nicht überein.'
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
		path: '/settings', title: 'Einstellungen',
		data: { user: updated },
		message: 'Einstellungen gespeichert.'
	} );

}
