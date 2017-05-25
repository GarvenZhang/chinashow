/**
 * Created by John Gorven on 2017/2/10.
 */
/**
 * component name:terminal-like type
 * class name: gar-terminal-like
 * html dom structure must be seeming to this:
    <p class="gar-terminal-like" >
        <label for="account">ACCOUNT:</label><input id="account" >
        <span><span></span><b></b></span>
    </p>
 *
 */
(function () {
    var aTerLike=getEls('.gar-terminal-like'), spanSup,spanSub,b,len=aTerLike.length;
    //dom
    var frag=document.createDocumentFragment();
    for(;len--;){
        oInput=aTerLike[len].querySelector('input');

        //create
        spanSup=document.createElement('span');
        spanSub=document.createElement('span');
        b=document.createElement('b');

        //style
        gar.addClass(oInput,'farToUnseen');
        gar.addClass(spanSup,'relative');
        gar.addClass(spanSub,'inline-block');

        //append
        spanSup.appendChild(spanSub);
        spanSup.insertBefore(b,null);
        frag.appendChild(spanSup);
        aTerLike[len].insertBefore(frag,null);

        //event listener
        gar.addHandler(aTerLike[len],'click',oInput.focus,false);
        gar.addHandler(oInput,'keyup',function (e) {transform(this,e);},false);
    }
    //show words in <input> on <span> in way of terminal-like
    function transform(from, e) {
        e=gar.getEvent(e);
        //visual area
        var tw=e.target.parentNode.childNodes[4].firstChild;
        tw.innerHTML=from.value;
    }
    //promise the <input> appearance not to be ugly
    for(var aInp=document.querySelectorAll('input'), l=aInp.length;l--;)
        if(!aInp[l].getAttribute('maxlength'))
            aInp[l].setAttribute('maxlength',20);
})();

/**
 * component name:canvas modal
 * effect:using canvas to draw bg and content is still input element
 * class name: canvasModalKey - canvasModal - modalBody
 * html dom structure must be seeming to this:
     <p class="questionForSafety canvasModalKey" id="questionForSafety">QUESTION&ANSWER</p>
     <div class="canvasModal " >
         <div class="modalBg"></div>
         <div class="modalBody">
             <small class="tips">TIPS:<small>PLEASE FILL A QUESTION AND ANSWER TO FIND YOUR ACCOUNT!</small></small>
             <p class="que gar-terminal-like">
                <label for="que">QUESTION:</label><input type="text" id="que" required size="30">
             </p>
             <p class="ans gar-terminal-like">
                <label for="ans">ANSWER:</label><input type="text" id="ans" required size="20">
             </p>
             <p class="clearfix">
                <button type="button">CONFIRM</button>
             </p>
         </div>
     </div>
 */
