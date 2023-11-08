// pages/dormNotice/dormNotice.js
const app = getApp();
var image = require('../../utils/image.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
    image:image.imageList.leaderImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    wx.request({
      url: app.globalData.url + '/wxbuildingNotice/noticeList',
      method: "GET",
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'Content-Type': 'application/json'
      },
      data: {},
      success: function (res) {
        var list = res.data;
        console.log(list);
        that.setData({
          noticeList: list
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  }
})