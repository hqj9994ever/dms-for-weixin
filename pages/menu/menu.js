const app = getApp()
import api from '../../utils/api'
// pages/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    user:{},
    userType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userType = api.getUserType()
    let user = api.getStorageObject(userType)
    this.setData({
      userType: userType,
      user:user
    })
  },
  //退出登录
  outLogin: function () {
    api.clearAll();
    wx.showToast({
      title: '正在退出',
      icon: 'none',
      duration: 2000
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }, 1500);
  },
})