window.eventHub= {
  events: {},
  emit: function (eventName, data) {
    for (let key in this.events) {
      if (key === eventName) {
        let fnList = this.events[key]
        fnList.map((fn) => {
          fn.call(undefined, data)
        })
      }
    }
  },
  on: function (eventName, fn) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = []
    }
    this.events[eventName].push(fn)
  },
  off: function () {

  }
}