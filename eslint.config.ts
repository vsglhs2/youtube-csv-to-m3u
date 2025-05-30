

import js from '@eslint/js';
import stylisticJsPlugin from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import ts from 'typescript-eslint';

module.exports = [
	js.configs.recommended,
	...ts.configs.recommended,
	{
		languageOptions: { globals: globals.browser },
		plugins: {
			'@stylistic/js': stylisticJsPlugin,
			'import': importPlugin,
		},
		files: ['**/*.{js,mjs,cjs,ts,d.ts,tsx}'],
		ignores: [
			'node_modules/',
			'dist/',
			'yt-search-repo/',
			'yt-search-browserify/',
			'src/yt-search/',
		],
		rules: {
			'@stylistic/js/eol-last': ['error', 'always'],
			'@stylistic/js/no-trailing-spaces': ['error'],
			'@stylistic/js/comma-dangle': ['error', 'always-multiline'],

			'eqeqeq': ['error', 'allow-null'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'indent': ['warn', 'tab'],

			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/consistent-type-imports': 'error',

			'import/order': [
				'error',
				{
					groups: [
						['builtin', 'external'],
					],
					'newlines-between': 'always',
				},
			],
		},
	},
];
