import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';
import webpack from 'webpack';
import path from 'path';
import { createRequire } from 'module';
import { getFilePaths } from '../../configs/utils.js';

const packageJSON = createRequire(import.meta.url)('../package.json');

const deps = packageJSON.dependencies;
const { __dirname } = getFilePaths(import.meta.url);

const configs = {
	appName: 'remoteApp',
	appFileName: 'remoteEntry.js',
	PORT: 3001,
	PUBLIC_PATH: 'http://localhost:3001/',
	REMOTES: ['hostApp@http://localhost:3000/remoteEntry.js'],
};

const SRC = path.resolve(__dirname, '../src');

let remotes = {};
let REMOTES = configs.REMOTES;
for (let i = 0; i < REMOTES.length; i++) {
	remotes[REMOTES[i].split('@')[0]] = REMOTES[i];
}

export default {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	entry: {
		main: ['webpack-hot-middleware/client', path.join(SRC, 'index.tsx')],
	},
	output: {
		publicPath: configs.PUBLIC_PATH,
	},
	plugins: [
		new ModuleFederationPlugin({
			name: configs.appName,
			filename: configs.appFileName,
			exposes: {
				'./RemoteComponent': path.join(SRC, 'RemoteComponent.tsx'),
			},
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
