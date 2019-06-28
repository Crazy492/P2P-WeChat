// var socket = io('http://192.168.43.134:8881');

var socket = io('http://127.0.0.1:8060');
var username = document.querySelector(".side-username").innerHTML
var group = document.querySelector(".side-group").innerHTML
var base64 = document.querySelector(".avator").src
var IP = document.querySelector('.IP').innerHTML
// 客户端登录（让服务器保存用户信息，并回写相关数据）
socket.on('connect', async function () {
    console.log("I'm IN")
    await socket.emit('login', {
        username, group, base64, IP
    });
});