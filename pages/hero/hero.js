// pages/hero/hero.js
//获取应用实例
const app = getApp()
const idraw = require('../../common/js/draw.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: true,
    codeSrc: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = app.globalData.userInfo
    this.setData({
      userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // let SessionKey = wx.getStorageSync('SessionKey')
    // if (SessionKey) {
    //   this.getMinAppCode() // 保存用户信息
    // } else if (this.data.canIUse) {
    //   app.userInfoReadyCallback = res => {
    //     this.getMinAppCode()
    //   }
    // } else {
    //   app.login().then(() => {
    //     this.getMinAppCode()
    //   })
    // }
  },
  draw(code) {
    // 头像  code
    let httpList = [this.data.userInfo.Avatar, app.domainName + code]
    this.setData({
      codeSrc: httpList[1]
    })
    app.downloadImgList(httpList).then(res => {
      let arr = ['/common/images/BG4.png', res[0], '/common/images/logo.png', '/common/images/1.png', res[1], '/common/images/head-icon.png']
      this.canvas_draw(arr)
    })
  },
  getMinAppCode() {
    wx.showLoading({
      title: '图片生成中',
      mask: true
    })
    let OpenID = wx.getStorageSync('OpenID')
    let scene = `${OpenID},4`
    app.Ajax.post('/Handler/User.ashx?method=GetShareCode', {
      path: 'pages/share/share',
      scene
    }).then(res => {
      if (res.errcode==0){
        this.draw(res.result)
      }else{
        app.toast(res.errmsg)
      }
    })
  },
  // 画画
  canvas_draw(path) {
    let _this = this
    let params = {
      canvasId: 'combinCanvas',
      width: 622,
      height: 1090,
      data: [{
          name: 'bg',
          type: 'image',
          source: path[0],
          x: 0,
          y: 0,
          width: 622,
          height: 1090
        },
        {
          name: 'icon',
          type: 'image',
          source: path[2],
          x: (622 - 187) - 10,
          y: 0,
          width: 187,
          height: 87
        },
        {
          name: 'head-bg',
          type: 'image',
          source: path[5],
          x: (622 - 205) / 2,
          y: 75,
          width: 205,
          height: 205
        },
        {
          name: 'head',
          type: 'image',
          status: 1, //是否为圆
          source: path[1],
          x: (622 - 154) / 2,
          y: 100,
          width: 154,
          height: 154
        },
        {
          name: 'name',
          type: 'text',
          textColor: '#ffffff',
          text: `${_this.data.userInfo.RegionName}  ${_this.data.userInfo.Name}`,
          font: 32,
          x: 310,
          y: 300,
        },
        {
          type: 'text',
          textColor: '#ffffff',
          text: `全 球 微 笑 天 使`,
          font: 42,
          x: 310,
          y: 360,
        },
        {
          name: 'jixiangwu',
          type: 'image',
          source: path[3],
          x: 0,
          y: 256,
          width: 662,
          height: 662
        },
        {
          name: 'code',
          type: 'image',
          source: path[4],
          x: (622 - 140) / 2,
          y: 1090 - 244,
          width: 140,
          height: 140
        },
        {
          name: 'name',
          type: 'text',
          textColor: '#ffffff',
          text: '扫一扫识别小程序',
          font: 24,
          x: (622 - 300),
          y: 1090 - 60,
        },
        {
          name: 'name',
          type: 'text',
          textColor: '#ffffff',
          text: '测一测你是哪一种小天使',
          font: 24,
          x: (622 - 300),
          y: 1090 - 30,
        },
      ]
    };
    idraw.draw(params, function(res) {
      _this.setData({
        shareImgSrc: res
      })
      _this.saveImgFile(res)
    });
  },
  opensetting() {
    var $this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          $this.setData({
            openSetting: ""
          });
          $this.getMinAppCode()
        } else {
          app.toast('请开启图片授权')
        }
      }
    })
  },
  saveImgFile(imgSrc) {
    var $this = this;
    let SessionKey = wx.getStorageSync('SessionKey')
    wx.uploadFile({
      url: app.domainName + '/handler/UploadFile.ashx?method=SynthesisImage&SessionKey=' + SessionKey,
      filePath: imgSrc,
      name: "file",
      success(res) {
        let data = JSON.parse(res.data);
        wx.downloadFile({
          url: app.domainName + data.result,
          success: function(res) {
            wx.hideLoading()
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function(data) {
                wx.showToast({
                  title: "已保存"
                })
              },
              fail: function(err) {
                if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
                  app.toast('你未开启图片授权')
                  $this.setData({
                    openSetting: "openSetting"
                  });
                }
              }
            });
          }
        });
      }
    })
    console.log(imgSrc)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    app.shareApp()
  }
})