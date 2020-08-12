const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebExtWebpackPlugin = require('@ianwalter/web-ext-webpack-plugin')

const plugins = [
  new WebExtWebpackPlugin(),
  new webpack.DefinePlugin({
    'process.env.IS_PROD': false,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
        to: 'browser-polyfill.js',
        context: '../',
        flatten: true,
        transform: function (content) {
          return content.toString().replace('//# sourceMappingURL=browser-polyfill.min.js.map', '')
        },
      }
    ],
  })
];

module.exports = {
  output: {
    path: path.resolve(__dirname, './build'),
    // path: path.resolve(__dirname, './build'),

  },
  // FIX: Module not found: Error: Can't resolve 'fs'
  node: { fs: 'empty' },
  target: 'web',
  plugins,
  /**
   * Only one that works on FF
   * Issue on webpack: https://github.com/webpack/webpack/issues/1194
   * Issue on web-ext toolbox: https://github.com/webextension-toolbox/webextension-toolbox/issues/58
   */
  devtool: 'inline-source-map',
};
