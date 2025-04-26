module.exports = {
	extends: [
		'../.eslintrc.js',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
	],
	plugins: ['react', 'react-native', 'react-hooks', 'react-refresh'],
	overrides: [
		{
			files: ['*.stories.tsx', '*.test.tsx'], 
			rules: {
				'@typescript-eslint/naming-convention': 'off',
				'@typescript-eslint/ban-ts-comment': 'off',
			},
		},
	],
};