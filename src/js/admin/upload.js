{
  let view = {
    el: '.upload',
    template: `
          <div id="pickfiles" class="pickfiles">
            <span id="">点击或拖拽上传文件</span>
            <span id="stats"></span>
          </div>`,
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
      this.initQiniu()
    },
    initQiniu() {
      //引入Plupload 、qiniu.js后
      let uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**，在页面上设置一个id为pickfiles的按钮
        // 难点之一就是需要后台生成一个uptoken
        uptoken_url : 'http://localhost:8888/uptoken', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
        domain: 'pogac8v3o.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
        container: 'upload',              //上传区域DOM ID，默认是browser_button的父元素，即上传点击按钮的父元素
        max_file_size: '100mb',            //最大文件体积限制
        //flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        //max_retries: 3,                 //上传失败最大重试次数
        dragdrop: true,                   //开启可拖曳上传
        drop_element: 'upload',           //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        //chunk_size: '4mb',              //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
          'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
              // 文件添加进队列后,处理相关的事情
            });
          },
          'BeforeUpload': function(up, file) {
            // 每个文件上传前,处理相关的事情
            window.eventHub.emit('boforeUpload')
          },
          'UploadProgress': function(up, file) {
            // 每个文件上传时,处理相关的事情
            stats.innerText = '文件上传中'
          },
          'FileUploaded': function(up, file, info) {
            window.eventHub.emit('afterUpload')
            stats.innerText = '文件上传完毕'
            // 每个文件上传成功后,处理相关的事情
            // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

            var domain = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink = 'http://' + domain + '/' + encodeURI(res.key); //获取上传成功后的文件的Url
            var songInfo = res.key.split('.')[0].split('-')
            var name = songInfo[0]
            var author = songInfo[1]
            var data = {
              name,
              author,
              sourceLink
            }
            window.eventHub.emit('upload', data)
            setTimeout(() => {
              stats.innerText = ''
            }, 3000)
          },
          'Error': function(up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          'UploadComplete': function() {
            //队列文件处理完毕后,处理相关的事情
          },
          //  'Key': function(up, file) {
          //    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          //    // 该配置必须要在 unique_names: false , save_key: false 时才生效

          //    var key = "";
          //    // do something with key here
          //    return key
          //  }
        }
      });

// domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取

// uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs

    }
  }
  controller.init(view, model)
}