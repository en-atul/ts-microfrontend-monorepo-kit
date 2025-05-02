import { createRequire } from 'module';
import { start } from '../../packages/webpack-config/src/webpack.server.js';
import { getConfig } from '../../packages/webpack-config/src/webpack.config.js';
import { parseArgs } from '../../packages/webpack-config/src/utils.js';
import chalk from 'chalk';

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);

const { dependencies: deps } = require('./package.json');

const port = 3000;

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'development';

console.log(chalk.grey(`[Build]: ${chalk.magenta(mode)}`));

// Base configuration
const baseFederationConfig = {
	name: 'hostApp',
	filename: 'remoteEntry.js',
	exposes: {},
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
				remotes: {
					remoteApp: 'http://localhost:3001/remoteEntry.js',
				},
				allowedOrigins: [],
			};

		case 'staging':
			return {
				publicPath: `http://staging.example.com/`,
				remotes: {
					remoteApp: `http://staging.example.com/remoteEntry.js`,
				},
				allowedOrigins: [],
			};

		case 'production':
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {
					remoteApp: 'http://localhost:3001/remoteEntry.js',
				},
				allowedOrigins: [],
			};

		default:
			// Fallback to development as default environment
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {
					remoteApp: 'http://localhost:3001/remoteEntry.js',
				},
				allowedOrigins: [],
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

let config;

if ((args.serve === 'true' && mode === 'production') || mode === 'development') {
	// Start the Webpack server
	config = start({
		appName: 'Host App',
		baseUrl: moduleUrl,
		federationConfigs,
		allowedOrigins: federationConfigs.allowedOrigins,
		port,
		mode,
	});
} else {
	config = getConfig({
		baseUrl: moduleUrl,
		federationConfigs,
		mode,
	});
}

export default config;
