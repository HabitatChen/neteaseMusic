{
  let view = {
    el: '.recommend-songs',
    template: `
            <p class="recommend-title">推荐歌单</p>
      <ul>
        <li>
          <div class="img-wrap">
            <img src="./assets/song.jpeg" alt="">
            <span class="lisners">545.2万</span>
          </div>
          <p>华语|难以被复制，声线极具特色的女歌手</p>
        </li>
        <li>
          <div class="img-wrap">
            <img src="./assets/song.jpeg" alt="">
            <span class="lisners">545.2万</span>
          </div>
          <p>华语|难以被复制，声线极具特色的女歌手</p>
        </li>
        <li>
          <div class="img-wrap">
            <img src="./assets/song.jpeg" alt="">
            <span class="lisners">545.2万</span>
          </div>
          <p>华语|难以被复制，声线极具特色的女歌手</p>
        </li>
        <li>
          <div class="img-wrap">
            <img src="./assets/song.jpeg" alt="">
            <span class="lisners">545.2万</span>
          </div>
          <p>华语|难以被复制，声线极具特色的女歌手</p>
        </li>
        <li>
          <div class="img-wrap">
            <img src="./assets/song.jpeg" alt="">
            <span class="lisners">545.2万</span>
          </div>
          <p>华语|难以被复制，声线极具特色的女歌手</p>
        </li>
        <li>
          <div class="img-wrap">
            <img src="./assets/song.jpeg" alt="">
            <span class="lisners">545.2万</span>
          </div>
          <p>华语|难以被复制，声线极具特色的女歌手</p>
        </li>
      </ul>
    `,
    render(data) {

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