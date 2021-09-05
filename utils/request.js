// 发送ajax请求

import config from './config'

export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      // url: config.mobileHost + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        if (data.isLogin) { // 登录请求
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        resolve(res.data) // 筛选后的数据
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}