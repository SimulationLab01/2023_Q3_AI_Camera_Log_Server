import * as path from 'path'
import { merge } from 'webpack-merge';
const __mode = process.env["WEBPACK_CONFIG_MODE"] = "production"
import config from './webpack.config';

module.exports = merge(config, {
	mode: __mode,
	devtool: false,
	optimization: {
		minimize: true,
	},
	output: {
		path: path.join(__dirname, 'www'),
	},
});
