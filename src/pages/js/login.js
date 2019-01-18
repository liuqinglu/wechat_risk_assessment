/* function request(url, callback) {
    $.ajax({
        url: url,
        method: 'get',
        success: function (data) {
            callback(null, data);
        },
        error: function (xhr, textStatus, errorThrown) {
            callback(errorThrown);
        }
    });
}

// callback函数，参数列表规定，第一个参数为错误抛出，第二个参数为响应值
request(url, function (err, data) {
    if (err) {
        // handle error
        return
    }
    // handle after request logic
    console.log(data);
}); */


// https://open.weixin.qq.com/connect/oauth2/authorize?AppID=wx2799d6a6a233231a&redirect_uri=http%3a%2f%2f10.liuqinglu.com&response_type=code&scope=snsapi_base&state=1#wechat_redirect


var baseUrl = 'http://119.23.109.99:8080';

mui.init();
// 失去焦点时提示必填项
$('input[type=text]').on('blur', function () {
    if ($(this).val().trim() === '') {
        // $(this).focus();
        mui.toast('请填写' + $(this).attr('name') + '！');
    }
});

$('#phone').on('blur', function () {
    var phone = $('#phone').val().trim();
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        mui.toast('手机号格式不正确');
        return false;
    }
});

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
        type: "get",
        success: function (res) {
            // console.log(res);
            var openid = res.openid;

            mui('body').on('tap', '#login', function () {
                var account = $('#account').val().trim(),
                    phone = $('#phone').val().trim(),
                    record_code = $('#record_code').val().trim(),
                    agree = $('input[type=checkbox]').prop('checked');
                console.log(agree);

                if (!(/^1[34578]\d{9}$/.test(phone))) {
                    mui.toast('手机号格式不正确');
                    $('#phone').focus();
                    return false;
                }


                if (account == '' || phone == '' || record_code == '') {
                    mui.toast('请填写必填信息！');
                } else {
                    if (agree == false) {
                        mui.toast('请阅读并确认同意会员注册条款！');
                        return;
                    }
                    var data = {
                        name: account,
                        phone: phone,
                        record_code: record_code,
                        weChat_code: openid
                    }
                    console.log(data);

                    $.ajax(baseUrl + '/api/v1/BindPersonInfo/', {
                        dataType: 'json', //服务器返回json格式数据
                        type: 'post', //HTTP请求类型
                        timeout: 10000, //超时时间设置为10秒；
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(data),
                        success: function (res) {
                            //服务器返回响应，根据响应结果，分析是否登录成功
                            if (res.code === 500) {//绑定失败，该干啥
                                mui.toast(res.message);
                            } else if (res.code === 200) {
                                if (res.message == 'ok') {//验证通过后跳转到之前页面
                                    mui.toast(res.message);
                                    mui.openWindow({
                                        url: './' + pageName + '.html?weChat_code=' + openid
                                    });
                                } else if (res.message == '绑定成功!') {//绑定成功后跳转到之前页面
                                    mui.toast(res.message);
                                    mui.openWindow({
                                        url: './' + pageName + '.html?weChat_code=' + openid
                                    });
                                }
                            }
                        },
                        error: function (xhr, type, errorThrown) {
                            //异常处理；
                            mui.toast(type)
                        }
                    });
                }
            });
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
    return null; //返回参数值
}