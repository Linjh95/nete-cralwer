var http = require('http')
var ta = require('./top_artists')

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/netease'; //数据库为 netease
var ablums_id = [];

//-------------------------------------------------------------------------------
//爬虫2：根据歌手id爬取这100名歌手的所有专辑:目前爬到4556个专辑
//-------------------------------------------------------------------------------
function craw_top_artists_albums(){

	for (var z = 0; z < 100; z++) {
       
       for (var x = 0; x < ta.top_artists_albumsize[z] / 30 + 1 ; x++) {

       		var req = http.request('http://localhost:3000/artist/album?id='+ ta.top_artists_id[z]+'&offset='+(x*30)+'&limit='+30 ,
			// console.log('http://localhost:3000/artists?id='+ ta.top_artists_id[i]);
			function(res){
				res.setEncoding('utf8');
				var str = '';
				res.on('data', function (chunk) {
					str += chunk;
				});

				res.on('end', function () {
					//字符串数据转json对象
					var data = JSON.parse(str);
					
					for (var j = 0; j < data.hotAlbums.length; j++) {
						ablums_id.push(data.hotAlbums[j].id); 
					}

					console.log("歌手单曲数据正准备写入表albums......");
					 
					var insertData = function(db, callback) {  
					    //连接到表 albums
					    var collection = db.collection('albums');
					    //插入数据
					    collection.insert(data.hotAlbums, function(err, result) { 
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
		});
		req.end();
       }                                               
	}
}

module.exports.ablums_id = ablums_id;
module.exports.craw_top_artists_albums = craw_top_artists_albums;