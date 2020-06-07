const webpack = require('webpack')

const merge = require('webpack-merge')

const { join } = require('path')

const Webpackbar = require('webpackbar')

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const baseConfig = require('./webpack.base.config.js')

const os = require('os')

const portfinder = require('portfinder')

const iptools = function () {
  let ip = '0.0.0.0'
  let interfaces = os.networkInterfaces()
  for (let key in interfaces) {
    const items = interfaces[key]
    for (let item of items) {
      if (item.family === 'IPv4' && !item.internal && item.address !== '127.0.0.1') {
        ip = item.address
        return ip
      }
    }
  }
}

const devConfig = merge(baseConfig, {
  entry: {
    main: join(__dirname, '..' ,'development', 'main.js'),
  },

  output: {
    filename: './[name].js',
    path: join(__dirname, '..', 'dist'),
    publicPath: '',
  },

  devtool: '#cheap-module-source-map',

  plugins: [
    new Webpackbar({ color: '#f46a97' }),

    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      template: join(__dirname, '..', 'development', 'template.html'),
      filename: 'index.html',
    }),

    new FaviconsWebpackPlugin(join(__dirname, '..', 'logo.png'))
  ],
})

module.exports = () => new Promise(async (resolve, reject) => {
  portfinder.basePort = 8066
  portfinder.getPort((err, port) => {
    if (err) return reject(err)
    portfinder.basePort = port
    devConfig.plugins.push(
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`您的项目运行在 http://localhost:${port}`],
          notes: [`您也可以查看您的 电脑ip + 端口号 ( http://${iptools()}:${port} ) 来访问！`]
        },
        clearConsole: true,
      })
    )
    resolve({devConfig, port})
  })
})
