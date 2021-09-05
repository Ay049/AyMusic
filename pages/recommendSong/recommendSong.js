// pages/recommendSong/recommendSong.js
const util = require('../../utils/util')
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTime: [],
    recommendList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '正在跳转至登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    this.setData({
      nowTime: util.formatTime(new Date()).ymd
    })
    this.getRecommendList()
  },
  // 获取每日推荐数据的请求
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.recommend
    })
  },
  // 跳转歌曲播放页
  toSongDetail(event) {
    let song = event.currentTarget.dataset.song
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id,

      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          list: this.data.recommendList,
          index: event.currentTarget.dataset.index,
          musicId: song.id
        })
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