'use strict'

/**
 * 功能项：单页面多页面配置、sass-resource-loader
 * 优化项：dllPlugin、happypack
 */
const path = require('path')
// const webpack = require('webpack')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const HappyPack = require('happypack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// const createLintingRule = () => ({
//   test: /\.(js|vue)$/,
//   loader: 'eslint-loader',
//   enforce: 'pre',
//   include: [resolve('src'), resolve('test')],
//   options: {
//     formatter: require('eslint-friendly-formatter'),
//     emitWarning: !config.dev.showEslintErrorsInOverlay
//   }
// })

// 单页面入口
let entries = {
  // vendor: ['vue', 'vuex', 'vue-router'],
  app: './src/main.js'
}

// 多页面入口配置
if (config.moduleName) {
  console.log("********webpack.base.conf.js*******");
  entries = utils.getMultiEntry('./src/' + config.moduleName + '/**/entry-*.js'); // 获得入口js文件
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: entries,
  // entry: {
  //   app: './src/main.js'
  // },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        // loader: 'babel-loader',
        use: 'happypack/loader?id=babel',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/vue-echarts'),
          resolve('node_modules/resize-detector')
          // resolve('node_modules/webpack-dev-server/client')
        ],
        // exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        // use: 'happypack/loader?id=url',
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        },
        include: [
          resolve('src')
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        // use: 'happypack/loader?id=url',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        // use: 'happypack/loader?id=url',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'babel',
      threads: 4,
      loaders: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
      }]
    }),
    // new HappyPack({
    //   id: 'url',
    //   threads: 4,
    //   loaders: ['url-loader']
    // })
    // split vendor js into its own file
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
