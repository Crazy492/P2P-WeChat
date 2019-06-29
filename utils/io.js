let db = require('./database');
const IO = require('koa-socket');
let io = new IO();
// let app = undefined;

io.on('connection',client=>{
    console.log('yyyyyy');
    // client.on('disconnect',()=>{
    //     console.log('xxxxxx');
    // })
})
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
            server.send(`${IP}--${group}--${username}--${base64}--广播`, port, gbIP);
        }
        flag = 1;
    })
    io.on('disconnect',()=>{
        server.setBroadcast(!0);//开启广播db[group] = {};
        server.setTTL(128);
        server.send(`${group}--${username}--退出`, port, gbIP);
        console.log(`${group}--${username}--退出a `);
        db[group] = {};
        // server.close();
        console.log('你退出了')
    })
    server.on('message', (msg, rinfo) => {
        if (rinfo.address == IP) {
            return;
        }
        let str = String(msg);
        let arr = str.split('--');
        let type = arr.pop();
        switch (type) {
            case '广播':
                if (arr[1] == group) {
                    server.setBroadcast(0);//单播
                    server.setTTL(128);
                    server.send(`${IP}--${group}--${username}--${base64}--应答`, port, rinfo.address)
                    db[group][arr[2]] = { "IP": arr[0], "base64": arr[3] };
                    app._io.emit('updateList', db[group]);
                    console.log('你来了');
                    break;
                } else {
                    console.log('不回应');
                }
            case '应答':
                db[group][arr[2]] = { "IP": arr[0], "base64": arr[3] };
                app._io.emit('updateList', db[group]);
                console.log('我知道你已经在了');
                break;
            case '退出':
                console.log('退出了');
                delete db[arr[0]][arr[1]];
                app._io.emit('smexit',db[arr[0]]);
                break;
            case '私聊':
                console.log(`${arr[0]}:${arr[1]}`,'12312312')
                app._io.emit('msgRec',{"IP":arr[0],"msg":arr[1],"base64":arr[2],"username":arr[3]});
                break;
        }
        console.log(`receive message from ${rinfo.address}:${rinfo.port}：${msg}`);
    })
    server.bind(port, IP);
    
    io.on('toPerson',async (ctx,data)=>{
        console.log('我要跟他聊天啊',data);
        let { aimIP, msg, IP, base64 ,username} = data;
        server.setBroadcast(0);//开启广播
        server.setTTL(128);
        server.send(`${IP}--${msg}--${base64}--${username}--私聊`, port, aimIP);
})
})



module.exports = {
    io,
    getApp(a) {
        app = a;
    }
}