(function () {
    function CanvasModal(oCanvasModal){
        this.oCanvasModal=oCanvasModal;
        this.oModalBg=oCanvasModal.querySelector('.gar-modalBg');
        this.oModalBody=oCanvasModal.querySelector('.gar-modalBody');
    }

    CanvasModal.prototype={
        constructor:CanvasModal,
        drawBg:function (heading){
            this.canM=this.oModalBg.querySelector('canvas');

            var _oModalBody=this.oCanvasModal,
                eleH=_oModalBody.querySelectorAll('p').length*35+28,    // cuz element <p> n' element <small> are not fixed in height so we can only get their actual height via F12
                h=Math.max(200,60+eleH);

            if(this.canM.getContext){
                var ctx=this.canM.getContext('2d');
                ctx.fillStyle='rgba(0,0,0,.6)';
                //border
                ctx.beginPath();

                ctx.strokeStyle='rgb(44,170,42)';
                ctx.lineWidth=2;
                ctx.lineCap='square';

                ctx.moveTo(10,0);
                ctx.lineTo(490,0);
                ctx.lineTo(500,10);
                ctx.lineTo(500,h);
                ctx.lineTo(0,h);
                ctx.lineTo(0,10);
                ctx.closePath();
                ctx.stroke();

                //canvasModal's navBox
                ctx.beginPath();

                ctx.lineCap='square';

                ctx.moveTo(10,5);
                ctx.lineTo(490,5);
                ctx.lineTo(495,10);
                ctx.lineTo(495,30);
                ctx.lineTo(5,30);
                ctx.lineTo(5,10);
                ctx.lineTo(10,5);

                ctx.moveTo(467,5);
                ctx.lineTo(467,30);

                ctx.closePath();
                ctx.fillStyle='#004100';
                ctx.fill();
                ctx.stroke();

                //heading
                ctx.font='20px courier,courier_ser';
                ctx.textAlign='center';
                ctx.textBaseline='top';
                ctx.fillStyle='rgb(44,170,42)';
                ctx.fillText(heading||'INFO BOX',250,6);
                ctx.fillText('X',481,6);
            }
        },
        drawHeading:function () {
            var frag=document.createDocumentFragment();

            //create
            var canM=document.createElement('canvas'),
                oDragArea=document.createElement('div'),
                closeBtn=document.createElement('a'),
                _oModalBody=this.oCanvasModal;

            //attr
            canM.setAttribute('width',500);
            canM.setAttribute('height',Math.max(200,60+_oModalBody.querySelectorAll('p').length*35+28));
            oDragArea.className='gar-dragArea';

            //append
            canM.appendChild(document.createTextNode('CANVAS IS NOT ALLOWED IN YOUR CURRENT BROWSER VERSION.PLEASE UPDATE YOUR BROWSER!'));
            closeBtn.appendChild(document.createTextNode('X'));
            (function(){
                for(var nodeArr=[canM,oDragArea,closeBtn],len=nodeArr.length;len--;)frag.appendChild(nodeArr[len]);
            })();
            this.oModalBg.appendChild(frag);
            //add Class attr
            this.oDragArea=this.oModalBg.querySelector('.gar-dragArea');
        },
        openBox:function () {
            //except nodeName='#text'
            var _self=this,
                _key=_self.oCanvasModal.previousSibling,
                _oCanvasModal=_self.oCanvasModal,
                _firstInp=_oCanvasModal.querySelector('input');
            while(!_key.className||_key.className.indexOf('gar-canvasModalKey')==-1)_key=_key.previousSibling;

            gar.addHandler(_key,'click',function (e) {
                gar.addClass(_oCanvasModal,'modalOpen');
                gar.removeClass({
                    'unseen':_oCanvasModal,
                    'modalDefault':_oCanvasModal,
                    'modalClose':_oCanvasModal
                });

                _firstInp.focus();

                //ensure that box-dragging merely happens when box is opened
                _self.moveBox();
            },false);

            _self.contentLimit();
        },
        moveBox:function () {
            var _CanvasModal=this.oCanvasModal,
                _DragArea=this.oDragArea;

            //remove event when moving for unnecessary space using
            gar.addHandler(_DragArea,'mousedown',dragStart,false);

            function dragStart(e) {
                e =gar.getEvent(e);
                var pageX=e.pageX,
                    pageY=e.pageY,
                    L, T;
                // <=ie8
                if(pageX===undefined)pageX=e.clientX+(document.body.scrollLeft||document.documentElement.scrollLeft);
                if(pageY===undefined)pageY=e.clientY+(document.body.scrollTop||document.documentElement.scrollTop);
                //calculate the distance from cursor to oCanvasModal's inner-border
                L=pageX-gar.getEleLeft(_CanvasModal);
                T=pageY-gar.getEleTop(_CanvasModal);
                //ie:setCapture
                if(this.setCapture)this.setCapture(true);

                //dragMove listener
                gar.addHandler(document,'mousemove',dragMove,false);
                //dragRelease listener
                gar.addHandler(document,'mouseup',dragRelease,false);

                function dragMove(e) {//document:just to ensure however fast of mouse's moving is ok
                    e=gar.getEvent(e);
                    var pageX=e.pageX,
                        pageY=e.pageY;
                    // <=ie8
                    if(pageX===undefined)pageX=e.clientX+(document.body.scrollLeft||document.documentElement.scrollLeft);
                    if(pageY===undefined)pageY=e.clientY+(document.body.scrollTop||document.documentElement.scrollTop);
                    //oCanvasModal moves
                    _CanvasModal.style.left=pageX-L+'px';
                    _CanvasModal.style.top=pageY-T+'px';
                }
                function dragRelease() {
                    gar.removeHandler(document,'mousemove',dragMove,false);
                    gar.removeHandler(document,'mouseup',dragRelease,false);
                    //remove
                    if(_DragArea.releaseCapture)_DragArea.releaseCapture();
                }
                //preventDefault event: pic, txt,...  can't be dragged in a default way
                return false;
            }
        },
        contentLimit:function () {
            var _input=this.oModalBody.querySelectorAll('input');
            if(_input)
                for(var len=_input.length;len--;)
                    _input[len].setAttribute('maxlength','25');
        },
        closeBox:function () {
            var _self=this,
                _closeBtn=_self.oModalBg.querySelector('a'),
                _oCanvasModal=_self.oCanvasModal,
                _DragArea=_self.oDragArea;

            gar.addHandler(_closeBtn,'click',function () {
                gar.removeClass(_oCanvasModal,'modalOpen');
                gar.addClass(_oCanvasModal,'modalClose');
                //delay time must be smaller half than .modalClose's duration so that user can view the animation effect
                setTimeout(function () {
                    gar.addClass(_oCanvasModal,'unseen');
                },100);

                //remove event of boxMove
                gar.removeHandler(_DragArea,'mousedown',_self.moveBox.dragStart,false);

            },false);
        }
    };

    CanvasModal.fn=CanvasModal.prototype;

    CanvasModal.fn.init=function (oCanvasModal) {
        //create instance
        var oCan=new CanvasModal(oCanvasModal);
        oCan.drawHeading();
        oCan.drawBg();
        oCan.openBox();
        oCan.closeBox();

        gar.addClass({
            'unseen':oCan.oCanvasModal,
            'modalDefault':oCan.oCanvasModal
        });
    };

    //init
    var aCanvasModal=getEls('.gar-canvasModal'),len=aCanvasModal.length;
    while(len--){
        CanvasModal.fn.init(aCanvasModal[len]);
    }
})();

