import { join } from 'node:path';
import dotenv from 'dotenv';

export const cwd = process.cwd();

export const config = dotenv.config( {
    path: join( cwd, 'config.env' ),
    quiet: true
} ).parsed ?? {};
