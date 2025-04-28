import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';
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

	return {
		mode: 'production',
		devtool: 'source-map',

		output: {
			filename: '[name].[contenthash].js',
			path: __dirname + '/dist',
			publicPath: '/',
		},

		module: {
			rules: [
				{
					test: /\.s?css$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
				},
			],
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
			new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
			new CleanWebpackPlugin(),
		],
	};
};
