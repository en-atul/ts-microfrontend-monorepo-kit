import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { getFilePaths } from '../../configs/utils.js';

const { __dirname } = getFilePaths(import.meta.url);

export default {
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
		new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
		new CleanWebpackPlugin(),
	],
};
