const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const createBaseWebpackConfig = ({ srcPath, publicPath, aliases = {} }) => {
  const ROOT = path.resolve(__dirname, '../../');
  const PACKAGES = {
    ui: path.join(ROOT, 'packages/ui/src'),
    utils: path.join(ROOT, 'packages/utils/src'),
  };

  const babelConfigPath = path.join(ROOT, 'babel.config.js');

  return {
    entry: path.join(srcPath, 'index.tsx'),

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss'],
      alias: {
        '@': srcPath,
        '@ts-microfrontend-monorepo-kit/ui': PACKAGES.ui,
        '@ts-microfrontend-monorepo-kit/utils': PACKAGES.utils,
        ...aliases, 
      },
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [srcPath, ...Object.values(PACKAGES)],
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              configFile: babelConfigPath,
            },
          },
        },
        {
          test: /\.module\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { modules: true, importLoaders: 1 },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /\.module\.(scss|sass)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset',
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf)$/,
          type: 'asset/resource',
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(publicPath, 'index.html'),
      }),
      new Dotenv(),
    ],
  };
};

module.exports = { createBaseWebpackConfig };
