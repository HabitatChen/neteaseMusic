var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if (!port) {
	console.log('你需要指定一个服务器的端口 \n for example: node server.js 8888')
	process.exit(1)
}

var server = http.createServer(function(request, response) {
	var parsedUrl = url.parse(request.url, true)
	var pathWithQuery = request.url
	var queryString = ''
	if (pathWithQuery.indexOf('?') >= 0) {
		queryString = pathWithQuery.subString(pathWithQuery.indexOf('?'))
	}
	var path = parsedUrl.pathname
	var query = parsedUrl.query
	var method = request.method
	// 上面是配置，下面是请求的响应设置

	if (path === '/uptoken') {
		response.statusCode = 200
		response.setHeader('Content-Type', 'text/json;charset=utf-8')
		response.setHeader('Access-Control-Allow-Origin', '*')
		var config = fs.readFileSync('./qiniu-key.json')
		config = JSON.parse(config)
		let {accessKey, secretKey} = config
		console.log(config)
		var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
		var options = {
			// 后面跟着的是篮子的名字
			scope: 'netease-music',
		};
		var putPolicy = new qiniu.rs.PutPolicy(options);
		var uploadToken=putPolicy.uploadToken(mac);

		response.write(`
			{
				"uptoken": "${uploadToken}"
			}
		`)
		response.end()
	}
})

server.listen(port)  
console.log('服务器发射成功，你可以试试啦 http://localhost:' + port)
