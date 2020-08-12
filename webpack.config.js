// import "@std/esm"

// import EsmWebpackPlugin from "esm-webpack-plugin";
const path = require('path')
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.dev.config')
const prodConfig = require('./webpack.prod.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpackConfig = {
  context: path.join(__dirname, 'src'),
  entry: {
    'bg': './bg.js',
    'helper': './helper.js',
    'page/chart': './page/chart.js',
    'page/screener': './page/screener.js',
    'page/symbols': './page/symbols.js',
    'popup/popup': './popup/popup.js',
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
  resolve: {
    extensions: ['.js'],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
          }
        ],
      },
    ],
  },
  target: 'web',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: '**/*.html' },
        { from: '**/*.css' },
      ],
    })
  ],
}

module.exports = (env, argv) => {
  let envConfig

  if (argv.mode === 'development') {
    envConfig = devConfig
    envConfig.mode = 'development'
  }

  if (argv.mode === 'production') {
    envConfig = prodConfig
    envConfig.mode = 'production'
  }
  
  return merge(webpackConfig, envConfig)
}
