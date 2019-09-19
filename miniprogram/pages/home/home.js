// pages/home/home.js
let todos = []
let trash = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todos: [],
    isHeartBeat: false
  },
  addTodo() {
    this.setData({
      isHeartBeat: true
    })
    this._navToEditPage()
    setTimeout(() => {
      this.setData({
        isHeartBeat: false
      })
    }, 500)
  },
  _navToEditPage() {
    wx.navigateTo({
      url: '../edit/edit',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadTodos()
  },

  onRemove(event) {
    const index = event.target.dataset.index
    trash = todos.splice(index, 1)[0]
    this._dump()
    this.setData({
      todos
    })
    this._saveTodos()
    this._toast('已丢到垃圾桶💥')
  },
  _dump() {
    let trashes = wx.getStorageSync('trashes')
    if (!trashes || !(trashes.length > 0)) {
      trashes = []
    }
    trashes.unshift(trash)
    wx.setStorageSync('trashes', trashes)
  },
  _saveTodos() {
    wx.setStorageSync('todos', todos)
  },
  _loadTodos() {
    todos = wx.getStorageSync('todos')
    if (!todos) {
      wx.setStorageSync('todos', [{
        "title": "短歌行",
        "content": "白日何短短，百年苦易满。\n苍穹浩茫茫，万劫太极长。\n麻姑垂两鬓，一半已成霜。\n天公见玉女，大笑亿千场。\n吾欲揽六龙，回车挂扶桑。\n北斗酌美酒，劝龙各一觞。\n富贵非所愿，与人驻颜光。",
        "timeStamp": Date.now()
      }])
    }
    this.setData({
      todos: todos
    })
  },
  _toast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 1500
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
    this._loadTodos()
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