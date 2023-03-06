import * as dateUtil from '../../utils/date'
import * as utils from '../../utils/utils'
import * as common from '../../utils/common'
var dayjs = require('../../utils/dayjs.min.js');


let app = getApp()
let today = new Date()
let curFirstWeekDate // 当前周的第一天
let weekInfoList // 周信息列表
let curWeekIndex // 当前周索引
let weekCourseList // 周课程列表

let formatWeekDate = function (date) {
  return date.getDate() + '日'
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dayStr: '',
    semesterStartDay: '2023-02-20',
    todayIndex: -1, // 当天索引0-6，-1表示不在当前周
    curMonth: '', // 当前月份
    curWeek: '', // 当前周数
    curTitle: '', // 当前周标题
    //FIXME 挑选配色 
    courseColors: ['#ffca7f', '#91d7fd', '#96a4f9'], // 0学校课程 1其他课程 2智康课程
    weekLabels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    courseTimes: ['08:00\n08:50', '09:00\n09:50', '10:10\n11:00', '11:10\n12:00',
      '14:00\n14:50', '15:00\n15:50', '16:10\n17:00', '17:10\n18:00',
      '18:30\n19:20', '19:30\n20:20', '20:30\n21:20', '21:30\n22:20'],
    weekDates: [], // 周日期列表
    tasklist: [], // 课程列表
    current: 'curriculum',
    homePageKey: 'homepage',
    curriculumKey: 'curriculum',
    infoCenterKey: 'infocenter',
    homePage: '/pages/index/index',
    curriculumPage: '/pages/curriculum/curriculum',
    infoCenterPage: '/pages/infocenter/infocenter',
    visible: false,
    currentCourses: [],
    weekAvailCourses : [],
    weekCoursesColors : [],
    actions: [
      {
        name: '去绑定',
        color: '#2d8cf0',
      },
      {
        name: '回到首页',
        color: '#19be6b'
      }
    ]
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

  /**
   * 课程详情
   */
  showCardView: function (event) {
    let ele = event.currentTarget
    let type = ele.dataset.type
    let index = ele.dataset.index
    app.globalData.currentCourse = weekCourseList[index]

    if (type == 2) {
      wx.switchTab({
        url: '../queryCourse/queryCourse',
      })
    } else {
      wx.navigateTo({
        url: '../editCourse/editCourse',
      })
    }
  },

  /**
   * 新建课程
   */
  addCourseHandler: function (event) {
    wx.navigateTo({
      url: '../addCourse/addCourse',
    })
  },

  /**
   * 上一周
   */
  prevWeekHandler: function (event) {
    // FIXME for demo
    this.updateWeeks(-1)
  },

  /**
   * 下一周
   */
  nextWeekHandler: function (event) {
    this.updateWeeks(1)
  },

  updateWeeks: function (week) {
    let day = dayjs()
    if (this.data.dayStr != '') {
      day = dayjs(this.data.dayStr)
    }
    let start = dayjs(this.data.semesterStartDay)
    let end = start.add(20, 'week')
    if (week > 0) {
      day = day.add(week, 'week')
    } else if (week < 0) {
      day = day.subtract(-week, 'week')
    }
    if (day.isBefore(start)) {
      day = start
    }
    if (day.isAfter(end)) {
      day = end
    }
    let curWeek = day.diff(start, 'week') + 1
    let curMonth = day.month() + 1
    //conver dayjs to date
    //convert dayjs to date
    let curFirstWeekDate = dateUtil.getWeekFirstDate(day.toDate())
    let weekDates = []
    let weekBegin = dayjs(curFirstWeekDate)
    let todayIndex = -1
    let today = dayjs()
    for (var i = 0; i < 7; i++) {
      if (weekBegin.isSame(today, 'day')) {
        todayIndex = i
      }
      weekDates.push(weekBegin.format("MM-DD"))
      weekBegin = weekBegin.add(1, 'day')
    }
    let dayStr = day.format("YYYY-MM-DD")
    let weekAvailCourses = []
    let weekCoursesColors = []
    let len = this.data.currentCourses.length
    let clen = this.data.courseColors.length
    let c = 0
    for(let i = 0; i < len; ++i){
      let bit = this.data.currentCourses[i].weekBits
      if(bit & (1 << curWeek)){
        weekAvailCourses.push(this.data.currentCourses[i])
        weekCoursesColors.push({
          id : c,
          color : this.data.courseColors[i % clen]
        })
        ++c
      }
    }
    this.setData({
      dayStr,
      day,
      todayIndex,
      curMonth,
      curWeek,
      weekDates,
      weekAvailCourses,
      weekCoursesColors
    })
    // // FIXME for demo
    // let tasklist = weekCourseList = [
    //   { id: 0, type: 0, day: 0, start: 1, sections: 1, course: "语文", teacher: "刘德华", place: "大钟寺" },
    //   { id: 1, type: 1, day: 1, start: 5, sections: 2, course: "数学", teacher: "谢霆锋", place: "五道口" },
    //   { id: 2, type: 2, day: 2, start: 1, sections: 2, course: "英语", teacher: "小明", place: "科贸" }
    // ]
  },

  handleClick: function ({ detail }) {
    if (detail.index == 0) {
      wx.navigateTo({
        url: '/pages/bindAccount/bindAccount',
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
        fail: function (data) {
          console.log(data)
        }
      })
    }
  },

  handleBindAccount: function () {
    this.setData({
      visible: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   utils.checkBind(function () {
  //     //FIXME already bind do what?
  //   }, this.handleBindAccount)
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  fetchCourse: function () {
    var that = this
    utils.requireOpenId(function (openid) {
      utils.getRequest(common.queryCourseUrl, { openid: openid }, function (res) {
        if (res.code == common.LoginFail) {
          utils.model("登录失败 未能获取到课表 请重试或者重新绑定后再进行尝试")
          return;
        }
        let currentCourses = res.data
        that.setData({
          currentCourses
        })
        wx.setStorage({
          //FIXME 这里的key应该与学期id相关
          key: 'currentCourses',
          data: currentCourses
        })
        that.updateWeeks(0)
      })
    })
  },
  onLoad : function (){
    this.onShow()
  },
  onShow: function () {
    let fetchCourse = this.fetchCourse
    let that = this
    utils.checkBind(function () {
      //FIXME 这里的key应该与学期id相关
      utils.getCache('currentCourses', function (currentCourses) {
        that.setData({
          currentCourses
        })
      },
        (err) => {
          fetchCourse()
        })
    }, this.handleBindAccount)
    this.updateWeeks(0)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})