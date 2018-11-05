const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode : 'production',
	entry: "./client/index.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js",
		publicPath: '/'
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin()
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.join(__dirname, 'client'),
					path.join(__dirname, 'shared')
				],
				use: [ 'babel-loader' ]
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "sass-loader",
					options: {
						includePaths: ["client/styles"]
					} // compiles Sass to CSS
				}]
			},
			{
				test: /\.css$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}]
			}
		]
	},
	resolve: {
		extensions: [ '*', '.js' ]
	}
};
