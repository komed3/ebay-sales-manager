import { cwd } from './config.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import deepmerge from 'deepmerge';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

const ordersFile = join( cwd, 'data/orders.json' );

function numberOrAny( value ) {

    const n = Number( value );
    return isNaN( n ) || Math.abs( n ) > 1e6 ? value : n;

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
    data.article = mergeFields( data.article );

    return data;

}

export function getOrders ( query ) {

    return JSON.parse( readFileSync( ordersFile, 'utf8' ) || '[]' ).filter( o =>
        JSON.stringify( o ).match( new RegExp( query.search?.length ? query.search : '', 'i' ) ) &&
        o.orderDate >= ( query.from?.length ? query.form : '1900-01-01' ) &&
        o.orderDate <= ( query.to?.length ? query.to : '2100-12-31' )
    );

}

export function getOrder ( uuid ) {

    const orders = getOrders();
    return orders.find( o => o.__uuid === uuid ) || null;

}

export function isOrder ( order ) {

    return order && typeof order === 'object' && order.__uuid;

}

export async function updateOrder ( raw ) {

    const data = sanitizeData( raw );
    const orders = getOrders();
    const idx = orders.findIndex( o => o.__uuid == data.__uuid ) ?? null;
    const now = new Date().toISOString();

    data.__updated = now;

    if ( idx >= 0 ) orders[ idx ] = deepmerge( orders[ idx ], data );
    else {

        const coords = await getCoordinates( [
            data.customer?.address?.street,
            data.customer?.address?.zipCode,
            data.customer?.address?.city
        ].filter( Boolean ).join( ', ' ) );

        orders.push( { ...data, ...{
            __created: now, __uuid: uuidv4(),
            location: coords
        } } );

    }

    writeFileSync( ordersFile, JSON.stringify( orders, null, 2 ), 'utf8' );

}
