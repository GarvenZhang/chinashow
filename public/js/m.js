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
(function () {

    var doc=document,
        doc_area_div=JM.getEle('.doc_area>div'),// show pics and folders' area
        oCreateDocs=doc.getElementById('createDocs');//the btn of creating a new folder
     getData('/getAllRootFolders_action',function (data) {
            var r_f_d=data.data,
                r_f_d_len=r_f_d.length;//rootFolderData's length;
            if(r_f_d_len){
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
                        d_item[i].setAttribute('data_p_id',item.parentId);
                        d_name[i].value=item.fName;

                        var type=d_item[i].getAttribute('data_type');

                        //open new folder
                        if(/folder/.test(d_item[i].getAttribute('data_type')))
                            d_pic_a[i].onclick=goToNextLay;

                        //blur
                        d_name[i].onblur=function () {
                            var self=this;
                            blur_modifyInfo(self,oCreateDocs,type);
                        };

                        //show delete btn
                        d_item[i].onmouseover=function (e) {
                            v_show(d_del[i],e);
                        };
                        d_item[i].onmouseout=function (e) {
                            v_n_show(d_del[i],e);
                        };
                    });
                });
            }
        });//get data from backstage supporter

    JM.addHandler(oCreateDocs,'click',function (e) {
        var ev=JM.getEvent(e),
            id=this.getAttribute('data_id');
        ev.stopPropagation(ev);
        pId=id?id:0;
        createDoc(doc_area_div,function (doc_item,doc_ti_input,doc_del,doc_pic_a) {
            var flag=true,
                type=doc_item.getAttribute('data_type');
            //open new folder
            if(/folder/.test(type))
                doc_pic_a.onclick=goToNextLay;
            //blur
            doc_ti_input.onblur=function () {
                var self=this,
                    oCreateDoc_d_id=oCreateDocs.getAttribute('data_id'),
                    id=0;
               oCreateDoc_d_id? id=oCreateDoc_d_id:id=0;

                //flag=true,create a new folder;flag=false,modify folder name
                if(flag) {
                    blur_createFolder(self,doc_item,doc_pic_a,id,oCreateDocs);
                    flag=false;
                }else blur_modifyInfo(self,oCreateDocs,type);
            };

            //show delete btn
            doc_item.onmouseover=function (e) {
                v_show(doc_del,e);
            };
            doc_item.onmouseout=function (e) {
                v_n_show(doc_del,e);
            };
        });
    });

function v_show(del,e) {
    var ev=JM.getEvent(e);
    JM.stopPropagation(ev);
    JM.addClass(del,'v_show');
}

function v_n_show(del,e) {
    var ev=JM.getEvent(e);
    JM.stopPropagation(ev);
    JM.removeClass(del,'v_show');
}

