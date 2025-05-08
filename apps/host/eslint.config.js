import { reactJsConfig } from '@repo/eslint-config/react-js';
import path from 'path';

/** @type {import("eslint").Linter.Config[]} */
export default [
	...reactJsConfig,
	{
		settings: {
			'import/resolver': {
				typescript: {
					project: path.resolve(__dirname, './tsconfig.json'),
				},
			},
		},
		ignores: ['dist/**'],
	},
];
