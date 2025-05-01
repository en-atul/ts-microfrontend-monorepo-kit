module.exports = function (api) {
	const isDevelopment = api.env('development');

	return {
		presets: [
			'@babel/preset-env',
			['@babel/preset-react', { runtime: 'automatic' }],
			'@babel/preset-typescript',
		],
		plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean), // removes `false` if not in development
	};
};
