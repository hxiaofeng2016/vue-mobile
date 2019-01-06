'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const HappyPack = require('happypack')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const styleRules = utils.styleLoaders({
  sourceMap: config.dev.cssSourceMap,
  usePostCSS: true
})
// const happypackPlugins = styleRules.map(item => new HappyPack({
//   id: item.use.split('id=')[1],
//   threads: 4,
//   loaders: [item.use.split('id=')[1] + '-loader']
// }))

// css配置happypackPlugins会影响到element-ui样式
const happypackPlugins = [
  new HappyPack({
    id: 'less',
    threads: 2,
    loaders: ['css-loader', 'postcss-loader', 'less-loader']
  })
  // new HappyPack({
  //   id: 'css',
  //   threads: 2,
  //   loaders: ['css-loader', 'postcss-loader']
  // })
]

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: styleRules
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    useLocalIp: true,
    public: `localhost:${config.dev.port}`,
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ?
      {
        warnings: false,
        errors: true
      } :
      false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    ...happypackPlugins,
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // new webpack.DllReferencePlugin({
    //   manifest: require('../vendor-manifest.json')
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    // copy custom static assets
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, '../static'),
    //   to: config.dev.assetsSubDirectory,
    //   ignore: ['.*']
    // }])
    // copy custom static assets
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../src/theme'),
        to: `${config.dev.assetsSubDirectory}/theme`,
        ignore: ['ThemePicker', 'ThemePicker/*']
      },
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.moduleName) {
  let pages = utils.getMultiEntry('./src/' + config.moduleName + '/**/*.html')
  console.log('webpack.dev.conf.js=================')
  console.log(pages)
  for (let pathname in pages) {
    // 配置生成的html文件，定义路径等
    let conf = {
      filename: pathname + '.html',
      template: pages[pathname], // 模板路径
      chunks: [pathname, 'vendors', 'manifest'], // 每个html引用的js模块
      inject: true // js插入位置
    }
    // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
  }
} else {
  devWebpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      inject: true
    })
  )
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://localhost:${port}`
            ]
            // messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
          },
          onErrors: config.dev.notifyOnErrors ?
            utils.createNotifierCallback() :
            undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
