//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        if (!res.code) {
          return
        }
        console.log(res.code)
        wx.request({
          url: "https://minipro.1194792182.com" + '/MiniPro/GetThirdSessionId',
          method: 'post',
          data:{
            Code: res.code
          },
          success: function (json) {
            var result = json.data;
            console.log(result)
            // if (result.success) {
            //   wx.setStorageSync('sessionId', result.sessionId);

            //   //获取userInfo并校验
            //   wx.getUserInfo({
            //     success: function (userInfoRes) {
            //       console.log('get userinfo', userInfoRes);
            //       that.globalData.userInfo = userInfoRes.userInfo
            //       typeof cb == "function" && cb(that.globalData.userInfo)

            //       //校验
            //       wx.request({
            //         url: wx.getStorageSync('domainName') + '/WxOpen/CheckWxOpenSignature',
            //         method: 'POST',
            //         data: {
            //           sessionId: wx.getStorageSync('sessionId'),
            //           rawData: userInfoRes.rawData,
            //           signature: userInfoRes.signature
            //         },
            //         success: function (json) {
            //           console.log(json.data);
            //         }
            //       });

            //       //解密数据（建议放到校验success回调函数中，此处仅为演示）
            //       wx.request({
            //         url: wx.getStorageSync('domainName') + '/WxOpen/DecodeEncryptedData',
            //         method: 'POST',
            //         data: {
            //           'type': "userInfo",
            //           sessionId: wx.getStorageSync('sessionId'),
            //           encryptedData: userInfoRes.encryptedData,
            //           iv: userInfoRes.iv
            //         },
            //         success: function (json) {
            //           console.log(json.data);
            //         }
            //       });
            //     }
            //   })
            // } else {
            //   console.log('储存session失败！', json);
            // }
          }
        })
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})