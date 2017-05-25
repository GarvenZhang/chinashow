/**
 * Created by John Gorven on 2017/4/7.
 */
(function () {
    /**
     * correct pwd
     */
    var oCorPwdForm=getEl('#corPwdForm'),
        oNowPwd=oCorPwdForm.nowPwd,
        oNewPwd=oCorPwdForm.newPwd,
        oConfirmPwd=oCorPwdForm.confirmPwd,
        oComfirmBtn=oCorPwdForm.confirmBtn;

    var validatorFunc=function () {
        var validator=new gar.validator4F();
        validator.add(oNowPwd,'confirmPwd:md5-'+gar.cookieUtil.get('password'),'原密码不正确!');
        validator.adds(oNewPwd,[
            {strategy:'minLen:8',errorMsg:'密码不能小于8位！'},
            {strategy:'maxLen:20',errorMsg:'密码不能超过20位！'},
            {strategy:'illegalInp',errorMsg:'密码不能包含非法字符:~!@#$%^&*('}
        ]);
        validator.add(oConfirmPwd,'confirmPwd:'+oNewPwd.value,'两次输入密码不正确！');
        return validator.start();
    };

    gar.addHandler(oComfirmBtn,'click',function () {
        var msg=validatorFunc();
        if(msg){
            alert(msg);
            return false;
        }
        gar.ajax('/modify_psw_action','post',true,
            {name:gar.cookieUtil.get('name'),
                password:md5(oConfirmPwd.value)}
            ,function (result) {
                if(result){
                    alert('密码修改成功');
                    gar.cookieUtil.unset('name');
                    gar.cookieUtil.unset('password');
                    oCorPwdForm.reset();
                }
                else alert('网络故障,请再次修改！');
            })
    },false);

    /**
     * tab
     */
    var aTabs=getEl('#tabWrap').querySelectorAll('li'),l=aTabs.length,
        oPicHandle=getEl('#picHandle'),
        oPwdCorr=getEl('#pwdCorr'),
        aDiv=[oPicHandle,oPwdCorr];
    for(;l--;){
        (function (index) {
            gar.addHandler(aTabs[index],'click',function() {
                var i=0;
                while(aDiv[i])gar.removeClass(aDiv[i++],'hide');
                switch(this.innerHTML){
                    case '图片处理':gar.addClass(oPwdCorr,'hide');break;
                    case '修改密码':gar.addClass(oPicHandle,'hide');break;
                }
            },false);
        })(l)
    }
})();

