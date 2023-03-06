import * as utils from '../../utils/utils'

Page({
  data: {
    current: 'homepage',
    homePageKey: 'homepage',
    curriculumKey: 'curriculum',
    infoCenterKey: 'infocenter',
    homePage: '/pages/index/index',
    curriculumPage: '/pages/curriculum/curriculum',
    infoCenterPage: '/pages/infocenter/infocenter'
  },
  handleChange({
    detail
  }) {
    if (detail.key == this.data.homePageKey) {
      wx.switchTab({
        url: this.data.homePage
      })
    } else if (detail.key == this.data.curriculumKey) {
      wx.switchTab({
        url: this.data.curriculumPage
      })
    } else if (detail.key == this.data.infoCenterKey) {
      wx.switchTab({
        url: this.data.infoCenterPage
      })
    }
  },
  onLoad: function (options) {
    utils.checkBind(function(){
      console.log("bind")
    },function(){
      console.log("unbind")
    })
  }
});