const merge = require('webpack-merge')

const { join } = require('path')

const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const baseConfig = require('./webpack.base.config.js')

const packageJson = require('../package.json')

module.exports = merge(baseConfig, {
  mode: 'production',

  entry: join(__dirname, '..', 'src', 'index.js'),

  output: {
    filename: 'index.js',
    path: join(__dirname, '..', 'dist'),
    libraryTarget: 'umd',
  },

  optimization: {
    splitChunks: {
      chunks: 'async'
    },
  },

  devtool: false,

  externals: Object.keys(packageJson.dependencies),

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'],
      cleanAfterEveryBuildPatterns: [],
    }),

    new WebpackProgressOraPlugin({
      clear: true,
    })
  ],
})
