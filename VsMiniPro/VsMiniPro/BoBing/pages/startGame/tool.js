
const commonGroup = 1;
const zhuangyuanGroup = 2;



function canReduceStock(prize) {
  if (parseInt(prize.prizeStock) > 0) {
    prize.prizeStock--;
    return true;
  }
  return false;
}

function setValidateResult(source, target, isNoEnoughStock, remainderStock) {
  target.levelAlias = source.levelAlias;
  target.level = source.level;
  target.prizeName = source.prizeName;
  target.ruleType = source.ruleType;
  if (isNoEnoughStock) {
    target.isNoEnoughStock = true;
  } else {
    target.isNoEnoughStock = false;
  }
  target.remainderStock = remainderStock;
}

function matchStock(prize, validateResult) {
  var isMatch = true;
  //普通
  if (parseInt(prize.group) === commonGroup) {
    var canReduce = canReduceStock(prize);
    if (canReduce) {
      setValidateResult(prize, validateResult, false, prize.prizeStock);
    } else {
      isMatch = false;
      setValidateResult(prize, validateResult, true, 0);
    }
  } else {
    setValidateResult(prize, validateResult, false, 0);
  }
  return isMatch;
}

var getPrizeSetListAscSortListByLevel = function (arr) {
  return arr.sort(function (a, b) {
    return parseInt(a.level) - parseInt(b.level);
  });
}

var getZhuangYuanPrizeList = function (prizeSetListAscLevelSortList) {
  var arr = [];
  for (var i = 0; i < prizeSetListAscLevelSortList.length; i++) {
    var obj = prizeSetListAscLevelSortList[i];
    if (obj.group == zhuangyuanGroup) {
      arr.push(obj);
    }
  }
  return arr;
}

var getCommonPrizeList = function (prizeSetListAscLevelSortList) {
  var arr = [];
  for (var i = 0; i < prizeSetListAscLevelSortList.length; i++) {
    var obj = prizeSetListAscLevelSortList[i];
    if (obj.group == commonGroup) {
      arr.push(obj);
    }
  }
  return arr;
}

function getSeededRandom(max, min, seed) {
  max = max || 1; min = min || 0;
  seed = (seed * 9301 + 49297) % 233280;
  var rnd = seed / 233280.0;
  return parseInt((min + rnd * (max - min)) + "");
}

var dealResult=function(str) {
  var numArr = str.split("");
  var result = numArr.sort().join("");
  return result;
}

var getRandNumsResult = function (seed) {
  var max = 7;
  var min = 1;
  var result = "";
  for (var i = 1; i <= 6; i++) {
    result += getSeededRandom(max, min, seed + (Math.random() * new Date().getTime()));
  }
  return dealResult(result);
}

var baseValidate = function (numStr, list, validateResult) {
  var isMatch = false;
  var ruleArr;
  for (var i = 0; i < list.length; i++) {
    var obj = list[i];
    switch (obj.ruleType) {
      case "1":
        isMatch = numStr.indexOf(obj.rule) > -1;
        if (isMatch) {
          isMatch = matchStock(obj, validateResult);
        }
        break;
      case "2":
        ruleArr = obj.rule.split(',');
        for (var k = 0; k < ruleArr.length; k++) {
          var kStr = dealResult(ruleArr[k]);
          isMatch = numStr.indexOf(kStr) > -1;
          if (isMatch) {
            break;
          }
        }
        if (isMatch) {
          isMatch = matchStock(obj, validateResult);
        }
        break;
      case "3":
        isMatch = (numStr == obj.rule);
        if (isMatch) {
          isMatch = matchStock(obj, validateResult);
        }
        break;
      case "4":
        ruleArr = obj.rule.split('|');
        isMatch = numStr.indexOf(ruleArr[0]) > -1;
        var noMatch = true;
        for (var m = 1; m < ruleArr.length; m++) {
          var mStr = ruleArr[m];
          noMatch = numStr.indexOf(mStr) <= -1;
          if (!noMatch) {
            break;
          }
        }
        isMatch = isMatch && noMatch;
        if (isMatch) {
          isMatch = matchStock(obj, validateResult);
        }
        break;
    }
    validateResult.isMatch = isMatch;
    if (isMatch) {
      break;
    }
  }
}

var setOutputResult = function (targetObj, sourceList) {
  targetObj.peopleName = sourceList[0].peopleName;
  targetObj.levelAlias = sourceList[0].levelAlias;
  targetObj.id = sourceList[0].id;
}

var getZhuangyuanListAscSortListByLevel = function (arr) {
  return arr.sort(function (a, b) {
    return parseInt(a.level) - parseInt(b.level);
  });
}

var getMinLevelList = function (arr, minLevel) {
  var tempArr = [];
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];
    if (obj.level != minLevel) {
      break;
    } else {
      tempArr.push(obj);
    }
  }
  return tempArr;
}

function getListByMaxNumStr(arr, maxNumStr) {
  var tempArr = [];
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];
    if (obj.numStr != maxNumStr) {
      break;
    } else {
      tempArr.push(obj);
    }
  }
  return tempArr;
}

function getListByAppearMaxTimesNum(arr, appearMaxTimesNumStr) {
  var tempArr = [];
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];
    if (obj.numStr.indexOf(appearMaxTimesNumStr) < 0) {
      break;
    } else {
      tempArr.push(obj);
    }
  }
  return tempArr;
}

function getDescSortListById(arr) {
  return arr.sort(function (a, b) {
    return parseInt(b.id) - parseInt(a.id);
  });
}

