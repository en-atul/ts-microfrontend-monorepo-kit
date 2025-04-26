const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const MODE = process.env.MODE || 'development';

let envConfig;
if (MODE === 'development') {
	envConfig = require('./webpack.dev.js');
} else {
	envConfig = require('./webpack.prod.js');
}

module.exports = merge(commonConfig, envConfig);
