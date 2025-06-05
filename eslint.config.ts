

import js from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import ts from 'typescript-eslint';
module.exports = [
	js.configs.recommended,
	...ts.configs.recommended,
	{
		languageOptions: { globals: globals.browser },
		plugins: {
			'@stylistic': stylisticPlugin,
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
			'@stylistic/eol-last': ['error', 'always'],
			'@stylistic/no-trailing-spaces': ['error'],
			'@stylistic/comma-dangle': ['error', 'always-multiline'],

			'eqeqeq': ['error', 'allow-null'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'indent': ['warn', 'tab'],

			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/consistent-type-imports': 'error',
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/semi-spacing': ['error', { 'before': false, 'after': true }],
			'@stylistic/semi-style': ['error', 'last'],
			'@stylistic/member-delimiter-style': ['error'],
			'@stylistic/arrow-parens': ['error'],

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
