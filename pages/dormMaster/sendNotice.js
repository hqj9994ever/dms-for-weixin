// pages/dormMaster/sendNotice.js
const app = getApp();
var util = require('../../utils/util.js');
var image = require('../../utils/image.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newNotice: '',
    itemlist: [],
    modalName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    var that = this;
    var list = [];
    for (let index = 0; index < 30; index++) {
      list.push({
        date:"data"+index,
        notice:"折磨生出苦难，苦难又会加剧折磨，凡间这无穷的循环，将有我来终结！"+index
      })
      
    }
    that.setData({
      itemlist: list
    })
    return


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
          itemlist: list
        })
      }

    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
  },
  showModal(e) {
    this.setData({
      modalName: 'DialogModal1'
    })
  },
  //取消按钮 
  hideModal: function () {
    this.setData({
      modalName: null
    });
  },
  //确认 
  confirm: function () {
    var that = this;
    if (that.data.newNotice != '') {
      console.log(that.data.newNotice)
      wx.request({
        url: app.globalData.url + '/wxbuildingNotice/updateNotice',
        method: "POST",
        header: {
          'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
          'Content-Type': 'application/json'
        },
        data: {
          notice: that.data.newNotice,
          date: util.formatTime(new Date())
        },
        success: function (res) {
          var resDate = res.data;
          console.log(resDate)
          if (resDate.code == 200) {
            wx.showToast({
              title: '发布成功',
              duration: 2000
            })
            that.onShow();
          } else {
            wx.showToast({
              title: '发布失败',
              duration: 2000
            })
          }
        }
      })
    }
    this.setData({
      modalName: null,
      newNotice: ''
    })
    this.onShow();
  },
  newNotice: function (e) {
    var that = this;
    this.setData({
      newNotice: e.detail.value
    })
    this.confirm();
  },
  //删除事件
  del: function (e) {
    var that = this;
    console.log(e.target.dataset.id)
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了

          wx.request({
            url: app.globalData.url + '/wxbuildingNotice/deleteNotice',
            method: "POST",
            header: {
              'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
              'Content-Type': 'application/json'
            },
            data: {
              id: e.target.dataset.id
            },
            success: function (res) {
              console.log(res.date)
              that.onShow();
            }
          })
        } else if (sm.cancel) {

        }
      }
    })
  }


})