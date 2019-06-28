
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
let flag = 0 //是否是第一次
let arr = [];
const port = 8060;
//safas
server.on('close',()=>{
    server.setBroadcast(!0);//开启广播
    server.setTTL(128);
    server.send(`我要下线了，我是${IPAdress}`,port,gbIP);
    console.log('socket已关闭');
});

const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
let IPAdress = '';
let gbIP = ''

for(var devName in interfaces){  
  var iface = interfaces[devName];  
  for(var i=0;i<iface.length;i++){  
        var alias = iface[i];  
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
              IPAdress = alias.address;  
        }  
  }  
} 
// console.log(IPAdress)
let arrtemp = IPAdress.split('.');
arrtemp.forEach((val,idx)=>{
  if(idx == 3){
    gbIP += '255'
  }else{
    gbIP += val+'.'
  }
})
// console.log(gbIP)

arr.push(IPAdress);

server.on('error',(err)=>{
  console.log(err);
});

server.on('listening',()=>{
  console.log('socket正在监听中...');
  if(!flag){
    server.setBroadcast(!0);//开启广播
    server.setTTL(128);
    server.send(`大家好啊，我是${IPAdress}`,port,gbIP);
  }
  flag = 1;
});
// server.on('connect',()=>{
  //   server.setBroadcast(!0);//开启广播
  //   server.setTTL(128);
  //   server.send(`大家好啊，我是${IPAdress}`,port,gbIP);
  // })
  
  server.on('message',(msg,rinfo)=>{
    
    if(rinfo.address!=IPAdress){
      let ip = String(msg).split(':')
      // console.log(arr);
      if(!arr.includes(ip[1])){
        console.log(`receive message from ${rinfo.address}:${rinfo.port}：${msg}`);
        arr.push(ip[1]);
        server.setBroadcast(0);
        server.setTTL(128);
        server.send(`我是:${IPAdress}:很高兴认识你`,port,rinfo.address)
      }else{
      }
    }
  });
  server.bind(port,IPAdress);