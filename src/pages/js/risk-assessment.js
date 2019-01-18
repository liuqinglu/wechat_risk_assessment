/**
 * 先获取code
 * 根据code获取微信用户OpenID
 * 点击微信菜单，判断是否已绑定
 * 否，跳转绑定页面
 * 是，判断问卷状态，并根据状态跳转到相应页面
 */

// https://open.weixin.qq.com/connect/oauth2/authorize?AppID=wx2799d6a6a233231a&redirect_uri=http%3a%2f%2f10.liuqinglu.com%2fpages%2frisk-assessment.html&response_type=code&scope=snsapi_base&state=1#wechat_redirect

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
    $.ajax(baseUrl + '/api/v1/GetOpenID/?code=' + code, {
        type: 'get',
        async: false,
        success: function (res) {
            console.log(res);
            var openid = res.openid;
            var data = {
                "weChat_code": openid
            }

            // 判断公众号是否登陆/绑定
            $.ajax(baseUrl + '/api/v1/ValidationLanding/', {
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                success: function (res) {
                    console.log(res);

                    // 判断是否已绑定
                    if (res.code === 1) {// 已绑定，
                        $.ajax(baseUrl + '/api/v1/BindReview/', {
                            dataType: 'json', //服务器返回json格式数据
                            type: 'post', //HTTP请求类型
                            timeout: 10000, //超时时间设置为10秒
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify(data),
                            success: function (res) {
                                console.log(res);
                                //服务器返回响应，根据响应结果，分析是否存在 未失效/未过期/暂存/新增几种状态
                                if (res.code === 1) {//审核通过且未失效，跳转详情和报告页面
                                    mui.toast(res.message);
                                } else if (res.code === 2) {//未审核通过且未过期，跳转风评问卷列表页面
                                    mui.toast(res.message);
                                    console.log(res.data[0].message);
                                } else if (res.code === 3) {//存在暂存的问卷，跳转编辑问卷页面
                                    mui.toast(res.message);
                                } else if (res.code === 4) {//跳转新增问卷页面
                                    mui.toast(res.message);
                                }
                            },
                            error: function (xhr, type, errorThrown) {
                                //异常处理；
                                // mui.toast(type);
                                mui.toast(1);
                            }
                        });
                    } else if (res.code === 2) {//未绑定，跳转到登录/绑定页面
                        mui.openWindow({
                            url: './../../index.html?pageName=' + pageName()[0]
                        });
                    }
                },
                error: function (xhr, type, errorThrown) {
                    //异常处理；
                    // mui.toast(type);
                    mui.toast(2);
                }
            });
        },
        error: function (XMLHttpRequest, textStatus) {
            console.log(textStatus);
            mui.toast(3);
        }
    });
}

// 获取url参数
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
console.log(pageName()[0]);

//取当前页面名称(带后缀名)
/* function pageName() {
    var strUrl = location.href;
    var arrUrl = strUrl.split("/");
    var strPage = arrUrl[arrUrl.length - 1];
    return strPage;
}
console.log(pageName()); */