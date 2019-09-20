// pages/home/home.js
let todos = []
let trash = {}
let result = []
let filter = 'none'
let scrollTop = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clear: '',
    indicatorColor: 'none',
    order: 'asc', //'asc'/'desc'
    isSearchBarShow: true,
    isFilterShow: false,
    isSearching: false,
    todos: [],
    isHeartBeat: false
  },
  filtLabel(evt) {
    const label = evt.detail.color
    filter = label
    this.setData({
      indicatorColor: label,
      isFilterShow: false,
    })
    if(label=='none'){
      this._toast('取消标签过滤')
    }
    this._render()
  },
  toggleFilter() {
    this.setData({
      isFilterShow: !this.data.isFilterShow
    })
  },
  changeOrder() {
    let order = this.data.order
    if (order === 'asc') {
      this.setData({
        order: 'desc'
      })
    } else {
      this.setData({
        order: 'asc'
      })
    }
    wx.setStorageSync('order', this.data.order)
    this._render()
  },
  addTodo() {
    this.setData({
      isHeartBeat: true
    })
    setTimeout(() => {
      this._navToEditPage()
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
  _render() {
    if (!todos) {
      return
    }
    let computed = []
    if (this.data.isSearching) {
      if (filter != 'none') {
        computed = result.filter(todo => todo.label == filter)
      } else {
        computed = result
      }
      if (this.data.order == 'asc') {
        computed = computed.sort((a, b) => b.timeStamp - a.timeStamp)
      } else {
        computed = computed.sort((a, b) => a.timeStamp - b.timeStamp)
      }
    } else {
      if (filter != 'none') {
        computed = todos.filter(todo => todo.label == filter)
      } else {
        computed = todos
      }
      if (this.data.order == 'asc') {
        computed = computed.sort((a, b) => b.timeStamp - a.timeStamp)
      } else {
        computed = computed.sort((a, b) => a.timeStamp - b.timeStamp)
      }
    }
    this.setData({
      todos: computed
    })
  },
  onSearch(event) {
    const keyword = event.detail.keyword.trim()
    if (!keyword) {
      this.setData({
        todos
      })
      return
    }
    filter = 'none'
    this.setData({
      isSearching: true,
      indicatorColor: 'none'
    })
    result = todos.filter(item => {
      return item.title.includes(keyword) || item.content.includes(keyword)
    })
    this._render()
    // this.setData({
    //   todos: result
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadSettings()
    this._loadTodos()
  },
  enTag(evt) {
    let color = evt.detail.color
    let timeStamp = evt.detail.timeStamp
    for (let i in todos) {
      if (todos[i].timeStamp === timeStamp) {
        todos[i].label = color
        break
      }
    }
    this._saveTodos()
  },

  onRemove(event) {
    const timeStamp = event.detail.timeStamp
    for (let index in todos) {
      if (todos[index].timeStamp == timeStamp) {
        trash = todos[index]
        todos.splice(index, 1)
        break
      }
    }
    if (this.data.isSearching) {
      for (let index in result) {
        if (result[index].timeStamp == timeStamp) {
          result.splice(index, 1)
          console.log('result updated')
        }
      }
    }
    console.log(result)
    this._updateTrashesInStorage()
    this._render()
    this._saveTodos()

    setTimeout(() => {
      this._toast('已丢到垃圾桶💥')
    }, 400)
  },
  _updateTrashesInStorage() {
    let trashes = wx.getStorageSync('trashes')
    if (!trashes) {
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
        "timeStamp": Date.now().toString(),
        label: 'white'
      }])
    }
    this._render()
    this.setData({
      isSearching: false
    })
  },
  _loadSettings() {
    let order = wx.getStorageSync('order')
    if (!order) {
      order = 'asc'
    }
    this.setData({
      order
    })
    wx.setStorageSync('order', order)
  },
  _toast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 1500
    })
  },
  cancelSearch() {
    this.setData({
      isSearching: false,
      clear: Date.now()
    })
    this._loadTodos()
  },

  onPageScroll(event) {
    if (event.scrollTop > scrollTop) {
      scrollTop = event.scrollTop
      if (this.data.isSearchBarShow) {
        this.setData({
          isSearchBarShow: false
        })
      }
    } else {
      scrollTop = event.scrollTop
      if (!this.data.isSearchBarShow) {
        this.setData({
          isSearchBarShow: true
        })
      }
    }
  },
  onShow() {
    this.setData({
      clear: Date.now().toString()
    })
    let isReloadRequired = wx.getStorageSync('isReloadRequired')
    if (isReloadRequired) {
      wx.setStorageSync('isReloadRequired', false)
      this.onLoad()
    }
  }
})