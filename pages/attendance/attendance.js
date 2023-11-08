// pages/attendance/attendance.js
const app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    location:{},
    date: util.myFormatDate(new Date()),
    myAttendanceStatus: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/myattendancestatus',
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
       date: util.myFormatDate(new Date())
      },
      success: function (res) {
        var resData = res.data;
        console.log(resData)
        if(resData.check_location==1){
          resData.AttendanceStatus="已打卡"
        }
        else{
          resData.AttendanceStatus="未打卡"
        }
        that.setData({
         myAttendanceStatus:resData
        })
      }
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

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
    var that=this;
    wx.request({
      url: app.globalData.url + '/buildinglocation',
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var resData = res.data;
        console.log(resData)
        that.setData({
         location:resData[0]
        })
        console.log(that.data.location)
      }
    })


  },


  
  getLocation() {
    let that = this;
    let location=that.data.location
   
    wx.getLocation({
      altitude: 'true',
      type:'gcj02',
      success: function (res) {
        console.log(location.longitude_south)
       var updatelocation=util.qqMapTransBMap(res.longitude,res.latitude);
      
        var longitude =parseFloat(res.longitude) 
        var latitude = parseFloat(res.latitude)
        // wx.openLocation({
        //   latitude,
        //   longitude,
        //   scale: 18,

        // })
       var longitude_max=(location.longitude_south)*1
       var longitude_min=(location.longitude_north)*1
       var latitude_max=(location.latitude_east)*1
       var latitude_min=(location.latitude_west)*1
        console.log(longitude_min+' ' +longitude+' ' +longitude_max)
        console.log(latitude*1<=latitude_max*1&&latitude*1>=latitude_min*1)
        console.log(longitude*1<=longitude_max&&longitude>=longitude_min)

        if (latitude<=latitude_max&&latitude>=latitude_min&&longitude<=longitude_max&&longitude>=longitude_min) {
          wx.request({
            url: app.globalData.url + '/attendance',
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
                  title: '签到成功',
                  duration: 5000
                })
              } else {
                wx.showToast({
                  title: '错误代码' + res.statusCode,
                  duration: 5000
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '当前不在签到范围，请尽快前往签到区域签到',
            duration: 5000
          })
        }

      }
    })
  }
})