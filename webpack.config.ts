import * as path from 'path'
import * as fs from 'fs'
import * as webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import pkg from './package.json'

const __mode = process.env["WEBPACK_CONFIG_MODE"] as "development" | "none" | "production" | undefined
const mode = __mode || 'development'

const config: webpack.Configuration = {
	mode: mode,
	devtool: 'inline-source-map',
	entry: {
		react: {
			import: ['react', 'react-dom', 'react-router-dom', 'usehooks-ts']
		},
		utils: {
			import: [
				path.join(__dirname, 'src', 'www', 'utils')
			]
		},
		bootstrap: {
			import: [path.join(__dirname, 'node_modules', 'bootstrap/scss/bootstrap.scss')]
		},
		css: {
			import: [path.join(__dirname, 'src', 'www', 'app.scss')],
			dependOn: ["bootstrap"]
		},
		lib: {
			import: ['bootstrap', 'jose']
		},
		translation: {
			import: [path.join(__dirname, 'src', 'www', 'translation')],
			dependOn: ['utils']
		},
		app: {
			import: path.join(__dirname, 'src', 'www', 'app.tsx'),
			dependOn: ['react', 'lib', 'css', 'utils', 'translation'],
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join('src', 'www', 'app.html'),
			minify: true,
			publicPath: '/',
			filename: 'app.html'
		}),
		new webpack.DefinePlugin({
			__version: JSON.stringify(pkg.version),
			__name: JSON.stringify(pkg.name),
			__mode: JSON.stringify(mode)
		}),
		{
			apply: (c) => {
				c.hooks.afterDone.tap({ name: 'create gitignore' }, (c) => {
					const outdir = c.compilation.outputOptions.path;
					if (outdir) {
						fs.writeFileSync(path.join(outdir, '.gitignore'), "*")
					}
				})
			}
		}
	],
	output: {
		path: path.join(__dirname, 'www.development'),
		filename: 'public/[name].js'
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	optimization: {
		minimize: false,
		runtimeChunk: 'single'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [{
					loader: 'ts-loader',
					options: {
						configFile: path.join(__dirname, "tsconfig.webpack.json"),
					}
				}],
				exclude: /node_modules/,
			},
			{
				test: /\.(scss)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
						options: {

							postcssOptions: {
								plugins: () => [
									require('autoprefixer')
								]
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								outputStyle: 'compressed'
							}
						}
					}
				]
			},
			{
				test: /\.woff(2)?(\?[0-9a-f]*)?$/,
				type: "asset/resource",
				generator: {
					filename: 'public/[name][ext][query]',
				}
			}
		],
	},

}
export default config