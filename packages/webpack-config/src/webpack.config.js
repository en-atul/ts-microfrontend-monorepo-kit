import { merge } from 'webpack-merge';
import { getCommonConfig } from './webpack.common.js';
import devConfig from './webpack.dev.js';
import prodConfig from './webpack.prod.js';

const MODE = process.env.MODE?.trim() || 'development';

const envConfigMap = {
	development: devConfig,
	production: prodConfig,
};

export const getConfig = ({ baseUrl, aliases, federationConfigs }) => {
	const getEnvConfig = envConfigMap[MODE] || devConfig;
	const commonConfig = getCommonConfig({ baseUrl, aliases });
	const envSpecificConfig = getEnvConfig({ baseUrl, configs: federationConfigs });

	return merge(commonConfig, envSpecificConfig);
};