//click folder
function goToNextLay(ev) {
    var e=JM.getEvent(ev),
        doc_area_div=JM.getEle('.doc_area>div'),
        d_name=JM.getEles('.doc_name'),
        oCreateDocs=doc.getElementById('createDocs'),//the btn of creating a new folder
        d_n=JM.getEles('.doc_name');// show pics and folders' area;
    JM.stopPropagation(e);
    var d_pic_a=JM.getEles('.doc_pic > a');
        id=this.getAttribute('data_id');
    oCreateDocs.setAttribute('data_id',id);
      getEachfolderInfo(id,function (data) {
            var doc=document,
                oPath=doc.getElementById('path'),
                oPath_ti=oPath.getElementsByTagName('i')[0],
                uploads=doc.getElementById('uploads'),
                n_f_d=data.data,
                f_file=n_f_d.files,
                f_f_len=f_file.length;
            //release click event
            JM.reverseIterator(d_pic_a,function (i,item) {
                item.onclick=null;
                d_n[i].onmouseover=null;
                d_n[i].onmouseout=null;
                d_name[i].onblur=null;
            });

            doc_area_div.innerHTML='';
            oPath_ti.innerHTML=n_f_d.fName;


          //init---show children folders and imgs
          initChildFolder(id,doc_area_div);

          //show
          JM.addClass(oPath,'d_show');
          JM.addClass(uploads,'d_show');

          uploads.onclick=function (ev) {
              var e=JM.getEvent(ev);
              JM.stopPropagation(e);
              var  modal=document.getElementsByClassName('modal')[0],
                  modal_div=JM.getEle('.modal>div');
              createPicUploads(modal_div);
              var  fInput=doc.getElementById('upload_pic_files'),
                  upBtn=doc.getElementById('upload_btn'),
                  exit=doc.getElementById('exit'),
                  upload_obj=new JM_UPLOAD(fInput,upBtn);

              upload_obj.init();

              //set f_id for upload btn to send a param for uploading imgs
              upBtn.setAttribute('f_id',id);

              JM.addClass(modal,'d_show');

              //click exit btn
              exit.onclick=function (e) {
                  var ev=JM.getEvent(e),
                      resTxt=JSON.parse(upload_obj.getRes()).decode_url;

                  console.log(resTxt);
                  JM.stopPropagation(ev);
                  //show all children folders and imgs
                  JM.removeClass(modal,'d_show');
                  iniCImgs(resTxt,doc_area_div);
              }

          };

            if(f_f_len){

                init(f_file,doc_area_div,function (data) {

                    var c_d=data,
                        d_item=JM.getEles('.doc_item'),
                        d_name=JM.getEles('.doc_name'),
                        d_del=JM.getEles('.doc_del'),
                        d_pic_a=JM.getEles('.doc_pic > a');

                    JM.reverseIterator(c_d,function (i,item) {

                        d_pic_a[i].setAttribute('data_id',item.id);
                        d_name[i].setAttribute('data_id',item.id);
                        d_item[i].setAttribute('data_p_id',item.parentId);
                        d_name[i].value=item.fName;

                        //show all children folders and imgs

                        //blur
                        d_name[i].onblur=function () {
                            var self=this,
                                id=self.getAttribute('data_id');
                            blur_operation(self,false,d_item[i],id);
                        };


                        //show delete btn
                        d_item[i].onmouseover=function (e) {
                            v_show(d_del[i],e);
                        };
                        //not show delete btn
                        d_item[i].onmouseout=function (e) {
                            v_n_show(d_del[i],e);
                        };
                        //open folder
                        if(/folder/.test(d_item[i].getAttribute('data_type')))
                            d_pic_a[i].onclick=goToNextLay;
                    })
                })
            }
        });
}


})();



function carryOutDeal(fId,status,callback) {
    deal_item(fId,status,function (name,doc_item,aT,del) {
        if(callback)callback(name,doc_item,aT,del);
    });
};

function deal_item(fId,status,callback) {
    var doc_item=JM.getEles('.doc_item'),
        doc_pic_a=JM.getEles('.doc_pic>a'),
        doc_name=JM.getEles('.doc_name'),
        doc_del=JM.getEles('.doc_del');
    JM.reverseIterator(doc_item,function (i,item) {
        deal(item,doc_del[i],doc_name[i],doc_pic_a[i],fId,status);
    });
    if(callback)callback(doc_name,doc_item,doc_pic_a,doc_del);
}

