// pages/other/other.js
import request from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      mingzi: 'make',
      age: 18
    }
  },
  handleGetOpenId() { // 获取用户唯一标识 openId 
    wx.login({
      success: (res) => {
        if (res.code) {
          // console.log(res.code);
          let code = res.code
          const P1 = new Promise((res) => {
            let r1 = request('/getOpenId', {
              code
            })
            console.log(r1);
            return r1
          })
        } else {
          console.log(res.errMsg)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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