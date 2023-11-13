// pages/attendance/attendance.js

import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
    userType: '',
    user: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userType = api.getUserType()
    let user = api.getStorageObject(userType)
    this.setData({
      userType: userType,
      user: user
    })
  },
  onShow: function () {
    var that = this;
    api.post("illegalRecord/optAll", {
      stuId: that.data.user.stuId,
    }).then(res => {
      that.setData({
        noticeList: res.illegalRecords
      })
    }).catch(err => { })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
  },
  //看详情
  showModal: function (e) {
    this.setData({
      info:  e.target.dataset.content,
      modalName: e.currentTarget.dataset.target
    });
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
})