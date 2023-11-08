// pages/ElectricityInfo/ElectricityInfo.js
var util = require('../../utils/util.js');
var wxCharts = require('../../utils/wxcharts.js'); //引入wxChart文件
const app = getApp()
var columnCanvas = null;
var searchCanvas = null;
var windowW = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    roomName: '',
    time: '',
    date: '',
    chartList: [],
    ElectricityInfoTop10: [],
    beginDate: '',
    endDate: '',
    imageWidth: 0,
    canvasSaveimg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth
    });
    //计算屏幕宽度比列
    windowW = this.data.imageWidth / 375;

    var ElectricityInfoTop10 = JSON.parse(options.obj)
    this.setData({
      ElectricityInfoTop10: ElectricityInfoTop10
    })
    var beginDate = util.myFormatDate(new Date())
    var endDate = util.myFormatDate(new Date())
    this.setData({
      beginDate:'2018-07-01',
      endDate: '2018-07-07'
    })
    this.onShow();
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
    var data = [];
    var categories = [];
    let list = this.data.ElectricityInfoTop10;

    for (let i = 0; i < list.length; i++) {
      categories[i] = util.timeStamp2String(new Date(list[i].readTime).getTime());

      data[i] = list[i].electricityConsumption
    };

    columnCanvas = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      dataLabel: true,
      categories: categories,
      series: [{
        name: '实时总用电量',
        color: '#000', //柱子的颜色
        data: data,
        format: function (val, name) {
          return val;

        }
      }],
      dataItem: {
        color: '#fff' //数据颜色
      },
      yAxis: {
        fontColor: '#000',
        disabled: false, //是否绘制Y轴
        format: function (val) { //返回数值
          return val.toFixed(0) + '度';
        },

        disableGrid: false,
        gridColor: '#fff',
        title: "用电量"
      },
      xAxis: {
        title: "日期",
        fontColor: '#000', //数据颜色
        disableGrid: false, //不绘制X轴网格(去掉X轴的刻度)
        gridColor: '#000',
        fontColor: '#000',
        type: 'calibration' //刻度

      },
      extra: {
        column: {
          width: 8
        }
      },
      dataPointShape: true, //是否在图标上显示数据点标志
      width: (385 * windowW), //图表展示内容宽度
      height: (300 * windowW) //图表展示内容高度
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  EndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  BeginDateChange(e) {
    this.setData({
      beginDate: e.detail.value
    })
  },
 
  Research: function (e) {
    var that = this
    wx.request({
      url: app.globalData.url + "/wxelectricityinfo/list",
      method:"GET",
      header: {
        'cookie': 'JSESSIONID=' + wx.getStorageSync('serverSeesion'),
        'content-type':'application/json'
      },
      data: {
        'beginTime': this.data.beginDate,
        'endTime': that.data.endDate
      },
      success: function (res) {
        var resData = res.data;
        console.log(resData)
        if (resData != null) {
          var data = [];
          var categories = [];
          let list = resData;

          for (let i = 0; i < list.length-1; i++) {
          categories[i] = util.myFormatDate(new Date(list[i].readTime));
          data[i] = (list[i+1].electricityConsumption-list[i].electricityConsumption).toFixed(2)
    };
      
          searchCanvas = new wxCharts({
            canvasId: 'searchCanvas',
            type: 'column',
            animation: true,
            dataLabel: true,
            categories: categories,
            enableScroll: true, //配置该折线图可滑动
            series: [{
              name: '每日用电量',
              color: '#000', //柱子的颜色
              data: data,
              format: function (val, name) {
                return val;
              }
            }],
            dataItem: {
              color: '#fff' //数据颜色
            },
            yAxis: {
              fontColor: '#000',
              disabled: false, //是否绘制Y轴
              format: function (val) { //返回数值
                return val.toFixed(0) + '度';
              },
              disableGrid: false,
              gridColor: '#fff',
              title: "用电量"
            },
            xAxis: {
              title: "日期",
              fontColor: '#000', //数据颜色
              disableGrid: true, //不绘制X轴网格(去掉X轴的刻度)
              gridColor: '#000',
              fontColor: '#000',
              type: 'calibration' //刻度

            },
            extra: {
              column: {
                width: 8
              }
            },
            dataPointShape: true, //是否在图标上显示数据点标志
            width:  (385 * windowW), //图表展示内容宽度
            height: 300 //图表展示内容高度
          })
        } else {
          wx.showToast({
            title: '未查到相关信息',
            duration: 2000
          })
        }
      }
    })
  },
  touchstart:function(e){ 
    searchCanvas.scrollStart(e);//开始滚动
    },
    
    touchmove:function(e){  
     searchCanvas.scroll(e);   
    },
    
    touchend:function(e){
     searchCanvas.scrollEnd(e);
    }





})