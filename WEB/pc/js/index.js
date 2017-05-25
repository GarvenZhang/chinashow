/**
 * Created by John Gorven on 2017/3/11.
 */
/**
 * device:
 */
if(/x5/.test(device)){
    //init height
    getEl('#homepage').style.height=parseInt(gar.getFullPageWH('h'))-parseInt(gar.getStyle(getEl('#nav'),'height'))+'px';
}

/**
 * judge device
 */
(function () {
    var client=gar.browserDetect(),sys=client.system;
    if(!client.engine.x5&&(sys.iphone||sys.android||sys.winMobile||sys.ipad||sys.ipod||sys.nokiaN)){
        //phone browser
        document.body.innerHTML='<div id="errorEnvir" style="text-align: center;"> <img style="display: inline-block" src="data:image/png;base64,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" alt="提醒logo" > <h4 style="font-size: 20px;font-weight: 400;line-height: 30px;color: #2B333F;">请在微信客户端打开链接</h4> </div>'
        document.getElementById('errorEnvir').style.marginTop=pageHeight/20+'px';
        document.getElementsByTagName('title')[0].innerHTML='抱歉,出错了!';
    }
})();

/**
 * for security:
 */
gar.preventIframe();

/**
 * cache file
 */
(function () {

    var oMBG=getEl('#mbg'),oCLG=getEl('#companyLogo'),oCU=getEl('#contactus'),
        cJs=new gar.CacheFile();
    try{
        var cF=gar.getLocalStorage(),
            getCacheInfo=function () {
                if(!cF.getItem('mbg'))cF.setItem('mbg',MBG_D64);
                oMBG.src=cF.getItem('mbg');
                if(!cF.getItem('clg'))cF.setItem('clg',CLG_D64);
                oCLG.src=cF.getItem('clg');
                if(!cF.getItem('cu'))cF.setItem('cu',CU_D64);
                oCU.src=cF.getItem('cu');
            };
        if(!cF.getItem('mbg'))cJs.init('js','fileJson','../file/tmpJson.js',getCacheInfo);
        else getCacheInfo();
    }catch (e){
        cJs.init('js','fileJson','../file/tmpJson.js',function () {
            oMBG.src=MBG_D64;
            oCLG.src=CLG_D64;
            oCU.src=CU_D64;
        });

    }
})();



/**
 * load img:
 */
