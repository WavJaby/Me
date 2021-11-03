var http = require('http');
var fs = require('fs');
var mime = require('mime');

http.createServer(function (req, res) {
	let fileName = req.url;
	if (fileName == '/')
		fileName = '/index.html';
	fileName = decodeURI(fileName.slice(1));
	console.log(fileName);
	let file;
	try {
		file = fs.readFileSync(fileName);
		res.writeHead(200, {'Content-Type': mime.getType(fileName)});
		res.end(file);
	} catch (e) {
		res.writeHead(404);
		res.end();
	}
}).listen(8080);