// components/filter-pannel/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    enTag(evt) {
      const color = evt.target.dataset.color
      this.triggerEvent('entag', {
        color
      })
      this.setData({
        isShow: false
      })
    }
  }
})