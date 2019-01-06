const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    vendor: [
      'babel-polyfill',
      'vue/dist/vue.esm.js',
      'vue-router',
      'vuex'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../static/js'),
    filename: 'dll.[name].js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dll/[name]-manifest.json'),
      name: '[name]_library'
    })
  ]
}
