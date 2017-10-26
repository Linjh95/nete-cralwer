# nete-cralwer

# 简介
  本项目是基于netecloudmusicapi开源项目所做的音乐爬虫,主要采用node.js+monogodb开发,node.js用于开发爬虫脚本,mongodb用于存储爬虫数据。
  本项目主要调用了一些api爬取了热门歌手、热门歌手专辑、专辑歌曲、歌曲评论等几项数据。

# 简单使用
  1、下载本项目
  2、安装node.js
  3、安装mongodb并做适当的配置，手动新建数据库名为 netease
  4、进入mycrawler目录下,打开命令行工具
     (1)首先要获取热门歌手及专辑数据,执行 node crawler.js
     (2)之后获取专辑内的歌曲,执行 node songs.js
     (3)最后获取歌曲评论数据,执行 node songs_comment.js

 # 注意
  1、使用步骤4中需要按顺序执行,因为后面爬取的数据依赖于前面的数据
  2、步骤4中(3)采用了ip代理,由于数据量庞大及代理的不稳定,因此需要反复执行songs_comment.js脚本,
     每次执行前需手动修改 groupedSongsId[] 中的数字,括号范围可填 0-88。
  3、ip代理可以手动修改：可到router目录下的 comment_music.js 的 randomProxyHost 函数进行删改。



