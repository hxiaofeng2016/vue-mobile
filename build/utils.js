'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const glob = require('glob')
const fs = require('fs')

exports.assetsPath = function (_path) {
  const assetsSubDirectory =
    process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // 将less变量设置为全局
  const sassResourcesLoader = {
    loader: 'sass-resources-loader',
    options: {
      resources: [
        path.resolve(__dirname, '../src/assets/style/common/basic.less')
      ],
      publicPath: '/'
    }
  }

  // 读取less文件并转为json
  function getLessVariables(file) {
    let themeContent = fs.readFileSync(file, 'utf-8')
    let variables = {}
    themeContent.split('\n').forEach(function (item) {
      if (item.indexOf('//') > -1 || item.indexOf('/*') > -1) {
        return
      }
      let _pair = item.split(':')
      if (_pair.length < 2) return
      let key = _pair[0].replace('\r', '').replace('@', '')
      if (!key) return
      let value = _pair[1]
        .replace(';', '')
        .replace('\r', '')
        .replace(/^\s+|\s+$/g, '')
      variables[key] = value
    })
    return variables
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    let isLess = loader === 'less'
    const theme = config.theme ?
      path.resolve(
        __dirname,
        '../src/assets/style/theme/' + config.theme + '.less'
      ) :
      null
    const loaders = options.usePostCSS ?
      [cssLoader, postcssLoader] :
      [cssLoader]

    if (loader) {
      if (isLess && theme) {
        loaderOptions = {
          modifyVars: getLessVariables(theme)
        }
      }
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
          publicPath: '/'
        })
      })
    }

    // 设置less全局变量
    if (isLess) {
      loaders.push(sassResourcesLoader)
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    // 根据配置打包不同主题
    // less: generateLoaders('less', {
    //   "sourceMap": true,
    //   "modifyVars": getLessVariables(config.theme)
    // }),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      // use: loader
      use: loader === 'less' ? `happypack/loader?id=${extension}` : loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

//获取多级的入口文件
exports.getMultiEntry = function (globPath) {
  let entries = {},
    basename,
    tmp,
    pathname

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry))
    // 以entry为入口点关键词
    if (basename.indexOf('entry') > -1) {
      let temp = basename.split('-')
      basename = temp[temp.length - 1]
    }

    tmp = entry.split('/').splice(-4)
    // console.log(entry, tmp, basename);
    let pathsrc = tmp[0] + '/' + tmp[1]
    if (tmp[0] == 'src') {
      pathsrc = tmp[1]
    }
    //console.log(pathsrc)
    pathname = pathsrc + '/' + basename // 正确输出js和html的路径
    entries[pathname] = entry
    // console.log(pathname + '-----------' + entry);
  })

  return entries
}
