const Koa = require('koa');
let app = new Koa();

app.listen('8060',ctx=>{
  console.log('Server start in 8060')
})
