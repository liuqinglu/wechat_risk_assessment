var tokens = localStorage.getItem('token')||'';

//get data
/**
 *获取数据请求
 *@meathod getData
 *@param {string,object,function,boolean}
 * url： 请求地址
 * data：请求数据
 * callback：回调函数
 * token：是否传token true：不传token
 *@return
 */
function getData(url, data, callback,token) {
    var isToken=true,
        options={
        url: url,
        type: "GET",
        data: data,
        success: function (res) {
            console.log(res);
            if (res.code == '503' || res.code == '504') {
                layer.msg('登录过期')
                setTimeout(function(){
                    // window.location.href = '../login.html';
                },2000)

                return;
            } else {
                callback(res.data);
            }
        },
        error: function (XMLHttpRequest,text) {
            // console.log(XMLHttpRequest.status,text);
            if(XMLHttpRequest.status===401){

                layer.msg('用户信息过期，请重新登录！', {
                    icon: 5,
                    time:1500
                });
                setTimeout(function(){
                    // window.location.href = '../login.html';
                },1500)
            }else{
                layer.msg('获取数据失败', {
                    icon: 5,
                });
            }

        }
    };
    if(token){
        isToken=false;
    }
        console.log(isToken,11);
    if(isToken){
        options.headers={
            Authorization: 'JWT ' +tokens
        }
    }else {
        options.headers={}
    }
    $.ajax(options);

}


//ajax请求
function ajaxData(options) {
    var defaults = {
        type: 'get',
        isJson: false,
        contentType:'application/x-www-form-urlencoded',
        isToken:true,
        headers:{
            Authorization: 'JWT ' + tokens
        }
    }
    var option = $.extend({}, defaults, options);

    if(!option.isToken){
        option.headers={}
    }
    if (option.isJson) {
        option.contentType = 'application/json';
        option.data = JSON.stringify(option.data)
    }
    $.ajax({
        url: option.url,
        type: option.type,
        data:option.data,
        contentType:option.contentType,
        headers: option.headers,
        success: function (res) {
            if (res.code == '503' || res.code == '504') {
                layer.msg('登录过期')
                window.location.href = '../login.html';
                // window.location.href='http://localhsot:9000/login.html';
                return;
            } else {
                option.callback(res)
            }
        },
        error: function (XMLHttpRequest) {
            layer.msg('操作失败，请重试！');
        }

    })
}


