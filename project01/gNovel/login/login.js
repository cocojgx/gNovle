var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
//登录获取code
login: function () {
  var that = this;
  wx.login({
      success: function (res) 
      {    
          console.log('code:'+res.code)
          //发送请求
          wx.request({
              url: 'http://localhost:8080/getid', //改成自己的服务器地址
              data: 
              { 
                  code: res.code ,//上面wx.login()成功获取到的code
                  operFlag: 'getOpenid',
                  name:that.data.name,
                  sex:that.data.sex,
                  address:that.data.address,
                  avatar:that.data.avatar
              },
              header: {
                  'content-type': 'application/json' //默认值
              },
              success: function (res) {
                  console.log(res)
              }
          })
      }
  })
},


onLoad: function ()
   {
     var that = this;
    wx.getUserInfo
    ({
      lang:"zh_CN",
      success: res => {
        console.log(res)    //获取的用户信息还有很多，都在res中，看打印结果
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
          
        })
        that.setData
        ({
          name:res.userInfo.nickName,
          sex:res.userInfo.gender,
          address:res.userInfo.province+'省'+res.userInfo.city+'市',
          avatar:res.userInfo.avatarUrl
        })
      }
      
    })

  },





  onAuth() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
            wx.reLaunch({
              url: '../index/index',
            })
          
         
        }
      }
    })
  }
})
