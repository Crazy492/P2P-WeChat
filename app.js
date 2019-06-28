const Koa = require('koa');
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
})

router.use('', require('./routes/index.js'))
app.use(router.routes())
app.use(router.allowedMethods())
app.use(static('./static'))

app.listen(8060, () => {
  console.log(`监听8060-----------`);
})