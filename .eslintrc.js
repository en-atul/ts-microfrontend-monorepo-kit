module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier', 'import'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:import/recommended',
	],
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // variable or func's parameter starts with (_) will not trigger unused variables lint error
		'@typescript-eslint/consistent-type-assertions': 'warn', // enforce using type assertions instead of type casts
		'@typescript-eslint/type-annotation-spacing': 'warn', // enforce consistent spacing around type annotations
		'@typescript-eslint/no-explicit-any': 'error', // disallow explicit any types
		'@typescript-eslint/no-inferrable-types': 'warn', // disallows explicit type declarations for variables/parameters where the type can be inferred
		'@typescript-eslint/no-non-null-assertion': 'error', // disallows the use of non-null assertions (!)
		'no-console': ['warn', { allow: ['warn', 'error'] }],
		'no-debugger': 'error',
		'consistent-return': 'error', // require return statements to either always or never specify values
		eqeqeq: ['error', 'always'],
		'no-throw-literal': 'error', // enforce to throw an Error object (throw new Error('no value')), instead of throwing a string literal (throw 'no value')
		'no-implicit-coercion': 'error',
		// 'no-magic-numbers': ['warn', { ignore: [0, 1] }],
		'@typescript-eslint/naming-convention': [
			'warn',
			{
				selector: 'variable',
				// Specify PascalCase for React components
				format: ['PascalCase', 'camelCase'],
				leadingUnderscore: 'allow',
			},
			{
				// Enforce PascalCase for classes and TypeScript types (excluding React components)
				selector: 'typeLike',
				format: ['PascalCase'],
			},
			{
				selector: 'enum',
				format: ['UPPER_CASE'],
			},
			{
				selector: 'enumMember',
				format: ['UPPER_CASE'],
			},
			{
				// Exclude function naming conventions
				selector: 'function',
				format: ['camelCase'],
			},
			{
				selector: 'parameter',
				format: ['camelCase'],
				leadingUnderscore: 'allow',
			},
			{
				selector: 'property',
				format: null,
				leadingUnderscore: 'allow',
			},
		],
		// enforces no usage of '.js' or '.ts' at the end of imports
		// 'import/extensions': ['error', 'never', { json: 'always', css: 'always' }],
		// ensure that default imports are matched by corresponding default imports
		'import/default': 'error',
		// prevent circular dependencies
		'import/no-cycle': ['error', { maxDepth: Infinity }],
		// replace unneeded backticks to the single quotes.
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
		'import/no-unresolved': 'error',
		'import/order': [
			'warn',
			{
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
				},
			},
		],
		'prettier/prettier': 'error',
		'import/named': 'off',
		semi: ['warn', 'always'],
		'no-nested-ternary': 'warn',
		'no-implicit-globals': 'warn',
		curly: ['warn', 'all'],
		'prefer-arrow-callback': 'warn',
		complexity: ['warn', { max: 10 }],
	},
	overrides: [
		{
			files: ['*.js'],
			rules: {
				'no-undef': 'off',
			},
		},
		{
			files: ['*.spec.ts', '*.spec.tsx', '*.test.ts', '*.test.tsx'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
};