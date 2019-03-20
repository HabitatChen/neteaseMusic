{
  let view = {
    el: '.song-list-item',
    template: `
      <ul>
      </ul>`,
    render(data) {
      let $el = $(this.el)
      $el.html(this.template)
      let {songs} = data
      let liList = songs.map((song) => {
        let li = $('<li class="song-style"></li>')
        li.text(song.name + '-' + song.author).attr('data-song-id', song.id)
        return li
      })
      $el.find('ul').empty()
      liList.map((domLi) => {
        $el.find('ul').append(domLi)
      })
    },
    clearActive() {
      $(this.el).find('.active').removeClass('active')
    },
    active(target) {
      $(this.el).find(target).addClass('active').siblings().removeClass('active')
    }
  }
  let model = {
    data: {
      songs: []
    },
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
    init: function (view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.model.fetch().then(() => {
        this.view.render(this.model.data)
      })
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', (data) => {
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })
      window.eventHub.on('new-song', (data) => {
        this.view.clearActive()
      })
      window.eventHub.on('upload', (data) => {
        let songs = this.model.data.songs
        songs.forEach((song, index) => {
          if (song.id === data.id) {
            this.model.data.songs[index] = data
            this.view.render(this.model.data)
            let li = $(this.view.el).find('ul')[0].children
            li[index].classList.add('active')
          }
        })
      })
    },
    bindEvents() {
      // 监听点击事件，然后触发一个eventHub让song-descrpiption知道
      $(this.view.el).on('click', 'li', (e) => {
        this.view.active(e.currentTarget)
        let songId = e.currentTarget.getAttribute('data-song-id')
        let data = {}
        this.model.data.songs.forEach((song) => {
          if (song.id === songId) {
            data = song
          }
        })
        // 在被点击的时候向外发射一个事件，然后在song-decription中订阅一下
        window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
      })
    }
  }
  controller.init(view, model)
}