module.exports = {
	extends: ['../.eslintrc.js', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
	plugins: ['react', 'react-hooks', 'react-refresh'],
	rules: {
		'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
		'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
		'react/function-component-definition': ['warn', { namedComponents: 'arrow-function' }],
		'react/jsx-no-useless-fragment': 'warn',
		'react/no-children-prop': 'error',
		'react/no-danger': 'error',
		'react/display-name': 'warn',
		'react/no-array-index-key': 'warn',
		'react-refresh/only-export-components': 'warn',
		'react/jsx-boolean-value': ['error', 'never'],
		'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }], // Enforce JSX in .jsx/.tsx files
		'react-hooks/exhaustive-deps': 'warn',
		'react-hooks/rules-of-hooks': 'error',
		'react/jsx-no-bind': [
			'warn',
			{
				ignoreRefs: true,
				allowArrowFunctions: true,
				allowFunctions: false,
				allowBind: false,
			},
		],
		'no-func-assign': 'error',
		'prefer-const': 'warn',
		'react/no-unescaped-entities': 'error',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