/**
 * component:progress bar
 * class name: gar-progressBar
 * html dom structure must be seeming to this:
       <div class="gar-progressBar"></div>
 */
(function () {
    function ProgressBar(obj) {
        this.oProgBar=obj;
    }

    ProgressBar.fn=ProgressBar.prototype;

    ProgressBar.fn.create=function (pTxt,version,url) {
        var frag=document.createDocumentFragment(),
            p=document.createElement('p'),
            small=document.createElement('small'),
            spanPer=document.createElement('span'),
            spanDetail=document.createElement('span'),
            div=document.createElement('div'),

            iLen=19,
            arrNode=[div,small,p],arrNodeL=arrNode.length,
            spanArr=[spanDetail,spanPer],spanArrL=spanArr.length;

        do div.insertBefore(document.createElement('i'),null); while(iLen--);

        //append
        p.appendChild(document.createTextNode(pTxt||'HANDLING....'));
        spanPer.appendChild(document.createTextNode('0%: '));
        while(spanArrL--)small.appendChild(spanArr[spanArrL]);
        while(arrNodeL--)frag.appendChild(arrNode[arrNodeL]);
        this.oProgBar.insertBefore(frag,null);

        this.spanPer=this.oProgBar.querySelector('small').firstChild;
        this.spanDetail=this.oProgBar.querySelector('small').lastChild;
        this.aI=this.oProgBar.querySelectorAll('i');

        if(!version||version==='ajax')this.msgSync(url);
        else this.animVersion();
    };

    ProgressBar.fn.msgSync=function (url) {
        var _self=this,
            _aI=this.aI,
            i=0; //how many <i> has been added className now

        //ajax&progress
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function () {
            if(xhr.readyState===4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status===304)console.log('SUCCESSFUL!');
                else console.info('REQUEST WAS UNSUCCESSFUL: '+xhr.status);
            }
        };
        xhr.onprogress=function (e) {

            e=gar.getEvent(e);
            if(e.lengthComputable){
                var per=e.position/e.totalSize,
                    times=per*20|0;//how many <i> should be added className now
                _self.dynamicMsg.apply(this,arguments);
                if(per==1.0)xhr.onprogress=null;//just use a time but related to dom
            }
        };
        xhr.open('get',url,false);
        xhr.send(null);
    };

    ProgressBar.fn.animVersion=function () {
        var _self=this,
            per=0,
            i=0,
            times=4,
            _aI=_self.aI,timer;

        timer=setInterval(function () {
            if(times>=20)clearInterval(timer);
            i=_self.dynamicMsg.call(this,_self,i,per,_aI,times);
            per+=0.2;
            if(per===1){
                _self.dynamicMsg.call(this,_self,i,per,_aI,times);
                //prepare enough time for progress bar to reach 100% and show animation
                setTimeout(function () {_self.autoClose();},300);
            }
            times+=4;
        },300);

    };

    ProgressBar.fn.dynamicMsg=function (_self,i,per,_aI,times) {
        _self.spanPer.innerHTML=Math.round(per*100)+'%: ';
        _self.spanDetail.innerHTML=(function (per) {
            switch(true){
                case per<0.2:return 'SENDING REQUEST TO THE SERVER!';
                case per>=0.2&&per<0.4:return 'SEARCHING FOR YOUR INFO FROM DATABASE!';
                case per>=0.4&&per<0.6:return 'HANDLING RELATED CALCULATION IN THE SERVER!';
                case per>=0.6&&per<0.8:return 'GOT INFO AND READY TO SEND FROM THE SERVER!';
                case per>=0.8&&per<1.0:return 'RECEIVING THE DATA!';
                default :return 'DONE!';
            }
        })(per);
        while(i<times){
            _aI[i].className='progressBar_show';
            i++;
        }
        return i;
    };

    ProgressBar.fn.autoClose=function () {
        var _oProgress=this.oProgBar;
        //prevent from coming into scroll on the body
        gar.addClass({
            'noscroll':document.body,
            'modalClose':_oProgress,
            'closeProgressBar':_oProgress
        });
        //delay time must be smaller half than .modalClose's duration so that user can view the animation effect
        setTimeout(function () {gar.addClass(_oProgress,'hide');},200);
    };

    ProgressBar.fn.init=function (ele) {
        new ProgressBar(ele).create(false,'anim');
    };

    var progBar=getEls('.gar-progressBar'),len=progBar.length;
    while(len--)ProgressBar.fn.init(progBar[len]);
})();

