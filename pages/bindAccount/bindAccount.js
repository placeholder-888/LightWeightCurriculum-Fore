import * as utils from '../../utils/utils'
import * as common from "../../utils/common"
Page({
  data: {
    studentId: '',
    studentPassword: '',
    studentType: '',
    types: [{
      id: 1,
      name: '研究生',
    }, {
      id: 2,
      name: '本科生'
    }],
    current: '研究生',
    position: 'left',
    checked: false,
    disabled: false,
    curriculumPage: '/pages/curriculum/curriculum'
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
      current: detail.value
    });
  },
  bindCallback: function (openId) {
    let that = this
    let account = {
      username: that.data.studentId,
      password: that.data.studentPassword
    }
    utils.postRequest(common.bindAccountUrl,
      {
        openid: openId,
        username: that.data.studentId,
        password: that.data.studentPassword
      },
      function (res) {
        if (res.code == common.BindSuccess) {
          console.log(res)
          wx.setStorage({
            key: 'account',
            data : account
          })
          wx.switchTab({
            url: that.data.curriculumPage
          })
          //utils.model("绑定成功");
        } else {
          utils.model("绑定失败 可能是因为账户名或者密码错误");
        }
      }
    )
  },
  handleBind: function () {
    if (this.data.studentId == '' || this.data.studentPassword == '') {
      utils.model("请输入学号和密码");
      return;
    }
    utils.requireOpenId(this.bindCallback)
  },
  idChange: function (event) {
    this.setData({
      studentId: event.detail.detail.value
    })
  },
  pwdChange: function (event) {
    this.setData({
      studentPassword: event.detail.detail.value
    })
  },
  onLoad: function () {
    //FIXME Check if the user has already binded his account
  }
});