const app = getApp()

const request = (url, options,toToast=true) => {
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
          reject(request.data.message)
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
const post = (url, options) => {
  return request(url, { method: 'POST', data: options })
}
const put = (url, options) => {
  return request(url, { method: 'PUT', data: options })
}
// 不能声明DELETE（关键字）
const remove = (url, options) => {
  return request(url, { method: 'DELETE', data: options })
}


/**
 * 本地存储getter/setter
 *
 * @param  {String}        key 本地缓存中的指定的`key`
 * @param  {Object|String} val 需要存储的内容(不指定表示`getter`)
 * @return {Promise}
 */
const wxStorage = (key, val) => {
  let isSetter = arguments.length === 2;
  return new Promise((resolve, reject) => {
    // setter
    if (isSetter) {
      return wx.setStorage({
        key: key,
        data: val,
        success: () => resolve(val),
        fail: (err) => reject(err)
      });
    }
    // getter
    try {
      resolve(wx.getStorageSync(key));
    } catch (e) {
      reject(e);
    }
  });
}

export default {
  get,
  post,
  put,
  remove,
  wxStorage
}