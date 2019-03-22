{
  let view = {
    el: '.song-detail-wrapper',
    template: `<audio></audio><button id="play">播放</button><button>暂停</button>`,
    render(data) {
      if (data.id) {
        let audio = $(this.el).find('audio')
        audio[0].src = data.attributes.sourceLink
        document.wrapper.prepend(audio[0])
      }
    },
    play() {
      $(this.el).find('.disc').addClass('playing')
      $(this.el).find('#play').addClass('playing')

    },
    pause() {
      $(this.el).find('.disc').removeClass('playing')
      $(this.el).find('#play').removeClass('playing')
    }
  }
  let model = {
    data: {
      currentSong: {},
      status: 'pause'
    },
    getSongItem(id) {
      var query = new AV.Query('song');
      return query.get(id).then((song) => {
        this.data.currentSong = song
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render({})
      this.getSongId()
      this.bindEvents()
    },
    getSongId() {
      let querys = window.location.search
      if (querys.indexOf('?') !== -1) {
        querys = querys.substring(1)
      }
      let quersList = querys.split('&')
      let data = {}
      quersList.map((query) => {
        let item = query.split('=')
        data[item[0]] = item[1]
      })
      if (data['id']) {
        this.model.getSongItem(data['id']).then(() => {
          console.log(this.model.data)
          this.view.render(this.model.data.currentSong)
        })
      }
    },
    bindEvents() {
      $(this.view.el).on('click', '.disc', (e) => {
        this.changeStatus()
      })
      $(this.view.el).on('click', '#play', (e) => {
        this.changeStatus()
      })
    },
    changeStatus() {
        if (this.model.data.status === 'pause') {
          this.view.play()
          this.model.data.status = 'playing'
        } else {
          this.view.pause()
          this.model.data.status = 'pause'
        }
    }
  }
  controller.init(view, model)
}