(function () {
    //product classification
    var catalogue=getEl('#catalogue'),aUl=catalogue.querySelectorAll('ul'),nav=getEl('#nav'),product=getEl('#product'),prodDetail=getEl('#prodDetail'),
        distanceFn=function () {
            return nav.offsetTop+nav.offsetHeight+product.offsetTop+product.offsetHeight-parseInt(gar.getFullPageWH('h'));
        },
        pG=new gar.photoGallery(),
        path;

    var partFunc_GARF=function (img, info) {
        var infoArr=info.split('&');
        img.setAttribute('idnum',infoArr[0].split('=')[1]);
        img.parentNode.lastChild.innerHTML=img.alt=infoArr[1].split('=')[1];
        img.setAttribute('parentid',infoArr[2].split('=')[1]);
        img.onclick=function () {
            gar.removeClass(tab[3],'hide');
            //reset
            gar.removeClass(prodDetail,'slowDisappear');
            //animation
            gar.addClass(catalogue,'slowDisappear');
            setTimeout(function () {
                gar.addClass(catalogue,'hide');
                gar.removeClass(prodDetail,'hide');
            },300);
            go2NextLay(infoArr[2].split('=')[1],'go');
        }
    };

    gar.ajax({
        url:'/getAllRootFolders_action',
        method:'get',
        fn:function (result) {
            if(result.status){
                var data=pG.handleAPI(result.data,'baseUrl'),l=data.length;
                data=[data.slice(0,(l>>1)===0?1:(l>>1)),(l>>1)===0?undefined:data.slice(l>>1)];
                gar.picPreLoad({
                    imgWrap:aUl[0],
                    defaultPic:'../img/loading.gif',
                    pictures:data[0]
                },{
                    main:pG.ordinaryStruc,
                    part:partFunc_GARF
                }, {
                    a1:2,
                    d:1,
                    distanceFn:distanceFn
                });

                gar.picPreLoad({
                    imgWrap:aUl[1],
                    defaultPic:'../img/loading.gif',
                    pictures:data[1]
                },{
                    main:pG.ordinaryStruc,
                    part:partFunc_GARF
                },{
                    a1:2,
                    d:1,
                    distanceFn:distanceFn
                });

                path='root-';

            }
        }
    });

    //product show
    var isSame,
        partFunc_GEFI=function (img, info) {
            var infoArr=info.split('&'),name=infoArr[1];
            img.setAttribute('idnum',infoArr[0].split('=')[1]);

            if(/iName/.test(name)){ //kind of img
                img.setAttribute('iname',name.split('=')[1]);
                if(/url/.test(infoArr[2]))img.setAttribute('url',infoArr[2].split('=')[1]);
                gar.singlePro(img);
            } else if(/fName/.test(name)){  // kind of File
                img.setAttribute('fname',name.split('=')[1]);
                if(/parentId/.test(infoArr[2]))img.setAttribute('parentid',infoArr[2].split('=')[1]);

                img.onclick=function () {
                    go2NextLay(infoArr[0].split('=')[1],'go');
                };
            }

            try{
                if(hSize('#prodDetail')[1]===0){
                    setTimeout(function () {
                        hSize('#prodDetail');
                    },300);
                }
            }catch (e){setTimeout(function () {
                hSize('#prodDetail');
            },300);}

            img.parentNode.lastChild.innerHTML=img.alt=name.split('=')[1];
        };

    function go2NextLay(id,goOrBack) {
        gar.ajax({
            url:'/getEachfolderInfo_action',
            method:'post',
            data:{id:id},
            fn:function (result) {
                if(result.status){
                    result=result.data;

                    var data4Img,data4File,data;
                    if(result.imgs)data4Img=pG.handleAPI(result.imgs,'baseUrl');
                    if(result.files)data4File=pG.handleAPI(result.files,'baseUrl');
                    if(data4File||data4Img){
                        if(data4Img&&data4File)data=data4Img.concat(data4File);
                    }else return;
                    if(isSame==this){
                        setTimeout(function () {
                            gar.imitClick(nav.querySelectorAll('a')[1]);
                        },500); //i don't know why yet ...why must I need to click the tab[1] again .
                                //Also, why must it need to delay for more than 300ms or more...
                        return;
                    } else {
                        //reset
                        var _target=getEl('.gargallery');
                        if(_target.hasChildNodes()){
                            var img=_target.querySelectorAll('img'),len=img.length;
                            //release each img's click event
                            while(len--)img[len].onclick=null;
                            _target.innerHTML='';
                        }
                        gar.picPreLoad({
                            imgWrap:_target,
                            defaultPic:'../img/loading.gif',
                            pictures:data
                        },{
                            main:pG.galleryStyle,
                            part:partFunc_GEFI
                        },{
                            a1:8,
                            d:3,
                            distanceFn:distanceFn
                        });
                        if(/go/.test(goOrBack))path+=id.toString()+'-';
                    }
                }

            }
        });
        //record the previous time which kind of product the user chose
        isSame=this;
    }

    //init


    /**
     * tab-cutover:
     */
    var biddenDefault=function (e) {gar.preventDefault(gar.getEvent(e));};
    gar.addHandler(document,'touchmove',biddenDefault,false);

    //click for each tab
    for(var tab=getEl('#nav').querySelectorAll('a'),l=tab.length,status=0;l--;){
        (function (index) {
            var tabHandle=function () {
                var ctx=getEl('#ctx');

                if(status===1||(status===2&&(this.innerHTML==='首页'||this.innerHTML==='联系我们')))gar.addClass(tab[3],'hide');

                //.ctx width calculate
                var _w=parseInt(gar.getStyle(getEl('.ctx'),'width'));
                switch(this.innerHTML){
                    case '首页'://left=0
                        gar.addHandler(document,'touchmove',biddenDefault,false);
                        gar.easeOut(ctx,'left',0,10);
                        hSize('#homepage');
                        break;
                    case '公司产品'://left=1050
                        gar.removeHandler(document,'touchmove',biddenDefault,false);

                        gar.easeOut(ctx,'left',Math.round(-0.3333333333333333333333333333*_w),10);
                        //due to browser scrollbar will come up at this moment
                        setTimeout(function () {
                            gar.easeOut(ctx,'left',Math.round(-0.3333333333333333333333333333*parseInt(gar.getStyle(getEl('.ctx'),'width'))),10);
                        },50);
                        hSize('#product');

                        if(/hide/.test(getEl('#catalogue').className)){
                            gar.removeClass(tab[3],'hide');
                        }
                        status=1;
                        break;
                    case '联系我们'://left=2100
                        gar.addHandler(document,'touchmove',biddenDefault,false);

                        gar.easeOut(ctx,'left',Math.round(-0.666666666666666666666666666*_w),10);
                        setTimeout(function () {
                            gar.easeOut(ctx,'left',Math.round(-0.6666666666666666666666666667*parseInt(gar.getStyle(getEl('.ctx'),'width')))-1,10);
                        },50);

                        hSize('#homepage');
                        break;
                    case '':
                        var tmpArr=path.split('-'),
                            parentId=parseInt(tmpArr[tmpArr.length-3]);
                        if(status)gar.removeClass(this,'hide');
                        if(tmpArr.length>3){
                            go2NextLay(parentId,'back');
                            path=path.slice(0,path.length-parentId.toString().length-1);
                            status=2;
                        }else{
                            //reset
                            gar.removeClass(catalogue,'slowDisappear');

                            //animation
                            gar.addClass(this,'hide');
                            gar.addClass(prodDetail,'slowDisappear');
                            setTimeout(function () {
                                gar.removeClass(catalogue,'hide');
                                gar.addClass(prodDetail,'hide');

                                hSize('#catalogue');
                            },300);
                            path='root-';
                            status=1;
                        }

                        break;
                }
            };

            gar.addHandler(tab[index],'click',tabHandle,true);

        })(l);
    }



})();

/**
 * init homepage height:
 */
function hSize(e){var ele=getEl(e);getEl('#ctxshowwrap').style.height=gar.getEleSumH(ele)+'px';return [ele.offsetTop,ele.offsetHeight,parseInt(gar.getStyle(ele,'marginBottom'))];}


hSize('#homepage');
setTimeout(function () {    //i don't know what the problem is when the page is loading, page height cannot change based to code hSize('#homepage);
                            //maybe there are some codes changing the page height after,so i have to delay to execute Line 201
    hSize('#homepage');
    //if(/pc/.test(device))gar.imitClick(getEl('#nav').querySelectorAll('a')[1]);
    if(parseInt(getEl('#ctxshowwrap').style.height)<=640)location.href=location.href;
},300);
























