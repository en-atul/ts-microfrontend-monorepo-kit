// import { resolve } from 'path';
// import { createBaseWebpackConfig } from './webpack.base.js';
// import { getFilePaths } from './utils.js';

// const { __dirname } = getFilePaths(import.meta.url);

// const SRC = resolve(__dirname, '../src');
// const PUBLIC = resolve(__dirname, '../public');

// const baseConfig = createBaseWebpackConfig({ srcPath: SRC, publicPath: PUBLIC });

// export default {
// 	...baseConfig,
// 	plugins: [...baseConfig.plugins],
// };

import path from 'path';
import { createBaseWebpackConfig } from './webpack.base.js';
import { getFilePaths } from './utils.js';

const setCommonConfig = ({ baseUrl, aliases = {} }) => {
	const { __dirname } = getFilePaths(baseUrl);

	const SRC = path.resolve(__dirname, './src');
	const PUBLIC = path.resolve(__dirname, './public');

	const baseConfig = createBaseWebpackConfig({ srcPath: SRC, publicPath: PUBLIC, aliases });

	return {
		...baseConfig,
		plugins: [...baseConfig.plugins],
	};
};

export { setCommonConfig };
