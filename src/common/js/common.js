
function leaf_active(state) {
    //叶子节点才会有激活属性
    var node = $("#tree li ul li a")
    if (state) {
        if (node.eq(0).next().length == 0) {
            node.eq(0).find('cite').addClass("active")
        } else {
            node.eq(0).siblings().find('li').eq(0).find("cite").addClass("active")
        }
    }

    node.on("click", 'cite', function (e) {
        e.preventDefault();
        if ($(this).parent().next().length == 0) {
            $('#tree cite').removeClass("active")
            $(this).addClass("active")
        }
    })
}


/**
 *表单禁用函数
 *@meathod hubDisAble
 *@param {selector} obj 输入框jq选择器
 *@return
 */
function hubDisAble(obj) {
    obj.attr({
        "readonly": "",
        "disabled": ""
    }).addClass('read-only')
}


//浏览器返回按钮禁用
function banJump() {
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            window.history.pushState('forward', null, '');
            window.history.forward(1);
        });
    }

}

function DecodeGetQueryString(name) {
    var r = window.location.search;
    var de = decodeURI(window.location.search)
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = de.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//iframe自适应内容高度
function setIframeHeight(id){
    try{
        var iframe = document.getElementById(id);
        if(iframe.attachEvent){
            iframe.attachEvent("onload", function(){
                iframe.height =  iframe.contentWindow.document.documentElement.scrollHeight;
            });
            return;
        }else{
            iframe.onload = function(){
                iframe.height = iframe.contentDocument.body.scrollHeight;
            };
            return;
        }
    }catch(e){
        throw new Error('setIframeHeight Error');
    }
}

//关闭当前窗口
function moduleClose(){
    window.opener=null;
    window.open('','_self')
    window.close();
}



function format(){
    template.defaults.imports.formatDate=function(value){
         value=value.slice(0,19).replace('T',' ');
        return value;
    }
}
