const Koa = require('koa');
const views = require('koa-views');//视图渲染
const path = require('path');//当前路径
const static = require('koa-static');
// const bodyParser = require('koa-bodyparser');
// const bodyParser = require('koa-body');
const body = require('koa-better-body');
const router = require('./routers/index');
const {io,getApp} = require('./utils/io');
const cors = require('koa-cors');
const IncomingForm = require('formidable');//用来保存后缀的
const form = new IncomingForm();

form.keepExtensions = true
form.encoding = 'utf-8'
form.uploadDir = path.join(__dirname, 'static/upload')

let app = new Koa();

getApp(app);
io.attach(app);

app.use(cors());
app.use(views('views',{extension:'ejs'}));

app.use(body({
  //上传文件的制定路径
  uploadDir: './static/upload',
  IncomingForm: form
}));

app.use(static(__dirname + '/static'));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen('8060',ctx=>{
  console.log('Server start in 8060')
})

