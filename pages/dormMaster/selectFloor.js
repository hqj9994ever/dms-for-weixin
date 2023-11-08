// pages/dormMaster/selectFloor.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floorList:[]
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
      url: app.globalData.url+'/wxroomscore/floorlist',
      method:"GET",
      header:{'cookie':'JSESSIONID='+wx.getStorageSync('serverSeesion'),
      'Content-Type': 'application/json'},
      data:{},
      success:function(res){
        var list=res.data;
        console.log(list);
        that.setData({
          floorList:list
        })
      }
    })
  },

  TogiveScore:function (e) {
    var floor =e.currentTarget.dataset.floor
    wx.navigateTo({
    url: '/pages/dormMaster/giveScore?floor='+floor
    })
  }
})