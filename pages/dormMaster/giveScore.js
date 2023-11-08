// pages/dormMaster/giveScore.js
const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    floor: 0,
    
    roomList: [],
    update: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var floor = options.floor
    this.setData({
      floor: floor
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var floor = this.data.floor
    wx.request({
      url: app.globalData.url + '/wxroomscore/roomlist',
      method: "GET",
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'Content-Type': 'application/json'
      },
      data: {
        floor: floor
      },
      success: function (res) {
        var list = res.data;
        console.log(list);
        for (let i = 0; i < list.length; i++) {
          list[i].name = list[i].name.slice(4); //处理字符串
          list[i].id = i;
        };
        that.setData({
          roomList: list
        })
      }
    })
  },

  scoreInput(e) {
    let list = this.data.roomList;
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value;
    var update = this.data.update;
    var data = {
      roomNo: list[index].no,
      score: value,
      date: util.myFormatDate(new Date()) 
    }
    update[index] = data;
    this.setData({
      update: update
    })
  },
  remarksInput(e) {
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value;
    var update = this.data.update;
    update[index].remarks = value;
    this.setData({
      update: update
    })
  },
  update:function (e) {
    var that=this;

    wx.showModal({
      title: '提示',
      content: '是否确认提交',
      success: function (sm) {
        if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            wx.request({
              url:app.globalData.url+"/wxroomscore/update",
              method:"POST",
              header:{'cookie':'JSESSIONID='+wx.getStorageSync('serverSeesion'),
                      'Content-Type': 'application/json'},
               data:{
                update: that.data.update
              },
              success:function(res){
                var resData=res.data;
                console.log(resData.message)
                if (resData.message =="操作成功") {         
                  wx.showToast({
                      title: "操作成功",
                      duration: 2000
                    })
               
                } else {
                  wx.showToast({
                    title:"操作失败",
                    duration: 2000
                  })
                }
              }
            })
          } else if (sm.cancel) {
            
          }
        }
      })
  
  }
})