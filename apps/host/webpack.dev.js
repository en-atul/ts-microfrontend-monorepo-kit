const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;

const configs = {
  appName: "hostApp",
  appFileName: "remoteEntry.js",
  PORT: 3000,
  PUBLIC_PATH: "http://localhost:3000/",
  REMOTES: ["remoteApp@http://localhost:3001/remoteEntry.js"],
};

let remotes = {};
let REMOTES = configs.REMOTES;
for (let i = 0; i < REMOTES.length; i++) {
  remotes[REMOTES[i].split("@")[0]] = REMOTES[i];
}

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-module-source-map",
  output: {
    publicPath: configs.PUBLIC_PATH,
  },
  devServer: {
    port: configs.PORT,
    hot: true,
    open: true,
    historyApiFallback: true,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: configs.appName,
      filename: configs.appFileName,
      exposes: {},
      remotes,
      shared: {
        ...deps,
        react: {
          singleton: true,
          eager: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new ReactRefreshWebpackPlugin(),
  ],
});
