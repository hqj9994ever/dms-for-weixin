var codeCache = '';
const app = getApp()
var showMsg = function (content) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false
  });
}

Page({
  data: {
    grids: [0, 1, 2, 3, 4],
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    }
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.userId = app.globalData.userId
    wx.setStorage({
      data: this.data.userId,
      key: 'userId',
    })
  },
  onBindQyLogin: function (e) {
    wx.qy.login({
      success: function (res) {
        codeCache = res.code;
        console.log('login:succ:%o', res);
        showMsg('企业微信登陆成功');
      },
      fail: function (res) {
        console.log('login:fail:%o', res);
        showMsg('企业微信登陆失败');
      },
      complete: function (res) {
        console.log('login:complete:%o', res);
      }
    })
  },
  onBindCodeToSession: function () {
    if (codeCache) {
      wx.showLoading();
      let corpid = 'ww02fd6a44a60a6dd7';
      let corpsecret = '8P8phFrLaegmbRtDCBEcII4Ipdjgy7dg_Fgc9xW1LWk';
      wx.request({
        url: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=' + corpid + '&corpsecret=' + corpsecret,
        success: function (res) {
          console.log(res)
          console.log(`${codeCache}`)

          wx.hideLoading();

          wx.request({
            url: `https://qyapi.weixin.qq.com/cgi-bin/miniprogram/jscode2session?access_token=${res.data.access_token}&js_code=${codeCache}&grant_type=authorization_code`,
            success: function (res) {
              console.log(res)
              if (res.data.errcode == 0) {
                showMsg('session转换成功');
              } else {
                showMsg('session转换失败');
              }
            }
          });
        }
      });
    } else {
      showMsg('请先调用wx.qy.login');
    }
  },
  onBindCheckSession: function (e) {
    wx.qy.checkSession({
      success: function (res) {
        showMsg('session验证成功');
      },
      fail: function (res) {
        showMsg('session验证失败：未登陆或者登陆过期');
      },
      complete: function (res) {
        console.log('checkSession:complete:%o', res);
      }
    })
  },
  onBindSendQuickReply: function (e) {
    wx.qy.sendChatMessage({
      msgtype:"text", //消息类型，必填
    enterChat: false, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段
    text: {
      content:"你好", //文本内容
    },
    image:
    {
      mediaid: "", //图片的素材id
    },
    video:
    {
      mediaid: "", //视频的素材id
    },
    file:
    {
       mediaid: "", //文件的素材id
    },
    news:
    {
      link: "", //H5消息页面url 必填
      title: "", //H5消息标题
      desc: "", //H5消息摘要
      imgUrl: "", //H5消息封面图片URL
    },
    miniprogram:
    {
      appid: "wx8bd80126147df384",//小程序的appid
      title: "this is title", //小程序消息的title
      imgUrl:"/appData/pic/pic1.jpg",//小程序消息的封面图
      page:"/index/page.html", //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
    },
    success: function(res) {
           //todo:
      }
  });
  }
});