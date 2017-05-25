/**
 * Created by John Gorven on 2017/4/6.
 */

/**
 * login form validate:
 */
var oForm=getEl('#loginForm'),
    oUser=oForm.user,
    oPwd=oForm.pwd,
    oSubmit=oForm.submit;

var setCookie4L=function (name,password) {
    var time=new Date(new Date().getTime()+2*60*60*1000);
    gar.cookieUtil.set('name',name,time);
    gar.cookieUtil.set('password',password,time);
};

var validatorFunc=function () {
    var validator=new gar.validator4F();
    validator.add(oUser,'isEmpty','用户名不能为空！');
    validator.add(oPwd,'isEmpty','密码不能为空！');
    return validator.start();
};

var submit=function (name,pwd,useMd5) {
    var errorMsg=validatorFunc();
    if(errorMsg){
        alert(errorMsg);
        return false;
    }
    gar.ajax({
        url:'/login_action',
        method:'post',
        data:{
            name: oUser.value,
            password: useMd5?md5(oPwd.value):oPwd.value
        },
        fn:function (result) {
            if(result.status){
                //cookie
                setCookie4L(name,pwd);
                location.assign(result.name);
            }
            else alert('密码唔系呢个勒~阿杰!');
        }
    })
};

gar.addHandler(oSubmit,'click',function () {
        submit(oUser.value,md5(oPwd.value),'md5');
},false);

//KEY 'enter' to submit
for(var aInpTxt=[oUser,oPwd],i=0,inp;inp=aInpTxt[i++];){
    (function (inp) {
        gar.addHandler(inp,'keyup',function (e) {
            if(gar.getEvent(e).keyCode===13)submit(oUser.value,md5(oPwd.value),'md5');
        },false);
    })(inp);
}

/**
 * automatically login if cookie has exited
 */
if(gar.cookieUtil.get('name') ==='yaojie'){
    oUser.value=gar.cookieUtil.get('name');
    oPwd.value=gar.cookieUtil.get('password');
    submit(oUser.value,oPwd.value);
}
