// pages/RoomPoints/RoomPoints.js
var util = require('../../utils/util.js');

const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    floorList:[],
    scoreList:[]
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let list = [{}];
    for (let i = 0; i < 26; i++) {
      list[i] = {};
      list[i].name = String.fromCharCode(65 + i);
      list[i].id = i;
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
  },
  onShow(){
    let that = this;
    wx.request({
      url: app.globalData.url +"/wxroomscore/floorlist",
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
        list[i].id=i;
       
        };
        that.setData({
          floorList:list
        })
      }
    }),
    wx.request({
      url: app.globalData.url+"/wxroomscore/scorelist",
      method:"GET",
      header:{'cookie':'JSESSIONID='+wx.getStorageSync('serverSeesion'),
      'Content-Type': 'application/json'},
      data:{
        JSESSIONID: wx.getStorageSync('serverSeesion')
      },
      success:function(res){
        var list=res.data; 
        for (let i = 0; i < list.length; i++) {
          list[i].id=i
          };
        for (let i = 0; i < list.length; i++) {
          list[i].name=list[i].name.slice(4);//处理字符串
          list[i].date=util.myFormatDate(new Date(list[i].date))//处理字符串
          };
        console.log(list);
        that.setData({
          scoreList:list
         
        })
      }
    })
  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.floorList;
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
  }
})