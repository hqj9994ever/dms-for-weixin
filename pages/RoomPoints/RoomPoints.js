// pages/RoomPoints/RoomPoints.js
import api from '../../utils/api'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    histScores: [],
    showView: false,
    picker: [],
    roomNo:'请选择宿舍',
    score:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      picker:api.getStorageString("rooms")
    })
    this.onShow();
  },
  goHist(e){
    wx.navigateTo({
      url: '/pages/RoomPoints/HisRoomPoints?roomId='+
      e.target.dataset.roomid,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    api.post("score/list").then(res => {
      that.setData({
        histScores: res.histScores
      })
    }).catch(err => { })
  },
  //选择宿舍
  pickerRoomChange(e) {
    this.setData({
      roomNo: this.data.picker[parseInt(e.detail.value)]
    })
  },
  //新增打分
  showView(e) {
    this.setData({
      showView: true
    })
  },
  //取消
  hideView(){
    this.setData({
      showView: false,
      score:'',
      roomNo:'请选择宿舍',
    })
  },
  //打分
  scoreInput(e) {
    this.setData({
      score: e.detail.value
    })
  },
  //保存
  confirm: function () {
    var that = this;
    if(that.data.roomNo == '请选择宿舍'){
      wx.showToast({
        title: '宿舍不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    
    if (that.data.score.length == 0) {
      wx.showToast({
        title: '打分不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let score = parseFloat(that.data.score);
    if(score>100||score<0){
      wx.showToast({
        title: '分数的范围为0-100',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    
    if(!(/^[0-9]+.?[0-9]*$/.test(that.data.score))){
      wx.showToast({
        title: '打分要为数字类型',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    
    api.post("score/optAdd",{
      roomId:that.data.roomNo,
      date:util.myFormatDate(new Date()),
      histScore:score,
    }).then(res => {
      that.hideView();
      that.onShow();
    }).catch(err => {
      that.hideView();
    })
  },
})