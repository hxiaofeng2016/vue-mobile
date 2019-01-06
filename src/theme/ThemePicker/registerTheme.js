/**
 * 切换主题
 * @param {String} theme 主题文件名
 * @param {Boolean} save 是否本地缓存
 * eg. registerTheme('')
 */
export function registerTheme(theme, save = true) {
  let less = null
  let existedTheme = document.getElementById('theme')
  let bodyTag = document.getElementsByTagName('body')[0]
  if (existedTheme) {
    bodyTag.removeChild(existedTheme)
  }
  if (theme && theme !== 'default') {
    let themeLink = document.createElement('link')
    themeLink.id = 'theme'
    themeLink.rel = 'stylesheet/less'
    themeLink.type = 'text/css'
    themeLink.href = `static/theme/${theme}.less`
    bodyTag.appendChild(themeLink)
    new Promise(resolve => {
      if (!less) {
        less = require('less')
      }
      resolve(less)
    }).then(less => {
      less.registerStylesheets()
      less.modifyVars()
    })
  }
  if (save) {
    let storage = window.localStorage
    storage.setItem('theme', theme)
  }
}
