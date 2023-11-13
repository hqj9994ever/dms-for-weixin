// pages/dormNotice/dormNotice.js
import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    api.post("callboard/list").then(res => {
      that.setData({
        noticeList: res.callboards
      })
    }).catch(err => {})
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