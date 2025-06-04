import fs from 'fs';
import browserify from 'browserify';
import { exit } from 'process';

browserify()
// somehow, browserify can't require this module
// and if we reexport it, there will be
// too much unnecessary work, so
// we just reexport recursive proxy plug
	.require('./modules/diagnostics_channel.js', {
		expose: 'diagnostics_channel',
	})
	.require('./modules/async_hooks.js', {
		expose: 'async_hooks',
	})
	.require('./modules/util_types.js', {
		expose: 'util/types',
	})
	.require('./modules/worker_threads.js', {
		expose: 'worker_threads',
	})
// browserify throws as it can't use esm variant
// so just reexport module require
// https://www.npmjs.com/package/jsonpath-plus?activeTab=readme
	.require('./modules/jsonpath-plus.js', {
		expose: 'jsonpath-plus',
	})
// browserify seems to bundle older (or incomplete) version
// of querystring module, so map external package instead
	.require('./modules/querystring.js', {
		expose: 'querystring',
	})
	.require('./modules/http2.js', {
		expose: 'http2',
	})
	.bundle()
	.on('error', (error) => {
		console.dir(error, { depth: 1 });

		exit(-1);
	})
	.pipe(fs.createWriteStream('../src/yt-search/deps.js'));

browserify('./patch.js')
	.external('jsonpath-plus')
	.external('worker_threads')
	.external('async_hooks')
	.external('util/types')
	.external('diagnostics_channel')
	.external('querystring')
// externalizing http2 without providing
// polyfill help to bypass part of errors
	.external('http2')
	.transform('babelify', {
		global: true,
		presets: ['@babel/preset-env'],
		plugins: ['@upleveled/babel-plugin-remove-node-prefix'],
	})
	.bundle()
	.on('error', (error) => {
		console.dir(error, { depth: 1 });

		exit(-1);
	})
	.pipe(fs.createWriteStream('../src/yt-search/bundle.js'));
