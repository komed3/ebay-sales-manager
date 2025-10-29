import { cwd } from './config.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import deepmerge from 'deepmerge';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

const ordersFile = join( cwd, 'data/orders.json' );
const calendarFile = join( cwd, 'data/calendar.json' );
const statsFile = join( cwd, 'data/stats.json' );
const annualReportsFile = join( cwd, 'data/annualReports.json' );
const reportsFile = join( cwd, 'data/reports.json' );

function numberOrAny( value ) {

    const n = Number( value );
    return [ '', null, undefined ].includes( value ) || isNaN( n ) || Math.abs( n ) > 9999 ? value : n;

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

    if ( ! obj ) return [];

    const fields = [ ...new Set( Object.keys( obj ).map( f => f.replace( /\[\d+\]/, '' ) ) ) ];
    const articles = [];
    let i = 0;

    while ( true ) {

        let data = {};

        for ( const field of fields ) { if ( obj[ `${field}[${i}]` ] != '' ) {
            data[ field ] = numberOrAny( obj[ `${field}[${i}]` ] );
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

export function getOrders () {

    return JSON.parse( readFileSync( ordersFile, 'utf8' ) || '[]' );

}

export function filterOrders ( query ) {

    const {
        offset = 0, limit = 32, search = '',
        from = '1900-01-01', to = '2100-12-31'
    } = expandDotNotation( query ?? {} );

    const orders = getOrders().filter( o =>
        JSON.stringify( o ).match( new RegExp( search, 'i' ) ) &&
        new Date( o.orderDate ).getTime() >= new Date( from ).getTime() &&
        new Date( o.orderDate ).getTime() <= new Date( to ).getTime()
    );

    const results = orders.slice( offset, offset + limit );
    return { results, count: results.length, max: orders.length };

}

export function getOrder ( uuid ) {

    const orders = getOrders();
    return orders.find( o => o.__uuid === uuid ) || null;

}

export function isOrder ( order ) {

    return order && typeof order === 'object' && order.__uuid;

}

export async function updateOrder ( raw, files ) {

    const data = sanitizeData( raw );
    const orders = getOrders();
    const idx = orders.findIndex( o => o.__uuid == data.__uuid ) ?? null;
    const now = new Date().toISOString();

    if ( files?.invoicePDF?.size ) {

        const pdfName = `${ uuidv4() }.pdf`;
        const pdfPath = join( cwd, 'data/upload', pdfName );

        files.invoicePDF.mv( pdfPath );
        data.invoicePDF = pdfName;

    }

    data.__updated = now;

    if ( idx >= 0 ) orders[ idx ] = deepmerge( orders[ idx ], data, {
        arrayMerge: ( _, source ) => source
    } );

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
    updateOrderStats();

    return data.__uuid;

}

export function getOrderStats () {

    return JSON.parse( readFileSync( statsFile, 'utf8' ) );

}

export function getOrderDates () {

    return JSON.parse( readFileSync( calendarFile, 'utf8' ) );

}

export function getAnnualReports () {

    return JSON.parse( readFileSync( annualReportsFile, 'utf8' ) );

}

export function getReports () {

    return JSON.parse( readFileSync( reportsFile, 'utf8' ) );

}

export function updateOrderStats () {

    const orders = getOrders();
    const customers = new Set();
    const dates = new Set();
    const stats = {
        orderCount: 0,
        customerCount: 0,
        shippingCount: 0,
        pickupCount: 0,
        totalRevenue: 0,
        shippingRevenue: 0,
        pickupRevenue: 0,
        totalShipping: 0,
        totalFees: 0,
        totalRefund: 0,
        totalProfit: 0,
        totalItems: 0
    };

    const monthlyReports = {};
    const annualReports = {};
    let report;

    orders.forEach( o => {

        // Collect unique order dates
        dates.add( o.orderDate );

        // Aggregate statistics
        stats.orderCount++;
        stats.totalRevenue += Number( o.revenue );
        stats.totalShipping += Number( o.shipping );
        stats.totalFees += Number( o.fees );
        stats.totalRefund += Number( o.refund );
        stats.totalProfit += Number( o.profit );

        stats[ `${o.orderType}Count` ]++;
        stats[ `${o.orderType}Revenue` ] += Number( o.revenue );

        if ( o.article && Array.isArray( o.article ) ) {
            stats.totalItems += o.article.reduce( ( sum, a ) => sum + ( Number( a.quantity ) || 0 ), 0 );
        }

        if ( ! customers.has( o.customer.nick ) ) {
            stats.customerCount++;
            customers.add( o.customer.nick );
        }

        // Aggregate report data
        const date = new Date( o.orderDate );
        const year = date.getFullYear();
        const month = String( date.getMonth() + 1 ).padStart( 2, '0' );
        const reportKey = `${year}-${month}`;

        if ( ! monthlyReports[ reportKey ] ) {

            monthlyReports[ reportKey ] = {
                orderCount: 0,
                totalRevenue: 0,
                totalShipping: 0,
                totalFees: 0,
                totalRefund: 0,
                totalProfit: 0
            };

        }

        report = monthlyReports[ reportKey ];
        report.orderCount++;
        report.totalRevenue += Number( o.revenue );
        report.totalShipping += Number( o.shipping );
        report.totalFees += Number( o.fees );
        report.totalRefund += Number( o.refund );
        report.totalProfit += Number( o.profit );

        if ( ! annualReports[ year ] ) {

            annualReports[ year ] = {
                orderCount: 0,
                totalRevenue: 0,
                totalShipping: 0,
                totalFees: 0,
                totalRefund: 0,
                totalProfit: 0
            };

        }

        report = annualReports[ year ];
        report.orderCount++;
        report.totalRevenue += Number( o.revenue );
        report.totalShipping += Number( o.shipping );
        report.totalFees += Number( o.fees );
        report.totalRefund += Number( o.refund );
        report.totalProfit += Number( o.profit );

    } );

    // Calculate averages and profit margins
    if ( stats.orderCount ) {

        stats.averageRevenue = stats.totalRevenue / stats.orderCount;
        stats.averageShipping = stats.totalShipping / stats.orderCount;
        stats.averageFees = stats.totalFees / stats.orderCount;
        stats.averageRefund = stats.totalRefund / stats.orderCount;
        stats.averageProfit = stats.totalProfit / stats.orderCount;
        stats.averageItems = stats.totalItems / stats.orderCount;
        stats.averageItemPrice = ( stats.totalRevenue - stats.totalShipping ) / stats.totalItems;
        stats.profitMargin = stats.totalProfit / stats.totalRevenue * 100;

    }

    // Round values
    for ( const [ key, val ] of Object.entries( stats ) ) {
        stats[ key ] = Number( Number( val ).toFixed( 2 ) );
    }

    // Proceed reports
    for ( const report of Object.values( monthlyReports ) ) {

        report.profitMargin = report.totalProfit / report.totalRevenue * 100;

        for ( const [ key, val ] of Object.entries( report ) ) {
            report[ key ] = Number( Number( val ).toFixed( 2 ) );
        }

    }

    for ( const report of Object.values( annualReports ) ) {

        report.profitMargin = report.totalProfit / report.totalRevenue * 100;

        for ( const [ key, val ] of Object.entries( report ) ) {
            report[ key ] = Number( Number( val ).toFixed( 2 ) );
        }

    }

    // Sort reports by date
    const monthlyReportsSorted = Object.fromEntries( Object.entries( monthlyReports ).sort( ( [ a ], [ b ] ) => a.localeCompare( b ) ) );
    const annualReportsSorted = Object.fromEntries( Object.entries( annualReports ).sort( ( [ a ], [ b ] ) => a.localeCompare( b ) ) );

    // Save stats and reports
    writeFileSync( calendarFile, JSON.stringify( [ ...dates ], null, 2 ), 'utf8' );
    writeFileSync( statsFile, JSON.stringify( stats, null, 2 ), 'utf8' );
    writeFileSync( annualReportsFile, JSON.stringify( annualReportsSorted, null, 2 ), 'utf8' );
    writeFileSync( reportsFile, JSON.stringify( monthlyReportsSorted, null, 2 ), 'utf8' );

}
