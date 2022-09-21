import { terser } from 'rollup-plugin-terser';
import versionInjector from 'rollup-plugin-version-injector';

const versionConfig = {
    injectInComments: {
        fileRegexp: /\.(js|html|css)$/,
        tag: 'Doz, version: {version} - {date}',
        dateFormat: 'mmmm d, yyyy HH:MM:ss'
    }
}

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/doz.js',
            format: 'es',
            name: 'Doz',
            plugins: [
                versionInjector(versionConfig)
            ]
        },
        {
            file: 'dist/doz.min.js',
            format: 'es',
            name: 'Doz',
            plugins: [
                versionInjector(versionConfig),
                terser()
            ]
        },
        /*{
            file: 'dist/umd/doz.js',
            format: 'umd',
            name: 'Doz',
            plugins: [
                versionInjector()
            ]
        },
        {
            file: 'dist/umd/doz.min.js',
            format: 'umd',
            name: 'Doz',
            plugins: [
                versionInjector(),
                terser()
            ]
        }*/
    ]
};