// components/model/index.js
Component({
  properties: {
    text: String
  },
  data: {
    isCompleted: false
  },
  methods: {
    hideModel() {
      this._complete()
      setTimeout(() => {
        this.triggerEvent('reject')
      }, 500)
    },
    confirm() {
      this._complete()
      setTimeout(() => {
        this.triggerEvent('confirm')
      }, 500)
    },
    _complete(){
      this.setData({
        isCompleted: true
      })
    }
  }
})