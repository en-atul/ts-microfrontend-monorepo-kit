import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import { getFilePaths } from './utils.js';

const { __dirname } = getFilePaths(import.meta.url);

const createBaseWebpackConfig = ({ srcPath, publicPath, aliases = {} }) => {
	const ROOT = path.resolve(__dirname, '../../../');

	console.log("------ROOT", ROOT);
	const PACKAGES = {
		ui: path.join(ROOT, 'packages/ui/src'),
		utils: path.join(ROOT, 'packages/utils/src'),
	};

	const babelConfigPath = path.join(ROOT, 'babel.config.js');

	return {
		entry: path.join(srcPath, 'index.tsx'),

		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.scss'],
			alias: {
				'@': srcPath,
				'@repo/ui': PACKAGES.ui,
				'@repo/utils': PACKAGES.utils,
				...aliases,
			},
		},

		module: {
			rules: [
				{
					test: /\.[jt]sx?$/,
					include: [srcPath, ...Object.values(PACKAGES)],
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							configFile: babelConfigPath,
						},
					},
				},
				{
					test: /\.module\.scss$/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: { modules: true, importLoaders: 1 },
						},
						'sass-loader',
					],
				},
				{
					test: /\.s[ac]ss$/i,
					exclude: /\.module\.(scss|sass)$/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: { importLoaders: 1 },
						},
						'sass-loader',
					],
				},
				{
					test: /\.(png|jpg|jpeg|gif|svg)$/,
					type: 'asset',
				},
				{
					test: /\.(woff(2)?|eot|ttf|otf)$/,
					type: 'asset/resource',
				},
			],
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: path.join(publicPath, 'index.html'),
			}),
			new Dotenv(),
		],
	};
};

export { createBaseWebpackConfig };
