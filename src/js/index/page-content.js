{
  let view = {
    el: '.page-tap-ul',
    template: `
      <li class="page-content page-1 active">
              
        </li>
        <li class="page-content page-2">
          第二页
        </li>
        <li class="page-content page-3">
          第三页
        </li>
    `,
    render(data) {
      let script = document.createElement('script')
      script.src = `./js/index/${data.page}.js`
      document.body.appendChild(script)
      $(this.el).html(this.template)
    }

  }
  let model = {
    data: {
      page: 'page-1'
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.eventHub()
    },
    eventHub() {
      window.eventHub.on('select-tap', (data) => {
        this.model.data.page = data
        $('.' + data).addClass('active').siblings().removeClass('active')
      })
    }
  }
  controller.init(view, model)
}