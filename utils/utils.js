/**
 * 工具类
 */

/**
 * 日期格式化
 */
import * as common from './common.js'

export function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//全局错误处理函数 出错了会跳转回主页
export function handleError(errorMsg) {
  wx.showModal({
    title: '出错',
    content: "error:" + errorMsg,
    success(res) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    showCancel: false,
    confirmText: "回到主页", //默认是“确定”
  })
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

export function postRequest(url_, form, callback) {
  wx.request({
    url: url_,
    data: json2Form(form),
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    success: function (res) {
      if (res.statusCode != 200) {
        console.log(res)
        model("服务器出错了 请重试");
      } else {
        callback(res.data)
      }
    },
    fail: function () {
      handleError("无法连接到服务器")
    }
  })
}

export function getRequest(url_, form, callback) {
  wx.request({
    url: url_,
    data: form,
    method: "GET",
    success: function (res) {
      if (res.statusCode != 200) {
        console.log(res)
        model("服务器出错了 请重试");
      } else {
        callback(res.data)
      }
    },
    fail: function () {
      handleError("无法连接到服务器")
    }
  })
}

export function getCache(cacheKey, successCallback, errorCallback) {
  wx.getStorage({
    key: cacheKey,
    success: function (res) {
      successCallback(res.data)
    },
    fail: function () {
      errorCallback()
    }
  });
}

//从缓存中取出openid，如果没有则登录获取openid并存入缓存
//如果出错了 那么就会跳转回主页
export function requireOpenId(Callback) {
  getCache('openid', function (res) {
    Callback(res)
  }, function () {
    loginAndStoreOpenId(Callback);
  });
}

function loginAndStoreOpenId(successCallback) {
  wx.login({
    success(res) {
      if (res.code) {
        getRequest(common.LoginUrl, { code: res.code }, function (res) {
          console.log(res)
          if (res.code != common.LoginSuccess) {
            handleError("登录失败！" + res.msg);
            return;
          }
          wx.setStorage({
            key: 'openid',
            data: res.openid
          })
          successCallback(res.openid)
        });
      }
    }
  })
}

export function checkBind(bindCallback, unBindCallback) {
  function doCheck(openId) {
    postRequest(common.checkBindUrl, { openid: openId },
      function (res) {
        if (res.code == common.AlreadyBind) {
          bindCallback()
        } else {
          unBindCallback()
        }
      });
  }
  getCache("account",bindCallback,function() { requireOpenId(doCheck) })
}

export function model(errorMsg) {
  wx.showModal({
    title: '出错了',
    content: errorMsg,
    showCancel: false,
    confirmText: "确定"
  })
}