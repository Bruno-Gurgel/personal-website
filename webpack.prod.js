/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
/* eslint-enable */
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/client/index.js',
    blog: './src/client/blog.js',
    landingPage: './src/client/landingPage.js',
    weatherApp: './src/client/weatherApp.js',
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      {
        test: '/.js$/',
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      sourcemap: true,
      // Was not founding the files because there was an "auto" before them
      modifyURLPrefix: {
        'auto./': '',
        // eslint-disable-next-line prettier/prettier
        auto: '',
      },
      inlineWorkboxRuntime: true,
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          ],
        ],
      },
    }),
  ],
};
