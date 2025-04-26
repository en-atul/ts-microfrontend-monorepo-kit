const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const packages = {
	ui: path.resolve(__dirname, '../../packages/ui/src'),
	utils: path.resolve(__dirname, '../../packages/utils/src'),
};

const apps = {
	base: path.resolve(__dirname, 'src'),
};

const babelConfigPath = path.resolve(__dirname, '../../babel.config.js');

module.exports = {
	entry: './src/index.tsx',
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.scss'],
		alias: {
			'@': apps.base,
			'@ts-microfrontend-monorepo-kit/ui': packages.ui,
			'@ts-microfrontend-monorepo-kit/utils': packages.utils,
		},
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							configFile: babelConfigPath,
						},
					},
				],
				include: apps.base,
				exclude: /node_modules/,
			},
			{
				test: /\.[jt]sx?$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							configFile: babelConfigPath,
						},
					},
				],
				include: Object.values(packages),
				exclude: /node_modules/,
			},
			{
				test: /\.module\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true,
							importLoaders: 1,
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.s[ac]ss$/i,
				exclude: /\.module\.(scss|sass)$/, // Don't process .module.scss here
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
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
			template: './public/index.html',
		}),
		new Dotenv(),
	],
};
