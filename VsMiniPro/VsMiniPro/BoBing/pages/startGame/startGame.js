var tools = require("tool.js")
// pages/startGame/startGame.js
const app = getApp()
var peopleBaseSetListStr, prizeSetListStr;
var peopleBaseSetList, prizeSetList;
var t;
var order = 0;//获得状元的顺序
var timeCount = 0;//博饼次数
const intervalTime = 100;
var prizeSetListAscLevelSortList;
var zhuangYuanPrizeList;
var commonPrizeList;
var zhuangyuanReusltArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight:732,
    toView:"start",
    hideStartBtn: 1,//开始按钮 1表示隐藏
    hideDetail: 1,//博饼详情 1表示隐藏
    hideZhuangyuanList: 1,//候选状元 1表示隐藏
    hidefinalZhuangyuan: 1,//最终状元 1表示隐藏
    hideGotoBottom:1,//到底部按钮 1表示隐藏
    disableStartBtn: 0,//0表示不禁用
    btnValue: "开始博饼",
    zhuangYuanListTitle: "候选状元",
    finalZhuanyuanTitle: "最终状元",
    resultInfos: [],
    zhuangYuanList: [],
    finalZhuangyuan: {}
  },
  loadData: function () {
    peopleBaseSetListStr = wx.getStorageSync(app.globalData.peopleSetKeyName);
    prizeSetListStr = wx.getStorageSync(app.globalData.prizeSetKeyName);
    peopleBaseSetList = JSON.parse(peopleBaseSetListStr);
    prizeSetList = JSON.parse(prizeSetListStr);
    prizeSetListAscLevelSortList = tools.getPrizeSetListAscSortListByLevel(prizeSetList);
    // console.log(prizeSetListAscLevelSortList);
    zhuangYuanPrizeList = tools.getZhuangYuanPrizeList(prizeSetListAscLevelSortList);
    // console.log(zhuangYuanPrizeList);
    commonPrizeList = tools.getCommonPrizeList(prizeSetListAscLevelSortList);
    // console.log(commonPrizeList);
  },
  checkStatusIsPrepareOk: function () {
    var peopleSetStr = wx.getStorageSync(app.globalData.peopleSetKeyName);
    if (peopleSetStr == "") {
      wx.showLoading({
        title: '请先设置参与者',
        icon: 'loading',
        duration: 2000,
        mask: true
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../setPeople/setPeople'
        })
      }, 1000)
      return false;
    }
    var prizeSetStr = wx.getStorageSync(app.globalData.prizeSetKeyName);
    if (prizeSetStr == "") {
      wx.showLoading({
        title: '请先设置奖品',
        icon: 'loading',
        duration: 2000,
        mask: true
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../setPrize/setPrize'
        })
      }, 1000)
      return false;
    }
    return true;
  }
  ,
  getCommonPrizeIsOverResult: function () {
    var sum = 0;
    for (var i = 0; i < commonPrizeList.length; i++) {
      var obj = commonPrizeList[i];
      sum += parseInt(obj.prizeStock);
    }
    return sum == 0;
  }
  ,
  getIsOverResult: function () {
    return this.getCommonPrizeIsOverResult() && zhuangYuanPrizeList[0].prizeStock == 0;
  }
  ,
  //匹配状元
  validateZhuangyuan: function (numStr, validateResult) {
    tools.baseValidate(numStr, zhuangYuanPrizeList, validateResult);
  }
  ,
  //匹配普通
  validateCommon: function (numStr, validateResult) {
    tools.baseValidate(numStr, commonPrizeList, validateResult);
  }
  ,
  getPrizeResult: function (numStr, peopleName, prizeResult) {
    var matchZhuangYuanResult = {};
    this.validateZhuangyuan(numStr, matchZhuangYuanResult);
    if (matchZhuangYuanResult.isMatch) {
      order++;
      zhuangyuanReusltArr.push({ "id": order, "peopleName": peopleName, "numStr": numStr, "level": matchZhuangYuanResult.level, "levelAlias": matchZhuangYuanResult.levelAlias });
      prizeResult.count = timeCount;
      prizeResult.numStr = numStr;
      prizeResult.alias = matchZhuangYuanResult.levelAlias;
      prizeResult.prizeName = "获得比拼状元的入场券";
      prizeResult.qty = 1;
      return;
    }
    var matchCommonResult = {};
    this.validateCommon(numStr, matchCommonResult);
    if (matchCommonResult.isMatch) {
      prizeResult.count = timeCount;
      prizeResult.numStr = numStr;
      prizeResult.alias = matchCommonResult.levelAlias;
      prizeResult.prizeName = matchCommonResult.prizeName;
      prizeResult.qty = matchCommonResult.remainderStock;
      return;
    }
    if (!matchCommonResult.isNoEnoughStock) {
      prizeResult.count = timeCount;
      prizeResult.numStr = numStr;
      prizeResult.alias = "无";
      prizeResult.prizeName = "无";
      prizeResult.qty = 0;
    } else {
      prizeResult.count = timeCount;
      prizeResult.numStr = numStr;
      prizeResult.alias = matchCommonResult.levelAlias;
      prizeResult.prizeName = "很可惜，此类奖品已分配完";
      prizeResult.qty = 0;
    }
  }
  ,
  settempResultInfosByPeopleId: function (tempResultInfos, id, prizeResult) {
    for (var i = 0; i < tempResultInfos.length; i++) {
      var obj = tempResultInfos[i];
      if (obj.id == id) {
        obj.detailList.push({
          count: prizeResult.count,
          numStr: prizeResult.numStr,
          alias: prizeResult.alias,
          prizeName: prizeResult.prizeName,
          qty: prizeResult.qty,
        });
        break;
      }
    }
  },
  logZhuangyuanReusltArr: function () {
    var tempzhuangYuanList = [];
    for (var i = 0; i < zhuangyuanReusltArr.length; i++) {
      var obj = zhuangyuanReusltArr[i];
      tempzhuangYuanList.push({
        id: obj.id,
        peopleName: obj.peopleName,
        numStr: obj.numStr,
        level: obj.level,
        alias: obj.levelAlias
      });
    }
    this.setData({
      hideZhuangyuanList: 0,
      zhuangYuanList: tempzhuangYuanList
    });
  },
  getFinailZhuangyuan: function (result) {
    //排序
    var zhuangyuanListAscSortList = tools.getZhuangyuanListAscSortListByLevel(zhuangyuanReusltArr);
    var minLevel = zhuangyuanListAscSortList[0].level;
    //获取等于最小等级的数组
    var minLevelList = tools.getMinLevelList(zhuangyuanListAscSortList, minLevel);
    //数组数量只有一个，那就是状元
    if (minLevelList.length == 1) {
      tools.setOutputResult(result, minLevelList);
      return;
    }
    //最小等级的数组数量超过1个，继续进行对比
    tools.getResultByRule(minLevelList, result);
  }
  ,
  setGameOver: function (result) {
    var self=this;
    for (var i = 0; i < zhuangYuanPrizeList.length; i++) {
      var obj = zhuangYuanPrizeList[i];
      obj.prizeStock = 0;
    }

    var tempFinalZhuangyuan = {
      id: result.id,
      peopleName: result.peopleName,
      alias: result.levelAlias
    };

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollViewHeight: res.windowHeight,
          hidefinalZhuangyuan: 0,
          disableStartBtn: 0,
          finalZhuangyuan: tempFinalZhuangyuan,
          hideGotoBottom:0          
        })
      }
    })
  }
  ,
  calc: function () {
    var self = this;
    timeCount++;
    var isOver = self.getIsOverResult();
    if (!isOver) {
      var tempResultInfos = self.data.resultInfos;
      for (var i = 0; i < peopleBaseSetList.length; i++) {
        var obj = peopleBaseSetList[i];
        var randNumsResult = tools.getRandNumsResult(obj.randseed);
        var prizeResult = {};
        randNumsResult = tools.dealResult(randNumsResult);
        self.getPrizeResult(randNumsResult, obj.name, prizeResult);
        //在tempResultInfos查找id相等的，修改添加detailList
        self.settempResultInfosByPeopleId(tempResultInfos, obj.id, prizeResult);
      }
      self.setData({
        resultInfos: tempResultInfos
      })
      //判断是否可以比拼状元
      var commonPrizeIsOverResult = self.getCommonPrizeIsOverResult();
      if (commonPrizeIsOverResult && zhuangyuanReusltArr.length > 0) {
        var result = {};
        if (zhuangyuanReusltArr.length == 1) {
          self.logZhuangyuanReusltArr();
          tools.setOutputResult(result, zhuangyuanReusltArr);
        } else {
          self.logZhuangyuanReusltArr();
          self.getFinailZhuangyuan(result);
        }
        self.setGameOver(result);
      }
      t = setTimeout(this.calc, intervalTime);
    } else {
      clearTimeout(t);
    }
  }
  ,
  ini: function () {
    timeCount = 0;
    order = 0;
    zhuangyuanReusltArr = [];
    this.setData({
      hideStartBtn: 0,//开始按钮 1表示隐藏
      hideDetail: 0,//博饼详情 1表示隐藏
      hideZhuangyuanList: 1,//候选状元 1表示隐藏
      hidefinalZhuangyuan: 1,//最终状元 1表示隐藏
      disableStartBtn: 1,//0表示不禁用
      btnValue: "重新开始",
      resultInfos: [],
      zhuangYuanList: [],
      finalZhuangyuan: {}
    })
    this.loadData();
  }
  ,
  start: function () {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '您确定开始？',
      success: function (res) {
        if (res.confirm) {
          self.ini();
          //生成所有参与者的博饼基础信息
          var tempResultInfos = [];
          for (var i = 0; i < peopleBaseSetList.length; i++) {
            var obj = peopleBaseSetList[i];
            tempResultInfos.push({
              id: obj.id
              , name: obj.name
              , luckNum: obj.randseed
              , detailList: []
            });
          }
          self.setData({
            resultInfos: tempResultInfos
          })
          t = setTimeout(self.calc, 100);
        } else if (res.cancel) {

        }
      }
    })
  },
  getPrize: function () {
    var isSuccess = false;
    var tempResultInfos = this.data.resultInfos;
    for (var i = 0; i < tempResultInfos.length; i++) {
      var obj = tempResultInfos[i];
      var tempDetailList = [];
      for (var j = 0; j < obj.detailList.length; j++) {
        var subObj = obj.detailList[j];
        if (subObj.prizeName == "无" || subObj.prizeName.indexOf('可惜') > -1 || subObj.prizeName.indexOf('获得比拼状元') > -1) {
          isSuccess = true;
        } else {
          tempDetailList.push(subObj);
        }
      }
      obj.detailList = tempDetailList;
    }
    this.setData({
      resultInfos: tempResultInfos
    });
    if (isSuccess) {
      wx.showLoading({
        title: '清点完成',
        icon: 'success',
        duration: 1000,
        mask: true
      })
    }
    else{
      wx.showLoading({
        title: '无需清点',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
  }
  ,
  gotoTop:function(){
    this.setData({
      toView: "start"
    })
  },
  gotoBottom:function(){
    this.setData({
      toView: "getPrize"
    })
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isPass = this.checkStatusIsPrepareOk();
    if (isPass) {
      this.setData({
        hideStartBtn: 0
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
})