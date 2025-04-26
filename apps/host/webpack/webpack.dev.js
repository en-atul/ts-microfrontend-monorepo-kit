const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('../package.json').dependencies;

const configs = {
	appName: 'hostApp',
	appFileName: 'remoteEntry.js',
	PORT: 3000,
	PUBLIC_PATH: 'http://localhost:3000/',
	REMOTES: ['remoteApp@http://localhost:3001/remoteEntry.js'],
};

let remotes = {};
let REMOTES = configs.REMOTES;
for (let i = 0; i < REMOTES.length; i++) {
	remotes[REMOTES[i].split('@')[0]] = REMOTES[i];
}

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || configs.PORT;
const PROTOCOL = process.env.PROTOCOL || (process.env.NODE_ENV === 'production' ? 'https' : 'http');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	output: {
		publicPath: configs.PUBLIC_PATH,
	},
	devServer: {
		port: configs.PORT,
		hot: true,
		open: true,
		historyApiFallback: true,
		onListening: () => {
			console.log(`\n🚀 [\x1b[35mHost App\x1b[0m] running at ${PROTOCOL}://${HOST}:${PORT}\n`);
		},
	},
	// https://webpack.js.org/configuration/infrastructureLogging/
	// Configure infrastructure logging to only show errors
	infrastructureLogging: { level: 'error' },
	// Minimize the amount of output in the terminal
	stats: 'minimal',
	plugins: [
		new ModuleFederationPlugin({
			name: configs.appName,
			filename: configs.appFileName,
			exposes: {},
			remotes,
			shared: {
				...deps,
				react: {
					singleton: true,
					eager: true,
					requiredVersion: deps.react,
				},
				'react-dom': {
					singleton: true,
					eager: true,
					requiredVersion: deps['react-dom'],
				},
			},
		}),
		new ReactRefreshWebpackPlugin(),
	],
};
