const app = require('../app')
var http = require('http')
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/netease'; //数据库为 netease
var albums_id = [];   //定义专辑数组

//查询专辑id
var selectData = function(db, callback) {  
  //连接到表  
  var collection = db.collection('albums');
  //查询数据
  collection.find({},{"id":1,"_id":0}).toArray(function(err, result) {
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
  selectData(db, function(result) {
    for (var i = 0; i < result.length; i++) {
    	albums_id.push(result[i].id);
    }
    // count = Math.floor(albums_id.length / 400) + 1;
    console.log(albums_id);
    db.close();
  });
});
//-------------------------------------------------------------------------------
//爬虫3：根据专辑id爬取专辑内所有歌曲:目前爬到44387首歌曲
//-------------------------------------------------------------------------------
setTimeout(function(){
	for (var y = 4500; y < 4556; y++) {
		if(albums_id[y] != null) {
		// console.log('http://localhost:3000/album?id='+ albums_id[y]);
		var req = http.get('http://localhost:3000/album?id='+albums_id[y],
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

				console.log("专辑歌曲信息正准备写入表songs......");
				 
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

},3000);
