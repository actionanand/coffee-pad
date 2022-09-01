const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  // entry: './main.js',
  context: __dirname,
  entry: path.join(__dirname, 'main.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js'
  },
  devServer: {
    allowedHosts: [
      'all'
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './vendor/vendor.js', to: './' }, // output path is 'public' folder, already defined.
        { from: './assets', to: './assets' },
        // { from: './src/styles.css', to: './' }
      ]
    }),
  ]
}