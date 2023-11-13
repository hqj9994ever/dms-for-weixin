// pages/administratorMenu/administratorMenu.js
import api from '../../utils/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ssList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 0,
      name: '宿舍考勤',
      url: '/pages/dormMaster/dailyAttendance'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 0,
      name: '每日评分',
      url: '/pages/RoomPoints/RoomPoints'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '发布公告',
      url: '../dormMaster/sendNotice'
    }],
    ryList: [{
      icon: 'friend',
      color: 'red',
      badge: 0,
      name: '学生情况',
      url: '/pages/student/student'
    }],
    gridCol: 3,
    skin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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