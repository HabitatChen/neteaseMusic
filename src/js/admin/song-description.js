{
  let view = {
    el: '.song-description',
    init() {
      this.$el = $(this.el)
    },
    template: `
      <form action="" class="song-detail">
          <div class="row">
            <labe>歌名：
              <input name="name" type="text" value="__name__">
            </labe>
          </div>
          <div class="row">
            <labe>歌手：
              <input name="author" type="text" value="__author__">
            </labe>
          </div>
          <div class="row">
            <labe>链接：
              <input name="sourceLink" type="text" value="__sourceLink__">
            </labe>
          </div>
          <div class="row">
            <input type="submit">
          </div>
        </form>
    `,
    render(data = {}) {
      // render的时候如果没有传入数据就使用空对象
      let placeholders = ['author', 'name', 'sourceLink', 'id']
      let html = this.template
      placeholders.map((string) => {
        // 替换所有的占位符为所需要的数据
        html = html.replace(`__${string}__`, data[string] || '')
      })
      let h1 = $('<h1></h1>')
      data.id ? h1.text('编辑歌曲') : h1.text('新建歌曲')
      $(this.el).html(html)
      this.$el.find('form').prepend(h1)
    },
    reset() {
      this.render()
    }
  }
  let model = {
    data: {
      'name': '',
      'author': '',
      'sourceLink': '',
      'id': ''
    },
    save(data) {
      // 创建数据库的表名
      let Song = AV.Object.extend('song');
      // 实例化
      let musicSong = new Song();
      musicSong.set('name', data.name)
      musicSong.set('author', data.author)
      musicSong.set('sourceLink', data.sourceLink)
      return musicSong.save().then((newSong) => {
        let {id, attributes} = newSong
        Object.assign(this.data, {
          id,
          ...attributes
        })
      })
    },
    update(data) {
      // 第一个参数是 className，第二个参数是 objectId
      let song = AV.Object.createWithoutData('song', this.data.id);
      // 修改属性
      song.set('name', data.name);
      song.set('author', data.author);
      song.set('sourceLink', data.sourceLink);
      // 保存到云端
      return song.save()
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        // 获得每个input中的值
        var data = {}
        let strings = 'name author sourceLink'.split(' ')
        strings.map((string) => {
          data[string] = this.view.$el.find(`[name="${string}"]`).val()
        })
        if (!this.model.data.id) {
          console.log('this is create data')
          console.log(data)
          this.model.save(data).then(() => {
            this.view.reset({})
            window.eventHub.emit('create',JSON.parse(JSON.stringify(this.model.data)))
          })
        } else {
          this.model.update(data).then(() => {
            let obj = JSON.parse(JSON.stringify(this.model.data))
            let newData = Object.assign(obj, data)
            window.eventHub.emit('upload', newData)
            this.view.render(newData)
          })
        }

      })
    },
    bindEventHub() {
      window.eventHub.on('upload', (data) => {
        //  this.model.data.songName = data.songName
        //  this.model.data.songAuthor = data.songAuthor
        //  this.model.data.sourceLink = data.sourceLink
        Object.assign(this.model.data, data || '')
        this.view.render(this.model.data)
      })
      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new-song', (data) => {
        this.model.data = {}
        this.view.render(data)
      })
    }
  }
  controller.init(view, model)
}