// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/client/index.js',
    blog: './src/client/blog.js',
    landingPage: './src/client/landingPage.js',
    weatherApp: './src/client/weatherApp.js',
    newsAnalyzer: './src/client/newsAnalyzer.js',
    travelApp: './src/client/travelApp.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
  },
  stats: 'verbose',
  output: {
    filename: '[name].js',
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
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
      chunks: ['blog'],
      filename: 'blog.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/blog/blogAbout.html',
      chunks: ['blog'],
      filename: 'aboutBlog.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/blog/blogPost.html',
      chunks: ['blog'],
      filename: 'postBlog.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/landing_page/landingPage.html',
      chunks: ['landingPage'],
      filename: 'landingPage.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/weather_app/weatherApp.html',
      chunks: ['weatherApp'],
      filename: 'weatherApp.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/news_analyzer/newsAnalyzer.html',
      chunks: ['newsAnalyzer'],
      filename: 'newsAnalyzer.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/travel_app/travelApp.html',
      chunks: ['travelApp'],
      filename: 'travelApp.html',
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