function getDescSortListByNumStr(arr) {
  return arr.sort(function (a, b) {
    return parseInt(b.numStr) - parseInt(a.numStr);
  });
}

function getDescSortListBySingleNumAfterReplace(arr, replaceStr) {
  return arr.sort(function (a, b) {
    return parseInt(b.numStr.replace(replaceStr, "")) - parseInt(a.numStr.replace(replaceStr, ""));
  });
}

function getAppearTimesObj(numStr) {
  var arr = numStr.split("");
  var temp = [];//对象数组
  var i;
  temp[0] = { value: arr[0], times: 1 };//保存数组元素出现的次数和值
  for (i = 1; i < arr.length; i++) {
    if (arr[i] == arr[i - 1]) {
      temp[temp.length - 1].times++;
    } else {//不相同则新增一个对象元素
      temp.push({ times: 1, value: arr[i] });
    }
  }
  temp.sort(function (a, b) { //按照出现次数从大到小排列
    return b.times-a.times;
  });

  var max = temp[0].times;
  var maxV = temp[0].value;
  var min = temp[1].times;
  var minV = temp[1].value;

  return { maxV: maxV, minV: minV };
}

function getDescSortListByAppearMaxTimesNum(arr) {
  return arr.sort(function (a, b) {
    var num1 = getAppearTimesObj(b.numStr).maxV;
    var num2 = getAppearTimesObj(a.numStr).maxV;
    return parseInt(num1) - parseInt(num2);
  });
}

function getDescSortListByAppearMinTimesNum(arr) {
  return arr.sort(function (a, b) {
    var num1 = getAppearTimesObj(b.numStr).minV;
    var num2 = getAppearTimesObj(a.numStr).minV;
    return parseInt(num1) - parseInt(num2);
  });
}

function getDescSortListByTwoNumAfterReplace(arr, replaceStr) {
  return arr.sort(function (a, b) {
    var bReplaceResultStr = b.numStr.replace(replaceStr, "");
    var aReplaceResultStr = a.numStr.replace(replaceStr, "");
    var num1 = parseInt(bReplaceResultStr.substr(0, 1)) + parseInt(bReplaceResultStr.substr(1, 1));
    var num2 = parseInt(aReplaceResultStr.substr(0, 1)) + parseInt(aReplaceResultStr.substr(1, 1));
    return num1 - num2;
  });
}

var getResultByRule = function (minLevelList, result) {
  var level = minLevelList[0].level + "";
  var zhuangyuanList = [], maxNumStr;
  switch (level) {
    case "1":
    case "2":
    case "3":
      //后发制胜原则
      zhuangyuanList = getDescSortListById(minLevelList);
      break;
    case "4":
      zhuangyuanList = getDescSortListByNumStr(minLevelList);
      maxNumStr = zhuangyuanList[0].numStr;
      zhuangyuanList = getListByMaxNumStr(zhuangyuanList, maxNumStr);
      if (zhuangyuanList.length > 1) {
        zhuangyuanList = getDescSortListById(zhuangyuanList);
      }
      break;
    case "5":
      zhuangyuanList = getDescSortListBySingleNumAfterReplace(minLevelList, "44444");
      maxNumStr = zhuangyuanList[0].numStr;
      zhuangyuanList = getListByMaxNumStr(zhuangyuanList, maxNumStr);
      if (zhuangyuanList.length > 1) {
        zhuangyuanList = getDescSortListById(zhuangyuanList);
      }
      break;
    case "6"://五子登科
      //先比较出现次数最多的那个数，再比较次数最少的那个数
      zhuangyuanList = getDescSortListByAppearMaxTimesNum(minLevelList);
      var appearMaxTimesNum = getAppearTimesObj(zhuangyuanList[0].numStr).maxV;
      zhuangyuanList = getListByAppearMaxTimesNum(zhuangyuanList, "" + appearMaxTimesNum + appearMaxTimesNum + appearMaxTimesNum + appearMaxTimesNum + appearMaxTimesNum);
      if (zhuangyuanList.length > 1) {
        zhuangyuanList = getDescSortListByAppearMinTimesNum(zhuangyuanList);
        maxNumStr = zhuangyuanList[0].numStr;
        zhuangyuanList = getListByMaxNumStr(zhuangyuanList, maxNumStr);
        if (zhuangyuanList.length > 1) {
          zhuangyuanList = getDescSortListById(zhuangyuanList);
        }
      }
      break;
    case "7":
      zhuangyuanList = getDescSortListByTwoNumAfterReplace(minLevelList, "4444");
      maxNumStr = zhuangyuanList[0].numStr;
      zhuangyuanList = getListByMaxNumStr(zhuangyuanList, maxNumStr);
      if (zhuangyuanList.length > 1) {
        zhuangyuanList = getDescSortListById(zhuangyuanList);
      }
      break;
  }

  setOutputResult(result, zhuangyuanList);
}

module.exports = {
  dealResult: dealResult,
  getPrizeSetListAscSortListByLevel: getPrizeSetListAscSortListByLevel,
  getZhuangYuanPrizeList: getZhuangYuanPrizeList,
  getCommonPrizeList: getCommonPrizeList,
  getRandNumsResult: getRandNumsResult,
  baseValidate: baseValidate,
  setOutputResult: setOutputResult,
  getZhuangyuanListAscSortListByLevel: getZhuangyuanListAscSortListByLevel,
  getMinLevelList: getMinLevelList,
  getResultByRule: getResultByRule
}