//@ts-check

'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node',
  mode: 'none',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
};

/** @type WebpackConfig */
const resourceConfig = {
  entry: "./public/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webview/bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "webview/index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/thrid-party", to: './webview/js' },
		{ from: "public/js", to: './webview/js' },
      ]
    })
  ]
};

module.exports = [ extensionConfig, resourceConfig ];