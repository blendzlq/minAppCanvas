//app.js
App({
  globalData: {
    userInfo: null
  },
  toast(str = '', time = 2000) {
    wx.showToast({
      title: str,
      duration: time,
      icon: 'none'
    }) 
  },
  // 下载一个网络图片列表.返回一个本地路径图片列表
  downloadImgList(list) {
    let ret = []
    return new Promise((resolve, reject) => {
      this.downloadImg(list, 0, ret, function() {
        resolve(ret)
      })
    })
  }, 
  downloadImg(arr, i, ret, success) {
    let that = this
    wx.downloadFile({
      url: arr[i],
      success(res) {
        ret.push(res.tempFilePath)
        if (i == arr.length-1) {
          success()
        } else {
          let _i = i+1
          that.downloadImg(arr, _i, ret, success)
        }
      }, fail(){
        console.log('image load error')
      }
    })
  }
})