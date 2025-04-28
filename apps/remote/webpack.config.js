import { start } from '../../packages/webpack-config/src/webpack.server.js';
import { createRequire } from 'module';

const packageJSON = createRequire(import.meta.url)('./package.json');
const deps = packageJSON.dependencies;

const EXPOSES = ['RemoteComponent_@_RemoteComponent.tsx'];

const configs = {
	development: {
		appName: 'remoteApp',
		appFileName: 'remoteEntry.js',
		PUBLIC_PATH: 'http://localhost:3001/',
		REMOTES: ['hostApp@http://localhost:3000/remoteEntry.js'],
		EXPOSES,
	},
	production: {
		appName: 'remoteApp',
		appFileName: 'remoteEntry.js',
		PUBLIC_PATH: 'http://localhost:3001/',
		REMOTES: ['hostApp@http://localhost:3000/remoteEntry.js'],
		EXPOSES,
	},
};

export default start({
	appName: 'Remote App',
	port: 3001,
	baseUrl: import.meta.url,
	configs,
	deps,
	allowedOrigins: ['http://localhost:3000/'],
});
