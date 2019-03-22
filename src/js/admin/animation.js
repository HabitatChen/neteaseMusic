{
  let view = {
    el: '.admin-loading',
    template: '',
    render() {}
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEventHub()
    },
    bindEventHub() {
      window.eventHub.on('boforeUpload', () => {
        $(this.view.el).addClass('active')
      })
      window.eventHub.on('afterUpload', () => {
        $(this.view.el).removeClass('active')
      })
    }
  }
  controller.init(view, model)
}