function deal(item,del,input,aT,fId,status) {
    var oCreateDocs=document.getElementById('createDocs'),
        data_type=item.getAttribute('data_type');
    JM.addHandler(item,'mouseover',function (ev) {
        v_show_operation(ev,del);
    },false);
    JM.addHandler(item,'mouseout',function (ev) {
        v_notShow_operation(ev,del);
    },false);
    JM.addHandler(input,'blur',function () {
        var self=this,
            id;
        fId===0?id=0:id=oCreateDocs.getAttribute('data_id');
        console.log(id);
        blur_operation(self,status,item,id);
    });
    JM.addHandler(del,'click',function (ev) {
        var self=this,
            parentNode=self.parentNode,
            id=parentNode.getAttribute('data_id'),
            type=parentNode.getAttribute('data_type');
        delelte_operation(ev,id,type,parentNode);
    });
    if(/folder/.test(data_type))
        JM.addHandler(aT,'click',function (ev) {
        var e=JM.getEvent(ev),
            doc=document,
            path=doc.getElementById('path'),
            fold_name=path.getElementsByTagName('i')[0],
            show_area=JM.getEle('.doc_area>div'),
            uploads=doc.getElementById('uploads'),
            f_id=input.getAttribute('data_id'),
            name=input.value;

        JM.stopPropagation(e);

        //set data_id for create item btn for knowing new folder belongs to which folder
        oCreateDocs.setAttribute('data_id',f_id);

        //set title value
        fold_name.innerHTML=name;
        //clear all thing in the show_area
        show_area.innerHTML='';

        //show
        JM.addClass(path,'d_show');
        JM.addClass(uploads,'d_show');

        //show pic and folders
        initChildFolder(f_id,show_area);
        //click uploads btn
        JM.addHandler(uploads,'click',function (ev) {
            var e=JM.getEvent(ev),
                modal=document.getElementsByClassName('modal')[0],
                modal_div=JM.getEle('.modal>div');
            JM.stopPropagation(e);
            //create uploads area
            createPicUploads(modal_div);
            //show uploads area
            JM.addClass(modal,'d_show');
            //init uploads
            var fInput=document.getElementById('upload_pic_files'),
                upBtn=document.getElementById('upload_btn');
             upBtn.setAttribute('f_id',f_id);
            var  obj=new JM_UPLOAD(fInput,upBtn);
            obj.init();

            //click exit btn
            JM.addHandler(exit,'click',function (e) {
                var ev=JM.getEvent(e);
                JM.stopPropagation(ev);
                JM.removeClass(modal,'d_show');
                if(f_id){
                    //update datas in the show area
                    console.log(f_id);
                    initChildFolder(f_id,show_area);
                }
            },false);
        })

        deal(item,del,input,aT,fId,status);
    })
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
        doc_ti_form=doc.createElement('form'),
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
    doc_ti_form.setAttribute('enctype','application/x-www-form-urlencoded');
    //add className
    JM.addClass(doc_item,'doc_item');
    JM.addClass(doc_pic,'doc_pic');
    JM.addClass(doc_ti_input,'doc_name');
    JM.addClass(doc_ti,'doc_ti');
    JM.addClass(doc_del,'doc_del');

    //append child
    JM.addNodes(doc_pic_a,doc_pic_img);
    JM.addNodes(doc_pic,doc_pic_a);

    JM.addNodes(doc_ti_form,doc_ti_input);
    JM.addNodes(doc_ti,doc_ti_form);

    JM.addNodes(doc_item,doc_pic);
    JM.addNodes(doc_item,doc_ti);
    JM.addNodes(doc_item,doc_del);
    JM.addNodes(obj,doc_item);

    if(fn)fn(doc_item,doc_ti_input,doc_del,doc_pic_a);
};

//initialize --- create documents
function init(data,obj,fn) {
    var datas=data,
        i=datas.length;
    for(;i--;){
        //create folders
        createDoc(obj);
    }
    if(fn)fn(data);
};



//iniCImgs
function iniCImgs(data,show_area) {
   var d=data;
    JM.reverseIterator(d,function (i,item) {
        var url=decodeURIComponent(item.url);
        createDoc(show_area,function (doc_item,doc_ti_input,doc_del,doc_pic_a) {
            //show delete btn
            doc_item.onmouseover=function (e) {
                v_show(d_del[i],e);
            };
            //not show delete btn
            doc_item.onmouseout=function (e) {
                v_n_show(d_del[i],e);
            };
            doc_ti_input.value=item.name;

            doc_ti_input.onblur=function () {
                var self=this,
                    id=self.getAttribute('data_id');
                blur_operation(self,false,doc_item,id);
            };
        },url);
    })
}

