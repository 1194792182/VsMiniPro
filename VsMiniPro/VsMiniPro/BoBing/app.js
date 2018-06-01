//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    return
    var self = this;
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          self.sendCode(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getServerUrlObj: function () {
    return this.globalData.serverUrlObj;
  },
  // 向服务器发送微信登录返回的code
  sendCode: function (code) {
    var self = this;
    // console.log(code);
    this.sendRequest({
      url: self.getServerUrlObj().sendCodeUrl,
      method: 'post',
      data: { code: code },
      success: function (res) {
        console.log(res);
        var myData = JSON.parse(res.Result);
        // console.log(myData.session_key);
        if (myData.errcode) {
          self.globalData.notBindXcxAppId = true;
          self.requestUserInfo(1);
        } else {
          if (myData.session_key) {
            self.setSessionKey(myData.session_key);
            self.requestUserInfo(2);
          }
        }
      },
      fail: function (res) {
        console.log('sendCode fail');
      },
      complete: function (res) {

      }
    })
  }
  ,
  requestUserInfo: function (is_login) {
    if (is_login == 1) {
      this.requestUserXcxInfo();
    } else {
      this.requestUserWxInfo();
    }
  }

  ,
  hideToast: function () {
    wx.hideToast();
  }
  ,
  requestUserXcxInfo: function () {
    var self = this;
    this.globalData.userInfo = {};
    self.setUserInfoStorage({});
  },
  sendRequest: function (param, customSiteUrl) {
    var self = this,
      data = param.data || {},
      header = param.header,
      requestUrl;
    if (data.app_id) {
      data._app_id = data.app_id;
    } else {
      // data._app_id = data.app_id = this.getAppId();
      data._app_id = this.getAppId();
    }
    if (!this.globalData.notBindXcxAppId) {
      data.session_key = this.getSessionKey();
    }
    if (customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = this.globalData.siteBaseUrl + param.url;
    }

    if (param.method) {
      if (param.method.toLowerCase() == 'post') {
        data = this.modifyPostParam(data);
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        }
      }
      param.method = param.method.toUpperCase();
    }

    if (!param.hideLoading) {
      this.showToast({
        title: '请求中...',
        icon: 'loading'
      });
    }

    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode && res.statusCode != 200) {
          self.hideToast();
          self.showModal({
            content: '' + res.errMsg
          });
          typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal();
          return;
        }
        if (res.data.status) {
          if (res.data.status == 401 || res.data.status == 2) {
            // 未登录
            self.login();
            typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal();
            return;
          }
          if (res.data.status != 0) {
            typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal();
            self.hideToast();
            self.showModal({
              content: '' + res.data.data
            });
            return;
          }
        }
        typeof param.success == 'function' && param.success(res.data);
      },
      fail: function (res) {
        console.log(res);
        self.hideToast();
        self.showModal({
          content: '请求失败 ' + res.errMsg
        })
        typeof param.fail == 'function' && param.fail(res.data);
      },
      complete: function (res) {
        param.hideLoading || self.hideToast();
        typeof param.complete == 'function' && param.complete(res.data);
      }
    });

  }
  ,
  getAppId: function () {
    return this.globalData.appId;
  },
  getSessionKey: function () {
    return this.globalData.sessionKey;
  },

  showToast: function (param) {
    wx.showToast({
      title: param.title,
      icon: param.icon,
      duration: param.duration || 1500,
      success: function (res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },

  modifyPostParam: function (obj) {
    let query = '',
      name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.modifyPostParam(innerObj) + '&';
        }
      }
      else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this.modifyPostParam(innerObj) + '&';
        }
      }
      else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },
  setUserInfoStorage: function (info) {
    for (var key in info) {
      this.globalData.userInfo[key] = info[key];
    }
    wx.setStorage({
      key: 'userInfo',
      data: this.globalData.userInfo
    })
  }, setSessionKey: function (session_key) {
    this.globalData.sessionKey = session_key;
    wx.setStorage({
      key: 'session_key',
      data: session_key
    })
  },
  requestUserWxInfo: function () {
    var self = this;
    wx.getUserInfo({
      success: function (res) {
        res.userInfo.getSuccess = true;
        self.sendUserInfo(res.userInfo);
      },
      fail: function (res) {
        console.log('requestUserWxInfo fail');
      }
    })
  },
  sendUserInfo: function (userInfo) {
    var self = this;
    self.setUserInfoStorage(userInfo);
  }
  ,

  globalData: {
    systemInfo: { SDKVersion: "", errMsg: "", language: "", model: "", pixelRatio: "", platform: "", screenHeight: "", screenWidth: "", system: "", version: "", windowHeight: "", windowWidth: "" }
    , appId: 'wx9b87c14c58097ad4'
    , sessionKey: ""
    , notBindXcxAppId: false
    , siteBaseUrl: 'https://smallpro.1194792182.com'

    , serverUrlObj: {
      uploadImg: '/UploadSth/UploadImg',
      sendCodeUrl: '/DataCenter/SendCode'
    }
    , appTitle: '待定义APP标题'
    , appDescription: '待定义APP描述',
    peopleSetKeyName:"peopleSet",
    prizeSetKeyName:"prizeSet"
  }
})