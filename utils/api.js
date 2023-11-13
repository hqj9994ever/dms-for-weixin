const app = getApp()
function request(url, options,toToast=true) {
  if(url.indexOf("/login")== -1 && !getUserType()){
    return false;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.url}${url}`,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      success(request) {
        if(toToast){
          wx.showToast({
            title: request.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        if (request.data.statusCode === 200) {
          resolve(request.data.dataZone)
        } else {
          reject(request.data.dataZone)
        }
      },
      fail(error) {
        wx.showToast({
          title: '网络异常，请重新再试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  })
}

const get = (url, options = {}) => {
  return request(url, { method: 'GET', data: options })
}
const post = (url, options,toToast) => {
  return request(url, { method: 'POST', data: options },toToast)
}
const put = (url, options) => {
  return request(url, { method: 'PUT', data: options })
}
// 不能声明DELETE（关键字）
const remove = (url, options) => {
  return request(url, { method: 'DELETE', data: options })
}
//设置缓存
const setStorageString = (key, value) => {
  wx.setStorageSync(key,value)
}
//设置缓存
const setStorageObject = (key, value) => {
  wx.setStorageSync(key,JSON.stringify(value))
}
//获取缓存String
const getStorageString = (key) => {
  return wx.getStorageSync(key)||''
}
//获取缓存Object
const getStorageObject = (key) => {
  return JSON.parse(wx.getStorageSync(key)||'{}')
}
//移除缓存
const removeStorage = (key) => {
  wx.removeStorageSync(key);
}
// 清空所有缓存
const clearAll = () => {
  wx.clearStorageSync();
}

//获取本地用户数据 izGetUser 是否获取用户数据
const getUserType = () => {
  let userType = getStorageString("userType")||''
  if(userType){
    return userType;
  }else{
    wx.showToast({
      title: '检测到未登录，跳转登录页面',
      icon: 'none',
      duration: 2000
    })
    clearAll();
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }, 1500);
    return false
  }
}
export default {
  get,
  post,
  put,
  remove,
  setStorageString,
  setStorageObject,
  getStorageString,
  getStorageObject,
  removeStorage,
  clearAll,
  getUserType
}