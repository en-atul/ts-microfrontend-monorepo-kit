import { reactJsConfig } from '@repo/eslint-config/react-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
	...reactJsConfig,
	// {
	// 	rules: {
	// 		'import/no-unresolved': [
	// 			'error',
	// 			{
	// 				ignore: ['remoteApp'],
	// 			},
	// 		],
	// 	},
	// },
	{
		settings: {
			'import/resolver': {
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
	},
];
