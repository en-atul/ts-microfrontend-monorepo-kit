import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.js';

const app = express();
const compiler = webpack(webpackConfig);

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const PROTOCOL = process.env.PROTOCOL || (process.env.NODE_ENV === 'production' ? 'https' : 'http');

const allowedOrigins = ['http://localhost:3000/'];
const isDevelopment = process.env.MODE === 'development';

app.use('/remoteEntry.js', (req, res, next) => {
	const referer = req.get('origin') || req.get('referer');

	if (allowedOrigins.some((origin) => referer && referer.startsWith(origin))) {
		return next();
	}

	res.status(403).send('Forbidden: Referer not allowed');
});

if (isDevelopment) {
	// Webpack middlewares
	app.use(
		webpackDevMiddleware(compiler, {
			publicPath: webpackConfig.output.publicPath,
			stats: 'minimal',
		}),
	);
	app.use(webpackHotMiddleware(compiler));
} else {
	// Static file handling for production
	app.use(express.static(path.resolve(__dirname, 'dist')));
}

// Handle everything else
app.get('/', (req, res) => {
	const filePath = isDevelopment
		? path.join(compiler.outputPath, 'index.html')
		: path.resolve(__dirname, 'dist', 'index.html');

	res.sendFile(filePath);
});

app.listen(PORT, () => {
	console.log(`\n🚀 [\x1b[35mRemote App\x1b[0m] running at ${PROTOCOL}://${HOST}:${PORT}\n`);
});
