// components/card/index.js
Component({
  properties: {
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
    isMove: false,
    formatedDateString: ''
  },
  methods: {
    onRemove(event) {
      this.setData({
        isMove: true
      })
      setTimeout(() => {
        this.setData({
          isMove: false
        })
        this.triggerEvent('remove')
      }, 300)
    },
    onRecover(event) {
      this.setData({
        isMove: true
      })
      setTimeout(() => {
        this.setData({
          isMove: false
        })
        this.triggerEvent('recover')
      }, 300)
    },
    toDetail() {
      let timeStamp = this.data.timeStamp
      let formatedDateString = this.data.formatedDateString
      let index = this.data.index
      let title = this.data.title
      let content = this.data.content
      wx.setStorageSync('temp', {
        index,
        timeStamp,
        formatedDateString,
        title,
        content
      })
      wx.navigateTo({
        url: `../../pages/detail/detail`,
      })
    }
  }
})