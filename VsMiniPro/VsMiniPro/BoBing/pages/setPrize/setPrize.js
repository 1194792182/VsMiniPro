// pages/setPrize/setPrize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: []
  },
  customReload: function () {
    var tempList = [];

    var currentPrizeSet = wx.getStorageSync(app.globalData.prizeSetKeyName);
    if (currentPrizeSet != "") {
      tempList = JSON.parse(currentPrizeSet);

    }
    else {
      this.setBasePrizeInfo(tempList);

    }
    this.setData({
      lists: tempList
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.customReload();
  },

  validatePrizeStock: function (e) {
    var value = e.detail.value;
    var arr = value.split("");
    if (arr.length > 0) {
      if (!/[1-9]/.test(arr[arr.length - 1])) {
        arr.length = arr.length - 1;
        var returnVal = arr.join("");
        return returnVal;
      }
    }
  },
  bindPrizeNameInput: function (e) {
    this.setObjValueById(e.target.dataset.id, e.detail.value, "prizeName");
  }
  ,
  bindPrizeStockInput: function (e) {
    this.setObjValueById(e.target.dataset.id, e.detail.value, "prizeStock");
  }
  ,
  setObjValueById: function (id, value, keyName) {
    var tempList = this.data.lists;

    for (var i = 0; i < tempList.length; i++) {
      var obj = tempList[i];
      if (obj.id == id) {
        obj[keyName] = value;
        break;
      }
    }
    this.data.lists = tempList;
  }
  ,
  save: function () {
    var tempList = this.data.lists;
    for (var i = 0; i < tempList.length; i++) {
      var item = tempList[i];
      if (item.prizeName == "" || item.prizeStock == "") {
        app.showToast({
          title: '请填写完整信息',
          icon: 'loading',
          duration: 300
        })
        return;
      }
      if (!/^[1-9]{1,3}$/.test(item.prizeStock) && item.prizeStock % 10 != 0 || item.prizeStock == 0) {
        console.log(i)
        app.showToast({
          title: '奖品数量有误',
          icon: 'loading',
          duration: 300
        })
        return;
      }
    }
    wx.setStorageSync(app.globalData.prizeSetKeyName, JSON.stringify(tempList));
    app.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 300
    })
  },
  reset: function () {
    wx.removeStorageSync(app.globalData.prizeSetKeyName);
    this.customReload();
    app.showToast({
      title: '重置成功',
      icon: 'success',
      duration: 300
    })
  },
  relaod: function () {
    this.customReload();
    app.showToast({
      title: '重载成功',
      icon: 'success',
      duration: 300
    })
  }
  ,
  next: function () {
    if (wx.getStorageSync(app.globalData.prizeSetKeyName) != "") {
      wx.navigateTo({
        url: '../startGame/startGame'
      })
    } else {
      app.showToast({
        title: '请先设置奖品',
        icon: 'loading',
        duration: 300
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  ,
  setBasePrizeInfo: function (tempList) {
    tempList.push({
      id: 1,
      "levelAlias": "一秀",
      "level": "12",
      "group": "1",
      "rule": "4",
      "ruleType": "1",//包含
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 2,
      "levelAlias": "二举",
      "level": "11",
      "group": "1",
      "rule": "44",
      "ruleType": "1",//包含
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 3,
      "levelAlias": "四进",
      "level": "10",
      "group": "1",
      "rule": "1111,2222,3333,5555,6666",
      "ruleType": "2"//包含其中一种
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 4,
      "levelAlias": "三红",
      "level": "9",
      "group": "1",
      "rule": "444",
      "ruleType": "1"//包含
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 5,
      "levelAlias": "对堂",
      "level": "8",
      "group": "1",
      "rule": "123456",
      "ruleType": "3"//等于
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 6,
      "levelAlias": "四红",
      "level": "7",
      "group": "2",
      "rule": "4444|114444|444444",
      "ruleType": "4"//包含并排除
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 7,
      "levelAlias": "五子登科",
      "level": "6",
      "group": "2",
      "rule": "11111,22222,33333,55555,66666",
      "ruleType": "2"//包含其中一种
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 8,
      "levelAlias": "五红",
      "level": "5",
      "group": "2",
      "rule": "444441,444442,444443,444445,444446",
      "ruleType": "2"//包含其中一种
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 9,
      "levelAlias": "黑六勃",
      "level": "4",
      "group": "2",
      "rule": "222222,333333,555555,666666",
      "ruleType": "2"//包含其中一种
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 10,
      "levelAlias": "遍地锦",
      "level": "3",
      "group": "2",
      "rule": "111111",
      "ruleType": "3"//等于
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 11,
      "levelAlias": "红六勃",
      "level": "2",
      "group": "2",
      "rule": "444444",
      "ruleType": "3"//等于
      ,
      "prizeName": "",
      "prizeStock": ""
    });
    tempList.push({
      id: 12,
      "levelAlias": "插金花",
      "level": "1",
      "group": "2",
      "rule": "114444",
      "ruleType": "3"//等于
      ,
      "prizeName": "",
      "prizeStock": ""
    });
  }
})