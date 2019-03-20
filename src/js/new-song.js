{
  let view = {
    el: '.new-song',
    template: '新建歌曲',
    render(data) {
      $(this.el).html(this.template)
    },
    active() {
      $(this.el).addClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEvents()
      this.view.render(this.model.data)
      window.eventHub.on('upload', (data) => {
        this.view.active()
      })
    },
    bindEvents() {
      $(this.view.el).on('click', () => {
        window.eventHub.emit('new-song', {})
      })
    }
  }
  controller.init(view, model)
}