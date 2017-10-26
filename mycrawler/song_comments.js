const app = require('../app')
var http = require('http')
//数据库查询部分
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/netease'; //数据库为 netease

var songs_id = [];   //定义专辑数组
var groupedSongsId = [];

//查询歌曲id
var selectData = function(db, callback) {  
  //连接到表  
  var collection = db.collection('songs');
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

//连接数据库查询歌曲id
MongoClient.connect(DB_CONN_STR, function(err, db) {
  console.log("连接成功！");
  selectData(db, function(result) {
    for (var i = 0; i < result.length; i++) {
    	songs_id.push(result[i].id);
    }
    db.close();
  });
});

//由于接口与代理不稳定，所以进行数组分割，便于查询
function group(array, subGroupLength) {
    var index = 0;
    var newArray = [];

    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}
// -------------------------------------------------------------------------------
// 爬虫4：根据歌曲id爬取歌曲中的热门评论和评论总数
// -------------------------------------------------------------------------------
var count = 0;
setTimeout(function(){
	setTimeout(function(){
		groupedSongsId = group(songs_id, 500);
		
		setInterval(function(){
			// var ss = Math.floor(songs_id.length / 44387* 10000) / 10000;
			// console.log("                          进度  "+ (10000 - ss*10000) / 100 + "%");
			//数组长度不为0
			// if(songs_id.length != 0){
			if(groupedSongsId[88] != 0){
				
				//访问数组表中是否存在该条歌曲id对应的评论
				var songid = groupedSongsId[88].shift();
				//查询专辑id
				var selectDataTwo = function(db, callback) {  
				  //连接到表  
				  var collection = db.collection('newcomments');
				  //查询数据
				  collection.find({id:songid}).toArray(function(err, result) {
				    if(err)
				    {
				      console.log('Error:'+ err);
				      return;
				    }     
				    callback(result);
				  });
				}
				 
				MongoClient.connect(DB_CONN_STR, function(err, db) {
				  selectDataTwo(db, function(result) {
				  	if(result.length != 0)
				  	{
				  		console.log("id:"+songid +"         ×××" );
				  		console.log("                               成功写入个数："+ (++count));	
				  	}else{
				  		console.log("id:"+songid +"         √√√√√" );
				  		exectue_one_request( songid );
				  		groupedSongsId[88].push(songid);
				  	}
				    db.close();
				  });
				});
			} 
				
		},200);
	},3000);
}, 200);

function exectue_one_request( song_id ){
	var req = http.request('http://localhost:3000/comment/music?id='+ song_id,
		function(res){
			res.setEncoding('utf8');
			var str = '';
			res.on('data', function (chunk) {
				str += chunk;
			});

			res.on('end', function () {
				// console.log('http://localhost:3000/comment/music?id='+ song_id);
				//字符串数据转json对象
				var data = JSON.parse(str);
				data.id = song_id;
				//歌曲评论信息简化，保留歌曲id，热门15条评论信息及评论总数
				 
				var insertData = function(db, callback) {  
				    //连接到表 comment
				    var collection = db.collection('newcomments');
				    //插入数据
				    collection.insert(data, function(err, result) { 
				        if(err)
				        {
				            console.log('Error:'+ err);
				            return;
				        }     
				        callback(result);
				    });
				}
				 
				MongoClient.connect(DB_CONN_STR, function(err, db) {
				    // console.log("连接成功！");
				    insertData(db, function(result) {
				        // console.log(result);
				        db.close();
	   		        });
	            });
			});
		});
		req.end();
}



