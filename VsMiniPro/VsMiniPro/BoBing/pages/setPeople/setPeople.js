
const app = getApp()
// pages/setPeople/setPeople.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [

    ],
    count: 1
  },


  customReload: function () {
    var tempList = [];
    this.data.count = 1;
    var currentPeopleSet = wx.getStorageSync(app.globalData.peopleSetKeyName);
    if (currentPeopleSet != "") {
      tempList = JSON.parse(currentPeopleSet);
      this.data.count = tempList[tempList.length - 1].id;
    }
    else {
      tempList.push({ id: this.data.count, name: "", randseed: "" });
      tempList.push({ id: ++this.data.count, name: "", randseed: "" });
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  addRow: function () {
    app.showToast({
      title: '添加成功',
      icon: 'loading',
      duration: 100
    })
    this.data.count++;
    var tempList = this.data.lists;
    tempList.push({ id: this.data.count, name: "", randseed: "" });
    this.setData({
      lists: tempList
    })
  },
  delRow: function (e) {
    app.showToast({
      title: '删除成功',
      icon: 'loading',
      duration: 100
    })

    var id = e.target.dataset.id;
    var tempList = this.data.lists;
    var index = 0;
    for (var i = 0; i < tempList.length; i++) {
      var obj = tempList[i];
      if (obj.id == id) {
        if (tempList.length == 2) {
          app.showToast({
            title: '最少两个参与者',
            icon: 'loading',
            duration: 300
          })
          break;
        }
        tempList.splice(i, 1);
        break;
      }
    }
    this.setData({
      lists: tempList
    })

  },
  bindNameInput: function (e) {
    this.setObjValueById(e.target.dataset.id, e.detail.value, "name");
  },
  bindRandSeedInput: function (e) {
    this.setObjValueById(e.target.dataset.id, e.detail.value, "randseed");
  },
  validateRandseed: function (e) {
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
      if (item.name == "" || item.randseed == "") {
        app.showToast({
          title: '请填写完整信息',
          icon: 'loading',
          duration: 300
        })
        return;
      }

    }
    wx.setStorageSync(app.globalData.peopleSetKeyName, JSON.stringify(tempList));
    app.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 300
    })
  },
  reset: function () {
    wx.removeStorageSync(app.globalData.peopleSetKeyName);
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
  },
  next: function () {
    if (wx.getStorageSync(app.globalData.peopleSetKeyName)!=""){
      wx.navigateTo({
        url: '../setPrize/setPrize'
      })
    }else{
      app.showToast({
        title: '请先设置参与者',
        icon: 'loading',
        duration: 300
      })
    }
  }
  ,
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
})