const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.config");

const app = express();
const compiler = webpack(webpackConfig);

const PORT = 3001;

const allowedOrigins = ["http://localhost:3000/"];
const isDevelopment = process.env.NODE_ENV === "development";

app.use("/remoteEntry.js", (req, res, next) => {
  const referer = req.get("origin") || req.get("referer");

  if (allowedOrigins.some((origin) => referer && referer.startsWith(origin))) {
    return next();
  }

  res.status(403).send("Forbidden: Referer not allowed");
});

if (isDevelopment) {
  // Webpack middlewares
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: "minimal",
    })
  );
  app.use(webpackHotMiddleware(compiler));
} else {
  // Static file handling for production
  app.use(express.static(path.resolve(__dirname, "dist")));
}

// Handle everything else
app.get('/', (req, res) => {
    const filePath = isDevelopment
      ? path.join(compiler.outputPath, 'index.html')
      : path.resolve(__dirname, 'dist', 'index.html');
  
    res.sendFile(filePath);
  });

app.listen(PORT, () => {
  console.log(`🚀 Remote app running at http://localhost:${PORT}`);
});
