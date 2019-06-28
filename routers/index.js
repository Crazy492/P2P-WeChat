const router = require('koa-router')()


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
  let { username,group,base64,IP } =  ctx.request.body
  console.log(IP,'123123123')
  ctx.session.user = {
    username,group,base64,IP
  }
  ctx.redirect('/home');
})

router.get('/home',async ctx => {
  
  if (ctx.session.user == undefined) {
    ctx.redirect("/");
    return;
  }
  let { username,group,base64,IP } = ctx.session.user;
  await ctx.render("home", { username,group,base64,IP});
})
module.exports = router
