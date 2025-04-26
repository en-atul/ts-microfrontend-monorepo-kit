const path = require('path');
const { createBaseWebpackConfig } = require('../../configs/webpack.base');

const SRC = path.resolve(__dirname, '../src');
const PUBLIC = path.resolve(__dirname, '../public');

const baseConfig = createBaseWebpackConfig({ srcPath: SRC, publicPath: PUBLIC });

module.exports = {
	...baseConfig,
	plugins: [...baseConfig.plugins],
};
