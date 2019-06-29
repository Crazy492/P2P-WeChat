// var socket = io('http://192.168.43.134:8881');

var socket = io('http://127.0.0.1:8060');
var username = document.querySelector(".side-username").innerHTML
var group = document.querySelector(".side-group").innerHTML
var base64 = document.querySelector(".avator").src
var IP = document.querySelector('.IP').innerHTML
var content = document.querySelector('.content');
var aimIP = '';
var msgStore = {

};

this.upDate = (data) => {
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
        msgStore[IP] = '';
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
            let title = document.querySelector('.header');
            let shadow = document.querySelector('.content-shadow')
            aimIP = aDiv[i].classList.item(0);

            content.innerHTML = msgStore[aimIP]

            aDiv[i].classList.remove('toRed')
            shadow.style.display = "none";
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
    // console.log(this.upDate)
    upDate(data);
})
socket.on('smexit', (data) => {
    upDate(data);
})
socket.on('msgRec', data => {

    let aDiv = document.querySelectorAll('.person');
    console.log(data.IP, aDiv[0].classList.item(0))
    let addHtml = `<div class="receive">
    <img  class="receive-avator" src="${data.base64}" alt="">
    <div class="receive-msg">${data.msg}</div>
    </div>`
    msgStore[data.IP] += addHtml;
    content.innerHTML = msgStore[data.IP];
    for (let i = 0; i < aDiv.length; i++) {

        if (data.IP == aDiv[i].classList.item(0)) {
            aDiv[i].classList.add('toRed')
        }
    }
    // let receiveHtml = document.createElement('div');
    // receiveHtml.className = 'receive'
    // receiveHtml.innerHTML = `
    //     <img  class="receive-avator" src="${data.base64}" alt="">
    //     <div class="receive-msg">${data.msg}</div>
    // `
    // content.appendChild(receiveHtml)
    content.scrollTop = content.scrollHeight
})
let btn = document.querySelector('.content-button');
btn.onclick = function () {
    let msg = document.querySelector('.content-textarea').value;

    let addHtml = `<div class="send">
    <div class="send-msg">${msg}</div>
    <img  class="send-avator" src="${base64}" alt="">
    </div>`
    msgStore[aimIP] += addHtml;
    content.innerHTML = msgStore[aimIP];

    // let sendHtml = document.createElement('div');
    // sendHtml.className = 'send'
    // sendHtml.innerHTML = `
    //     <div class="send-msg">${msg}</div>
    //     <img  class="send-avator" src="${base64}" alt="">
    // `
    // content.appendChild(sendHtml)
    console.log(content)

    document.querySelector('.content-textarea').value = '';
    socket.emit('toPerson', {
        msg,
        aimIP,
        IP,
        base64,
        username
    });
    console.log(msg, aimIP, IP);
    content.scrollTop = content.scrollHeight

}

let allbtn = document.querySelector('#allbtn');
allbtn.onclick = function(){
    let msg = document.getElementById('newContent').value;
    let person = document.querySelectorAll('.person');
    for(let i = 0; i < person.length; i++){
        let ip = person[i].classList.item(0);
        let addHtml = `<div class="send">
        <div class="send-msg">${msg}</div>
        <img  class="send-avator" src="${base64}" alt="">
        </div>`
        msgStore[ip] += addHtml;
        content.innerHTML = msgStore[ip];
        socket.emit('toPerson', {
            msg,
            aimIP:ip,
            IP,
            base64,
            username
        });
    }
    document.getElementById('newContent').value = '';
}

socket.on('disconnect', async () => {
    console.log('aaaa');

    // socket.emit('goodbye');
})

socket.on('download', async (data) => {
    console.log(data);

    let addHtml = `<div class="file-box">
    <img src="${data.base64}" class="receive-avator"><img>
    <a href="${data.dlFilePath}" class="dl"> 
     <div class="file-wrap">
        <span class= "file-span">${data.fileName}</span>
    </div>
    </a>
    </div>`
    msgStore[data.IP] += addHtml;
    content.innerHTML = msgStore[data.IP];



    // let div = document.createElement('div');
    // div.className = 'file-box';
    // let a = document.createElement('a');
    // div.innerHTML =
    //     `<img src="${data.base64}" class="receive-avator"><img>
    // <a href="${data.dlFilePath}" class="dl"> 
    //  <div class="file-wrap">
    //     <span class= "file-span">${data.fileName}</span>
    // </div>
    // </a>
    // `
    // content.appendChild(div)
    content.scrollTop = content.scrollHeight
})

document.querySelector('.content-textarea').onkeydown = (e) => {

    if (e.keyCode == 13) {
        btn.click();
    }
};
let toFile1 = () => {
    let inputF = document.querySelector('#file');
    inputF.click();
}
let toPersonFile = () => {
    let formdata = new FormData();
    let file = document.querySelector('#file').files[0];
    // if (!file) {
    //     alert('请先选择所需上传文件');
    //     return;
    // }
    console.log(file);
    formdata.append('f1', file);
    var xhr = new XMLHttpRequest();
    xhr.open('post', `http://${aimIP}:8060/postFile`, true);
    xhr.send(formdata);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {

                let addHtml = `<div class="file-box2">
                <a href="javascript:void(0)" class="dl"> 
                 <div class="file-wrap2">
                    <span class= "file-span">${file.name}</span>
                </div>
                </a>
                <img src="${base64}" class="send-avator"><img>
                </div>`
                msgStore[aimIP] += addHtml;
                content.innerHTML = msgStore[aimIP];

                
                // let div = document.createElement('div');
                // div.className = 'file-box2';
                // let a = document.createElement('a');
                // div.innerHTML =
                //     `
                // <a href="javascript:void(0)" class="dl"> 
                //  <div class="file-wrap2">
                //     <span class= "file-span">${file.name}</span>
                // </div>
                // </a>
                // <img src="${base64}" class="send-avator"><img>
                // `
                // content.appendChild(div)
                content.scrollTop = content.scrollHeight
                //同时触发server的接受文件事件？是跟post路径不同的一个东西
                //触发事件的时候，把要传的对象socketId和文件名一起传？
                socket.emit('toPersonFile', {
                    fileName: file.name,
                    aimIP: aimIP,
                    base64: base64
                })
            } else {
                alert('失败')
            }
        }
    }
    //用户虽然是传给某一个人，但实际上是上传到服务器，然后提醒对应的用户并且让他再次从服务器上下载文件?
    //还是直接通过socket传文件？
}