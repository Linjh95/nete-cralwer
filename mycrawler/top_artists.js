var http = require('http')
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/netease'; //数据库为 netease

var limit = 50;       
var top_artists_id = [];  //热门歌手id数组
var top_artists_albumsize = [];  //热门歌手id数组

//-------------------------------------------------------------------------------
//爬虫1：只能爬取热门100名歌手
//-------------------------------------------------------------------------------
function craw_top_artists( ){
	for (var i = 0; i < 100 / limit; i++) {
	var req = http.request('http://localhost:3000/top/artists?offset=' + (i*limit)+'&limit=50',
		function(res){
			// console.log('STATUS: ' + res.statusCode); 
			// console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');

			var str = '';
			res.on('data', function (chunk) {
				str += chunk;
				//存储数据方式一：写到文件
				// fs.appendFile('input.txt', chunk, function (err) {
				//          if(err) throw err;
				//    }); 
				// console.log("BODY" + chunk);
			});

			//存储数据方式二：写到mongodb
			res.on('end', function () {
				//字符串数据转json对象
				var data = JSON.parse(str);
				for (var j = 0; j < data.artists.length; j++) {
					top_artists_id.push(data.artists[j].id); 
					top_artists_albumsize.push(data.artists[j].albumSize);
				}
				// console.log(top_artists_id);
				// delete(data.code);
				// delete(data.more);
				console.log("热门歌手数据正准备写入表top_artists......");
				 
				var insertData = function(db, callback) {  
				    //连接到热门歌手表 top_artists
				    var collection = db.collection('top_artists');
				    //插入数据
				    collection.insert(data.artists, function(err, result) { 
				        if(err)
				        {
				            console.log('Error:'+ err);
				            return;
				        }     
				        callback(result);
				    });
				}
				 
				MongoClient.connect(DB_CONN_STR, function(err, db) {
				    console.log("连接成功！");
				    insertData(db, function(result) {
				        console.log(result);
				        // db.close();
	   		        });
	            });
			});
			// 关闭文件
		    // fs.close();
	});
	req.end();
	}
}

module.exports.top_artists_id = top_artists_id;
module.exports.top_artists_albumsize = top_artists_albumsize;
module.exports.craw_top_artists = craw_top_artists;