/**
 * component:photo gallery
 * class name:gargallery
 * html dom structure must be seeming to this:
 *
 */
gar.photoGallery=function () {};
gar.photoGallery.fn=gar.photoGallery.prototype;
gar.photoGallery.fn.ordinaryStruc=function (pics,fragment) {
    for(var _imgArr=[],li,h3,i=-1;pics[++i];){
        _imgArr[i]=document.createElement('img');
        li=document.createElement('li');
        h3=document.createElement('h3');
        li.appendChild(h3);
        li.insertBefore(_imgArr[i],h3);
        fragment.appendChild(li);
    }
    return _imgArr;
};
gar.photoGallery.fn.galleryStyle=function (pics,fragment) {
    var _style=[3,2,3,2,3,3,4,3],
        imgStruc=function () {
            var img=document.createElement('img'),
                div=document.createElement('div'),
                p=document.createElement('p');
            div.insertBefore(p,null);
            div.insertBefore(img,p);
            return [img,div];
        };

    for(var _imgArr=[],i=1,j=0,sum=0,tmp,li;pics[i-1];){
        li=document.createElement('li');
        gar.addClass(li,'clearfix');
        while((i%23==0?23:i%23)<=((_style[j%8]+sum)%23==0?23:(_style[j%8]+sum)%23)){   //3+2+3+2+3+3+4+3=23    _style.length=8
            tmp=imgStruc();
            li.appendChild(tmp[1]);
            _imgArr.push(tmp[0]);
            if(i===23){
                sum=0;
                ++i;
                break;
            }
            ++i;
        }
        sum+=_style[j%8];
        ++j;
        fragment.appendChild(li);
    }

    return _imgArr;
};
gar.photoGallery.fn.handleAPI=function (dataObj,coreProperty) {
    //when use this component to date docking
    // {
    //     name:<String>,
    //     url:<String>,
    //     id:<Number>
    // }
    var data=dataObj,prop,d;

    for(var i =0;d=data[i];i++){
        tmp='';
        for( prop in d)if(!new RegExp(coreProperty).test(prop))tmp+= prop+'='+d[prop]+'&';
        data[i]= '<'+tmp.slice(0,tmp.length-1)+'>'+d['baseUrl'];
    }
    return data;
};


/**
 * component:single photo scale
 * id :garsinglePro
 * html dom structure must be seeming to this:
 *  <div class="garsinglePro">
        <img src="" alt="" width="" height="">
    </div>
 */
