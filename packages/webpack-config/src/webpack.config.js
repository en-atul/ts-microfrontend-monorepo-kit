import { merge } from 'webpack-merge';
import { getCommonConfig } from './webpack.common.js';
import devConfig from './webpack.dev.js';
import prodConfig from './webpack.prod.js';

const envConfigMap = {
	development: devConfig,
	production: prodConfig,
};

export const getConfig = ({ mode, baseUrl, aliases, federationConfigs }) => {
	const getEnvConfig = envConfigMap[mode] || devConfig;
	const commonConfig = getCommonConfig({ mode, baseUrl, aliases });
	const envSpecificConfig = getEnvConfig({ baseUrl, configs: federationConfigs });

	return merge(commonConfig, envSpecificConfig);
};
