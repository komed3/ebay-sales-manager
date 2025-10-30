import { cwd } from './config.js';
import i18next from 'i18next';
import FsBackend from 'i18next-fs-backend';
import { handle } from 'i18next-http-middleware';

await i18next.use( FsBackend ).init( {
    fallbackLng: 'en-US',
    preload: [ 'en-US', 'de-DE' ],
    backend: {
        loadPath: join( cwd, 'locales/{{lng}}.json' )
    },
    interpolation: {
        escapeValue: false
    }
} );

export const i18nHandler = handle( i18next );
