// pages/chooseRoom/chooseRoom.js
const app = getApp()
var image=require('../../utils/image.js');
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
    list: [],
    load: true,
    userId: app.globalData.userId,
    bedsList: [],
    roomsList: [],
    buildingName: "",
    buildingNo: "",
    img:image.imageList.bedImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var buildingInfo = JSON.parse(options.obj)
    this.setData({
      buildingName: buildingInfo.buildingName,
      buildingNo: buildingInfo.buildingNo
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
    let that = this;
    wx.request({
      url: app.globalData.url+"/wxchoose/wxroomlist",
      method:"GET",
      header:{'cookie':'JSESSIONID='+wx.getStorageSync('serverSeesion'),
      'Content-Type': 'application/json'},
      data:{
        buildingNo:that.data.buildingNo,
        JSESSIONID: wx.getStorageSync('serverSeesion')
      },
      success:function(res){
        var list=res.data;
        console.log(list);
        for (let i = 0; i < list.length; i++) {
        list[i].id=i
        };
        for (let i = 0; i < list.length; i++) {
          list[i].name=list[i].name.slice(4);//处理字符串
          };
        that.setData({
          roomsList:list
        })
      }
    }),
    wx.request({
      url: app.globalData.url +"/wxchoose/wxbedlist",
      method:"GET",
      header:{'cookie':'JSESSIONID='+wx.getStorageSync('serverSeesion'),
      'Content-Type': 'application/json'},
      data:{
        JSESSIONID: wx.getStorageSync('serverSeesion')
      },
      success:function(res){
        var list=res.data; 
        console.log(list);
        for (let i = 0; i < list.length; i++) {
          list[i].name=list[i].name.slice(4);//处理字符串
          };
        that.setData({
          bedsList:list
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
    let list = this.data.roomsList;
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
  Choose:function(e){
    var that =this
    var bedId= e.currentTarget.dataset.id
    console.log(bedId)
    wx.showModal({
      title: '提示',
      content: '确定要选择该床位吗？',
      success: function (sm) {
        if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了

            wx.request({
              url:app.globalData.url+"/wxchoose/selectchoose",
              method:"POST",
              header:{'cookie':'JSESSIONID='+wx.getStorageSync('serverSeesion'),
                      'Content-Type': 'application/x-www-form-urlencoded'},
               data:{
                bedId: bedId
              },
              success:function(res){
                var resData=res.data;
                
                if (resData == "success") {         
                  wx.showToast({
                      title: '选择成功',
                      duration: 2000
                    })
                    that.onLoad();
                that.onShow();
                } else {
                  wx.showToast({
                    title: '选择失败:已有宿舍',
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