var path = require('path');
var webpack = require('webpack');

var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// CSS
var atImport = require('postcss-easy-import');
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-import');
var precss = require('precss');
var atRoot = require('postcss-atroot');
var bemAtRules = require('postcss-bem');
var bemLinter = require('postcss-advanced-variables');
var colorguard = require('colorguard');
var cssMQPacker = require('css-mqpacker');
var cssnano = require('cssnano');
var csso = require('gulp-csso');
var cssVariables = require('postcss-css-variables');
var currentSelector = require('postcss-current-selector');
var maps = require('postcss-map');
var nestedProps = require('postcss-nested-props').default;
var propertyLookup = require('postcss-property-lookup');
var reporter = require('postcss-reporter');
var stylelint = require('stylelint');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpackServerURL = 'http://localhost:8080';

module.exports = {
  entry: [
    'babel-polyfill',
		'webpack-dev-server/client?' + webpackServerURL + '/',
		'webpack/hot/only-dev-server',
    './src/assets/scripts/entry'
  ],
  output: {
			path: 'dist/assets/scripts',
      publicPath: '/assets/scripts',
      filename: 'bundle.js'
  },
	devServer: {
		contentBase: './dist/'
	},
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ["es2015"],
        }
      },
			{
        test: /\.css$/,
				include: path.join(__dirname,'src'),
        loader: ExtractTextPlugin.extract(
					'style-loader',
					'css-loader!postcss-loader')
      }
		]
  },
	postcss: function(webpack) {
    return [
      postcssImport({ addDependencyTo: webpack })
			// currentSelector,
			// nestedProps,
			// atRoot,
			// bemAtRules,
			// colorguard,
			// cssVariables,
			// precss,
			// maps,
			// propertyLookup,
			// cssMQPacker,
			// autoprefixer,
			// cssnano,
			// csso,
			// reporter,
			// bemLinter,
			// stylelint
    ];
  },
	plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: webpackServerURL
    },
    {
      reload: false
    }),
		// Output the CSS as a single CSS file and set its name.
    new ExtractTextPlugin('dist/styles.css', { allChunks: true }),
    new webpack.HotModuleReplacementPlugin()
  ],
	debug: true
};
