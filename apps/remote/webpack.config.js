import { createRequire } from 'module';
import { start } from '../../packages/webpack-config/src/webpack.server.js';

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);

const { dependencies: deps } = require('./package.json');

const port = 3001;

// Base configuration
const baseFederationConfig = {
	name: 'remoteApp',
	filename: 'remoteEntry.js',
	exposes: {
		'./RemoteComponent': 'RemoteComponent.tsx',
	},
	shared: {
		...deps,
		react: { singleton: true, eager: true, requiredVersion: deps.react },
		'react-dom': { singleton: true, eager: true, requiredVersion: deps['react-dom'] },
	},
};

// Environment-specific settings (overrides for each environment)
const getEnvironmentConfig = (env) => {
	switch (env) {
		case 'development':
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {},
				allowedOrigins: ["http://localhost:3000/"],
			};

		case 'staging':
			return {
				publicPath: `http://staging.example.com/`,
				remotes: {},
				allowedOrigins: [`http://marketting.staging.example.com/`],
			};

		case 'production':
			return {
				publicPath: `http://production.example.com/`,
				remotes: {},
				allowedOrigins: [`http://marketting.production.example.com/`],
			};

		default:
			// Fallback to development as default environment
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {},
				allowedOrigins: ["http://localhost:3000/"],
			};
	}
};

// Get the specific environment config
const environmentConfig = getEnvironmentConfig(process.env.NODE_ENV);

// Combine base and environment-specific configs
const federationConfigs = {
	...baseFederationConfig,
	...environmentConfig,
};

// Start the Webpack server
export default start({
	appName: 'Remote App',
	baseUrl: moduleUrl,
	federationConfigs,
	allowedOrigins: federationConfigs.allowedOrigins,
	port,
});
