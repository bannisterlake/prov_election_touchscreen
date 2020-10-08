var path = require("path");
var webpack = require("webpack");

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
// var Dotenv = require('dotenv-webpack');


module.exports =(env, argv)=> ({
	entry: { bundle: "./src/index.js" },
	mode: 'development',
	output: {
		path: path.resolve(__dirname, "dist"),

		//mode: production
		filename: argv.mode === 'development' ? 'bundle.js' : "[name].[hash:6].js",


	
		//mode: development
		//filename: "bundle.js"
	},
	node: {
		fs: 'empty'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: "babel-loader",
				options: { presets: ["@babel/env"] }
			},
			{
				test: /\.css$/,
				loader: "style-loader"
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "css-loader",
						options: {
							name: '[name].[hash].[ext]',
							outputPath: 'css/',
							publicPath: 'css/'
						}
					}
				]
			},
			{
				test: /\.html$/,
				use: ['html-loader']
			},
			{
				test: /\.(png|jpg|gif|ico)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'img/',
							publicPath: 'img/'
						}
					}, 
				]
			},
			{
				type: 'javascript/auto',
				test: /\.json$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'data/',
						publicPath: 'data/'
					}
				}]

			}
		]
	},

	plugins: [
		// new webpack.EnvironmentPlugin({
		// 	PROV: env.PROV
		// }),
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.html',
			filename: 'index.html'
		}),
		new CleanWebpackPlugin(['dist']),
		new CopyWebpackPlugin([
			{
				from: '*.json', 
				to: 'data/',
				toType: 'dir',
				context: 'src/data/'
			},
			{
				from: 'election.config.json',
				to: '',
				context: 'src/'
			},
			{
				from: '*', 
				to: 'img/',
				context: 'src/img'
			},
			{
				from: '*',
				to: 'headshots/',
				context: 'src/headshots'
			},
			{
				from: '*.json',
				to: '',
				context: 'src/'
			}
		])

	],
	devServer: {
		host: '0.0.0.0',
		contentBase: path.join(__dirname, "src/"),
		port: 3000,
		publicPath: "http://localhost:3000/dist/"
	}

});