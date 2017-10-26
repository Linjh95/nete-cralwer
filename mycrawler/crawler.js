const app = require('../app')
var tac = require('./top_artists')          
var taa = require('./top_artists_albums')
var tas = require('./top_artists_songs')

//step1:爬取热门100名歌手
tac.craw_top_artists();

//等待3s后打印热门歌手的id数组
setTimeout(function() {
    console.log(tac.top_artists_id);
    console.log(tac.top_artists_albumsize);
}, 3000);

//step2:爬取热门歌手所有专辑
setTimeout( taa.craw_top_artists_albums , 5000);

//step3:爬取所有专辑的歌曲
// setTimeout( tas.craw_top_albums_songs , 20000);