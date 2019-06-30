let db = require('./database');
const IO = require('koa-socket');
let io = new IO();
let MySocketID = '';
let oApp = null;
// let app = undefined;

io.on('connection', client => {
    console.log('yyyyyy');
    let os = require('os');
    let obj = os.networkInterfaces()
    // function ipToInt(IP){var REG =/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    //     var xH = "",result = REG.exec(IP);
    //     if(!result) return -1;
    //     return (parseInt(result[1]) << 24 
    //         | parseInt(result[2]) << 16
    //         | parseInt(result[3]) << 8
    //         | parseInt(result[4]))>>>0;
    // }
    // console.log(ipToInt(obj.WLAN[1].address))
    // client.on('disconnect',()=>{
    //     console.log('xxxxxx');
    // })
})
io.on('login2',async (ctx,data)=>{
    console.log('login2!!!!')
    io.on('toPerson', async (ctx, data) => {
        console.log('我要跟他聊天啊', data);
        let { aimIP, msg, IP, base64, username,group } = data;
        console.log(db[group][username].socketID,'MySocketID')
        app._io.emit('msgRec', { "IP": IP, "msg": msg, "base64": base64, "username": username,"aimIP":aimIP })
        // io.broadcast('msgRec', { "IP": IP, "msg": msg, "base64": base64, "username": username });
        // server.setBroadcast(0);//开启广播
        // server.setTTL(128);
        // server.send(`${IP}--${msg}--${base64}--${username}--私聊`, port, aimIP);
    })
})

io.on('login', async (ctx, data) => {
    // oApp = app._io;
    // console.log(oApp)
    console.log(data);
    let { group, IP, username, base64} = data;
    let socketID = ctx.socket.socket.id
    if (!db.hasOwnProperty(group)) {
        db[group] = {};
    }
    db[group][username] = { "IP": IP, "base64": base64, "socketID": socketID };
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
    // gbIP = '10.101.55.255'
    server.on('listening', () => {
        console.log('正在监听中...');
        if (!flag) {
            server.setBroadcast(!0);//开启广播
            server.setTTL(128);
            console.log(gbIP)
            server.send(`${IP}--${group}--${username}--${base64}--${socketID}--广播`, port, gbIP);
            server.send(`${IP}--${group}--${username}--${base64}--${socketID}--广播`, port, gbIP);
            server.send(`${IP}--${group}--${username}--${base64}--${socketID}--广播`, port, gbIP);
        }
        flag = 1;
    })
    io.on('disconnect', (ctx) => {
        if(ctx.socket.socket.id == db[group][username].socketID){
            server.setBroadcast(!0);//开启广播
            server.setTTL(128);
            server.send(`${group}--${username}--${socketID}--退出`, port, gbIP);
            server.send(`${group}--${username}--${socketID}--退出`, port, gbIP);
            server.send(`${group}--${username}--${socketID}--退出`, port, gbIP);
            console.log(`${group}--${username}--${socketID}--退出a `);
            db[group] = {};
            // server.close();
            console.log('你退出了')
        }else{
            console.log('bushiwo')
        }
    })
    server.on('message', (msg, rinfo) => {
        if (rinfo.address == IP) {
            return;
        }
        let str = String(msg);
        let arr = str.split('--');
        let type = arr.pop();
        console.log(type)
        switch (type) {
            case '广播':
                if (arr[1] == group) {
                    server.setBroadcast(0);//单播
                    server.setTTL(128);
                    server.send(`${IP}--${group}--${username}--${base64}--${socketID}--应答`, port, rinfo.address)
                    server.send(`${IP}--${group}--${username}--${base64}--${socketID}--应答`, port, rinfo.address)
                    server.send(`${IP}--${group}--${username}--${base64}--${socketID}--应答`, port, rinfo.address)
                    db[group][arr[2]] = { "IP": arr[0], "base64": arr[3],"socketID":arr[4] };
                    app._io.emit('updateList', db[group]);
                    console.log('你来了');
                } else {
                    console.log('不回应');
                }
                break;
            case '应答':
                db[group][arr[2]] = { "IP": arr[0], "base64": arr[3],"socketID":arr[4] };
                app._io.emit('updateList', db[group]);
                console.log('我知道你已经在了');
                break;
            case '退出':
                if( arr[0] == group){
                    console.log('退出了');
                    delete db[arr[0]][arr[1]];
                    app._io.emit('smexit', db[arr[0]]);
                }
                break;
            case '私聊':
                console.log(`${arr[0]}:${arr[1]}`, '12312312')
                app._io.emit('msgRec', { "IP": arr[0], "msg": arr[1], "base64": arr[2], "username": arr[3],"aimIP": arr[4]});
                break;
            case '文件':
                app._io.emit('download', {
                    IP:arr[0],
                    dlFilePath: arr[1],
                    fileName: arr[2],
                    base64:arr[3]
                })//下载的路径
                break;
        }
        console.log(`receive message from ${rinfo.address}:${rinfo.port}：${msg}`);
    })
    server.bind(port, IP);

   
    io.on('toAllPerson', async (ctx, data) => {
        console.log('我要跟他聊天啊', data);
        let { aimIP, msg, IP, base64, username, group } = data;
        // app._io.emit('msgRec', { "IP": IP, "msg": msg, "base64": base64, "username": username,"aimIP":aimIP })
        // io.broadcast('msgRec', { "IP": IP, "msg": msg, "base64": base64, "username": username });
        server.setBroadcast(0);//开启广播
        server.setTTL(128);
        server.send(`${IP}--${msg}--${base64}--${username}--${aimIP}--私聊`, port, aimIP);
    })

    io.on('toPersonFile', (ctx, data) => {
        console.log('触发文件上传到用户的服务');
        let { fileName, aimIP, base64 } = data;
         let dlFilePath = `http://${aimIP}:${port}/downloadFile/${fileName}`;
        server.setBroadcast(0);//开启广播
        server.setTTL(128);
        server.send(`${IP}--${dlFilePath}--${fileName}--${base64}--文件`, port, aimIP);
        // app._io.emit('download', {
        //     dlFilePath: dlFilePath,
        //     fileName: fileName,
        // })//下载的路径
        // app._io.emit('personMsg', `你对${name}发送了文件: ${fileName}`)
    })
})
module.exports = {
    io,
    getApp(a) {
        app = a;
    }
}