(function () {
    /**
     * Created by jm on 2017/4/7.
     */

    /*
     <div data_type="folder" class=" doc_item">
     <div class=" doc_pic">
     <a><img src="/images/folder.png" data_c_name="doc_pic_img"></a>
     </div>
     <div class=" doc_ti">
     <form enctype="application/x-www-form-urlencoded">
     <input class=" doc_name">
     </form>
     </div>
     <i data_c_name="doc_del" class=" doc_del"></i>
     </div>
     */


    var doc=document,
        doc_area_div=JM.getEle('.doc_area>div'),// show pics and folders' area
        oCreateDocs=doc.getElementById('createDocs'),//the btn of creating a new folder
        a_log=JM.getEle('.path > a');

    //set default path for a tag
    a_log.href=location.pathname;

    //initialize main page
    getData('/getAllRootFolders_action',function (data) {
        var r_f_d=data.data,
            r_f_d_len=r_f_d.length;//rootFolderData's length;
        if(r_f_d_len){
            //init main page
            init(r_f_d,doc_area_div,function (data) {
                var d=data,
                    d_item=JM.getEles('.doc_item'),
                    d_name=JM.getEles('.doc_name'),
                    d_del=JM.getEles('.doc_del'),
                    d_pic_a=JM.getEles('.doc_pic > a');

                JM.reverseIterator(d,function (i,item) {
                    //set data_id
                    d_pic_a[i].setAttribute('data_id',item.id);
                    d_name[i].setAttribute('data_id',item.id);
                    d_item[i].setAttribute('data_id',item.id);
                    d_name[i].value=item.fName;

                    var type=d_item[i].getAttribute('data_type');

                    //blur
                    d_name[i].onblur=function () {
                        var self=this;
                        blur_modifyInfo(self,type);
                    };

                    //show delete btn
                    d_item[i].onmouseover=function (e) {
                        v_show(d_del[i],e);
                    };

                    //not show delete btn
                    d_item[i].onmouseout=function (e) {
                        v_n_show(d_del[i],e);
                    };

                    d_del[i].onclick=function (ev) {
                        var id=d_item[i].getAttribute('data_id'),
                            type=d_item[i].getAttribute('data_type');
                        console.log(d_item[i]);
                        delelte_operation(ev,id,type,d_item[i],doc_area_div);
                    };

                    //open a new folder
                    if(/folder/.test(d_item[i].getAttribute('data_type')))
                        d_pic_a[i].onclick=goToNextLay;

                });
            });
        }
    });//get data from backstage supporter

    //click create a new folder btn
    oCreateDocs.onclick=function (e) {
        var ev=JM.getEvent(e),
            id=this.getAttribute('data_id');
        ev.stopPropagation(ev);
        createDoc(doc_area_div,function (doc_item,doc_ti_input,doc_del,doc_pic_a) {
            var flag=true,
                type=doc_item.getAttribute('data_type'),
                d_id=doc_item.getAttribute('data_id');

            //open new folder
            if(/folder/.test(type))
                doc_pic_a.onclick=goToNextLay;
            //blur
            doc_ti_input.onblur=function () {
                var self=this,
                    oCreateDoc_d_id=oCreateDocs.getAttribute('data_id'),
                    tips_notNull=JM.getEle('.tips>p'),
                    id=0;
                oCreateDoc_d_id>0? id=oCreateDoc_d_id:id=0;
                //flag=true,create a new folder;flag=false,modify folder name
                console.log(id);
                if(/[^\s]/.test(self.value)){
                    oCreateDocs.disabled=false;
                    JM.removeClass(tips_notNull,'d_show');
                    if(flag) {
                        blur_createFolder(self,doc_item,doc_pic_a,id,oCreateDocs,function () {
                            flag=false;
                        });
                    }else blur_modifyInfo(self,type);
                }
                else  {
                    oCreateDocs.disabled=true;
                    JM.addClass(tips_notNull,'d_show');
                }
            };

            //show delete btn
            doc_item.onmouseover=function (e) {
                v_show(doc_del,e);
            };
            doc_item.onmouseout=function (e) {
                v_n_show(doc_del,e);
            };
            doc_del.onclick=function (ev) {
                var ids=doc_item.getAttribute('data_id');
                delelte_operation(ev,ids,type,doc_item,doc_area_div);


            }
        });
    };


    //click folder
    function goToNextLay(ev) {
        var e=JM.getEvent(ev),
            doc_area_div=JM.getEle('.doc_area>div'),
            d_name=JM.getEles('.doc_name'),
            oCreateDocs=doc.getElementById('createDocs'),//the btn of creating a new folder
            d_n=JM.getEles('.doc_name'),// show pics and folders' area;
            d_pic_a=JM.getEles('.doc_pic > a'),
            id=this.getAttribute('data_id');

        JM.stopPropagation(e);

        //set data_id for a btn to create folders
        oCreateDocs.setAttribute('data_id',id);

        //if id exists,can send request and get the folder'datas
        if(id>0)
            getEachfolderInfo(id,function (data) {
            var doc=document,
                oPath=doc.getElementById('path'),
                oPath_ti=oPath.getElementsByTagName('i')[0],
                uploads=doc.getElementById('uploads'),
                n_f_d=data.data;

            //release click event
            JM.reverseIterator(d_pic_a,function (i,item) {
                item.onclick=null;
                d_n[i].onmouseover=null;
                d_n[i].onmouseout=null;
                d_name[i].onblur=null;
            });

            doc_area_div.innerHTML='';
            oPath_ti.innerHTML=n_f_d.fName;

            //show
            JM.addClass(oPath,'d_show');
            JM.addClass(uploads,'d_show');

            //click upload btn
            uploads.onclick=function (ev) {
                var e=JM.getEvent(ev),
                     modal=document.getElementsByClassName('modal')[0],
                    modal_div=JM.getEle('.modal>div');

                JM.stopPropagation(e);

                //create upload pics html
                createPicUploads(modal_div);

                var  fInput=doc.getElementById('upload_pic_files'),
                    upBtn=doc.getElementById('upload_btn'),
                    exit=doc.getElementById('exit'),
                    upload_obj=new JM_UPLOAD(fInput,upBtn);

                //initialize upload plug-in
                upload_obj.init();

                //set f_id for upload btn to send a param for uploading imgs
                upBtn.setAttribute('f_id',id);

                //show upload imgs modal
                JM.addClass(modal,'d_show');

                //click exit btn
                exit.onclick=function (e) {
                    var ev=JM.getEvent(e);
                        upload_obj_res=JSON.parse(upload_obj.getRes());

                    JM.stopPropagation(ev);
                    //show all children folders and imgs
                    JM.removeClass(modal,'d_show');

                    if(upload_obj_res.decode_url && upload_obj_res.info){
                       var resTxt=upload_obj_res.decode_url,
                           infos=upload_obj_res.info;
                        //show pic in the pic_area after uploading imgs completely
                        iniCImgs(resTxt,infos,doc_area_div);
                    }
                }

            };

            //initialize children folders and imgs
            initChildFolder(n_f_d,doc_area_div);

        });
    }

    //create new folders
    function createDoc(obj,fn,src) {
        var doc=document;
        //create elements
        var doc_item=doc.createElement('div'),

            doc_pic=doc.createElement('div'),
            doc_pic_a=doc.createElement('a'),
            doc_pic_img=doc.createElement('img'),

            doc_ti=doc.createElement('div'),
            doc_ti_input=doc.createElement('input'),

            doc_del=doc.createElement('i');

        //according to the src,judge the object is a folder or an image
        if(src){
            doc_pic_img.src=src;
            doc_item.setAttribute('data_type','img');
        } else {
            doc_pic_img.src='/images/folder.png';
            doc_item.setAttribute('data_type','folder');
        }

        //set attr
        doc_pic_img.setAttribute('data_c_name','doc_pic_img');
        doc_del.setAttribute('data_c_name','doc_del');

        //add className
        JM.addClass(doc_item,'doc_item');
        JM.addClass(doc_pic,'doc_pic');
        JM.addClass(doc_ti_input,'doc_name');
        JM.addClass(doc_ti,'doc_ti');
        JM.addClass(doc_del,'doc_del');

        //append child
        JM.addNodes(doc_pic_a,doc_pic_img);
        JM.addNodes(doc_pic,doc_pic_a);

        JM.addNodes(doc_ti,doc_ti_input);

        JM.addNodes(doc_item,doc_pic);
        JM.addNodes(doc_item,doc_ti);
        JM.addNodes(doc_item,doc_del);
        JM.addNodes(obj,doc_item);

        if(fn)fn(doc_item,doc_ti_input,doc_del,doc_pic_a);
    }


    //initialize --- create documents
    function init(data,obj,fn) {
        var datas=data,
            i=datas.length;
        for(;i--;){
            //create folders
            createDoc(obj);
        }
        if(fn)fn(data);
    }

    //iniCImgs
    function iniCImgs(data,infos,show_area) {
        var d=data;
        JM.reverseIterator(d,function (i,item) {
            var url='/baseurl'+item.url+'.txt';
            gar.ajax({
               'url':url,
                'method':'GET',
                'fn':function (result) {
                    createDoc(show_area,function (doc_item,doc_ti_input,doc_del) {
                        doc_item.setAttribute('data_id',infos[i].id);
                        doc_ti_input.setAttribute('data_id',infos[i].id);
                        //show delete btn
                        doc_item.onmouseover=function (e) {
                            v_show(doc_del,e);
                        };
                        //not show delete btn
                        doc_item.onmouseout=function (e) {
                            v_n_show(doc_del,e);
                        };
                        doc_ti_input.value=item.name;

                        doc_ti_input.onblur=function () {
                            var self=this,
                                type=doc_item.getAttribute('data_type');
                            blur_modifyInfo(self,type);
                        };
                        doc_del.onclick=function (ev) {
                            var id=doc_item.getAttribute('data_id');
                            if(id)
                                delelte_operation(ev,id,doc_item.getAttribute('data_type'),doc_item);
                            else JM.removeNodes(doc_area_div,doc_item);
                        }

                    },result);
                }

            });

        })
    }

    //init ---show folders and imgs
    function initChildFolder(data,show_area) {
        var datas=data,
            data_files=datas.files,
            data_imgs=datas.imgs,
            d_f_len=data_files.length,
            d_i_len=data_imgs.length;
        //if child folder data exists
        if(d_f_len){
            JM.reverseIterator(data_files,function (i,item) {
                var d_item=item;
                createDoc(show_area,function (items,ti_input,del,pic_a) {
                    var it=items,
                        input=ti_input,
                        de=del,
                        aT=pic_a;

                    aT.setAttribute('data_id',item.id);
                    input.setAttribute('data_id',item.id);
                    it.setAttribute('data_id',item.id);
                    input.value=item.fName;

                    //blur
                    input.onblur=function () {
                        var self=this,
                            type=it.getAttribute('data_type');

                        blur_modifyInfo(self,type);
                    };


                    //show delete btn
                    it.onmouseover=function (e) {
                        v_show(de,e);
                    };
                    //not show delete btn
                    it.onmouseout=function (e) {
                        v_n_show(de,e);
                    };

                    de.onclick=function (ev) {
                        var id=it.getAttribute('data_id'),
                            type=it.getAttribute('data_type');
                        delelte_operation(ev,id,type,it,doc_area_div);
                    };
                    //open folder
                    if(/folder/.test(it.getAttribute('data_type')))
                        aT.onclick=goToNextLay;
                })
            })
        }
        //if child imgs data exists
        if(d_i_len){
            JM.reverseIterator(data_imgs,function (i,item) {
                var d_i_item=item,
                    url='/baseurl'+d_i_item.url+'.txt';
                gar.ajax({
                    url:url,
                    method:'get',
                    fn:function (result) {
                        createDoc(show_area,function (items,ti_input,del,pic_a) {
                            var it=items,
                                input=ti_input,
                                de=del,
                                aT=pic_a;

                            aT.setAttribute('data_id',item.id);
                            input.setAttribute('data_id',item.id);
                            it.setAttribute('data_id',item.id);
                            input.value=item.iName;


                            //blur
                            input.onblur=function () {
                                var self=this,
                                    type=it.getAttribute('data_type');
                                blur_modifyInfo(self,type);
                            };

                            //show delete btn
                            it.onmouseover=function (e) {
                                v_show(de,e);
                            };
                            //not show delete btn
                            it.onmouseout=function (e) {
                                v_n_show(de,e);
                            };

                            //delete btn
                            de.onclick=function (ev) {
                                var id=it.getAttribute('data_id'),
                                    type=it.getAttribute('data_type');
                                delelte_operation(ev,id,type,it,doc_area_div);
                            };

                            //open folder
                            if(/folder/.test(it.getAttribute('data_type')))
                                aT.onclick=goToNextLay;
                        },result);
                    }
                })

            })
        }
}


    /*******************************operation******************************************/
    function delelte_operation(e,id,type,obj,doc_area_div) {
        var ev=JM.getEvent(e);
        JM.stopPropagation(ev);
        console.log(id);
        if(id>0){
            var data=JSON.stringify({
                'id':id,
                'type':type
            });
            deleteFolder(data,obj);
        } else JM.removeNodes(doc_area_div,obj)
    }

    //create new folder
    function blur_createFolder(self,item,aT,fId,oCreateDocs,callback) {
        var tips_notNull=JM.getEle('.tips>p'),
            tips_notSign=JM.getEles('.tips>p')[4];
        if(/[^\s]/.test((self.value))){
            JM.removeClass(tips_notNull,'d_show');
            if(/[!@#$%^&*()~`]/.test(self.value)) JM.addClass(tips_notSign,'d_show');
            else{
                oCreateDocs.disabled=false;
                //value exists,hidden the tip
                JM.removeClass(tips_notSign,'d_show');
                var pId=fId,
                    results=JSON.stringify({
                        'fName':self.value.trim(),
                        'pId':pId
                    });
                createNewRootFolder(self,item,aT,oCreateDocs,results,function (id) {
                    aT.setAttribute('data_id',id);
                    if(callback)callback();
                });
            }
        } else{
            //value is null,show the tip
            JM.addClass(tips_notNull,'d_show');
            oCreateDocs.disabled=true;
        }
    }

    //modify name
    /*
       self:input
       oCreateDocs:a btn to create a new folder
       type:folder/img
       item: doc_item
     */
    function blur_modifyInfo(self,type) {
        var tips_notNull=JM.getEle('.tips>p'),
            tips_notSign=JM.getEles('.tips>p')[4];
        if(/[^\s]/.test((self.value))){
            JM.removeClass(tips_notNull,'d_show');
            if(/[!@#$%^&*()~`]/.test(self.value)) JM.addClass(tips_notSign,'d_show');
            else{
                //value exists,hidden the tip
                JM.removeClass(tips_notSign,'d_show');
                var id2=self.getAttribute('data_id'),
                    r2=JSON.stringify({
                        'id':id2,
                        'name':self.value.trim(),
                        'type':type
                    });
                modifyFolderOrImgs(self,r2);
            }

        }else{
            //value is null,show the tip
            JM.addClass(tips_notNull,'d_show');
        }


    }

    //show
    function v_show(del,e) {
        var ev=JM.getEvent(e);
        JM.stopPropagation(ev);
        JM.addClass(del,'v_show');
    }

    //not show
    function v_n_show(del,e) {
        var ev=JM.getEvent(e);
        JM.stopPropagation(ev);
        JM.removeClass(del,'v_show');
    }
    /***********************************uploads imgs****************************************/
    function JM_UPLOAD(input,btn) {
        this.fileInput=input;
        this.uploadBtn=btn;
        this.uploadFiles=[];
        this.lastUploadFile=[];
        this.perUploadFile=[];
        this.zipUploadFiles=[];
        this.fileNum=0;
        this.resp='';
    }
    JM_UPLOAD.prototype={
        'constructor':JM_UPLOAD,
        'onselect':function (sFiles,files) {
            var f=files,
                showPic_area_div=JM.getEle('.showPic_area>div'),
                pExist=JM.getEle('.tip>:nth-child(1)'),
                uFail=JM.getEle('.tip>:nth-child(2)');
            showPic_area_div.innerHTML='';
            this.zipUploadFiles=[];
            if(pExist || uFail){
                JM.removeClass(pExist,'d_show');
                JM.removeClass(uFail,'d_show');
            }
            JM.inIterator(f,function (i,item) {
                //show pic in the picArea
                createPicItem(JM.createObjURL(item),item.name,function () {
                    var   pic_item=JM.getEles('.pic_item'),
                        len=pic_item.length;
                    (function iterator(i) {
                        if (i==len){
                            return;
                        }
                        pic_item[i].setAttribute('index',i);
                        iterator(++i);
                    })(0)
                });
            })
        },
        'onsucess':function (data) {
            var d=data,
                status=d.status,
                pic_name=JM.getEles('.pic_name'),
                span=JM.getEles('.pic_item span'),
                pExist=JM.getEle('.tip>:nth-child(1)');
            if(status){
                console.log(status);
                var  success_imgs=d.success_imgs;
                JM.inIterator(pic_name,function (i,item) {
                    if(JM.inArray(item.innerHTML,success_imgs)>-1)
                        JM.addClass({
                            'upload_success':span[i],
                            'v_show':span[i]
                        });
                    else {
                        JM.addClass({
                            'upload_false':span[i],
                            'v_show':span[i]
                        });
                        JM.addClass(pExist,'show');
                    }
                })
            }else{
                JM.inIterator(pic_name,function (i,item) {
                    if(JM.inArray(item.innerHTML,success_imgs)>-1)
                        JM.addClass({
                            'upload_success':span[i],
                            'v_show':span[i]
                        });
                    else {
                        JM.addClass({
                            'upload_false':span[i],
                            'v_show':span[i]
                        });
                        JM.addClass(pExist,'show');
                    }
                })
            }
        },
        'onfail':function (data) {
            console.log(data);
            var  uFail=JM.getEle('.tip>:nth-child(2)');
            JM.addClass(uFail,'show');
        },
        'ondelete':function (index) {
            this.fn_deleteFiles(index,function (file,surplusFiles) {
                console.info("当前删除了此文件：");
                console.info(file);
                console.info("当前剩余的文件：");
                console.info(surplusFiles);
            });
        },
        'getFile':function () {
            return this.zipUploadFiles;
        },
        'getRes':function () {
            return this.resp||JSON.stringify({});
        },
        /*major*/
        'fn_dragOver':function (e) {
            var ev=JM.getEvent(e);
            JM.stopPropagation(ev);
            JM.preventDefault(ev);
            return this;
        },
        'fn_filterFiles':function (results) {
            var re=results,
                arr=[];
            for(var i in re)
                if(/\d+/.test(i)) arr.push(re[i]);
            return arr;
        },
        'fn_getFiles':function (e) {
            var ev=JM.getEvent(e),
                self=this;
            this.fn_dragOver(e);
            var files=JM.getTarget(ev).files||ev.dataTransfer.files;
            self.lastUploadFile=this.uploadFiles;
            this.uploadFiles=this.uploadFiles.concat(this.fn_filterFiles(files));
            var tempFiles=[],
                beforeArr=[],
                nowArr=[];
            JM.inIterator(this.lastUploadFile,function (i,item) {
                beforeArr.push(item.name);
            });
            JM.inIterator(this.uploadFiles,function (i,item) {
                nowArr.push(item.name);
                // nowArr.reverse();
            });
            JM.inIterator(nowArr,function (i,item) {
                if(JM.inArray(item,beforeArr)<0) {
                    tempFiles.push(self.uploadFiles[i]);
                }
            });
            this.uploadFiles=tempFiles;
            this.fn_dealFiles();

            return true;
        },
        'fn_dealFiles':function () {
            var self=this,
                reader;
            JM.inIterator(this.uploadFiles,function (i,item) {
                item.index=self.fileNum;
                self.fileNum++;
            });
            var selectFiles=this.uploadFiles;
            this.perUploadFile=this.perUploadFile.concat(this.uploadFiles);
            this.uploadFiles=this.lastUploadFile.concat(this.uploadFiles);
            var f_len=this.uploadFiles.length;
            if(f_len>10){
                this.uploadFiles=this.uploadFiles.splice(0,10);
                f_len=10;
            }
            this.onselect(selectFiles,this.uploadFiles);

            (function iterator(i) {
                if(i==f_len){
                    return;
                }
                var f=self.uploadFiles[i],
                    type=f.type,
                    name=f.name,
                    reader=new FileReader();
                reader.readAsDataURL(f);
                reader.onload=function (e) {
                    var ev=JM.getEvent(e),
                        r=JM.getTarget(ev).result,
                        img=new Image();
                    img.src=r;
                    img.onload=function () {
                        var canvas=document.createElement('canvas'),
                            scale=1;
                        // if(this.width>350 ||this.height>400){
                        //     if(this.width>this.height) scale=350/this.width;
                        //     else scale=400/this.height;
                        // }
                        canvas.width=350;
                        canvas.height=400;
                        if(canvas.getContext){
                            var ctx=canvas.getContext('2d');
                            ctx.drawImage(this,0,0,canvas.width,canvas.height);
                            var newImgData=canvas.toDataURL(type,0.8);
                            self.zipUploadFiles.push({
                                'name':name,
                                'url':newImgData
                            })
                        }
                    }
                };
                iterator(++i);
            })(0);
            return this;
        },
        'fn_deleteFiles':function (deleteFilesIndex,callback) {
            var self=this,
                tempFile=[],
                delFile=self.perUploadFile[deleteFilesIndex];
            JM.inIterator(self.uploadFiles,function (i,item) {
                if(delFile!=item) tempFile.push(item);
            });
            this.uploadFiles=tempFile;
            if(callback) callback(delFile,self.uploadFiles);
            return true;
        },
        'fn_uploadFiles':function () {
            var self=this,
                len=self.uploadFiles.length,
                form_data=new FormData(),
                xhr=JM.createXHR();
            if(len>0){
                JM.inIterator(this.uploadFiles,function (i,item) {
                    form_data.append('pic',item);
                });
                form_data.append('zipImgs',JSON.stringify({
                    'file':self.zipUploadFiles
                }));
                var f_id=self.uploadBtn.getAttribute('f_id');
                form_data.append('f_id',f_id);
                JM.addHandler(xhr,'load',function () {
                    JM.inIterator(self.uploadFiles,function (i,item) {
                        self.fn_deleteFiles(item.index,false);
                    });
                    self.onsucess(JSON.parse(xhr.responseText));
                    self.resp=xhr.responseText;
                    if(self.uploadFiles.length==0)console.log('全部完成');
                },false);
                JM.addHandler(xhr,'error',function () {
                    console.log('错误');
                },false);
                xhr.open('POST','/uploadImgs_action',true);
                xhr.send(form_data);
            }
        },
        'init':function () {
            var self = this;
            if(self.fileInput){
                JM.addHandler(this.fileInput,'change',function (e) {
                    self.fn_getFiles(e);
                    var  pic_delete=JM.getEles('.pic_delete'),
                        pic_item=JM.getEles('.pic_item'),
                        parent_pic_item=JM.getEle('.showPic_area>div');
                    if(pic_delete){
                        JM.inIterator(pic_delete,function (i,item) {
                            JM.addHandler(item,'click',function (e) {
                                var ev=JM.getEvent(e),
                                    index=i;
                                JM.stopPropagation(ev);
                                var preNode_name=JM.getPreChild(item).innerHTML;
                                JM.inIterator(self.uploadFiles,function (i,item) {
                                    if(item.name==preNode_name) {
                                        self.ondelete(item.index);
                                        JM.removeNodes(parent_pic_item,pic_item[index]);
                                    };
                                })
                            })
                        });
                    }
                },false);
            }
            if(self.uploadBtn){
                JM.addHandler(this.uploadBtn,'click',function (e) {
                    JM.stopPropagation(JM.getEvent(e));
                    self.fn_uploadFiles();
                },false);
            }
        }
    };
    function createPicUploads(obj) {
        var  html='<div id="uploadPics">' +
            '<div class="upload_area">' +
            '<div>' +
            '<div>'+
            '<div class="chooseFile">上传照片</div>'+
            '<form enctype="multipart/form-data" id="up">' +
            '<input type="file" multiple="multiple" name="picture" id="upload_pic_files">'+
            '</form>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="infos_area clearfix">' +
            '<p>温馨提示：一次最多上传10张图片。</p>'+
            '<div>'+
            '<button type="button" id="upload_btn">开始上传</button>'+
            '</div>'+
            '</div>'+
            '<div class="showPic_area">'+
            '<div class="clearfix">'+
            '</div>'+
            '</div>'+
            '<div class="tip">'+
            '<p>图片已存在</p>'+
            '<p>图片上传失败</p>'+
            '</div>'+
            '</div>';
        obj.innerHTML=html;
    }
    function createPicItem(src,name,fn) {
        //get ele
        var doc=document,
            div=JM.getEle('.showPic_area>div'),

            //create eles
            oItem=doc.createElement('div'),
            oDiv=doc.createElement('div'),
            oImg=doc.createElement('img'),
            oSucess=doc.createElement('span'),
            oInfo=doc.createElement('div'),
            oName=doc.createElement('p'),
            oDel=doc.createElement('i');

        //set attrs
        oImg.src=src;
        oName.innerHTML=name;

        //add class
        JM.addClass(oItem,'pic_item');
        // JM.addClass(oSucess,'upload_success');
        JM.addClass({
            'pic_info':oInfo,
            'clearfix':oInfo
        });
        JM.addClass(oName,'pic_name');
        JM.addClass(oDel,'pic_delete');

        JM.addHandler(oItem,'mouseover',function () {
            JM.addClass(oInfo,'v_show');
        },false);
        JM.addHandler(oItem,'mouseout',function () {
            JM.removeClass(oInfo,'v_show');
        },false);

        //append child
        JM.addNodes(oDiv,oImg);
        JM.addNodes(oInfo,oName);
        JM.addNodes(oInfo,oDel);
        JM.addNodes(oItem,oDiv);
        JM.addNodes(oItem,oSucess);
        JM.addNodes(oItem,oInfo);
        JM.addNodes(div,oItem);

        if(fn)fn();
    };

    /*****************************************ajax*********************************************/
    //ajax---get data
    function getData(url,callback) {
        JM.ajax(url,'get',true,null,function (xhr) {
            var data=JSON.parse(xhr.responseText);
            if(callback)callback(data);
        });
    };

    //ajax-----create new root folders
    function createNewRootFolder(inp,item,aT,oCreateDocs,results,callback) {
        JM.ajax('/addFolder_action','post',true,results,function (xhr) {
            var obj=JSON.parse(xhr.responseText),
                id=obj.newId,//new folder id
                tip_1=JM.getEles('.tips>p')[1];
            console.log(obj);
            inp.setAttribute('data_id',id);//data_id:a sign marking the id of the current folder
            item.setAttribute('data_id',id);//data_id:a sign marking the id of the current folder
            aT.setAttribute('data_id',id);//data_id:a sign marking the id of the current folder
            if(obj.status){
                if(callback)callback(id);
                oCreateDocs.disabled=false;
                JM.removeClass(tip_1,'d_show');
            }else{
                JM.addClass(tip_1,'d_show');
                oCreateDocs.disabled=true;
            }
        });
    };

    //ajax------modify folder
    /*
        inp:input
        oCreateDocs: a btn to create a new folder
        data:data
        item:doc_item
     */
    function modifyFolderOrImgs(inp,data) {
        JM.ajax('/modifyFolderOrImgs_action','post',true, data,function (xhr) {
            var obj=JSON.parse(xhr.responseText),
                tip_1=JM.getEles('.tips>p')[1];
            if(obj.status){
                JM.removeClass(tip_1,'d_show');
                inp.setAttribute('data_name',JSON.parse(data).fName);//update data_name
            }else{
                if(obj.name!==inp.value)
                    JM.addClass(tip_1,'d_show');

            }
        });
    };

    //ajax------delete folder
    function deleteFolder(data,item){
        JM.ajax('/deleteFolderAndImg_action','post',true,data,function (xhr) {
            var  oDoc_area_div=JM.getEle('#doc_area > div'),//the area to show pics and folders
                r=JSON.parse(xhr.responseText).status;
            if(r)
                JM.removeNodes(oDoc_area_div,item);
            else
                console.log('删除文件夹失败');
        })
    };

    //get each folder data
    function getEachfolderInfo(id,callback) {
        var data=JSON.stringify({
            'id':id
        });
        JM.ajax('/getEachfolderInfo_action','post',true,data,function (xhr) {
            var d=JSON.parse(xhr.responseText);
            if(callback)callback(d);
        });
    };
})();


