/**
 * API配置文件
 */
const apiPath = process.env.NODE_ENV === 'production' ? '/' : '/api/' // api
/**
 * 二级域名
 */
const apiSlDomain = {
  default: '/'
}

// 自定义移动端适配方案
window.onresize = function() {
  InitSize()
}
InitSize()
function InitSize() {
  var windowWidth = null
  var Html = document.getElementsByTagName('html')[0]
  if (window.innerWidth) {
    windowWidth = window.innerWidth
  } else if (document.body && document.body.clientWidth) {
    windowWidth = document.body.clientWidth
  }
  windowWidth < 640 ? '' : (windowWidth = 640)
  Html.style.fontSize = (windowWidth / 160) * 7 + 'px'
}

module.exports = {
  apiPath
}
