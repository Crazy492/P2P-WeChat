let db = require('./database');
const IO = require('koa-socket');
let io = new IO();

io.on('login', async (ctx, data) => {
    console.log(data);
    let { group, IP, username, base64 } = data;
    if (!db.hasOwnProperty(group)) {
        db[group] = {};
    }
    db[group][username] = { "IP": IP, "base64": base64 };
    const dgram = require('dgram');
    const server = dgram.createSocket('udp4');
    let flag = 0;
    // let arr = [];
    // arr.push(IP);
    const port = 8060;
    let gbIP = '';
    let arrtemp = IP.split('.');
    arrtemp.forEach((val, idx) => {
        if (idx == 3) {
            gbIP += '255'
        } else {
            gbIP += val + '.'
        }
    })
    server.on('listening', () => {
        console.log('正在监听中...');
        if (!flag) {
            server.setBroadcast(!0);//开启广播
            server.setTTL(128);
            server.send(`${IP}:${group}:${username}:${base64}:广播`, port, gbIP);
        }
        flag = 1;
    })
    server.on('message', (msg, rinfo) => {
        if(rinfo.address == IP){
            return ;
        }
        let str = String(msg);
        let arr = str.split(':');
        let type = arr.pop();
        switch (type) {
            case '广播':
                if(arr[1] == group){
                    server.setBroadcast(0);//单播
                    server.setTTL(128);
                    server.send(`${IP}:${group}:${username}:${base64}:应答`, port, rinfo.address)
                    db[group][arr[1]] = {"IP":arr[0],"base64":arr[3]};
                    console.log('你来了');
                    break;
                }else{
                    console.log('不回应');
                }
            case '应答':
                db[group][arr[1]] = {"IP":arr[0],"base64":arr[3]};
                console.log('我知道你已经在了');
                break;
        }
        console.log(`receive message from ${rinfo.address}:${rinfo.port}：${msg}`);
    })
    server.bind(port, IP);

})



let app = undefined;

module.exports = {
    io,
    getApp(a) {
        app = a;
    }
}