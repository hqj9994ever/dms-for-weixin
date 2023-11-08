const app = getApp()
// pages/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: app.globalData.userId,
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.userId = app.globalData.userId
    wx.setStorage({
      data: this.data.userId,
      key: 'userId',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  ToElectricityInfo: function (e) {
    wx.request({
      url: app.globalData.url + '/wxelectricityinfo/initlist',
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var list = res.data;
        wx.navigateTo({
          url: '/pages/ElectricityInfo/ElectricityInfo?obj=' + JSON.stringify(list)
        })
      }
    })


  }

})