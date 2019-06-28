// var socket = io('http://192.168.43.134:8881');

var socket = io('http://127.0.0.1:8060');
var username = document.querySelector(".side-username").innerHTML
var group = document.querySelector(".side-group").innerHTML
var base64 = document.querySelector(".avator").src
var IP = document.querySelector('.IP').innerHTML
var aimIP = '';

function upDate(data) {
    let sideWrap = document.querySelector('.side-wrap')

    while (sideWrap.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        sideWrap.removeChild(sideWrap.firstChild);
    }

    var number = document.querySelector('.number')
    //data按组过滤
    var arr = Object.keys(data)
    console.log(arr)
    number.innerHTML = arr.length
    //
    let newArr = arr.filter(val => val != username)

    console.log(newArr, username)

    for (let i = 0; i < newArr.length; i++) {
        let div = document.createElement("div");
        let base64 = data[newArr[i]].base64
        let IP = data[newArr[i]].IP
        div.className = IP + " person";
        document.querySelector('.side-wrap').appendChild(div);
        div.innerHTML = `
        <img src=${base64} style="width: 50px;height: 50px;">
        <span class="username ${IP}" >${newArr[i]}</span>
        `
    }
    let aDiv = document.querySelectorAll('.person');
    console.log(aDiv);
    for (let i = 0; i < aDiv.length; i++) {
        aDiv[i].onclick = function () {
            aimIP = aDiv[i].classList.item(0);
            let title = document.querySelector('.header');

            title.innerHTML = newArr[i];
        }
    }
}

// 客户端登录（让服务器保存用户信息，并回写相关数据）
socket.on('connect', async function () {
    console.log("I'm IN")
    await socket.emit('login', {
        username, group, base64, IP
    });
});
socket.on('updateList', async (data) => {
    console.log(data);
    upDate(data);
})
socket.on('smexit', (data) => {
    upDate(data);
})
socket.on('msgRec',data => {
    let content = document.querySelector('.content');
    let receiveHtml = document.createElement('div');
    receiveHtml.className = 'receive'
    receiveHtml.innerHTML = `
        <div class="receive-msg">${data.msg}</div>
        <img  class="receive-avator" src="${data.base64}" alt="">
    `
    content.appendChild(sendHtml)
})
let btn = document.querySelector('.content-button');
btn.onclick = function(){
    let msg = document.querySelector('.content-textarea').value;
    let content = document.querySelector('.content');
    let sendHtml = document.createElement('div');
    sendHtml.className = 'send'
    sendHtml.innerHTML = `
        <div class="send-msg">${msg}</div>
        <img  class="send-avator" src="${base64}" alt="">
    `
    content.appendChild(sendHtml)
    console.log(content)
    socket.emit('toPerson', {
        msg,
        aimIP,
        IP,
        base64
    });
    console.log(msg,aimIP,IP);
}
