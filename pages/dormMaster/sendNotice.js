// pages/dormMaster/sendNotice.js
import api from '../../utils/api'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newNotice: '',
    noticeList: [],
    showView: false,
    userType: '',
    user:{},
    info:''
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
  onShow: function () {
    var that = this;
    api.post("callboard/list").then(res => {
      that.setData({
        noticeList: res.callboards
      })
    }).catch(err => {})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
  },
  showView(e) {
    this.setData({
      showView: true
    })
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
  //取消按钮 
  hideView: function () {
    this.setData({
      showView: false
    });
  },
  //发布公告
  confirm: function () {
    var that = this;
    if(that.data.newNotice.length == 0){
      wx.showToast({
        title: '公告内容不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    api.post("callboard/optAdd",{
      adminiId:that.data.user.id,
      date:util.formatTime(new Date()),
      content:that.data.newNotice,
      adminiName:that.data.user.name
    }).then(res => {
      that.setData({
        showView: false,
        newNotice: ''
      })
      that.onShow();
    }).catch(err => {
      that.setData({
        showView: false,
        newNotice: ''
      })
    })
  },
  //发布内容
  newNotice: function (e) {
    this.setData({
      newNotice: e.detail.value
    })
  },
  //删除事件
  del: function (e) {
    var that = this,id = e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          api.post("callboard/optDel",{
            id:id
          }).then(res => {
            that.onShow();
          }).catch(err => {
          })
        } else if (sm.cancel) {}
      }
    })
  }


})