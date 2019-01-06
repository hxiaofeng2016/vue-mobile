/**
 * 认证接口
 * @type {{ login: ((params?)) }}
 */

// 拦截器
import Ajax from '@/utils/fetch'
import until from '@/utils/until'
import Qs from 'qs'
let base = until.apiPath

// 示例：
const authApi = {
  /**
   * 后台登录
   * @param {String} userName 账号
   * @param {String} password 密码 md5 加密
   * @param {String} opts 配置请求参数
   */
  login(params, opts) {
    const data = Qs.stringify(params)
    return Ajax({
      url: `${base}authentication/sign-in-auth`,
      method: 'post',
      opts,
      data
    })
  }
}

export default authApi