function initChildFolder(f_Id,show_area) {
    getEachfolderInfo(f_Id,function (data) {
        console.log(data);
            var datas=data.data,
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
                        input=ti_input;
                    it.setAttribute('data_id',d_item.id);
                    input.value=d_item.fName;
                    console.log(1111);
                })
            })
        }
        //if child imgs data exists
        if(d_i_len){
            JM.reverseIterator(data_imgs,function (i,item) {
                var d_i_item=item;
                createDoc(show_area,function (items,ti_input,del,pic_a) {
                    var it=items,
                        input=ti_input,
                        aT=pic_a,
                        de=del,
                        id=d_i_item.id;
                    //set data_id
                    it.setAttribute('data_id',id);
                    input.setAttribute('data_id',id);
                    input.value=d_i_item.iName;
                    //deal item
                    deal(it,de,input,aT,id,false);
                },d_i_item.url);

            })
        }
    });

}

// function initChildFolder(f_Id,show_area) {
//     var datas=getEachfolderInfo(f_Id).data,
//         oCreateDocs=document.getElementById('createDocs'),
//         data_files=datas.files,
//         data_imgs=datas.imgs,
//         d_f_len=data_files.length,
//         d_i_len=datas.imgs.length,
//         f_doc_name=JM.getEles('.doc_item[data_type=\"folder\"] .doc_name'),
//         p_doc_name=JM.getEles('.doc_item[data_type=\"img\"] .doc_name'),
//         name=[],
//         pic=[];
//     //if child folder data exists
//     if(d_f_len){
//         JM.reverseIterator(f_doc_name,function (i,item) {
//             var inn=item.value;
//             name.push(inn);
//         });
//         JM.reverseIterator(data_files,function (i,item) {
//             var d_item=item;
//             //find among items which exist,can't find,show the item
//             if(JM.inArray(item.fName,name)<0){
//                 createDoc(show_area,function (items,ti_input,del,pic_a) {
//                     var it=items,
//                         input=ti_input;
//                     it.setAttribute('data_id',d_item.id);
//                     input.value=d_item.fName;
//                 })
//             }
//         })
//     }
//     //if child imgs data exists
//     if(d_i_len){
//         JM.reverseIterator(p_doc_name,function (i,item) {
//             var inn=item.value;
//             pic.push(inn);
//         });
//         JM.reverseIterator(data_imgs,function (i,item) {
//            var d_i_item=item;
//
//             //find among items which exist,can't find,show the item
//            if(JM.inArray(d_i_item.iName,pic)<0)
//                createDoc(show_area,function (items,ti_input,del,pic_a) {
//                    var it=items,
//                        input=ti_input,
//                        aT=pic_a,
//                        de=del,
//                        id=d_i_item.id;
//                    //set data_id
//                    it.setAttribute('data_id',id);
//                    input.setAttribute('data_id',id);
//                    input.value=d_i_item.iName;
//                    JM.addHandler(it,'mouseover',function (ev) {
//                        v_show_operation(ev,de);
//                    },false);
//                    JM.addHandler(it,'mouseout',function (ev) {
//                         v_notShow_operation(ev,de);
//                    },false);
//                    JM.addHandler(input,'blur',function () {
//                        var self=this;
//                        blur_operation(self,false,it);
//                    },false);
//                    JM.addHandler(de,'click',function (e) {
//                        var type=it.getAttribute('data_type');
//                             console.log(type);
//                        delelte_operation(e,id,type,it);
//                    },false);
//                    JM.addHandler(aT,'click',function (e) {
//                        var ev=JM.getEvent(e),
//                            f_id=input.getAttribute('data_id'),
//                            name=input.value,
//                            path=document.getElementById('path'),
//                            fold_name=path.getElementsByTagName('a')[1],
//                            show_area=JM.getEle('.doc_area>div'),
//                            uploads=document.getElementById('uploads');
//                        JM.stopPropagation(ev);
//                        oCreateDocs.setAttribute('data_id',f_id);
//                        fold_name.innerHTML=name;
//                        show_area.innerHTML='';
//                        //show
//                        JM.addClass(path,'d_show');
//                        JM.addClass(uploads,'d_show');
//
//                        // initChildFolder(f_id,show_area);
//
//                        //click uploads btn
//                        // JM.addHandler(uploads,'click',function (ev) {
//                        //     var e=JM.getEvent(ev),
//                        //         modal=document.getElementsByClassName('modal')[0],
//                        //         modal_div=JM.getEle('.modal>div');
//                        //     JM.stopPropagation(e);
//                        //     //create uploads area
//                        //     createPicUploads(modal_div);
//                        //     //show uploads area
//                        //     JM.addClass(modal,'d_show');
//                        //     //init uploads
//                        //     var fInput=document.getElementById('upload_pic_files'),
//                        //         upBtn=document.getElementById('upload_btn'),
//                        //         obj=new JM_UPLOAD(fInput,upBtn);
//                        //     obj.init();
//                        //     JM.addHandler(exit,'click',function (e) {
//                        //         var ev=JM.getEvent(e);
//                        //         JM.stopPropagation(ev);
//                        //         JM.removeClass(modal,'d_show');
//                        //         if(f_id){
//                        //             initChildFolder(f_id,show_area);
//                        //         }
//                        //         console.log(f_id);
//                        //     },false);
//                        // })
//                    },false);
//                },item.url);
//         })
//     }
// }

