import wepy from 'wepy'
import Tips from './tips'
const USER_TOKEN_KEY = 'user_token_key'
// const prefix = 'https://qcloud.microvcard.com/9.6.3/public/index.php/'
const prefix = 'https://yace.microvcard.com/test/public/index.php/'
export default class WXRequest {
    static token = 0

    static init (app) {
      this.app = app
    }
    static async request (method, url, data, loading = true, endpoint = '/') {
    if (loading) {
      Tips.navLoading()
    }
    // let reqURL = 'https://still-castle-28094.herokuapp.com/todos' + url
    // let reqURL = 'https://qcloud.microvcard.com/9.6.3/public/index.php/' + endpoint
    let reqURL = prefix + endpoint
    if(!this.token){
      console.log('没有token，请求token', this.token)
      let {code} =  await wepy.login()
      console.log(code)
      let tokendata = await wepy.request({
        url:prefix + 'token',
        method:'post',
        data: {
          code: code
        }
      })
      this.app.openid = tokendata.data.openid
      console.log('data',tokendata,this.app)
      if(tokendata.statusCode >= 200 && tokendata.statusCode < 400){
        this.token = tokendata.data.session_key
      } else {
        Tips.modal('token请求失败'+JSON.stringify(tokendata.data))
        return 0;
      }
    } else {
      console.log('有token', this.token)
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
        console.log('res.data', res.data)
        return res.data
      } else if (res.statusCode === 400) {
        console.log('token失效了,重新请求')
        // this.token = 0
        return this.request(method, url, data, loading, endpoint)
      } else {
        Tips.modal('请求失败，'+ url +JSON.stringify(res.data))
      }
    })
    .catch((res) => {
      Tips.confirm('网络连接失败，请稍后重试'+url+JSON.stringify(res.data),(r)=>{
        if(r){
          return this.request(method, url, data, loading, endpoint)
        }
      })
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
