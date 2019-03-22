{
  let view = {
    el: '.page-change-bar',
    template: `
        <li class="topNavBar-item active" data-tap="page-1">
            <span class="topNavBar-item-text">推荐音乐</span>
        </li>
        <li class="topNavBar-item" data-tap="page-2">
            <span class="topNavBar-item-text">热歌榜</span>
        </li>
        <li class="topNavBar-item" data-tap="page-3">
            <span class="topNavBar-item-text">搜索</span>
        </li>
    `,
    init() {
      this.$el = $(this.el)
    },
    render(data) {
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      this.view.render()
      this.bindEvents()
    },
    bindEvents() {
      this.view.$el.on('click', 'li', (e) => {
        $(e.currentTarget).addClass('active').siblings().removeClass('active')
        let page = $(e.currentTarget).attr('data-tap')
        window.eventHub.emit('select-tap', page)
      })
    }
  }
  controller.init(view, model)
}