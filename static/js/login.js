
window.onload = function(){
  let IP = document.querySelector('#IP').innerHTML;
  
  let base64 =""
  document.querySelector('.main-logo').onclick = ()=>{
    document.querySelector('.change-img').click();
  }
  document.querySelector('.change-img').onchange = (e)=>{ 
    // 创建一个FileReader对象
      var reader = new FileReader();
     
     // 绑定load事件
      reader.onload = (e)=>{
          document.querySelector('.main-logo').src=e.target.result
          base64 = e.target.result
          document.querySelector('#base64').value=e.target.result;
          console.log(base64);
      }
      
      // 读取File对象的数据
     reader.readAsDataURL(document.querySelector('.change-img').files[0]);
  }

  let oForm=document.querySelector('.form');

  oForm.onsubmit=function (){
    let formdata=new FormData(oForm);
  
    let xhr=new XMLHttpRequest();
    formdata.append('username', username);
    formdata.append('group', group);
    formdata.append('base64', base64);
    formdata.append('IP', IP);
  
    xhr.open(oForm.method, oForm.action, true);
    console.log(formdata)
    xhr.send(formdata);
    xhr.onreadystatechange=function (){
      if(xhr.readyState==4){
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
          alert('success');
        }else{
          alert('fail');
        }
      }
    };
  
    return false; //取消表单默认提交事件
  };
  
}