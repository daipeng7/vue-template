/*
 * @Author:
 * @Date: 2018-09-17 09:58:57
 * @LastEditors: VSCode
 * @LastEditTime: 2019-12-17 15:09:52
 * @Description: 静态资源服务器（nodejs）
 * @Company:
 */
var express = require('express');
var path = require('path');
var proxy = require('http-proxy-middleware');
var history = require('connect-history-api-fallback');
var compression = require('compression');
var app = express();
app.use(compression());

app.use(history());

// 设置静态文件路径
app.use(express.static(path.resolve('./dist'), { index: ['index.html', 'index.htm'] }));

app.listen(8099, '0.0.0.0', function() {
	console.log('启动成功！');
});
