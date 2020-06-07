const webpack = require('webpack')

const { join } = require('path')

const WebpackNotifier = require('webpack-notifier')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

const baseConfig = {
  mode: process.env.NODE_ENV,

  target: 'web',

  performance: {
    hints: false,
  },

  resolve: {
    alias: {
      vue: join(__dirname, '..', 'node_modules', 'vue', 'dist', 'vue.runtime.js'),
      '@app': join(__dirname, '..', 'development', 'app.vue'),
      '@': join(__dirname, '..', 'src'),
      'ace-markdown-editor': join(__dirname, '..', 'src', 'index.js'),
      '@plugins': join(__dirname, '..', 'src', 'plugins'),
      '@components': join(__dirname, '..', 'src', 'components'),
    },

    extensions: ['.js', '.vue'],
  },

  module: {
    rules: [
      {
        test: /\.js(\?.*)?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          presets: [
            ['@babel/preset-env']
          ],
          plugins: [
            ['@babel/transform-runtime', {
              corejs: 3,
            }],
            ['@babel/plugin-proposal-class-properties', {
              loose: false
            }]
          ],
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.scss(\?.*)?$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 文件的大小小于10000字节(10kb)的时候会返回一个dataUrl
          limit: 10000,
          // 生成的文件的保存路径和后缀名称
          name: '[name].[hash:7].[ext]',
          esModule: false,
        }
      },
    ]
  },

  plugins: [
    new WebpackNotifier({
      title: 'build completed...',
      alwaysNotify: false,
    }),

    new VueLoaderPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
  ],
}

module.exports = baseConfig
