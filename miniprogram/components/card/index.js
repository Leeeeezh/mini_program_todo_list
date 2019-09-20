// components/card/index.js
Component({
  properties: {
    label: String,
    index: Number,
    title: String,
    content: String,
    timeStamp: Number,
    state: {
      type: String,
      value: 'todo' // todo/trash
    }
  },
  externalClasses: ['remove', 'recover'],
  observers: {
    timeStamp(timeStamp) {
      const date = new Date(timeStamp)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      this.setData({
        formatedDateString: `${year}年${month}月${day}日 - ${hour}时${minute}分`
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPannelShow: false,
    isMove: false,
    formatedDateString: ''
  },
  methods: {
    enTag(evt) {
      let color = evt.detail.color
      if (color == 'none') {
        this.setData({
          isPannelShow: false
        })
        return
      }
      this.setData({
        label: color,
        isPannelShow: false
      })
      this.triggerEvent('entag', {
        color,
        timeStamp: this.data.timeStamp
      })
    },
    onRemove(event) {
      this.setData({
        isMove: true
      })
      setTimeout(() => {
        this.triggerEvent('remove', {
          timeStamp: this.data.timeStamp
        })
        this.setData({
          isMove: false
        })
      }, 300)
    },
    onRecover(event) {
      this.setData({
        isMove: true
      })
      setTimeout(() => {
        this.triggerEvent('recover', {
          timeStamp: this.data.timeStamp
        })
        this.setData({
          isMove: false
        })
      }, 300)
    },
    togglePannel() {
      this.setData({
        isPannelShow: !this.data.isPannelShow
      })
    },
    toDetail() {
      let timeStamp = this.data.timeStamp
      let formatedDateString = this.data.formatedDateString
      let index = this.data.index
      let title = this.data.title
      let content = this.data.content
      let label = this.data.label
      wx.setStorageSync('temp', {
        index,
        timeStamp,
        formatedDateString,
        title,
        content,
        label
      })
      wx.navigateTo({
        url: `../../pages/detail/detail`,
      })
    }
  }
})