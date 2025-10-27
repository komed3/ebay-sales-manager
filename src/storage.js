import { cwd } from './config.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

function numberOrAny( value ) {

    const n = Number( value );
    return isNaN( n ) ? value : n;

}

function expandDotNotation ( obj ) {

    const result = {};

    for ( const [ key, value ] of Object.entries( obj ) ) {

        if ( key.includes( '.' ) ) {

            const parts = key.split( '.' );
            let current = result;

            for ( let i = 0; i < parts.length; i++ ) {

                const p = parts[ i ];

                if ( i === parts.length - 1 ) current[ p ] = numberOrAny( value );
                else {

                    if ( typeof current[ p ] !== 'object' || current[ p ] === null ) current[ p ] = {};
                    current = current[ p ];

                }

            }

        }

        else result[ key ] = numberOrAny( value );

    }

    return result;

}

function mergeFields ( obj ) {

    const fields = Object.keys( obj );
    const articles = [];
    let i = 0;

    while ( true ) {

        let data = {};

        for ( const field of fields ) { if ( obj[ field ]?.[ i ]?.length ) {
            data[ field ] = numberOrAny( obj[ field ][ i ] );
        } }

        if ( Object.keys( data ).length ) articles.push( data );
        else return articles;

        i++;

    }

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
    data.article = mergeFields( data.article );

    return data;

}

export function getOrders () {

    const fileName = join( cwd, 'data/orders.json' );
    return JSON.parse( readFileSync( fileName, 'utf8' ) || '[]' );

}

export function getOrderIndex ( uuid ) {

    const orders = getOrders();
    return orders.findIndex( o => o.__uuid === uuid ) || -1;

}

export function getOrderData ( uuid ) {

    const orders = getOrders();
    return orders.find( o => o.__uuid === uuid ) || null;

}

export function updateOrder ( data ) {

    const orders = getOrders();
    const idx = getOrderIndex( data.__uuid );

    if ( idx >= 0 ) orders[ idx ] = data;
    else orders.push( data );

    writeFileSync( fileName, JSON.stringify( orders, null, 2 ), 'utf8' );

}
