const Koa = require('koa');
<<<<<<< HEAD
const Router = require('koa-router');
const render = require('koa-ejs');
const static = require('koa-static')
const app = new Koa();
const router = new Router();

render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
=======
const views = require('koa-views');//视图渲染
const path = require('path');//当前路径
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('./routers/index');

let app = new Koa();

app.use(views('views',{extension:'ejs'}));

app.use(bodyParser());
app.use(static(__dirname + '/static'));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen('8060',ctx=>{
  console.log('Server start in 8060')
>>>>>>> crazy
})

router.use('', require('./routes/index.js'))
app.use(router.routes())
app.use(router.allowedMethods())
app.use(static('./static'))

app.listen(8060, () => {
  console.log(`监听8060-----------`);
})