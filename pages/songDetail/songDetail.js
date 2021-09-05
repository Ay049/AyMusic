// pages/songDetail/songDetail.js
import request from '../../utils/request'
const util = require('../../utils/util')
const appInstance = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: {},
    musicUrl: '',
    musicId: '',
    musicList: [],
    listIndex: 0,
    currentTime: '00:00',
    durationTime: '03:30',
    currentWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', ({
      list,
      index,
      musicId
    }) => {
      this.setData({
        musicList: list,
        listIndex: index,
        musicId
      })
    })

    this.backAudioManager = wx.getBackgroundAudioManager();

    this.getSongInfoStyle(this.data.musicId)

    // 同步全局背景播放状态
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) {
      this.setData({
        isPlay: true
      })
    }
    this.backAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = this.data.musicId
    })
    this.backAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    this.backAudioManager.onEnded(() => { // 监听自然播放结束
      // ----
      this.setData({
        musicUrl: ''
      })
      if (this.data.listIndex >= this.data.musicList.length - 1) {
        this.UpdateListIndex(0)
      } else {
        this.UpdateListIndex(this.data.listIndex + 1)
      }

    })
    this.backAudioManager.onTimeUpdate(() => { // 监听播放进度
      this.setData({
        currentTime: util.time(this.backAudioManager.currentTime * 1000).ms,
        currentWidth: this.backAudioManager.currentTime / this.backAudioManager.duration * 450
      })
    })
  },
  getSongInfoStyle(musicId) { // 获取歌曲信息 拿图和歌名
    this.getMusicInfo(musicId)
    let isPlay = true
    let {
      musicUrl
    } = this.data
    this.musicControl(isPlay, musicId, musicUrl)
  },
  changePlayState(isPlay) { // 改变全局播放状态
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },
  async getMusicInfo(musicId) { // 获取歌曲信息
    let songData = await request('/song/detail', {
      ids: musicId
    })
    this.setData({
      song: songData.songs[0],
      durationTime: util.time(songData.songs[0].dt).ms
    })
    console.log(this.data.durationTime);
  },
  handleMusicPlay() { // 点击播放暂停歌曲
    let isPlay = !this.data.isPlay
    let {
      musicId,
      musicUrl
    } = this.data;
    this.musicControl(isPlay, musicId, musicUrl)
  },
  getMusicUrl(musicId) { // 获取歌曲地址
    return new Promise((res, rej) => {
      let musicUrlData = request('/song/url', {
        id: musicId
      })
      res(musicUrlData)
    }).then((res) => {
      this.data.musicUrl = res.data[0].url
      this.setData({
        musicUrl: this.data.musicUrl
      })
      return this.data.musicUrl
    }).then((musicUrl) => {
      this.backAudioManager.src = this.data.musicUrl
      this.backAudioManager.title = this.data.song.name
    })
  },
  musicControl(isPlay, musicId, musicUrl) { // 背景音频控制
    if (isPlay) {
      if (!musicUrl) {
        this.getMusicUrl(musicId)
      } else {
        this.backAudioManager.src = this.data.musicUrl
        this.backAudioManager.title = this.data.song.name
      }
    } else {
      this.backAudioManager.pause()
    }
  },
  handleSwitch(event) { // 切歌
    this.setData({
      musicUrl: ''
    })
    let type = event.currentTarget.id
    let listIndex = this.data.listIndex
    if (type === 'pre') { // 上一首
      if (listIndex === 0) {
        this.UpdateListIndex(this.data.musicList.length - 1)
      } else {
        this.UpdateListIndex(this.data.listIndex - 1)
      }
    } else { //下一首
      if (listIndex >= this.data.musicList.length - 1) {
        this.UpdateListIndex(0)
      } else {
        this.UpdateListIndex(this.data.listIndex + 1)
      }
    }
  },
  UpdateListIndex(listIndex) { // 更新歌曲列表索引
    this.setData({
      listIndex,
      musicId: this.data.musicList[listIndex].id,
      isPlay: true
    })
    this.getSongInfoStyle(this.data.musicId)

    // this.playMusic(listIndex)
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