gar.singlePro=(function () {
    try{
        var wrap=getEl('#garsinglePro'),
            nowImg=wrap.querySelector('img');

        //exit the window of single product's watching
        gar.addHandler(wrap,'click',function (e) {
            var e= gar.getEvent(e),
                tar=gar.getTarget(e);

            if(tar===this){
                hSize('.gargallery');
                gar.addClass(this,'hide');
            }

        },false);
    }catch(ex){}
    return function (img) {
        img.onclick=function () {
            if(/baseurl\/(.+\..+)/.test(this.src)){
                nowImg.src=RegExp['$1'];
                console.log(RegExp.$1,this.src);
            }else nowImg.src=this.src;
            nowImg.alt=this.parentNode.lastChild.innerHTML;
            nowImg.style.transform='translate('+nowImg.width/(-2)+'px,'+nowImg.height/(-2)+'px)';

            hSize('#garsinglePro');

            //getEl('#ctxshowwrap').style.height=parseInt(gar.getFullPageWH('h'))-parseInt(gar.getStyle(getEl('#nav'),'height'))+'px';
            gar.removeClass(wrap,'hide');
        };
    }
})();


/**
 * pictures preload:
 * preListObj:{
 *     imgWrap:<Object>,
 *     defaultPic:<String>,
 *     pictures:<Array>
 * }
 * domStructureFn:{
 *     main:<Function>,
 *     part:<Function>
 * }
 *waterfall:{
 *     a1:<Number>,
 *     d:<Number>,
 *     distanceFn:return  page sum height - browser window height  <Function>
 * }
 */
gar.picPreLoad=function (preListObj,domStructureFn,waterfall) {
    var pics=preListObj.pictures,
        picIndex=0,  // record how many pictures has been loaded
        loadingPic=true,
        imgDomArr;
    var myImg=(function () {
        var fragment=document.createDocumentFragment();
        //domStructureFn must return those img doms that were created
        imgDomArr=domStructureFn.main.call(this,pics,fragment);
        preListObj.imgWrap.appendChild(fragment);
        //remove  excess
        if(imgDomArr.length>pics.length){
            var dis=imgDomArr.length-pics.length;
            while(dis--){
                var o=imgDomArr.pop();
                o.onclick=null;
                o.parentNode.parentNode.removeChild(o.parentNode);
            }
        }
        return {
            setSrc:function (src) {
                if(/(\d+),imgIndex\s/.test(src)){
                    var index=parseInt(RegExp['$1']);
                    imgDomArr[index].src=RegExp.rightContext;
                    if(/\<(.+)\>/.test(pics[index]))domStructureFn.part.call(this, imgDomArr[index],RegExp['$1']);
                    return;
                }
                //defaultPic for loading
                if(loadingPic){
                    var i =0;
                    do imgDomArr[i++].src=src; while(imgDomArr[i]);
                    loadingPic=false;
                }
            }
        };
    })();
    var proxyImg=(function () {
        for(var i =-1,img=[];preListObj.pictures[++i];){
            img[i]=new Image;
            img[i].onload=(function (index) {
                var index=index;
                return function () {
                    myImg.setSrc(index+',imgIndex '+img[index].src);
                }
            })(i);
        }
        return {
            setSrc:function (srcArr) {
                myImg.setSrc(preListObj.defaultPic);
                var i =0;
                do{
                    if(/\<.+\>/.test(srcArr[i]))srcArr[i]='/baseurl'+RegExp.rightContext;

                    //img[picIndex].src=srcArr[i];    //if srcArr[i] = pics src

                    (function (picIndex) {
                        gar.ajax({
                            url:srcArr[i]+'.txt',
                            method:'get',
                            fn:function (result) {
                                img[picIndex].src=result;
                            }
                        });
                    })(picIndex);
                }while(srcArr[i++]&&img[++picIndex])
            }
        }
    })();
    //waterfall
    if(waterfall){
        var l=pics.length, n=0,An,loadingPicsNow,
            wfHandler=function () {
                var _scrollH= /CSS1Compat/.test(document.compatMode)?document.body.scrollTop:document.documentElement.scrollTop,
                    d=waterfall.distanceFn();
                if((getScrollTop() + getWindowHeight() - getScrollHeight()<30)||n===0 || /load/.test(gar.touchTrace(gar.browserDetect().engine.x5))) {        //for better controlling the smooth effect
                    An = waterfall.a1 + waterfall.d * n;
                    if (An < l) {

                        if (l - An > waterfall.d) {
                            loadingPicsNow = n === 0 ? pics.slice(0, An) : preListObj.pictures.slice(An, An + waterfall.d);
                            proxyImg.setSrc(loadingPicsNow);
                            ++n;
                        } else {
                            proxyImg.setSrc(preListObj.pictures.slice(An, l));
                            ++n;

                            if (An>=l){
                                gar.removeHandler(window,'scroll',wfHandler,false);
                            }
                        }
                    } else  {
                        gar.removeHandler(window,'scroll',wfHandler,false);

                        proxyImg.setSrc(preListObj.pictures.slice(0, l));
                    }

                    hSize('#product');
                }
            };
        //init
        wfHandler();
        gar.addHandler(window,'scroll',wfHandler,false);
        //window.onscroll=wfHandler;
    }else proxyImg.setSrc(pics);

};
//滚动条在Y轴上的滚动距离

