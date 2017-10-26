const app = require('../app')
var http = require('http')
var al = require('./top_artists_albums')

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/netease'; //数据库为 netease

//-------------------------------------------------------------------------------
//爬虫3：根据专辑id爬取专辑内所有歌曲:目前爬到首歌曲
//-------------------------------------------------------------------------------
function craw_top_albums_songs() {

	for ( var y = 0; y < al.ablums_id.length; y++) {
    	console.log('http://localhost:3000/album?id='+ al.ablums_id[y]);
    	var req = http.get('http://localhost:3000/album?id='+al.ablums_id[y],
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
					
					// for (var j = 0; j < data.hotAlbums.length; j++) {
					// 	ablums_id.push(data.hotAlbums[j].id); 
					// }

					// console.log("专辑歌曲信息正准备写入表songs......");
					 
					var insertData = function(db, callback) {  
					    //连接到表 songs
					    var collection = db.collection('songs');
					    //插入数据
					    collection.insert(data.songs, function(err, result) { 
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
					        db.close();
		   		        });
		            });
				});
		});
		req.end();   		                                       
	}
}
module.exports.craw_top_albums_songs = craw_top_albums_songs;