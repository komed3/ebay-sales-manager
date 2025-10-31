import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();

// Helper to create file if it not exists
const createFile = ( path, payload ) => {

    const fullPath = join( cwd, 'data', path );

    if( ! existsSync( fullPath ) ) writeFileSync(
        fullPath, JSON.stringify( payload, null, 2 ), 'utf8'
    );

}

// Create directories
mkdirSync( join( cwd, 'data/reports' ), { recursive: true } );
mkdirSync( join( cwd, 'data/upload/tmp' ), { recursive: true } );

// Create files
createFile( 'annualReports.json', {} );
createFile( 'calendar.json', [] );
createFile( 'customers.json', {} );
createFile( 'monthlyReports.json', {} );
createFile( 'orders.json', [] );
createFile( 'users.json', {} );

// Populate stats
createFile( 'stats.json', {
    orderCount: 0, customerCount: 0, shippingCount: 0, pickupCount: 0, totalRevenue: 0,
    shippingRevenue: 0, pickupRevenue: 0, totalShipping: 0, totalFees: 0, totalRefund: 0,
    totalProfit: 0, totalItems: 0, averageRevenue: 0, averageShipping: 0, averageFees: 0,
    averageRefund: 0, averageProfit: 0, averageItems: 0, averageItemPrice: 0,
    profitMargin: 0
} );
