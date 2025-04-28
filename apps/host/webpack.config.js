import { start } from '../../packages/webpack-config/src/webpack.server.js';
import { createRequire } from 'module';

const packageJSON = createRequire(import.meta.url)('./package.json');
const deps = packageJSON.dependencies;

const EXPOSES = [];

const configs = {
	development: {
		appName: 'hostApp',
		appFileName: 'remoteEntry.js',
		PUBLIC_PATH: 'http://localhost:3000/',
		REMOTES: ['remoteApp@http://localhost:3001/remoteEntry.js'],
		EXPOSES,
	},
	production: {
		appName: 'hostApp',
		appFileName: 'remoteEntry.js',
		PUBLIC_PATH: 'http://localhost:3000/',
		REMOTES: ['remoteApp@http://localhost:3001/remoteEntry.js'],
		EXPOSES,
	},
};

export default start({
	appName: 'Host App',
	port: 3000,
	baseUrl: import.meta.url,
	configs,
	deps,
	allowedOrigins: [],
});
