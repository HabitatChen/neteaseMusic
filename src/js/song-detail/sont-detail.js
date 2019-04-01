{
  let view = {
    el: '.song-detail-wrapper',
    template: `<audio style="background: red !important;"></audio>`,
    render(data) {
      if (data.id) {
        let audio = $(this.el).find('audio')
        audio[0].src = data.attributes.sourceLink
        audio[0].onend = () => {
          window.eventHub.emit('songEnd')
        }
        audio[0].ontimeupdate = (e) => {
          this.showLyric(e.target.currentTime)
        }
        let lyricList = data.attributes.songLyric.split('\n')
        let time, content, parts, lyricP
        lyricList.forEach((item) => {
          parts = item.split(']')
          time = parts[0].split('[')[1]
          timeParts = time.split(':')
          timeMinites = timeParts[0]
          timeSecond = timeParts[1]
          timeTotal = parseInt(timeParts) * 60 + parseFloat(timeSecond) + 1.5
          content = parts[1]
          lyricP = $('<p class="song-lyric-content"></p>')
          lyricP.text(content).attr('data-time', timeTotal)
          $('.lyric-window > .song-lines').append(lyricP)
        //  $('.lyric-window').css({
        //    border: '1px solid red'
        //  })
        })
        document.wrapper.prepend(audio[0])
      }
    },
    showLyric(time) {
      // 接受一个时间点
      // 首先，我要知道对应的时间点所对应的歌词，当我目前的时间小于歌词所对应的时间，说明哪一行就是我要的歌词
      // 遍历歌词组，当时间小于等于当前时间，并且当前时间小于下一行的时间，说明是这一行
      // 知道是哪一个行之后，就要自动的滚动到那一行
      // 如何做到自动滚动？
      // 首先获得视图的高度，然后获得那一行所在屏幕的高度，然后减去视图高度就是要滚动的高度。
      // 最后找到那个需要滚动的视图进行滚动
      // 然后给滚动到的元素一个高亮
      let pList = $('.lyric-window > .song-lines > p')
      for (let i = 0; i < pList.length; i++) {
        if (i === pList.length -1) {
          break
        } else {
          let previousTime = pList.eq(i).attr('data-time')
          let nextTime = pList.eq(i+1).attr('data-time')
          if (previousTime <= time && time < nextTime) {
            let p = pList[i]
            let pHeight = p.getBoundingClientRect()
            let clientHeight = $(this.el).find('.lyric-window > .song-lines')[0].getBoundingClientRect()
            let height = pHeight.top - clientHeight.top
            $(this.el).find('.lyric-window > .song-lines').css({
              transform: `translateY(${-height + 30}px)`
            })
            $(this.el).find('.lyric-window  p').eq(i).addClass('active').siblings().removeClass('active')
            break
          }
        }
      }
    },
    play() {
      $(this.el).find('.disc').addClass('playing')
      $(this.el).find('#play').addClass('playing')
      let audio = $(this.el).find('audio')
      audio[0].play()
    },
    pause() {
      $(this.el).find('.disc').removeClass('playing')
      $(this.el).find('#play').removeClass('playing')
      let audio = $(this.el).find('audio')
      audio[0].pause()
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
      this.bindEventHub()
    },
    changeStatus() {
        if (this.model.data.status === 'pause') {
          this.view.play()
          this.model.data.status = 'playing'
        } else {
          this.view.pause()
          this.model.data.status = 'pause'
        }
    },
    bindEventHub() {
      window.eventHub.on('songEnd', () => {
        this.model.data.status = 'pause'
      })
    }

  }
  controller.init(view, model)
}