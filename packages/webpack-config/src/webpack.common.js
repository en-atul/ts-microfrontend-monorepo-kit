import path from 'path';
import { createBaseWebpackConfig } from './webpack.base.js';
import { getFilePaths } from './utils.js';

const getCommonConfig = ({ baseUrl, aliases = {} }) => {
	const { __dirname } = getFilePaths(baseUrl);

	const SRC = path.resolve(__dirname, './src');
	const PUBLIC = path.resolve(__dirname, './public');

	const baseConfig = createBaseWebpackConfig({ srcPath: SRC, publicPath: PUBLIC, aliases });

	return {
		...baseConfig,
		plugins: [...baseConfig.plugins],
	};
};

export { getCommonConfig };
