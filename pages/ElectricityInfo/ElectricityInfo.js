// pages/ElectricityInfo/ElectricityInfo.js
import api from '../../utils/api'
var util = require('../../utils/util.js');
var wxCharts = require('../../utils/wxcharts.js'); //引入wxChart文件
var windowW = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    ElectricityInfoWeek: [],
    imageWidth: 0,
    userType: '',
    user: {},
    lastList: [],
    allRemain: 0,
    remain: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userType = api.getUserType()
    let user = api.getStorageObject(userType)
    let that = this
    this.setData({
      userType: userType,
      user: user,
      imageWidth: wx.getSystemInfoSync().windowWidth
      // 如果卡死就写死320 选iphone5机型
      // imageWidth: wx.getSystemInfoSync().windowWidth
    });
    //计算屏幕宽度比列
    windowW = this.data.imageWidth / 375;
    //最近7天缴费 情况
    api.post("electric/lastWeek/"+ user.roomNo, {}, false).then(res => {
      that.setData({
        ElectricityInfoWeek: res.electRates
      })
      that.showChart();
    }).catch(err => { })
    //电费余额
    api.post("electric/optFind/" + user.roomNo, {}, false).then(res => {
      that.setData({
        allRemain: res.allRemain.toFixed(2)
      })
    }).catch(err => { })
    this.getLastThree();

  },
  //获取最新3条缴费记录
  getLastThree() {
    let that=this;
    api.post("electric/lastThreeList/"+ that.data.user.roomNo, {}, false).then(res => {
      that.setData({
        lastList: res.electRates
      })
    }).catch(err => { })
  },

  showChart() {
    var that = this;
    var data = [];
    var categories = [];
    let list = this.data.ElectricityInfoWeek;
    for (let i = 0; i < list.length; i++) {
      categories[i] = list[i].readTime;
      data[i] = list[i].electricityConsumption
    };
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      dataLabel: true,
      categories: categories,
      series: [{
        name: '最近7天缴费记录',
        color: '#0892E8', //柱子的颜色
        data: data,
        format: function (val, name) {
          return val;
        }
      }],
      dataItem: {
        color: '#fff' //数据颜色
      },
      yAxis: {
        fontColor: '#13A7CF',
        disabled: false, //是否绘制 Y轴
        format: function (val) { //返回数值
          return val.toFixed(2) + '元';
        },
        min:0,
        max:1,
        disableGrid: false,
        gridColor: '#fff',
        title: "缴费金额"
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  showView(e) {
    this.setData({
      showView: true
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
    if (that.data.remain.length == 0) {
      wx.showToast({
        title: '缴纳金额不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!(/^[0-9]+.?[0-9]*$/.test(that.data.remain))){
      wx.showToast({
        title: '缴纳金额要为数字类型',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let remain = parseFloat(that.data.remain)
    api.post("electric/optAdd", {
      roomId: that.data.user.roomNo,
      date: util.formatTime(new Date()),
      remain: remain
    }).then(res => {
      that.setData({
        showView: false,
        remain: '',
        allRemain: (parseFloat(that.data.allRemain)+remain).toFixed(2)
      })
      that.getLastThree();
    }).catch(err => {
      that.setData({
        showView: false,
        remain: ''
      })
    })
  },
  remainInput: function (e) {
    this.setData({
      remain: e.detail.value
    })
  },
})