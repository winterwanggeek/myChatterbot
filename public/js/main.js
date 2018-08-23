window.onload = function () {
    //建立连接
    var url = "http://localhost:3000";
    var socket = io.connect(url);
    //添加用户发送的信息
    var text = document.getElementById("f_left");
    var btn = document.getElementById("btn");
    text.focus();
    socket.on("connect", function(){
        socket.emit("open");
    });
    window.onkeydown = function (e){
        var eve = e || window.event;
        if(eve.keyCode === 13){
            addCustomMsg();
        }
    };
    btn.onclick = function(){
        addCustomMsg();
    };

    //接受服务器返回消息
    socket.on("msg", function(data){
        action(data);
    });

    //关闭对话的方法
    //socket.disconnect(true);
    //window.location.href = '/users';
    function action(text){
        var obj ={
            type: 'get',
            url: 'http://www.tuling123.com/openapi/api',
            data: {
                key: "2e0f59bc488349d699a2d676761f3f78",
                info: text
            },
            success: function (xhr) {
                var result = JSON.parse(xhr.responseText);
                var msg = result.text;
                dealData("rotWord", msg);
                addAudio(msg);
            },
            error: function (xhr) {
                console.log(xhr.status);
            }
        };
        myAjax(obj);
    }

    function addCustomMsg(){
        if (null === text.value || "" === text.value) {
            text.focus();
            return;
        }
        socket.emit("msg", text.value);
        dealData("myWord", text.value);
        text.value = "";
        text.focus();
    }

    function dealData(className, data) {
        var b_body = document.getElementById("b_body");
        var oDiv = document.createElement("div");
        var oSpan = document.createElement("span");
        var oP = document.createElement("p");
        oDiv.className = className;
        //设置p标签的内容
        oP.innerText = data;
        b_body.appendChild(oDiv);
        oDiv.appendChild(oSpan);
        oDiv.appendChild(oP);
        //滚动条保持在对话在最低端
        b_body.scrollTop = b_body.scrollHeight;
    }

    function addAudio(txt){
        var audioUrl = 'http://tsn.baidu.com/text2audio?tex=' + txt + '&lan=zh&cuid=35703043690945&ctp=1&tok=24.bd64810e297f92b0b0f5739293049b89.2592000.1537505481.282335-11711143';
        var audioObj = document.createElement("audio");
        audioObj.src = audioUrl;
        audioObj.setAttribute("autoplay", "autoplay");
        var audio = document.getElementsByTagName("audio");
        for(var i=0; i<audio.length; i++){
            if (audio[i]) {
                audio[i].parentNode.removeChild(audio[i]);
            }
        }
        document.body.appendChild(audioObj);
    }
};