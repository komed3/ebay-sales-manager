export function form ( req, res, next ) { res.render( 'form', { path: '/form', title: 'Neue Bestellung' } ) }

export function update ( req, res, next ) { res.redirect( '/orders' ) }
