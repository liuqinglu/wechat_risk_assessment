/**
 * 先获取code
 * 根据code获取微信用户OpenID
 * 点击微信菜单，判断是否已绑定
 * 否，跳转绑定页面
 * 是，直接跳转目标页面
 */

// https://open.weixin.qq.com/connect/oauth2/authorize?AppID=wx2799d6a6a233231a&redirect_uri=http%3a%2f%2f10.liuqinglu.com%2fpages%2fmember-center.html&response_type=code&scope=snsapi_base&state=1#wechat_redirect
var baseUrl = 'http://119.23.109.99:8080';

mui.init();

// 获取code
var AppID = 'wx2799d6a6a233231a';
var code = getUrlParam('code');
var local = window.location.href;
if (code == null || code === '') {
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?AppID=' + AppID +
        '&redirect_uri=' + encodeURIComponent(local) +
        '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
} else {
    console.log('code:' + code);

    // 获取OpenID
    var url = baseUrl + '/api/v1/GetOpenID/?code=' + code;
    $.ajax(url, {
        type: "get",
        success: function (res) {
            console.log(res);
            var openid = res.openid;
            var data = {
                "weChatId": openid
            }
            
            // 判断是否已绑定
            if (isBind == true) {// 已绑定，显示会员中心页内容
                $.ajax(baseUrl + '/api/v1/IndexPerson/', {
                    dataType: 'json',
                    type: 'post',
                    timeout: 10000, //超时时间设置为10秒
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data),
                    success: function (res) {
                        //服务器返回响应，根据响应结果，分析是否登录成功
                        if (res.code === 200) {//显示会员中心页面内容
                            console.log(res);
                            mui.toast(res.message);
                        } else if (res.code === 500) {
                            mui.toast(res.message);
                        }
                    },
                    error: function (xhr, type, errorThrown) {
                        //异常处理；
                        mui.toast(type)
                    }
                });
            } else {//未绑定，跳转到绑定页面
                mui.openWindow({
                    url: './../../index.html?page=' + pageName(),
                    id: 1
                });
            }
        },
        error: function (XMLHttpRequest, textStatus) {
            console.log(textStatus);
        }
    });
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


// 取当前页面名称(不带后缀名)
function pageName() {
    var a = location.href;
    var b = a.split("/");
    var c = b.slice(b.length - 1, b.length).toString(String).split(".");
    return c.slice(0, 1);
}

//取当前页面名称(带后缀名)
function pageName() {
    var strUrl = location.href;
    var arrUrl = strUrl.split("/");
    var strPage = arrUrl[arrUrl.length - 1];
    return strPage;
}
// console.log(pageName());