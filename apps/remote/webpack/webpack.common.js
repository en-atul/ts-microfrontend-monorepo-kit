import { resolve } from 'path';
import { createBaseWebpackConfig } from '../../configs/webpack.base.js';
import { getFilePaths } from '../../configs/utils.js';

const { __dirname } = getFilePaths(import.meta.url);

const SRC = resolve(__dirname, '../src');
const PUBLIC = resolve(__dirname, '../public');

const baseConfig = createBaseWebpackConfig({ srcPath: SRC, publicPath: PUBLIC });

export default {
	...baseConfig,
	plugins: [...baseConfig.plugins],
};
