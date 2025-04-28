import { merge } from 'webpack-merge';
import commonConfig from './webpack.common.js';
import devConfig from './webpack.dev.js';
import prodConfig from './webpack.prod.js';

const MODE = process.env.MODE || 'development';

let envConfig;
if (MODE === 'development') {
	envConfig = devConfig;
} else {
	envConfig = prodConfig;
}

export default merge(commonConfig, envConfig);
