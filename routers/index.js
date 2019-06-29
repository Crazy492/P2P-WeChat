const router = require('koa-router')()
const send = require('koa-send')
const path = require('path')
const fs = require('fs')


router.get('/',async ctx=>{
  // getIP
    const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
    let IP = '';

    for(var devName in interfaces){  
      var iface = interfaces[devName];  
      for(var i=0;i<iface.length;i++){  
            var alias = iface[i];  
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
              IP = alias.address;  
            }  
      }  
    } 
    console.log(IP,'IP')
  await ctx.render('login',{IP});
})
router.post('/login',async ctx=>{
  let {username,group,base64,IP } = ctx.request.fields;
  console.log(IP,'123123123')
  ctx.user = {
    username,group,base64,IP
  }
  // ctx.redirect('/home');
  await ctx.render("home", { username,group,base64,IP});
})

// router.get('/home',async ctx => {
  
//   // if (ctx.user == undefined) {
//   //   ctx.redirect("/");
//   //   return;
//   // }
//   let { username,group,base64,IP } = ctx.user;
//   await ctx.render("home", { username,group,base64,IP});
// })

//做接口用？
router.all('/postFile', async ctx => {
  ctx.body = '123';
  // ctx.res.write('123');
  console.log('我的文件呢', ctx.request.fields);//这里会又一个文件的路径信息
  var file = ctx.request.fields.f1[0];
  // //我直接把路径加到全局里？ctx.fileName = ???
  var aimPath = 'upload' + file.path.split('upload')[2];
  // console.log(aimPath);
  // console.log('文件名' + file.name);
  // //-----重命名时需要看文件里是否有重复的名字，有就要做对应修改(两个都要写绝对路径啊亲！！！)
  fs.rename(path.join(__dirname, '../static/upload', aimPath), path.join(__dirname, '../static/upload', file.name));
  // // 只是作为处理文件上传的部分，要处理文件命名的问题，不处理后期操作，后期操作交给app.js里的server.io去实现
})


// router.all('/downloadFile/:name', async ctx => {
//   const name = ctx.body;
//   console.log(name);
//   // const dlPath = `static/upload/${name}`;
//   // ctx.attachment(dlPath);
//   // await send(ctx, dlPath);
// })

module.exports = router
