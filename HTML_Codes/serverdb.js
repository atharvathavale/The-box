// http module creating a web server
var url = require('url');
var http = require('http');
var fs = require('fs');
var qs = require('querystring')
var MongoClient = require('mongodb').MongoClient;
//var mdb = require('mongodb')
//var MongoClient = mdb.MongoClient
//Post - create, Get - read, Put - update, delete - delete
http.createServer(function(request,response){
    if(request.method=='GET'){
		var pathname = url.parse(request.url).pathname;
		var isImage = 0, contentType, fileToLoad;
		var extension = pathname.split('.').pop();
		var file = "." + pathname;
		var dirs = pathname.split('/');
		if(pathname == "/"){
			file = "loginpage.html";
			contentType = 'text/html';
			isImage = 2;
		}
		else if(pathname == "/insert")
		{
			var myurl = url.parse(request.url)
			var query = myurl.query;//?srn=1234&dept=cse
            var qobj = qs.parse(query);
			//console.log('Inside insert');
			//console.log(qobj.name);
			MongoClient.connect('mongodb://localhost:27017',{
                    useUnifiedTopology:true
                }, function(err,client){
                    if(err) throw err;
                    const db = client.db('boxdb');
					db.collection('players').findOne({email : qobj.email},
                        function(err,docs){
							if(err) throw err;
                            return;
                        })
					db.collection('players').insertOne({name : qobj.name, email : qobj.email, password : qobj.password}, function(err, res) {
						if (err) throw err;
						console.log("1 document inserted");
							/*res.format ({
								'text/plain': function() {
								res.send('Inserted');
								},
							});*/
					  });
				});
		}
		else if(pathname == "/find")
		{
			console.log('Inside find');
			var myurl = url.parse(request.url)
			var query = myurl.query;//?srn=1234&dept=cse
            var qobj = qs.parse(query);
			//console.log('Inside insert');
			//console.log(qobj.name);
			MongoClient.connect('mongodb://localhost:27017',{
                    useUnifiedTopology:true
                }, function(err,client){
                    if(err) throw err;
                    const db = client.db('boxdb');
					db.collection('players').findOne({email : qobj.email},
                        function(err,docs){
							if(err) throw err;
                            return;
                        })
				});
		}
		else{
			switch(extension){
				case "jpg":
					contentType = 'image/jpg';
					isImage = 1;
					break;
				case "png":
					contentType = 'image/png';
					isImage = 1;
					break;
				case "js":
					contentType = 'text/javascript';
					isImage = 2;
					break;
				case "css":
					contentType = 'text/css';
					isImage = 2;
					break;
				case "html":
					contentType = 'text/html';
					isImage = 2;
					break;
			}
		}
		if(isImage == 1){
			fileToLoad = fs.readFileSync(file);
			response.writeHead(200, {'Content-Type':  contentType });
			response.end(fileToLoad, 'binary');
		}
		else if(isImage == 2){
			fileToLoad = fs.readFileSync(file, "utf8");
			response.writeHead(200, {'Content-Type':  contentType });
			response.write(fileToLoad);
			response.end();
		}
	}
}).listen(8080);
console.log('server is up and running');
