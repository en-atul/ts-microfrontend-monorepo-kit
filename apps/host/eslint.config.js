import path from 'path';
import { fileURLToPath } from 'url';
import { reactJsConfig } from '@repo/eslint-config/react-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("eslint").Linter.Config[]} */
export default [
	...reactJsConfig,
	{
		files: ['**/*.{ts,tsx}'],
		rules: {
			'import/no-unresolved': [
				'error',
				{
					ignore: ['^remoteApp/'], // Add MF remotes here
				},
			],
		},
		settings: {
			'import/resolver': {
				typescript: {
					project: path.resolve(__dirname, './tsconfig.json'),
					alwaysTryTypes: true,
				},
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			},
		},
	},
	{
		ignores: ['dist/**'],
	},
];
