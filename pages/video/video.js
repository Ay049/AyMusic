// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航数据
    navId: '', // 导航标识
    videoList: [], // 视频列表数据
    videoUpdateTime: [], // video播放时长
    isTriggered: false // 下拉状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getVideoGroupListData()
  },
  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoList(navId) {
    let videoListData = await request('/video/group', {
      id: navId
    })
    wx.hideLoading() // 关闭 wx.showLoading
    let index = 0
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered: false // 下拉状态
    })
  },
  // 点击切换导航
  changNav(event) {
    let navId = event.currentTarget.id // id传值会变成字符串
    // let navId = event.currentTarget.dataset.id // data-id 不会改变值类型
    this.setData({
      navId: navId >>> 0, // 隐式转换
      videoList: []
    })
    wx.showLoading({
      title: '加载中..',
      mask: true,
      success: (result) => {

      }
    });
    // 动态获取当前当好对应的视频数据列表
    this.getVideoList(this.data.navId)
  },
  // 点击视频播放
  handlePlay(event) {
    let vid = event.currentTarget.id
    /*     this.vid !== vid && this.videoContext && this.videoContext.stop()
        this.vid = vid //性能优化后无需该段代码 */
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    // 判断当前视频之前是否播放过,如果有则跳转到指定的秒数
    let {
      videoUpdateTime
    } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    } else {
      this.videoContext.play()
    }
    // this.videoContext.play() // 注释该行并在video标签中添加autoplay解决连续快速点击多重播放的bug
  },
  // 监听视频播放进度
  handleTimeUpdate(event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }
    let {
      videoUpdateTime
    } = this.data

    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束
  handleEnded(event) {
    let {
      videoUpdateTime
    } = this.data

    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },
  // 下拉刷新视频列表
  handleRefresher() {
    this.getVideoList(this.data.navId)
  },
  // 触底加载
  handleToLower() {
    // 模拟的数据
    let newVideoList = [{
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_B909F2A5BBE6CBD1450D9FB07E3CC650",
          "coverUrl": "https://p2.music.126.net/q65fonc0AmXJ9IvVV0K_Xg==/109951164158591300.jpg",
          "height": 1080,
          "width": 1920,
          "title": "达人秀现场选手指弹贝多芬《命运交响曲》…",
          "description": "达人秀现场选手指弹贝多芬《命运交响曲》\nMarcin Patrzalek combines Beethoven's 5th Symphony and \"Toxicity\" by System of a Down",
          "commentCount": 470,
          "shareCount": 1011,
          "resolutions": [{
              "resolution": 240,
              "size": 33423014
            },
            {
              "resolution": 480,
              "size": 54428351
            },
            {
              "resolution": 720,
              "size": 79873889
            },
            {
              "resolution": 1080,
              "size": 119031386
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 320000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/fzQHvzcuOyJX41PCfN8OCQ==/109951164426031658.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 320500,
            "birthday": -2209017600000,
            "userId": 134733911,
            "userType": 0,
            "nickname": "cycmx",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164426031660,
            "backgroundImgId": 109951164125634980,
            "backgroundUrl": "http://p1.music.126.net/64s4Y0IcTocyWkvFpI1N_Q==/109951164125634970.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951164125634970",
            "avatarImgIdStr": "109951164426031658"
          },
          "urlInfo": {
            "id": "B909F2A5BBE6CBD1450D9FB07E3CC650",
            "url": "http://vodkgeyttp9c.vod.126.net/vodkgeyttp8/gAUAy4tJ_2554500564_uhd.mp4?ts=1629996819&rid=6C6EFC134C83BD1D7EA0ABE07918F207&rl=3&rs=IuqfziFKQphXWgsWTLvjVRVpMZWmYxQZ&sign=61243decc640232e78cc508a79c40199&ext=2d%2Bu0KcB3LeManlgPiWB0zkcI9zHJR5MGpo4P86hEde0%2Bpc4RhNETk%2Fd4EZNnjbumxktbHfgKrz5ZzIlFpvmQdSlcpS3U%2FXUJC8n0cNUHGoRIaYVyRMk0viH8Xml1NGVkyI35jKQsp3wZog9AKzfmlmKaKOyW4crglLs4fvsUqgHGsM91wJn0pJhZmsjfAoU2%2ByvYwMgtXrqawHyYRedG4LpogtUbvNul4mMD3l0n46RNR%2BrJbQPA7VNgkt07DaE",
            "size": 119031386,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [{
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 23128,
              "name": "纯音乐",
              "alg": null
            },
            {
              "id": 16170,
              "name": "吉他",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "B909F2A5BBE6CBD1450D9FB07E3CC650",
          "durationms": 261317,
          "playTime": 1074128,
          "praisedCount": 7652,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_558877ED26B15B2ED060AA0CF2D9ED5B",
          "coverUrl": "https://p2.music.126.net/C-9uYlGPL3MrvGegZdKfQQ==/109951164940849976.jpg",
          "height": 720,
          "width": 1280,
          "title": "【天赐的声音】汪小敏&胡海泉《叶子》 纯享版",
          "description": null,
          "commentCount": 101,
          "shareCount": 360,
          "resolutions": [{
              "resolution": 240,
              "size": 20417818
            },
            {
              "resolution": 480,
              "size": 34337217
            },
            {
              "resolution": 720,
              "size": 51759719
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/7GOpFiR6wzI7pUwmg8bO4Q==/109951165296157308.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 1001300,
            "birthday": 748454400000,
            "userId": 57026856,
            "userType": 204,
            "nickname": "谁在繁华深处了悟深秋",
            "signature": "每一个人都有属于自己的一片森林,也许我们从来不曾去过,但它一直在那里,总会在那里.迷失的人迷失了,相逢的人会再相逢.",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165296157310,
            "backgroundImgId": 109951166305805310,
            "backgroundUrl": "http://p1.music.126.net/D1naFJeaF4anMiAM7OCSxQ==/109951166305805318.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951166305805318",
            "avatarImgIdStr": "109951165296157308"
          },
          "urlInfo": {
            "id": "558877ED26B15B2ED060AA0CF2D9ED5B",
            "url": "http://vodkgeyttp9c.vod.126.net/cloudmusic/hvUdLsep_2982048352_shd.mp4?ts=1629996819&rid=6C6EFC134C83BD1D7EA0ABE07918F207&rl=3&rs=buQvjCmZuMDOoBuBMPbxOFTGzkHDqXbT&sign=3bf5896a1a96b9210ab84657955566a2&ext=2d%2Bu0KcB3LeManlgPiWB0zkcI9zHJR5MGpo4P86hEde0%2Bpc4RhNETk%2Fd4EZNnjbumxktbHfgKrz5ZzIlFpvmQdSlcpS3U%2FXUJC8n0cNUHGoRIaYVyRMk0viH8Xml1NGVkyI35jKQsp3wZog9AKzfmlmKaKOyW4crglLs4fvsUqgHGsM91wJn0pJhZmsjfAoU2%2ByvYwMgtXrqawHyYRedG4LpogtUbvNul4mMD3l0n46RNR%2BrJbQPA7VNgkt07DaE",
            "size": 51759719,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 4101,
              "name": "娱乐",
              "alg": null
            },
            {
              "id": 3101,
              "name": "综艺",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "558877ED26B15B2ED060AA0CF2D9ED5B",
          "durationms": 267700,
          "playTime": 120336,
          "praisedCount": 2640,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_07E4318766EC046EA534885737AE7D84",
          "coverUrl": "https://p2.music.126.net/Jkny_r4shSxbni8xbi6SOA==/109951165125777578.jpg",
          "height": 720,
          "width": 1270,
          "title": "【台风蜕变之战】终极成团夜《睫毛弯弯》纯享版",
          "description": null,
          "commentCount": 183,
          "shareCount": 313,
          "resolutions": [{
              "resolution": 240,
              "size": 49069918
            },
            {
              "resolution": 480,
              "size": 64642489
            },
            {
              "resolution": 720,
              "size": 115122192
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 500000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/fGVIqVGdEdjfkCQaGUyT2g==/109951166180773771.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 500101,
            "birthday": 1127404800000,
            "userId": 407889211,
            "userType": 204,
            "nickname": "没有烦恼奥特曼没有烦恼",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166180773780,
            "backgroundImgId": 109951166180754600,
            "backgroundUrl": "http://p1.music.126.net/xTZDYAtKGCd8bwf41Hw_-Q==/109951166180754589.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951166180754589",
            "avatarImgIdStr": "109951166180773771"
          },
          "urlInfo": {
            "id": "07E4318766EC046EA534885737AE7D84",
            "url": "http://vodkgeyttp9c.vod.126.net/cloudmusic/HdiLn1AW_3054298754_shd.mp4?ts=1629996819&rid=6C6EFC134C83BD1D7EA0ABE07918F207&rl=3&rs=wgOufXmiaGxYIFciIrBsxOFObywOmCoN&sign=6095811a4b360ea5f0c185f5a381796d&ext=2d%2Bu0KcB3LeManlgPiWB0zkcI9zHJR5MGpo4P86hEde0%2Bpc4RhNETk%2Fd4EZNnjbumxktbHfgKrz5ZzIlFpvmQdSlcpS3U%2FXUJC8n0cNUHGoRIaYVyRMk0viH8Xml1NGVkyI35jKQsp3wZog9AKzfmlmKaKOyW4crglLs4fvsUqgHGsM91wJn0pJhZmsjfAoU2%2ByvYwMgtXrqawHyYRedG4LpogtUbvNul4mMD3l0n47Lf8T3nwFxlZXHfVW7oiMd",
            "size": 115122192,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "07E4318766EC046EA534885737AE7D84",
          "durationms": 233409,
          "playTime": 198739,
          "praisedCount": 3389,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_B5BE2DCB650AD352EF4C78A9FE005E58",
          "coverUrl": "https://p2.music.126.net/IGy1a2mFIQD2UWpS5yrLYw==/109951164651379711.jpg",
          "height": 720,
          "width": 1280,
          "title": "任贤齐 刘宇宁 《天涯》现场版",
          "description": "",
          "commentCount": 74,
          "shareCount": 166,
          "resolutions": [{
              "resolution": 240,
              "size": 30502874
            },
            {
              "resolution": 480,
              "size": 50296156
            },
            {
              "resolution": 720,
              "size": 69968310
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/qtS-5xoNuulflQemz1sYvQ==/18753270325145818.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 110101,
            "birthday": 650822400000,
            "userId": 33413418,
            "userType": 0,
            "nickname": "石破天惊木棉树",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18753270325145816,
            "backgroundImgId": 2002210674180199,
            "backgroundUrl": "http://p1.music.126.net/VTW4vsN08vwL3uSQqPyHqg==/2002210674180199.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "2002210674180199",
            "avatarImgIdStr": "18753270325145818"
          },
          "urlInfo": {
            "id": "B5BE2DCB650AD352EF4C78A9FE005E58",
            "url": "http://vodkgeyttp9c.vod.126.net/vodkgeyttp8/uqq684n9_2887231635_shd.mp4?ts=1629996819&rid=6C6EFC134C83BD1D7EA0ABE07918F207&rl=3&rs=iYsZPTyJoyNpXKMnLgzgmnxIqOmYwHnO&sign=4e3ba3063d0ae7b440949282575465a3&ext=2d%2Bu0KcB3LeManlgPiWB0zkcI9zHJR5MGpo4P86hEde0%2Bpc4RhNETk%2Fd4EZNnjbumxktbHfgKrz5ZzIlFpvmQdSlcpS3U%2FXUJC8n0cNUHGoRIaYVyRMk0viH8Xml1NGVkyI35jKQsp3wZog9AKzfmlmKaKOyW4crglLs4fvsUqgHGsM91wJn0pJhZmsjfAoU2%2ByvYwMgtXrqawHyYRedG4LpogtUbvNul4mMD3l0n47Lf8T3nwFxlZXHfVW7oiMd",
            "size": 69968310,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "B5BE2DCB650AD352EF4C78A9FE005E58",
          "durationms": 283470,
          "playTime": 146420,
          "praisedCount": 647,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_1F66A761FD705917B90466AD3F69DED7",
          "coverUrl": "https://p2.music.126.net/JES9ZDb2gVTAsR9SMdj_wQ==/109951165017386598.jpg",
          "height": 720,
          "width": 1280,
          "title": "我最尊重的音乐家：Mahmut Sulayman",
          "description": null,
          "commentCount": 348,
          "shareCount": 3301,
          "resolutions": [{
              "resolution": 240,
              "size": 35636504
            },
            {
              "resolution": 480,
              "size": 44376041
            },
            {
              "resolution": 720,
              "size": 66561095
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 650000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/RlIa3e1PPkykScHnVjWqCQ==/109951165712835401.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 650100,
            "birthday": 1000137600000,
            "userId": 246357705,
            "userType": 0,
            "nickname": "-Mstafa",
            "signature": "维吾尔族音乐人 创立古城乐队 参与各种音乐演出和比赛并获得奖项",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165712835410,
            "backgroundImgId": 109951164740489490,
            "backgroundUrl": "http://p1.music.126.net/oDxsdG3f2NF3Gp9po2lQfw==/109951164740489491.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951164740489491",
            "avatarImgIdStr": "109951165712835401"
          },
          "urlInfo": {
            "id": "1F66A761FD705917B90466AD3F69DED7",
            "url": "http://vodkgeyttp9c.vod.126.net/cloudmusic/MPJkHaue_3012489001_shd.mp4?ts=1629996819&rid=6C6EFC134C83BD1D7EA0ABE07918F207&rl=3&rs=AlMRIrFKkJissYGVPYMJjSbJYTupPVgA&sign=5d91a445d29c31ea3c224c48d5cf79f5&ext=2d%2Bu0KcB3LeManlgPiWB0zkcI9zHJR5MGpo4P86hEde0%2Bpc4RhNETk%2Fd4EZNnjbumxktbHfgKrz5ZzIlFpvmQdSlcpS3U%2FXUJC8n0cNUHGoRIaYVyRMk0viH8Xml1NGVkyI35jKQsp3wZog9AKzfmlmKaKOyW4crglLs4fvsUqgHGsM91wJn0pJhZmsjfAoU2%2ByvYwMgtXrqawHyYRedG4LpogtUbvNul4mMD3l0n47Lf8T3nwFxlZXHfVW7oiMd",
            "size": 66561095,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 4103,
              "name": "演奏",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [{
            "name": "Newruz gulum（翻自 mahmut sulayman） ",
            "id": 1429026203,
            "pst": 0,
            "t": 0,
            "ar": [{
              "id": 34514610,
              "name": "Mahmut Sulayman 穆罕莫德·苏来曼",
              "tns": [],
              "alias": []
            }],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 0,
            "v": 10,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 86312740,
              "name": "Newruz gulum",
              "picUrl": "http://p4.music.126.net/yaR_JGd3UFV8UKHN7OOgwA==/109951164779226491.jpg",
              "tns": [],
              "pic_str": "109951164779226491",
              "pic": 109951164779226500
            },
            "dt": 225071,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 9003929,
              "vd": -36794
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 5402375,
              "vd": -34113
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 3601598,
              "vd": -32304
            },
            "a": null,
            "cd": "01",
            "no": 1,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 0,
            "mv": 0,
            "publishTime": 1583510400000,
            "privilege": {
              "id": 1429026203,
              "fee": 0,
              "payed": 0,
              "st": 0,
              "pl": 320000,
              "dl": 320000,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 320000,
              "fl": 320000,
              "toast": false,
              "flag": 0,
              "preSell": false
            }
          }],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "1F66A761FD705917B90466AD3F69DED7",
          "durationms": 237000,
          "playTime": 2289316,
          "praisedCount": 12647,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_90B128B2D30DAC8A06EE9CEFE75140E6",
          "coverUrl": "https://p2.music.126.net/XNso_6jKxOg3W-wAHFG5qg==/109951163680090714.jpg",
          "height": 1080,
          "width": 1920,
          "title": "这大概就是初恋的感觉吧…《脸红的思春期 - 给你宇宙》",
          "description": "这大概就是初恋的感觉吧…《脸红的思春期 - 给你宇宙 Galaxy》 高清现场",
          "commentCount": 1427,
          "shareCount": 6910,
          "resolutions": [{
              "resolution": 240,
              "size": 26139715
            },
            {
              "resolution": 480,
              "size": 43996187
            },
            {
              "resolution": 720,
              "size": 64324393
            },
            {
              "resolution": 1080,
              "size": 104283603
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/H9vu6wKrx82NRT47ZEsmRQ==/109951166078934893.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 110101,
            "birthday": 1486742400000,
            "userId": 273165882,
            "userType": 204,
            "nickname": "一日歌",
            "signature": "微博、B站、A站:一日歌",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166078934900,
            "backgroundImgId": 2002210674180198,
            "backgroundUrl": "http://p1.music.126.net/i0qi6mibX8gq2SaLF1bYbA==/2002210674180198.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "2002210674180198",
            "avatarImgIdStr": "109951166078934893"
          },
          "urlInfo": {
            "id": "90B128B2D30DAC8A06EE9CEFE75140E6",
            "url": "http://vodkgeyttp9c.vod.126.net/vodkgeyttp8/5vAXbhWH_2135924927_uhd.mp4?ts=1629996819&rid=6C6EFC134C83BD1D7EA0ABE07918F207&rl=3&rs=GmfLbDuKnYiTnWrmNNeeibhwahRwEBkM&sign=56644fc39c1186a222aa60f1dbdd5924&ext=2d%2Bu0KcB3LeManlgPiWB0zkcI9zHJR5MGpo4P86hEde0%2Bpc4RhNETk%2Fd4EZNnjbumxktbHfgKrz5ZzIlFpvmQdSlcpS3U%2FXUJC8n0cNUHGoRIaYVyRMk0viH8Xml1NGVkyI35jKQsp3wZog9AKzfmlmKaKOyW4crglLs4fvsUqgHGsM91wJn0pJhZmsjfAoU2%2ByvYwMgtXrqawHyYRedG4LpogtUbvNul4mMD3l0n47Lf8T3nwFxlZXHfVW7oiMd",
            "size": 104283603,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [{
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 57107,
              "name": "韩语现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "90B128B2D30DAC8A06EE9CEFE75140E6",
          "durationms": 219801,
          "playTime": 6870116,
          "praisedCount": 52955,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_22C441E67FB7FE290034EDC42BB0093D",
          "coverUrl": "https://p2.music.126.net/1llObWKekpAGB2sBfRkSDA==/109951163574062456.jpg",
          "height": 720,
          "width": 1280,
          "title": "TFBOYS - 是你（2016移动视频风云盛典）",
          "description": "一直相信着\n在世界某个角落\n会有专属于我的 小小宇宙",
          "commentCount": 114,
          "shareCount": 225,
          "resolutions": [{
              "resolution": 240,
              "size": 30585914
            },
            {
              "resolution": 480,
              "size": 50126613
            },
            {
              "resolution": 720,
              "size": 74589856
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/5rK5EE48oekIjNHyR3GIYg==/109951163424583352.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 110101,
            "birthday": -2209017600000,
            "userId": 1345020800,
            "userType": 0,
            "nickname": "拾號播放器",
            "signature": "让我们一起泡在音乐水里面",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163424583360,
            "backgroundImgId": 109951162868128400,
            "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "109951162868128395",
            "avatarImgIdStr": "109951163424583352"
          },
          "urlInfo": {
            "id": "22C441E67FB7FE290034EDC42BB0093D",
            "url": "http://vodkgeyttp9c.vod.126.net/vodkgeyttp8/FHiOywEf_1829908224_shd.mp4?ts=1629996819&rid=6C6EFC134C83BD1D7EA0ABE07918F207&rl=3&rs=bxEVEiYndVzdpTQrfNyalqnsUwPDPDeD&sign=1638adfa8ab6ed3776458c96af4f3be5&ext=2d%2Bu0KcB3LeManlgPiWB0zkcI9zHJR5MGpo4P86hEde0%2Bpc4RhNETk%2Fd4EZNnjbumxktbHfgKrz5ZzIlFpvmQdSlcpS3U%2FXUJC8n0cNUHGoRIaYVyRMk0viH8Xml1NGVkyI35jKQsp3wZog9AKzfmlmKaKOyW4crglLs4fvsUqgHGsM91wJn0pJhZmsjfAoU2%2ByvYwMgtXrqawHyYRedG4LpogtUbvNul4mMD3l0n47Lf8T3nwFxlZXHfVW7oiMd",
            "size": 74589856,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 11137,
              "name": "TFBOYS",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [{
            "name": "星空物语（Live）",
            "id": 29716009,
            "pst": 0,
            "t": 0,
            "ar": [{
              "id": 999220,
              "name": "王俊凯",
              "tns": [],
              "alias": []
            }],
            "alia": [],
            "pop": 95,
            "st": 0,
            "rt": null,
            "fee": 0,
            "v": 73,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 2843059,
              "name": "翻唱歌曲",
              "picUrl": "http://p3.music.126.net/2tfox8KcZDHpWLaE4r__XQ==/3391993372381563.jpg",
              "tns": [],
              "pic": 3391993372381563
            },
            "dt": 265000,
            "h": null,
            "m": null,
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 4252402,
              "vd": -27000
            },
            "a": null,
            "cd": "01",
            "no": 7,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 2,
            "s_id": 0,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 0,
            "mv": 0,
            "publishTime": 1356969600007,
            "privilege": {
              "id": 29716009,
              "fee": 0,
              "payed": 0,
              "st": 0,
              "pl": 128000,
              "dl": 128000,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 128000,
              "fl": 128000,
              "toast": false,
              "flag": 0,
              "preSell": false
            }
          }],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "22C441E67FB7FE290034EDC42BB0093D",
          "durationms": 230720,
          "playTime": 227859,
          "praisedCount": 2240,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_366E414F846A9A13CC361FD98AF0B8D0",
          "coverUrl": "https://p2.music.126.net/JlDneyLojjzSJaBrIEAzXw==/109951163751582690.jpg",
          "height": 720,
          "width": 1280,
          "title": "英文版《Dream lt possible》",
          "description": "英文版《Dream lt possible》我的梦，超有感觉，好听死了",
          "commentCount": 149,
          "shareCount": 1376,
          "resolutions": [{
              "resolution": 240,
              "size": 13871469
            },
            {
              "resolution": 480,
              "size": 22108474
            },
            {
              "resolution": 720,
              "size": 29436949
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 440000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/_vr2Cmz4Z1Xr_olVZxgvng==/109951165972427567.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 440100,
            "birthday": 811008000000,
            "userId": 375173620,
            "userType": 0,
            "nickname": "Teenager小慧",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165972427570,
            "backgroundImgId": 2002210674180202,
            "backgroundUrl": "http://p1.music.126.net/pmHS4fcQtcNEGewNb5HRhg==/2002210674180202.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "2002210674180202",
            "avatarImgIdStr": "109951165972427567"
          },
          "urlInfo": {
            "id": "366E414F846A9A13CC361FD98AF0B8D0",
            "url": "http://vodkgeyttp9c.vod.126.net/vodkgeyttp8/jPtCbRt5_2215570216_shd.mp4?ts=1629996819&rid=6C6EFC134C83BD1D7EA0ABE07918F207&rl=3&rs=YynyNjzQLJylClRZhpJNRBdlTDhEFlJj&sign=938a5d7c4f59bf5d9f70ce5285ce7a82&ext=2d%2Bu0KcB3LeManlgPiWB0zkcI9zHJR5MGpo4P86hEde0%2Bpc4RhNETk%2Fd4EZNnjbumxktbHfgKrz5ZzIlFpvmQdSlcpS3U%2FXUJC8n0cNUHGoRIaYVyRMk0viH8Xml1NGVkyI35jKQsp3wZog9AKzfmlmKaKOyW4crglLs4fvsUqgHGsM91wJn0pJhZmsjfAoU2%2ByvYwMgtXrqawHyYRedG4LpogtUbvNul4mMD3l0n47Lf8T3nwFxlZXHfVW7oiMd",
            "size": 29436949,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [{
            "name": "Dream It Possible",
            "id": 38592976,
            "pst": 0,
            "t": 0,
            "ar": [{
              "id": 489045,
              "name": "Delacey",
              "tns": [],
              "alias": []
            }],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 0,
            "v": 149,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 3426477,
              "name": "Dream It Possible",
              "picUrl": "http://p3.music.126.net/Gfq_eVuq7lgilBf0w1g5dg==/109951163088676710.jpg",
              "tns": [],
              "pic_str": "109951163088676710",
              "pic": 109951163088676700
            },
            "dt": 204000,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 8162787,
              "vd": 0
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 4897689,
              "vd": 0
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 3265141,
              "vd": 0
            },
            "a": null,
            "cd": "1",
            "no": 1,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 0,
            "mv": 5439243,
            "publishTime": 1441036800000,
            "privilege": {
              "id": 38592976,
              "fee": 0,
              "payed": 0,
              "st": 0,
              "pl": 320000,
              "dl": 999000,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 999000,
              "fl": 320000,
              "toast": false,
              "flag": 0,
              "preSell": false
            }
          }],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "366E414F846A9A13CC361FD98AF0B8D0",
          "durationms": 191286,
          "playTime": 648749,
          "praisedCount": 2875,
          "praised": false,
          "subscribed": false
        }
      }
    ]
    let videoList = this.data.videoList
    // 将视频最新的数据更新到原有视频列表中
    videoList.push(...newVideoList)
    this.setData({
      videoList
    })
  },
  // 跳转至搜索界面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
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
  onShareAppMessage: function({
    from
  }) {
    if (from === 'button') {
      return {
        title: '分享',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    } else {
      return {
        title: '视频页',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
  }
})