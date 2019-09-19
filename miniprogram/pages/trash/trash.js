// pages/trash/trash.js
let trashes = []
let todos = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSwing: false,
    isClear: false,
    isModelShow: false,
    trashes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadTrashes()
  },
  onRecover(event) {
    let recoverItem = trashes.splice(event.target.dataset.index, 1)[0]

    this._updateTrashes()

    this._loadTodos()
    todos.unshift(recoverItem)
    this._saveTodos()

    this._toast('还原啦😀')
  },
  showModel() {
    this.setData({
      isSwing: true
    })
    setTimeout(() => {
      this.setData({
        isSwing: false
      })
      this.setData({
        isModelShow: true
      })
    }, 300)

  },
  hideModel() {
    this.setData({
      isModelShow: false
    })
  },
  clear() {
    wx.setStorageSync('trashes', [])
    this.setData({
      isClear: true
    })
    setTimeout(() => {
      this.setData({
        trashes: [],
        isModelShow: false,
        isClear: false
      })
    }, 300)

    this._toast('清空啦💥')
  },
  _updateTrashes() {
    this.setData({
      trashes
    })
    wx.setStorageSync('trashes', trashes)
  },
  _loadTodos() {
    todos = wx.getStorageSync('todos')
  },
  _saveTodos() {
    wx.setStorageSync('todos', todos)
  },
  _loadTrashes() {
    trashes = wx.getStorageSync('trashes')
    if (!trashes) {
      wx.setStorageSync('trashes', [])
    }
    this.setData({
      trashes: trashes
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
    this._loadTrashes()
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