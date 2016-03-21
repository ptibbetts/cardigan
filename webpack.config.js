var path = require('path');
var webpack = require('webpack');

module.exports = function(cardiganConfig) {

	"use strict";

	var config = {
		entry: {
			'fabricator/scripts/fabricator': cardiganConfig.src.scripts.fabricator,
			'toolkit/scripts/toolkit': cardiganConfig.src.scripts.toolkit
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
					loaders: ['babel'],
					presets: ['es2015', 'stage-2']
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
