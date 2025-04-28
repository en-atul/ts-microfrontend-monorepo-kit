import { merge } from 'webpack-merge';
import { setCommonConfig } from './webpack.common.js';
import devConfig from './webpack.dev.js';
import prodConfig from './webpack.prod.js';

const MODE = process.env.MODE || 'development';

const getConfig = ({ baseUrl, aliases, configs, deps }) => {
	let envConfig;
	if (MODE === 'development') {
		envConfig = devConfig({ baseUrl, configs: configs.development, deps });
	} else {
		envConfig = prodConfig;
	}

	const commonConfig = setCommonConfig({ baseUrl, aliases });
	return merge(commonConfig, envConfig);
};

export { getConfig };
