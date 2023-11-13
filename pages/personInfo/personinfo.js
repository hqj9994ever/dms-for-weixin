// pages/personInfo/personinfo.js
import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    user: {},
    phoneNum: '',
    imgList: [],
    headImage: '',
    title: '',
    oldPass: '',
    newPass: '',
    verifyPass: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userType = api.getUserType()
    let user = api.getStorageObject(userType)
    this.setData({
      userType: userType,
      user: user,
      title: options.title
    })
    if (user.headImage) {
      this.setData({
        imgList: [user.headImage],
        phoneNum:user.phoneNum
      })
    }
  },
  ChooseImage() {
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //指定来源是相册还是相机，默认二者都有
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        var tempFilesSize = tempFilePaths[0].size / 1000;//获取图片的大小，单位kB
        if (tempFilesSize > 500) {
          wx.showToast({
            title: '头像大小不能超过500kb',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(tempFilePaths)
          })
        } else {
          that.setData({
            imgList: tempFilePaths
          })
        }
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths[0],
          encoding: 'base64',
          success: res => {
            wx.getImageInfo({
              src: tempFilePaths[0],
              success: (infoRes) => {
                that.setData({
                  headImage:
                    `data:image/${infoRes.type};base64,${res.data}`
                })
              },
              fail: (err) => {
                reject('Error getting image info')
              }
            })
          },
          fail: err => {
            reject('Error reading file')
          }
        })
      }
    })
  },
  hideView() {
    wx.redirectTo({
      url: '/pages/menu/menu',
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这头像吗？',
      cancelText: '再看看',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  //个人信息
  saveUser: function () {
    var that = this;
    if (!/^1[3456789]\d{9}$/.test(that.data.phoneNum)) {
      // 手机号格式不正确，提示用户
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return false
    }
    if (that.data.headImage.length == 0) {
      wx.showToast({
        title: '头像不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    api.post("student/updUserInfo", {
      stuId: that.data.user.stuId,
      phoneNum: that.data.phoneNum,
      headImage: that.data.headImage,
    }).then(res => {
      let user = that.data.user;
      user.phoneNum = that.data.phoneNum
      user.headImage = that.data.headImage
      api.setStorageObject('student', user)
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/menu/menu',
        })
      }, 1500);
    }).catch(err => {
    })
  },
  //密码
  savePass: function () {
    var that = this;
    if (that.data.oldPass.length == 0) {
      wx.showToast({
        title: '旧密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (that.data.newPass.length == 0) {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (that.data.verifyPass.length == 0) {
      wx.showToast({
        title: '确认密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(that.data.newPass == that.data.oldPass){
      wx.showToast({
        title: '新密码和旧密码不能相同',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(that.data.newPass != that.data.verifyPass){
      wx.showToast({
        title: '确认密码与新密码不一致',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(that.data.newPass))){
      wx.showToast({
        title: '新密码组成为8-20位的字母和数字',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    api.post("student/updMypassword", {
      stuId: that.data.user.stuId,
      newPass: that.data.newPass,
      oldPass: that.data.oldPass,
    }).then(res => {
      api.clearAll();
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }, 1500);
    }).catch(err => {
    })
  },
  //保存
  confirm: function () {
    if (this.data.title == 'user') {
      this.saveUser();
    }
    if (this.data.title == 'pass') {
      this.savePass();
    }
  },
  //手机号码
  phoneNumInput(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  //新密码
  newPassInput(e) {
    this.setData({
      newPass: e.detail.value
    })
  }, 
  //旧密码
  oldPassInput(e) {
    this.setData({
      oldPass: e.detail.value
    })
  },
  //确认密码
  verifyPassInput(e) {
    this.setData({
      verifyPass: e.detail.value
    })
  }
})