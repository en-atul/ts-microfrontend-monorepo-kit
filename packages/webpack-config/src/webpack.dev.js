import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';
import webpack from 'webpack';
import path from 'path';
import { getFilePaths } from './utils.js';

export default ({ baseUrl, configs, deps }) => {
	const { __dirname } = getFilePaths(baseUrl);

	const SRC = path.join(__dirname, 'src');

	let remotes = {};
	let exposes = {};
	let REMOTES = configs.REMOTES;
	for (let i = 0; i < REMOTES.length; i++) {
		remotes[REMOTES[i].split('@')[0]] = REMOTES[i];
	}

	let EXPOSES = configs.EXPOSES;
	for (let i = 0; i < EXPOSES.length; i++) {
		const [k, v] = EXPOSES[i].split('_@_');
		exposes[`./${k}`] = path.join(SRC, v);
	}

	// 'webpack-hot-middleware/client',
	return {
		mode: 'development',
		devtool: 'cheap-module-source-map',
		entry: {
			main: [path.join(SRC, 'index.tsx')],
		},
		output: {
			publicPath: configs.PUBLIC_PATH,
		},
		plugins: [
			new ModuleFederationPlugin({
				name: configs.appName,
				filename: configs.appFileName,
				exposes,
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
			new webpack.HotModuleReplacementPlugin(),
		],
	};
};
