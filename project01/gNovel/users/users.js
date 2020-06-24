﻿// gNovel/users/users.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: 
  {
    showModal: false,
    Viewdisplay1:'none',
    Viewdisplay2:'none',
    Viewdisplay3:'none',
    Viewdisplay4:'none',
    Viewdisplay5:'none',
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ()
   {
     var that = this;
     if(that.flag=='1')
     {
       that.setData({
         Viewdisplay4:'block',
         Viewdisplay5:'none'
       })
     }
     if(that.flag==null||that.flag=='0')
     {
       that.setData
       ({
         Viewdisplay4:'none',
         Viewdisplay5:'block'
       })
     }
     
     wx.login
    ({     
      success: function (res) 
      {
        wx.request
        ({
          url: 'http://192.168.137.1:8080/getUser', //仅为示例，并非真实的接口地址
          data: 
          {
            code: res.code ,//上面wx.login()成功获取到的code
          },
          header:
          {
              "Content-Type":"application/json"
          },
          success: function(res) 
          {
            that.setData({
              name:res.data[0].uname,
              sex:res.data[0].sex,
              region:[res.data[0].address],
              id:res.data[0].id,
              head:res.data[0].avatar,
              flag:res.data[0].flag
            })
            if (res.data[0].flag=='1')
            {
                that.setData
                ({
                  flag:res.data[0].flag,
                  Viewdisplay4:'block',
                  Viewdisplay5:'none'
                })
            }
            if (res.data[0].flag=='0')
             {
              that.setData
              ({
                flag:res.data[0].flag,
                Viewdisplay4:'none',
                Viewdisplay5:'block'
              })
            }
          }
        })
        
      }
    })

  },
  inApp:function()
  {
   var that = this;
    wx.login
    ({     
      success: function (res) 
      {
        if (that.flag=='0'||that.flag==null)
            {
              wx.showLoading
              ({
                title: '正在登陆',
              })
              
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
              wx.reLaunch({
                url: '../login/login',
              })
            }
        wx.request
        ({
          url: 'http://192.168.137.1:8080/getUser', //仅为示例，并非真实的接口地址
          data: 
          {
            code: res.code ,//上面wx.login()成功获取到的code
          },
          header:
          {
              "Content-Type":"application/json"
          },
          success: function(res) 
          {
            that.setData({
              name:res.data[0].uname,
              sex:res.data[0].sex,
              region:[res.data[0].address],
              id:res.data[0].id,
              head:res.data[0].avatar,
              flag:'1',
              Viewdisplay4:'block',
              Viewdisplay5:'none'
            })            
          }
        })
      }
    })

  },
  outApp:function(e)
  {
    
    var that = this;
    var f = '0'
		wx.showActionSheet({
			itemList: ['确认退出'],
      success: function(res)
       {
         
        if (res.tapIndex==0)
         {
           that.flag='0'
          wx.request({
            url: 'http://192.168.137.1:8080/updateFlag', //仅为示例，并非真实的接口地址
            data:
             { 
               id:that.data.id,   
               flag:f
            },
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) 
            {
              that.onLoad()
            }
      })
          wx.showLoading
          ({
            title: '正在退出登陆',
          })
          
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)

          wx.redirectTo
          ({
            url: '../users/users',
          })          
         
          that.setData
          ({
            Viewdisplay4:'none',
            Viewdisplay5:'block',
            flag:'0'
          })
         }

			},
      fail: function(res)
       {
				console.log(res.errMsg)
			}

})
  },
  // tapAvatorUp:function()
  // {
  //   this.setData({Viewdisplay4:'none'})
  // },
  tapName:function()
  {
    this.setData({Viewdisplay1:'block'})
  },
  tapSex:function()
  {
    this.setData({Viewdisplay2:'block'})
  },

  formSubmit:function(e)
  {
    var that = this;
    var value = e.detail.value.name
    this.setData({Viewdisplay1:'none'})

    wx.request({
      url: 'http://192.168.137.1:8080/updateUname', //仅为示例，并非真实的接口地址
      data:
       { 
         id:that.data.id,   
         name: value,
      },
      header:{
          "Content-Type":"application/json"
      },
      success: function(res) 
      {
        that.setData({
          name:value
        })
      }

})

  },
  formSubmit2:function(e)
  {
    var that = this;
    var value = that.data.sex
    this.setData({Viewdisplay2:'none'})
    wx.request({
      url: 'http://192.168.137.1:8080/updateSex', //仅为示例，并非真实的接口地址
      data:
       { 
         id:that.data.id,   
         sex: value,
         
      },
      header:{
          "Content-Type":"application/json"
      },
      success: function(res) 
      {
        that.setData({
          sex:value
        })
      }
})

  },
  radiochange:function(e)
  {
    var that = this;
    that.setData
    ({
      sex:e.detail.value
    })
  },
  bindRegionChange: function(e)
  {
    var that = this;
    this.setData
    ({
      region:e.detail.value
    })
    wx.request({
      url: 'http://192.168.137.1:8080/updateAddress', //仅为示例，并非真实的接口地址
      data:
       { 
         id:that.data.id,   
         address:e.detail.value[0]+" "+e.detail.value[1]+" "+e.detail.value[2]
      },
      header:{
          "Content-Type":"application/json"
      },
      success: function(res) 
      {
        
      }
})
    
  },
  upload: function () 
  {
    var that = this;
    wx.chooseImage
    ({
      count: 1, // 默认9      
      sizeType: ['original', 'compressed'],
      // 指定是原图还是压缩图，默认两个都有      
      sourceType: ['album', 'camera'],
      // 指定来源是相册还是相机，默认两个都有    
      success: function (res)
       {
         var avatarUrl = res.tempFilePaths[0];
        wx.request({
          url: 'http://192.168.137.1:8080/updateAvatar', //仅为示例，并非真实的接口地址
          data:
           { 
             id:that.data.id,   
             avatar: avatarUrl,
          },
          header:{
              "Content-Type":"application/json"
          },
          success: function(res) 
          {
            that.setData({
              avatar:avatarUrl
            })
          }
    
    })
        console.log(res)
        // 返回选定照片的本地文件路径tempFilePath可以作为img标签的src属性显示图片        
        that.setData
        ({
          head: res.tempFilePaths[0]
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})