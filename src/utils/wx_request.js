import wepy from 'wepy'
import Tips from './tips'
const USER_TOKEN_KEY = 'user_token_key'
const prefix = 'tcloud'
export default class WXRequest {
    static token = 0
  static async request (method, url, data, loading = true, endpoint = '/') {
    if (loading) {
      Tips.navLoading()
    }
    // let reqURL = 'https://still-castle-28094.herokuapp.com/todos' + url
      let reqURL = `https://${prefix}.microvcard.com/9.6.3/public/index.php/` + endpoint
      if(!this.token){
        console.log(this.token)
        console.log("没有token")
        let {code} =  await wepy.login();
        console.log(code)
          let {data:{session_key}} = await wepy.request({
              url:`https://${prefix}.microvcard.com/9.6.3/public/index.php/token`,
              method:'post',
              data: {
                  code: code
              }
          })
          console.log(session_key)
          this.token = session_key
      }
    return wepy.request({
      url: reqURL,
      method: method || 'GET',
      data: data,
      header: {
        'Content-Type': 'application/json', 'token':this.token
      }
    })
    .then((res) => {
      Tips.loaded()
      if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log(res.data)
        return res.data
      } else {
        var error = {}
        error.statusCode = res.statusCode
        error.code = res.data.code
        error.message = res.data.error
        Tips.error(error.message)
        throw error
      }
    })
  }

  static get (url, data, loading = true) {
    console.log("调用get")
    return this.request('GET', url, data, loading, 'mycard')
  }

  static put (url, data, loading = true) {
    return this.request('POST', url, data, loading, 'edit')
  }
  static canvas (data) {
      return this.request('GET', '/', data,true, 'canvas')
  }
  static post (url, data, loading = true) {
    return this.request('POST', url, data, loading)
  }

  static patch (url, data, loading = true) {
    return this.request('PATCH', url, data, loading)
  }

  static delete (url, data, loading = true) {
    return this.request('DELETE', url, data, loading)
  }
}
