const Koa = require('koa');
const views = require('koa-views');//视图渲染
const path = require('path');//当前路径
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('./routers/index');
const {io,getApp} = require('./utils/io');


let app = new Koa();

getApp(app);
io.attach(app);
app.use(views('views',{extension:'ejs'}));

app.use(bodyParser());
app.use(static(__dirname + '/static'));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen('8060',ctx=>{
  console.log('Server start in 8060')
})

