const { merge } = require("webpack-merge");
const commonConfig = require('./webpack.common'); // Common config shared by both dev and prod

const ENV = process.env.NODE_ENV || 'development';

let envConfig;
if (ENV === 'development') {
  envConfig = require('./webpack.dev.js');  // Development config
} else {
  envConfig = require('./webpack.prod.js');  // Production config
}

module.exports = merge(commonConfig, envConfig);
