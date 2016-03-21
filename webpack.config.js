var path = require('path');
var webpack = require('webpack');

module.exports = function(cardiganConfig) {

	"use strict";

	var config = {
		entry: {
			'scripts/index': cardiganConfig.src.scripts
		},
		output: {
			path: path.resolve(__dirname, cardiganConfig.dest, 'assets'),
			filename: '[name].js'
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules|prism\.js)/,
					loaders: ['babel-loader']
				}
			]
		},
		plugins: [],
		cache: {}
	};

	if (!cardiganConfig.dev) {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin()
		);
	}

	return config;

};
