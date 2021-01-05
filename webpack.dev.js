// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/client/index.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
  },
  stats: 'verbose',
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        // ASSET LOADER
        test: /\.(woff|woff2|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
        },
      },
      {
        // IMAGE LOADER
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/views/index.html',
      chunks: ['index'],
      filename: 'index.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/about.html',
      chunks: ['index'],
      filename: 'about.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/blog/blog.html',
      chunks: ['index'],
      filename: 'blog.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/blog/blogAbout.html',
      chunks: ['index'],
      filename: 'aboutBlog.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/blog/blogPost.html',
      chunks: ['index'],
      filename: 'postBlog.html',
    }),
    new CleanWebpackPlugin({
      // Simulate the removal of files
      dry: true,
      // Write Logs to Console
      verbose: true,
      // Automatically remove all unused webpack assets on rebuild
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: false,
    }),
  ],
};
