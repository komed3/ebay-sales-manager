import { cwd } from './config.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

export function expandDotNotation ( obj ) {

    const result = {};

    for ( const [ key, value ] of Object.entries( obj ) ) {

        if ( key.startsWith( 'article.' ) ) continue;

        if ( key.includes( '.' ) ) {

            const parts = key.split( '.' );
            let current = result;

            for ( let i = 0; i < parts.length; i++ ) {

                const p = parts[ i ];

                if ( i === parts.length - 1 ) current[ p ] = value;
                else {

                    if ( typeof current[ p ] !== 'object' || current[ p ] === null ) current[ p ] = {};
                    current = current[ p ];

                }

            }

        }

        else result[ key ] = value;

    }

    return result;

}

export function mergeArticles ( obj ) {

    const articleKeys = Object.keys( obj ).filter( k => k.startsWith( 'article.' ) );
    const fields = {};

    if ( articleKeys.length === 0 ) return [];

    for ( const key of articleKeys ) {

        const field = key.split( '.' )[ 1 ];
        fields[ field ] = Array.isArray( obj[ key ] ) ? obj[ key ] : [ obj[ key ] ];

    }

    const maxLen = Math.max( ...Object.values( fields ).map( a => a.length ) );
    const articles = [];

    for ( let i = 0; i < maxLen; i++ ) {

        const article = {};

        for ( const [ field, arr ] of Object.entries( fields ) ) {

            const val = arr[ i ]?.toString().trim() ?? '';
            if ( val !== '' ) article[ field ] = val;

        }

        articles.push( article );

    }

    return articles;

}

export async function getCoordinates ( address ) {

    if ( ! address || address.trim() === '' ) return null;

    const query = encodeURIComponent( address );
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    try {

        const res = await fetch( url, { headers: { 'User-Agent': 'OrderManager/1.0 (example@example.com)' } } );
        if ( ! res.ok ) return null;

        const results = await res.json();
        if ( results.length === 0 ) return null;

        const { lat, lon } = results[ 0 ];
        return { lat: parseFloat( lat ), lon: parseFloat( lon ) };

    } catch { return null }

}

export function sanitizeData ( raw ) {

    const data = expandDotNotation( raw );

    data.__uuid ||= uuidv4();
    data.__updated = new Date().toISOString();
    data.article = mergeArticles( data );

    return data;

}

export function updateOrder ( data ) {

    const fileName = join( cwd, 'data/orders.json' );
    const orders = JSON.parse( readFileSync( fileName, 'utf8' ) || '[]' );
    const idx = orders.findIndex( o => o.__uuid === data.__uuid ) || -1;

    if ( idx >= 0 ) orders[ idx ] = data;
    else orders.push( data );

    writeFileSync( fileName, JSON.stringify( orders, null, 2 ), 'utf8' );

}
