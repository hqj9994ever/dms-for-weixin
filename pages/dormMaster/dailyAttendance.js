// pages/dormMaster/dailyAttendance.js
const app=getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    dateList:[],
    unAttendentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that =this
    wx.request({
      url: app.globalData.url+'/dateList',
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        var list=res.data;
       
        for (let i = 0; i < list.length; i++) {
        list[i].id=i
        };
        
        that.setData({
          dateList:list
        })
      }
    }) ,

    wx.request({
      url: app.globalData.url+'/attendanceList',
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
        date: util.myFormatDate(new Date())
      },
      success: function (res) {
        console.log(res.data)
        var list=res.data;

        for (let i = 0; i < list.length; i++) {
          list[i].date=util.myFormatDate(new Date(list[i].date));
          };  
          console.log(res.data)  
        that.setData({
          unAttendentList:list
        })
      }
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50,
  
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.dateList;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  newAttendance(){
    wx.request({
      url: app.globalData.url + '/newAttendance',
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        date: util.myFormatDate(new Date())

      },
      success: function (res) {
        console.log(res)
        if (res.data == "success") {
          wx.showToast({
            title: '创建成功',
            duration: 5000
          })
        }
        else{
          wx.showToast({
            title: "创建失败",
            duration: 5000
          })
        }
      }
    })
  }



 
})