/*******************************operation******************************************/
function delelte_operation(e,id,type,obj) {
    var ev=JM.getEvent(e),
        data=JSON.stringify({
            'id':id,
            'type':type
        });
    JM.stopPropagation(ev);
    deleteFolder(data,obj);
}

function blur_createFolder(self,item,aT,fId,oCreateDocs) {
    if(/[^\s]/.test((self.value))){
        var pId=fId,
            results=JSON.stringify({
                'fName':self.value.trim(),
                'pId':pId
            });
        createNewRootFolder(self,item,aT,oCreateDocs,results,function (id) {
            aT.setAttribute('data_id',id);
        });
    }
}
function blur_modifyInfo(self,oCreateDocs,type) {
    if(/[^\s]/.test((self.value))){
        var id2=self.getAttribute('data_id'),
            r2=JSON.stringify({
                'id':id2,
                'name':self.value.trim(),
                'type':type
            });
        modifyFolderOrImgs(self,oCreateDocs,r2);
    }
}

function blur_operation(self,status,item,fId,aT,flag){
    var type=item.getAttribute('data_type'),
        oCreateDocs=document.getElementById('createDocs');
    if(status){
        if(/[^\s]/.test((self.value))){
            //flag:true ---create folders
            if(flag){
                var pId=fId,
                    results=JSON.stringify({
                        'fName':self.value.trim(),
                        'pId':pId
                    });
                createNewRootFolder(self,item,aT,oCreateDocs,results,function (id) {
                    flag=false;
                    aT.setAttribute('data_id',id);
                });
                console.log(flag);
            }else{ //flag:false ----- modify folder
                var id=self.getAttribute('data_id'),
                    r=JSON.stringify({
                        'id':id,
                        'type':type,
                        'fName':self.value.trim()
                    });
                modifyFolderOrImgs(self,oCreateDocs,r);
                console.log('dsadadsdd');
            }
        }
    }else{
        if(/[^\s]/.test((self.value))){
            var id2=self.getAttribute('data_id'),
                r2=JSON.stringify({
                    'id':id2,
                    'name':self.value.trim(),
                    'type':type
                });
            modifyFolderOrImgs(self,oCreateDocs,r2);
        }
    }
};
function v_show_operation(ev,de) {
    var e=JM.getEvent(ev);
    JM.stopPropagation(e);
    JM.addClass(de,'v_show');
};
function v_notShow_operation(ev,de) {
    var e=JM.getEvent(ev);
    JM.stopPropagation(e);
    JM.removeClass(de,'v_show');
};
/***********************************uploads imgs****************************************/
function JM_UPLOAD(input,btn) {
    this.fileInput=input;
    this.uploadBtn=btn;
    this.uploadFiles=[];
    this.lastUploadFile=[];
    this.perUploadFile=[];
    this.zipUploadFiles={};
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
        this.zipUploadFiles={};
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
        return this.resp;
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
                        var newImgData=canvas.toDataURL(type,0.8),
                            baseUrl=newImgData.replace(/^data:image\/\w+;base64,/,'');
                        self.zipUploadFiles[name]=baseUrl;
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
            form_data.append('zipImgs',JSON.stringify(self.zipUploadFiles));
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
            xhr.open('POST','/uploadImgs_action',false);
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
    JM.ajax(url,'get',false,null,function (xhr) {
       var data=JSON.parse(xhr.responseText);
        if(callback)callback(data);
    });
}

