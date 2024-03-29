// pages/detail/detail.js
let scrollTop = 0
Page({
  data: {
    editLock: false,
    isEditIconShow: true,
    isShake: false,
    index: -1,
    formatedDateString: '',
    title: '',
    content: '',
    timeStamp: 0,
  },
  onLoad: function(options) {
    const temp = wx.getStorageSync('temp')
    this.setData(temp)

    const pages = getCurrentPages()
    if (pages[0].route == 'pages/trash/trash') {
      this.setData({
        editLock: true
      })
    }
  },
  onshow() {
    const temp = wx.getStorageSync('temp')
    this.setData(temp)
  },
  onEdit() {
    this.setData({
      isShake: true
    })
    setTimeout(() => {
      this.setData({
        isShake: false
      })
      wx.navigateTo({
        url: `../edit/edit?mode=update`,
      })
    }, 300)

  },
  onPageScroll(event) {
    if (event.scrollTop > scrollTop) {
      scrollTop = event.scrollTop
      if (this.data.isEditIconShow) {
        this.setData({
          isEditIconShow: false
        })
      }
    } else {
      scrollTop = event.scrollTop
      if (!this.data.isEditIconShow) {
        this.setData({
          isEditIconShow: true
        })
      }
    }
  }
})