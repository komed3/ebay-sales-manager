import { cwd } from './config.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

export function expandDotNotation ( obj ) {

    const result = {};

    for ( const [ key, value ] of Object.entries( obj ) ) {

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

export function sanitizeData ( raw ) {

    const data = expandDotNotation( raw );

    if ( ! '__uuid' in data ) data.__uuid = uuidv4();
    data.__updated = new Date().toISOString();

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
