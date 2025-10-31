import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import bcrypt from 'bcrypt';

const usersFile = join( process.cwd(), 'data/users.json' );
const rl = readline.createInterface( { input, output } );
const users = JSON.parse( readFileSync( usersFile, 'utf8' ) );
const now = new Date().toISOString();

console.log( 'Create a new user' );

// Prompt for user details
const nick = await rl.question( 'Nickname: ' );
const mail = await rl.question( 'Email: ' );
const pass = await rl.question( 'Password: ' );

// Check if user already exists
if ( users[ nick ] ) {

    console.error( `User "${ nick }" already exists!` );
    rl.close();
    process.exit( 1 );

}

// Create new user
users[ nick ] = {
    __created: now, __updated: now,
    nick, mail, pass: await bcrypt.hash( pass, 10 ),
    settings: {}
};

// Save to file
writeFileSync( usersFile, JSON.stringify( users, null, 4 ), 'utf8' );
console.log( `User "${ nick }" created successfully.` );

rl.close();
