module.exports = {
	extends: ['../.eslintrc.js'],
	rules: {
		'import/no-named-as-default-member': 'off',
	},
	overrides: [
		{
			files: ['*.styled.ts'],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
			},
		},
	],
};
