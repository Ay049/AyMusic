// pages/search/search.js
import request from '../../utils/request'
import util from '../../utils/util'
// let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', // 默认搜索内容
    hotList: [], // 热搜数据
    searchContent: '', // 用户输入的value值
    searchList: [], // 接口返回的搜索数据
    historyList: [], // 历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInitData()
    this.getSearchHistory()
  },
  getInitData() { // 获取初始化数据

    const hDetail = new Promise((res) => { // 热搜
      let hotListData = request('/search/hot/detail')
      res(hotListData)
    })
    const sDefault = new Promise((res) => { // 默认搜索请求
      let placeholderData = request('/search/default')
      res(placeholderData)
    })

    Promise.all([sDefault, hDetail]).then(res => {
      return this.setData({
        placeholderContent: res[0].data.showKeyword,
        hotList: res[1].data
      })
    }).catch(err => {
      console.log(err);
    })
  },
  getSearchHistory() { // 历史记录
    let historyList = wx.getStorageSync('this.data.historyList')
    if (historyList) {
      this.setData({
        historyList
      })
    }
    console.log(historyList);
  },
  getSearchList() { // 搜索请求
    if (!this.data.searchContent) { // 如果搜索栏为空,则设置搜索列表数据为空,并直接返回中断请求函数
      this.setData({
        searchList: []
      })
      return
    }
    const sLD = new Promise((res) => {
      const searchListData = request('/search', {
        keywords: this.data.searchContent,
        limit: 10
      })
      res(searchListData)
    }).then(res => {
      console.log(res.result.songs);
      return (this.setData({
        searchList: res.result.songs
      }))
    }).then(() => {
      // 历史记录
      let historyList = this.data.historyList
      let searchContent = this.data.searchContent
      if (historyList.indexOf(searchContent) !== -1) {
        historyList.splice(historyList.indexOf(searchContent), 1)
      }
      historyList.unshift(searchContent)
      this.setData({
        historyList: historyList
      })
      return wx.setStorageSync('searchHistory', historyList)
    })
  },
  // 用防抖方法做的  inputChange事件监听
  handleInputChange: util.debounce(function(event) {
    this.setData({
      searchContent: event[0].detail.value.trim()
    })
    if (this.data.searchContent.value) {
      return
    } else {
      this.getSearchList()
    }
  }, 1000),
  // handleInputChange(event) {
  //   this.setData({
  //     searchContent: event.detail.value.trim()
  //   })
  //   // 节流
  //   if (isSend) {
  //     return
  //   }
  //   isSend = true
  //   this.getSearchList()
  //   setTimeout(() => {
  //     isSend = false
  //   }, 300)
  // },
  clearSearchContent() {
    // 清空搜索框内容
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  deleteSearchHistory() {
    wx.showModal({ // 弹窗询问
      title: '',
      content: '确地清空全部历史记录?',
      success: (res) => {
        if (res.confirm) { // res.confirm为true则表示用户点击了弹窗的确定
          this.setData({
            historyList: []
          })
          wx.removeStorageSync('searchHistory')  // 清除本地历史
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})