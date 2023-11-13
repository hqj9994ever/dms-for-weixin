// pages/RoomPoints/HisRoomPoints.js
import api from '../../utils/api'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    histScores: [],
    roomId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let roomId = options.roomId;
    this.setData({
      roomId: roomId
    })
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that = this;
    api.post("score/queryhis/"+that.data.roomId).then(res => {
      let histScores = res.histScores
      let his=[]
      let nowDate=util.myFormatDate(new Date())
      for (let i = 0; i < histScores.length; i++) {
        const element = histScores[i];
        if(element.date != nowDate){
          his.push(element)
        }
      }
      that.setData({
        histScores: his
      })
    }).catch(err => { })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.onShow();
  },

})