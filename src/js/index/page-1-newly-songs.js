{
  let view = {
    el: '.newly-song',
    template: `
      <p class="recommend-title">最新音乐</p>
      <ul>
      </ul>`,
    render(data = {}) {
      $(this.el).html(this.template)
      if (data) {
        let songs = data
        let songList = songs.map((song) => {
          let li = $(`<li>
          <div class="song-info">
            <p class="song-name">
              ${song.attributes.name}
            </p>
            <p class="song-author">
              ${song.attributes.author}
            </p>
          </div>
          <a class="play-icon" href="${song.attributes.sourceLink}">
            <i class="iconfont">&#xe60f;</i>
          </a>
        </li>`)
          li.attr('song-id', song.id)
          return li
        })
        $(this.el).find('ul').empty()
        songList.map((domLi) => {
          $(this.el).find('ul').append(domLi)
        })
      }
    }
  }
  let model = {
    data: {},
    fetch() {
      var songList = new AV.Query('song');
      return songList.find()
          .then((songs) => {
            this.data.songs = songs.map((song) => {
              return {id: song.id, ...song.attributes}
            })
            return songs
          })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.model.fetch().then((data) => {
        this.view.render(data)
      })
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).on('click', 'ul > li', (e) => {
        let id = $(e.currentTarget).attr('song-id')
        window.location = './song-detail.html' + '?id=' + id
      })
    }
  }
  controller.init(view, model)
}