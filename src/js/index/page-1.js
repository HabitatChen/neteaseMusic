{
  let view = {
    el: '.page-1',
    template: `
      <section class="recommend-songs">

    </section>
    <section class="newly-song">

    </section>
    <footer>
      <p>
        <i class="iconfont">&#xe605;</i>
        <span>网易云音乐</span>
      </p>
      <div class="footer-download">
        <span>打开APP，发现更多好音乐</span>
      </div>
      <p class="copyright">网易公司版权所有@1997-2019 杭州乐读科技有限公司运营</p>
    </footer>
    `,
    render(data) {
      let script1 = document.createElement('script')
      script1.src = './js/index/page-1-reconmend.js'
      document.body.appendChild(script1)
      let script2 = document.createElement('script')
      script2.src = './js/index/page-1-newly-songs.js'
      document.body.appendChild(script2)
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
    }
  }
  controller.init(view, model)
}