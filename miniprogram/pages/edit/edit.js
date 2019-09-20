// pages/edit/edit.js
let todos = []
let mode = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: -1,
    title: '',
    content: '',
    timeStamp: 0,
    label: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    mode = options.mode
    const temp = wx.getStorageSync('temp')
    if (options.mode == "update") {
      this.setData(temp)
    }
  },
  onTitleInput(event) {
    let title = event.detail.value
    this.setData({
      title
    })
  },

  onContentInput(event) {
    let content = event.detail.value
    this.setData({
      content
    })
  },
  onConfirm() {
    if (this._check()) {
      wx.setStorageSync('isReloadRequired', true)      
      this._saveTodo()
      this._toast(this.data.index == -1 ? '添加成功😋' : '编辑成功😋')
      setTimeout(() => {
        this._navBack()
      }, 1000)
    }
  },
  _check() {
    const title = this.data.title.trim()
    const content = this.data.content.trim()
    if (!title || !content) {
      this._toast('标题/内容不能为空😥')
      return false
    }
    return true
  },
  _loadTodos() {
    todos = wx.getStorageSync('todos')
  },
  _saveTodo() {
    this._loadTodos()
    const title = this.data.title
    const index = this.data.index
    const content = this.data.content
    const timeStamp = this.data.timeStamp
    const label = this.data.label
    if (mode == 'update') {
      const todo = {
        title,
        content,
        label,
        timeStamp
      }
      let formatedDateString = this.data.formatedDateString
      wx.setStorageSync('temp', {
        ...todo,
        formatedDateString
      })
      for (let index in todos) {
        if (todos[index].timeStamp == todo.timeStamp) {
          todos[index] = todo
          break
        }
      }
    } else {
      const todo = {
        title,
        content,
        timeStamp: Date.now(),
        label: 'white'
      }
      todos.unshift(todo)
    }
    wx.setStorageSync('todos', todos)
  },
  _navBack() {
    const pages = getCurrentPages()
    //  更新首页
    pages[0]._loadTodos()
    //  更新更新详情页
    if(pages.length==3){
      pages[1].onLoad()
    }
    wx.navigateBack({})
  },
  _toast(text) {
    wx.showToast({
      title: text,
      duration: 2000,
      icon: 'none'
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