var APP_ID = 'DJq6WxdBULoeLcWfDttnQPA5-gzGzoHsz';
var APP_KEY = 'GzY5SV97LQLVC13iudpTgkFc';

AV.init({
appId: APP_ID,
appKey: APP_KEY
});

// 创建数据库的表名
var Song = AV.Object.extend('song');
// 实例化
var musicSong = new Song();

musicSong.save({
	name: '123',
	author: 'ck',
	url: '',
	des: '',
	date: '',
	id: 111,
	songList: ['hello', 'moto']
}).then(function(object) {
	alert('LeanCloud Rocks!');
})
