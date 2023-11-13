// pages/dormMaster/dailyAttendance.js
import api from '../../utils/api'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newNotice: '',
    noticeList: [],
    showView: false,
    userType: '',
    user: {},
    info: '',
    stuId: '请选择学生学号',
    sid: null,
    date: '',
    remark: "",
    roomNo: '',
    name: '',
    picker: [],
    stuList: [],
    cDate: '请选择缺勤日期',
    cStuId: '请选择学生学号',
    csId: null,
    csDate: null,
    qqDate:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userType = api.getUserType()
    let user = api.getStorageObject(userType)
    this.setData({
      userType: userType,
      user: user
    })
    var that = this;
    //学生列表
    api.post("student/list", {}, false).then(res => {
      let students = res.students, picker = []
      students.forEach(e => {
        picker.push(`${e.name}(学号:${e.username})`)
      })
      that.setData({
        stuList: students,
        picker: picker
      })
    }).catch(err => { })
  },
  onShow: function () {
    var that = this;
    api.post("illegalRecord/optAll", {
      stuId: that.data.csId,
      date: that.data.csDate
    }).then(res => {
      that.setData({
        noticeList: res.illegalRecords
      })
    }).catch(err => { })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
  },
  //选择学号
  pickerStuIdChange(e) {
    let stu = this.data.stuList[parseInt(e.detail.value)]
    this.setData({
      stuId: stu.username,
      name: stu.name,
      roomNo: stu.roomNo,
      sid: stu.stuId
    })
  },
  //选择学号查询
  pickerStuIdGet(e) {
    let stu = this.data.stuList[parseInt(e.detail.value)]
    this.setData({
      cStuId: "学号:" + stu.username,
      csId: stu.stuId
    })
    this.onShow();
  },
  //重置条件
  resetparam(){
    this.setData({
      cDate: '请选择缺勤日期',
      cStuId: '请选择学生学号',
      csId: null,
      csDate: null,
    })
    this.onShow();
  },
  //选择日期查询
  pickerDateGet(e) {
    this.setData({
      cDate: "日期:"+e.detail.value,
      csDate:e.detail.value,
    })
    this.onShow();
  },
  showView(e) {
    let obj = e.target.dataset.id
    if(obj){
      this.setData({
        id: obj.id,
        name:obj.name,
        qqDate:obj.date,
        remark:obj.remark
      })
    }
    this.setData({
      showView: true
    })
  },
  //看详情
  showModal: function (e) {
    this.setData({
      info: e.target.dataset.content,
      modalName: e.currentTarget.dataset.target
    });
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //取消按钮 
  hideView: function () {
    this.setData({
      showView: false,
      stuId: '请选择学生学号',
      name: '',
      roomNo: '',
      sid: null,
      remark:'',
      qqDate:'',
      id:''
    });
  },
  //保存
  confirm: function () {
    var that = this;
    if (that.data.remark.length == 0) {
      wx.showToast({
        title: '缺勤原因不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let data = {},url='';
    if(that.data.id){
      //修改
      url = "illegalRecord/optEdit"
      data = {
        id:that.data.id,
        remark: that.data.remark,
      }
    }else{
      if (that.data.stuId == '请选择学生学号') {
        wx.showToast({
          title: '学生学号不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      //新增
      url = "illegalRecord/optAdd"
      data = {
        adminiId: that.data.user.id,
        date: util.myFormatDate(new Date()),
        remark: that.data.remark,
        stuId: that.data.sid,
      }
    }
    api.post(url,data ).then(res => {
      that.hideView()
      that.onShow();
    }).catch(err => {
      that.hideView()
    })
  },
  //发布内容
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  //删除事件
  del: function (e) {
    var that = this, id = e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          api.post("illegalRecord/optDel/" + id).then(res => {
            that.onShow();
          }).catch(err => {
          })
        } else if (sm.cancel) { }
      }
    })
  }


})