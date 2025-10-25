import { get as dashboard } from './dashboard.js';

export const router = [ {
    paths: '{/}',
    controller: {
        get: dashboard
    }
} ];
