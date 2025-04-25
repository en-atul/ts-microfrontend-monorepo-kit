const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;

const configs = {
  appName: "remoteApp",
  appFileName: "remoteEntry.js",
  PORT: 3001,
  PUBLIC_PATH: "http://localhost:3001/",
  REMOTES: ["hostApp@http://localhost:3000/remoteEntry.js"],
};

let remotes = {};
let REMOTES = configs.REMOTES;
for (let i = 0; i < REMOTES.length; i++) {
  remotes[REMOTES[i].split("@")[0]] = REMOTES[i];
}

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  output: {
    publicPath: configs.PUBLIC_PATH,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: configs.appName,
      filename: configs.appFileName,
      exposes: {
        "./RemoteComponent": "./src/RemoteComponent",
      },
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
};
