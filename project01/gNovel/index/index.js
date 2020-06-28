// gNovel/index/index.js
Page({
  data: {
    is_load: true,
    //搜索
    stopLoadMoreTiem:false,
    isScroll:'scroll',
    showModal:false,
    searchShow: [],
    pageNum: 1,
    keyWord:'',
    listCounts:'',
    placeholders:'搜索小说',
    nodata:false,
    //推荐
    booksTuiJian:[],
    animationTime:'',
    //分类
    bookShelf:[],
    //轮播图
    imgUrls: [  '../imgsG/未标题-1.JPG' , '../imgsG/未标题-2.JPG'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  goToText01:function(e){ wx.navigateTo({url: '../text01/text01'}) },
  //推荐
  Recommend:function(){
    var that=this
    that.setData({  animationTime:'700ms' })
    wx.request({
      url: 'http://192.168.117.43:8080/maybeLike', 
      header:{ "Content-Type":"application/json" },
      success: function(res) {  var list=res.data; that.setData({booksTuiJian:list, }) } 
    })
    setTimeout((function callback() { this.setData({animationTime:''}) }).bind(this), 1500);
  },
  //分类
  classify:function(){
    var u=[];
    for(var i=0;i<4;i++){ 
      var v=Math.floor(Math.random()*7)+1;
      u[i]=v;
      for(var j=0;j<i;j++){ if(u[j]==u[i]){ i--; break; }} 
    }
    for(var i=0;i<4;i++){
      wx.request({
        url: 'http://192.168.117.43:8080/getBcId?id='+u[i], 
        header:{ "Content-Type":"application/json" },
        success:res=> {
            var list=res.data;
            this.data.bookShelf.push(list);
            this.setData({   bookShelf:this.data.bookShelf});
        }
      })
    }
  },
  // 监听页面加载
  onLoad: function (options) {
    this.Recommend();
    this.classify();
  },

  // 用户下拉动作
  onPullDownRefresh: function () {
    var that = this
    if (that.data.is_load == true) {
      that.data.is_load= false;
      wx.showNavigationBarLoading()
      that.setData({
          //搜索
          stopLoadMoreTiem:false, isScroll:'scroll' , showModal:false , searchShow: [] , pageNum: 1 ,
          keyWord:'' , listCounts:'' , placeholders:'搜索小说' , nodata:false,
          //推荐
          booksTuiJian:[] , animationTime:'' ,
          //分类
          bookShelf:[],
      });
      this.Recommend();
      this.classify();
      setTimeout(() => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },2000);
      setTimeout((function callback() {  this.setData({is_load:true}) }).bind(this), 2500);
    } 
  },

  //搜索
  goSearch1:function(e){
    var that=this;
    var formData=e.detail.value;
      if(formData!=that.data.keyWord){ 
        that.setData({
          keyWord:formData,
          isScroll:true,
          searchShow:[],
          pageNum:1,
          stopLoadMoreTiem:false,
        })
          that.goSearch();
      }else if(formData==that.data.keyWord){
          that.goSearch();
      }
  },
  goSearch:function(e){
    var that=this;
    if(that.data.keyWord.length>0){
      //搜索总条数
      wx.request({
        url: 'http://192.168.117.43:8080/findSome',
        data: { keyWord: that.data.keyWord },
        success:function (re) {
          var count=re.data.length
          that.setData({ listCounts: count })
          if(count<=5&&count>0)  { that.setData({ placeholders:that.data.keyWord,  keyWord:'' }) }
          console.log('搜索：'+that.data.keyWord)
        }
      })
      //书籍搜索
      wx.request({
        url: 'http://192.168.117.43:8080/findSomeLimit',
        data: {
         keyWord: that.data.keyWord,
         pageNum: that.data.pageNum,
         pageSize: 5 ,
        },
        header: { 'Content-Type': 'application/json' },
        success:function (res) {
          var arr1 = that.data.searchShow; //从data获取当前数组
          var arr2 = res.data.records; //从此次请求返回的数据中获取新数组
          if(arr2.length!=0){
              if(that.data.listCounts<=5&&that.data.listCounts>0){
                that.setData({
                  showModal: true,
                  isScroll:'hidden',
                  searchShow: arr2,
                  stopLoadMoreTiem:true,
                  nodata:true 
                 });
              }else if(that.data.listCounts>5){
                  arr1 = arr1.concat(arr2); //合并数组
                  arr1 = removeRepeat(arr1);//去重
                  that.setData({
                  showModal: true,
                  isScroll:'hidden',
                  searchShow: arr1,
                  });
              }
          }else if (arr2.length==0&&that.data.listCounts>0){
              wx.showToast({ icon:"none",  title: '没有更多相关书籍', })
             that.setData({ 
              stopLoadMoreTiem:true,
              placeholders:that.data.keyWord,
              keyWord:'',
              nodata:true
            })
           }else if(that.data.listCounts==0)
           {
            wx.showToast({
              icon:"none",
              image:"/gNovel/imgsG/微信图片_20200618175026.png",
              title: '没有更多相关书籍~',
            })
             that.setData({
               placeholders:'搜索小说',
               keyWord:'',
               isScroll:'scroll',
               showModal:false,
             })
           }
       },

     })
    }
    //去重
    function removeRepeat(nodes) {
      var arr=[],obj={};
      for(var i = 0,l= nodes.length;i<l;i++){
            var item = nodes[i].id;
            if(obj[item]) { obj [item]+= 1; }
            else{ obj [item] = 1;  arr.push(nodes[i]) }
        }
        return arr; }
  },
  //上拉加载
  lower: function() {
    var that = this;
    if (that.stopLoadMoreTiem) { return;  }
    this.setData({
      pageNum: that.data.pageNum + 1 //上拉到底时将page+1后再调取列表接口
    });
    that.goSearch();
  },
 
  closeTC:function(e){
    var that=this;
      that.setData({ 
        isScroll:'scroll',
        showModal:false,
        isScroll:true,
        searchShow:[],
        pageNum:1,
        stopLoadMoreTiem:true,
        keyWord:'',
        placeholders:'搜索小说'
      })
  },

  hideModal:function(e){
    this.setData({
      isScroll:'scroll',
      showModal:false,
      keyWord:'',
      placeholders:'搜索小说'
    })
  },
})