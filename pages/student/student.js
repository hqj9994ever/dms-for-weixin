// pages/student/student.js
import api from '../../utils/api'
import util from '../../utils/util'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuList: [],
    showView: false,
    userType: '',
    user:{},
    info:'',
    name:'',
    username:'',
    password:'',
    roomNo:'请选择宿舍',
    picker:[],
    id:'',
    pickerSex:['男','女'],
    pickerBed:['1','2','3','4'],
    pickerClass:[],
    bedNum:'请选择床位',
    genderValue:'请选择性别',
    stuClass:'请选择班级'
  },
  /**
   * 生命周期函数
   */
  onLoad: function (options) {
    let userType = api.getUserType()
    let user = api.getStorageObject(userType)
    this.setData({
      userType: userType,
      user:user,
      picker:api.getStorageString("rooms"),
      pickerClass:api.getStorageString("classses"),
    })
  },
  onShow: function () {
    var that = this;
    api.post("student/list").then(res => {
      that.setData({
        stuList: res.students
      })
    }).catch(err => {})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if(!this.data.showView){
      //为列表的时候 下拉刷新
      this.onShow();
    }
  },
  //选择宿舍
  pickerRoomChange(e) {
    this.setData({
      roomNo: this.data.picker[parseInt(e.detail.value)]
    })
  },
  //床位
  pickerBedChange(e) {
    this.setData({
      bedNum: this.data.pickerBed[parseInt(e.detail.value)]
    })
  },
  //性别
  pickerSexChange(e) {
    this.setData({
      genderValue: this.data.pickerSex[parseInt(e.detail.value)]
    })
  },
  pickerClassChange(e) {
    this.setData({
      stuClass: this.data.pickerClass[parseInt(e.detail.value)]
    })
  },
  //新增学生
  showView(e) {
    var that = this,obj = e.target.dataset.id
    if(obj){
      that.setData({
        stuClass: obj.stuClass,
        roomNo: obj.roomNo,
        bedNum: obj.bedNum,
        name: obj.name,
        gender: obj.gender,
        username: obj.username,
        id:obj.stuId
      })
    }else{
      //生成学号
      let username='';
      if(that.data.stuList && that.data.stuList.length>0){
        //存在列表 获取最新学员学号+1去生成新的学号
        let newNum = parseInt(that.data.stuList[0].username.substring(4,7))+1;
        username = new Date().getFullYear()+util.fixNum(newNum,3)+util.randNum(1000,9999)
      }else{
        //第一个学生
        username = new Date().getFullYear()+"001"+util.randNum(1000,9999)
      }
      that.setData({
        username:  username
      })
    }
    this.setData({
      showView: true
    })
  },
  //取消按钮 
  hideView: function () {
    this.setData({
      showView: false,
      name:'',
      username:'',
      password:'',
      roomNo:'请选择宿舍',
      id:'',
      bedNum:'请选择床位',
      genderValue:'请选择性别',
      stuClass:'请选择班级'
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
    if(that.data.bedNum == '请选择床位'){
      wx.showToast({
        title: '床位不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!that.data.id){
      //新增
      if(that.data.stuClass == '请选择班级'){
        wx.showToast({
          title: '班级不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (that.data.name.length == 0) {
        wx.showToast({
          title: '姓名不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if(that.data.genderValue == '请选择性别'){
        wx.showToast({
          title: '性别不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (that.data.username.length == 0) {
        wx.showToast({
          title: '学号不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (that.data.password.length == 0) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(that.data.password))){
        wx.showToast({
          title: '密码组成为8-20位的字母和数字',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      api.post("student/register",{
        roomNo:that.data.roomNo,
        username:that.data.username,
        password:that.data.password,
        name:that.data.name,
        bedNum:that.data.bedNum,
        stuClass:that.data.stuClass,
        gender:that.data.genderValue=='男'?true:false
      }).then(res => {
        setTimeout(() => {
          that.hideView();
          that.onShow();
        }, 1500);
      }).catch(err => {
        // that.hideView();
      })
    }else{
      api.post("student/optEit",{
        roomNo:that.data.roomNo,
        bedNum:that.data.bedNum,
        stuId:that.data.id
      }).then(res => {
        setTimeout(() => {
          that.hideView();
          that.onShow();
        }, 1500);
      }).catch(err => {
        // that.hideView();
      })
    }
  },
  //重置密码
  updatePass: function (e) {
    var that = this,id = e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '重置密码为123456，确认重置吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 
          api.post("student/updpassword",{
            stuId:id,
            password:'123456'
          }).then(res => {
            that.onShow();
          }).catch(err => {
          })
        } else if (sm.cancel) {}
      }
    })
  },
  //删除事件
  del: function (e) {
    var that = this,id = e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          api.post("student/delstudent",{
            stuId:id
          }).then(res => {
            that.onShow();
          }).catch(err => {
          })
        } else if (sm.cancel) {}
      }
    })
  },
  //学号
  usernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },
  //密码
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  //姓名
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },

})