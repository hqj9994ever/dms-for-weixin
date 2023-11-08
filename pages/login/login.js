// pages/login/login.js
import api from '../../utils/api'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    username: '',
    password: '',
    dateList: ["学生登录", "管理员登录"],
    tabCur: 0,
    scrollLeft: 0,
    title:'学号',
    url:"student/login"
  },
  usernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  tabSelect(e) {
    this.setData({
      username: '',
      password: '',
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      title:e.currentTarget.dataset.id == 0 ? '学号' : '编号',
      url:e.currentTarget.dataset.id == 0 ? "student/login" : "root/login"
    })
  },
  // 登录
  clickLogin: function (e) {
    var that = this;
    if (that.data.username.length == 0) {
      wx.showToast({
        title: that.data.title + '不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (that.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    api.post(that.data.url, {
      username: that.data.username,
      password: that.data.password
    }).then(res => {
     console.log(res)
     that.data.tabCur == 0 ? api.wxStorage("student",res.student):api.wxStorage("root",res.root)
     
    }).catch(err => {})
  }
})