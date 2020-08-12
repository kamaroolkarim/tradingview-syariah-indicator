const path = require('path')
const webpack = require('webpack')
const cssnano = require('cssnano')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const plugins = [
  new webpack.DefinePlugin({
    'process.env.IS_PROD': true,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
        to: 'browser-polyfill.js',
        context: '../',
        flatten: true,
        transform: function (content) {
          return content.toString().replace('//# sourceMappingURL=browser-polyfill.min.js.map', '')
        },
      },
    ]
  }),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: cssnano,
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true,
  }),
  new HtmlMinifierPlugin({
    filename: './popup/popup.html',
    caseSensitive: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    keepClosingSlash: true,
    minifyCSS: true,
    removeComments: true,
    removeRedundantAttributes: true,
    quoteCharacter: '\''
  })
]

module.exports = {
  output: {
    path: path.join(__dirname, './release/build'),
    // path: path.resolve(__dirname, './release/build'),
  },
  target: 'web',
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        // cache: true,
        // parallel: true,
        sourceMap: true,
        extractComments: false,
        terserOptions: {
          // ecma: 6,
          comments: false,
          // compress: {
          //   drop_console: true,
          // },
        }
      }),
    ],
  },
  plugins,
  // Prefer size and performance
  devtool: 'cheap-module-source-map',
}