function getScrollTop(){
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
        bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

//文档的总高度

function getScrollHeight(){
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
        bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}

//浏览器视口的高度

function getWindowHeight(){
    var windowHeight = 0;
    if(document.compatMode == "CSS1Compat"){
        windowHeight = document.documentElement.clientHeight;
    }else{
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

/**
 * component name:tree menu
 * class name:gartreeMenu
 * html dom structure must be seeming to this:
 *
 */
(function () {

})();


/**
 * form validate:
 */
gar.strategies4FV={
    isEmpty:function (val,errorMsg) {
        if(val==='')return errorMsg;
    },
    minLen:function (val, len, errorMsg) {
        if(val.length<len)return errorMsg;
    },
    maxLen:function (val,len,errorMsg) {
        if(val.length>len)return errorMsg;
    },
    isMobile:function (val, errorMsg) {
        if(!/^1[3|4|5|8][0-9]{9}$/.test(val))return errorMsg;
    },
    illegalInp:function (val,errorMsg) {    //   ~!@#$%^&*(
        if(/[~!@#$%^&*()]+/i.test(val))return errorMsg;
    },
    confirmPwd:function (oldVal, newVal, errorMsg) {
        if(/md5-/.test(newVal)){
            oldVal=md5(oldVal);
            newVal=newVal.slice(4);
        }
        if(oldVal!==newVal)return errorMsg;
    }
};
gar.validator4F=function () {this.cache=[];};
gar.validator4F.prototype.add=function (dom,rule,errorMsg) {
    var ary=rule.split(':');
    this.cache.push(function () {
        var strategy=ary.shift();
        ary.unshift(dom.value);
        ary.push(errorMsg);
        return gar.strategies4FV[strategy].apply(dom,ary);
    });
};
gar.validator4F.prototype.adds=function (dom,rules) {
    for(var self=this,i=0,rule;rule=rules[i++];){
        (function (rule) {
            var strategyAry=rule.strategy.split(':'),
                errorMsg=rule.errorMsg;
            self.cache.push(function () {
                var strategy=strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return gar.strategies4FV[strategy].apply(dom,strategyAry);
            });
        })(rule);
    }
};
gar.validator4F.prototype.start=function () {
    for(var i =0,validatorFunc;validatorFunc=this.cache[i++];){
        var msg=validatorFunc();
        if(msg)return msg;
    }
};

/**
 * use localStorage to cache js , css , base64 file
 */
gar.CacheFile=function () {
    this.storage=gar.getLocalStorage();
};
gar.CacheFile.prototype={
    constructor:gar.CacheFile,
    getFile:function (kind,name,url,fn) {
        var _self=this;
        gar.ajax({
            url:url,
            method:'get',
            fn:function (result) {
                _self.storage.setItem(name,result);
                if(/js/i.test(kind))_self.writeJs(name);
                else if(/css/i.test(kind))_self.writeCss(name);
                fn();
            }
        })
    },
    writeJs:function (name) {
        var oJs=document.createElement('script');

        oJs.innerHTML=this.storage.getItem(name);
        document.body.appendChild(oJs);
    },
    writeCss:function (name) {
        var oStyle=document.createElement('style');
        document.head.appendChild(oStyle);
        oStyle.innerHTML=this.storage.storage(name);
    },

    init:function (kind,name,url,fn) {
        this.getFile(kind,name,url,fn);
    }
};

