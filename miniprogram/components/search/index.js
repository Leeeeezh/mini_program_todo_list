// components/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clear: String
  },
  observers:{
    clear(){
      this.setData({
        keyword: ''
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    keyword: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      const keyword = event.detail.value
      this.setData({
        keyword
      })
    },
    search() {
      const keyword = this.data.keyword
      this.triggerEvent('search', {
        keyword
      })
    }
  }
})