//ajax-----create new root folders
function createNewRootFolder(inp,item,aT,oCreateDocs,results,callback) {
    JM.ajax('/addFolder_action','post',false,results,function (xhr) {
        var obj=JSON.parse(xhr.responseText),
            id=obj.newId,//new folder id
            pId=obj.pId, // new folder's parent id
            fName=obj.fName,//new folder name
            tip_1=JM.getEles('.tips>p')[1];
        inp.setAttribute('data_pId',pId);//data_id:a sign marking the id of the current folder
        inp.setAttribute('data_id',id);//data_id:a sign marking the id of the current folder
        item.setAttribute('data_id',id);//data_id:a sign marking the id of the current folder
        aT.setAttribute('data_id',id);//data_id:a sign marking the id of the current folder
        inp.setAttribute('data_name',fName);//data_name:a sign marking the name of the current folder
        if(obj.status){
            if(callback)callback(id);
            oCreateDocs.disabled=false;
            JM.removeClass(tip_1,'show');
        }else{
            JM.addClass(tip_1,'show');
            oCreateDocs.disabled=true;
        }
    });
};
//ajax------modify folder
function modifyFolderOrImgs(inp,oCreateDocs,r) {
    JM.ajax('/modifyFolderOrImgs_action','post',false, r,function (xhr) {
        var obj=JSON.parse(xhr.responseText),
            tip_1=JM.getEles('.tips>p')[1];
        if(obj.status){
            JM.removeClass(tip_1,'show');
            oCreateDocs.disabled=false;
            inp.setAttribute('data_name',JSON.parse(r).fName);//update data_name
            console.log(1);
        }else{
            oCreateDocs.disabled=true;
            JM.addClass(tip_1,'show');
        }
    });
}

//ajax------delete folder
function deleteFolder(data,self){
    JM.ajax('/deleteFolderAndImg_action','post',false,data,function (xhr) {
        var  oDoc_area_div=JM.getEle('#doc_area > div'),//the area to show pics and folders
            r=JSON.parse(xhr.responseText).status;
        if(!r)console.log('删除文件夹失败');
        JM.removeNodes(oDoc_area_div,self);
    })
};

//ajax---getImgs
function getImgs(id) {
    var data=JSON.stringify({
        'fId':id
    });
    JM.ajax('/getimgs_action','post',false,data,function (xhr) {
        data=JSON.parse(xhr.responseText);
    });
    return data;
};
//get each folder data
function getEachfolderInfo(id,callback) {
    var data=JSON.stringify({
        'id':id
    });
    JM.ajax('/getEachfolderInfo_action','post',false,data,function (xhr) {
        var d=JSON.parse(xhr.responseText);
        if(callback)callback(d);
    });
};