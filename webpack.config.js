var webpack = require('webpack')

module.exports = {
	entry: { app: './app.js' },
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: `jshint-loader`,
				enforce: 'pre'
			}
		]
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				jshint: {
					camelcase: true,
					emitErrors: false,
					failOnHint: false,
					esversion: 8,
					asi: true
				}
			}
		})
	],
	devServer: {
		publicPath: '/',
		contentBase: './public',
		inline: true,
		host: '0.0.0.0',
		port: 8888,
		open: true
	},
	resolve: {
		extensions: ['.js', '.es6']
	}
}
