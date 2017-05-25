/**
 * Created by jm_hello on 2017/3/14.
 */
var mysql=require('mysql'),
    formidable=require('formidable'),
    file=require('./file.js'),
    path=require('path'),
    fs=require('fs');
var pool=mysql.createPool({
    'host':'localhost',
    'port':3306,
    'database':'china',
    'user':'root',
    'password':'hellojm'
});



/*register*/
exports.register=function (req,res) {
  pool.getConnection(function (err,connection) {
      if(err) console.log('连接数据库失败！');
      else{
          console.log('连接数据库成功!');
          connection.query('SELECT MAX(id) AS MAX_ID FROM ??',['user'],function (err,results) {
             if(err) console.log('查询表失败！'+err);
              else{
                  var MAX_ID=results[0].MAX_ID;
                 req.on('data',function (data) {
                     var d=JSON.parse(data.toString()),
                         name=d.name,
                         psw=d.password,
                         pNum=d.phoneNum;
                     connection.query('SELECT ? FROM ?? WHERE ??=?',['name','user','name',name],function (err,results) {
                         if(err) console.log('查询表失败！'+err);
                         else{
                             console.log(results);

                             var r=results.length;
                             if(r){
                                 res.send({
                                     'status':false
                                 })
                             }else{
                                 connection.query('INSERT INTO ?? set id=?,name=?,password=?,phone=?',['user',++MAX_ID,name,psw,pNum],function (err,results) {
                                     if(err) console.log('插入表失败:'+err);
                                     else{
                                         res.send({
                                             'status':true
                                         })
                                     }
                                 })

                             }
                         }
                     });


                 })
             }
          });

      }
  })
};

/*login*/
exports.login=function (req,res) {
  pool.getConnection(function (err,connection) {
      if(err) console.log('连接数据库失败！'+err);
      else{
          req.on('data',function (data) {
             var d=JSON.parse(data.toString()),
                 name=d.name,
                 psw=d.password;
              connection.query('SELECT ??,?? FROM ?? WHERE ??=? AND ??=?',['name','password','user','name',name,'password',psw],function (err,results) {
                 if(err) {
                     console.log('查询表失败！'+err);
                 }
                  else{
                      var r=results.length;

                     if(r) {
                         connection.query('SELECT name from getMain WHERE id=1',function (err,results) {
                             if(err) console.log('查询表失败！'+err);
                             else{
                                 var name=results[0].name,
                                     oldPath=path.normalize(__dirname+'/../public/'+name),
                                     ran_num=parseInt(Math.random()*99999+100000).toString()+'.html';
                                 connection.query('UPDATE getMain set name=?',[ran_num],function (err,results) {
                                     if(err) console.log('更新表失败！'+err);
                                     else{
                                         console.log('更新表成功');
                                         var newPath=path.normalize(__dirname+'/../public/'+ran_num);
                                         fs.rename(oldPath,newPath,function (err) {
                                             if(err) console.log('更改名失败！')
                                             else{
                                                 console.log('更改名成功！');
                                                 res.send({
                                                     'name':ran_num,
                                                     'status': true
                                                 });
                                             }
                                         })
                                     }
                                 })
                                     .on('end',function () {
                                         console.log('本次数据库操作完毕！');
                                         try{connection.release();}catch (e){};
                                     });
                             }
                         })
                             .on('end',function () {
                                 console.log('本次数据库操作完毕！');
                                 try{connection.release();}catch (e){};
                             });
                     }
                     else {
                         res.send({
                             'status':false
                         });

                     }
                 }
              })
                  .on('end',function () {
                      console.log('本次数据库操作完毕！');
                      try{connection.release();}catch (e){};
                  });
          });
      }
  })
};

/*modifyPsw*/
exports.modifyPsw=function (req,res) {
  pool.getConnection(function (err,connection) {
      if(err) console.log('连接数据库失败！'+err);
      else{
          req.on('data',function (data) {
                var d=JSON.parse(data.toString()),
                    name=d.name,
                    psw=d.password;
              connection.query('UPDATE ?? SET ??=? WHERE ??=?',['user','password',psw,'name',name],function (err,results) {
                  if(err) {
                      console.log('更新表失败！'+err);
                  }
                  else{
                     var affectRows=results.affectedRows;
                      if(affectRows){
                          res.send({
                              'status':true
                          })
                      }else{
                          res.send({
                              'status':false
                          })
                      }
                  }
              })
                  .on('end',function () {
                      console.log('本次数据库操作完毕！');
                      try{connection.release();}catch (e){};
                  });
          });
      }
  })
};
/*directory*/
//addNewFolder
exports.addNewFolder=function (req,res) {
    pool.getConnection(function (err,connection) {
        if(err)console.log('连接数据库失败！'+err);
        else{
            console.log('连接数据库成功！');
            connection.query('SELECT MAX(id) AS max_id FROM file',function (err,result) {
                if(err) {
                    console.log('查询表失败！'+err);
                }
                else{
                    console.log('查询表成功!');
                    var id=result[0].max_id;
                    //id
                    if(id)++id;
                    else id=1;
                   req.on('data',function (data) {
                       var datas=JSON.parse(data.toString()),
                           pId=datas.pId,
                           fName=datas.fName;
                       if(pId==0){
                           //root folder
                           connection.query('SELECT id,fName,parentId FROM file WHERE fName=? AND id=parentId',[fName],function (err,results) {
                               if(err) {
                                   console.log('查询表失败！'+err);
                               }
                               else{
                                   console.log('查询表成功');
                                   var len=results.length;
                                   if(len==0) {
                                       connection.query('INSERT INTO file set id=?,fName=?,parentId=?',[id,datas.fName,id],function (err,results) {
                                           if(err) {
                                               console.log('插入表失败！'+err);
                                           } else{
                                               console.log('插入表成功！');
                                               res.send({
                                                   'newId':id,
                                                   'pId':id,
                                                   'fName':fName,
                                                   'status':true
                                               })
                                           }
                                       })
                                           .on('end',function () {
                                               console.log('本次数据库操作完毕！');
                                               try{connection.release();}catch (e){};
                                           });
                                   }
                                   else{
                                       res.send({
                                           'status':false
                                       })
                                   }
                               }
                           })
                               .on('end',function () {
                                   console.log('本次数据库操作完毕！');
                                   try{connection.release();}catch (e){};
                               });
                       }else{
                           connection.query('SELECT id,fName,parentId FROM file WHERE fName=? AND parentId=? AND parentId!=id',[fName,pId],function (err,results) {
                               if(err) {
                                   console.log('查询表失败！'+err);
                               }
                               else{
                                   console.log('查询表成功');
                                   var len=results.length;
                                   if(len==0) {
                                       connection.query('INSERT INTO file set id=?,fName=?,parentId=?',[id,fName,pId],function (err,results) {
                                           if(err) {
                                               console.log('插入表失败！'+err);
                                           }
                                           else{
                                               console.log('插入表成功！');
                                               res.send({
                                                   'newId':id,
                                                   'pId':pId,
                                                   'status':true
                                               })
                                           }
                                       })
                                           .on('end',function () {
                                               console.log('本次数据库操作完毕！');
                                               try{connection.release();}catch (e){};
                                           });;
                                   }
                                   else{
                                       res.send({
                                           'status':false
                                       })
                                   }
                               }
                           })
                               .on('end',function () {
                                   console.log('本次数据库操作完毕！');
                                   try{connection.release();}catch (e){};
                               });
                       }

                   });
                }
            })
                .on('end',function () {
                    console.log('本次数据库操作完毕！');
                    try{connection.release();}catch (e){};
                });
        }
    });
};

//modifyFolderInfo
exports.modifyFolderOrImgs=function (req,res) {
    pool.getConnection(function (err, connection) {
        if(err) console.log('连接数据库失败！'+err);
        else{
            console.log('连接数据库成功！');
            req.on('data',function (data) {
                var datas=JSON.parse(data.toString()),
                    id=datas.id,
                    fName=datas.name,
                    type=datas.type;
                if(/folder/.test(type))
                    connection.query('SELECT ?? ,?? FROM ?? WHERE ??=?',['parentId','fName','file','id',id],function (err,results) {
                        if(err){
                            console.log('查询file表失败!'+err);
                        }
                        else{
                            var pId=results[0].parentId,
                                sign_name=results[0].fName;
                            //if id equals to pId,the folder is the folder in the root directory
                            if(id==pId){
                                //root folders
                                connection.query('SELECT ?? FROM ?? WHERE ??=?? AND ??=?',['fName','file','id','parentId','fName',fName],function (err,results) {
                                    if(err){
                                        console.log('查询表file失败！'+err);
                                    }
                                    else{
                                        var l1=results.length;
                                        //if l1 is 0,it means there is no same fName in the database
                                        if(l1==0){
                                            connection.query('UPDATE ?? set ??=? WHERE ??=?',['file','fName',fName,'id',id],function (err,results) {
                                                if(err){
                                                    console.log('更新file表失败！'+err);
                                                    connection.destroy();

                                                }else{
                                                    console.log('更新file表成功！');
                                                    res.send({
                                                        'status':true
                                                    });
                                                    connection.destroy();

                                                }
                                            })
                                        }else{
                                            res.send({
                                                'status':false,
                                                'name':sign_name
                                            })
                                        }
                                    }
                                })
                                    .on('end',function () {
                                        console.log('本次数据库操作完毕！');
                                        try{connection.release();}catch (e){};
                                    });
                            }else{
                                //child folders
                                connection.query('SELECT ?? FROM ?? WHERE ??=? AND ??!=?? AND ??=?  ',['fName','file','parentId',pId,'parentId','id','fName',fName],function (err,results) {
                                    if(err) {
                                        console.log('查询表file失败！'+err);
                                    }
                                    else{
                                        var l2=results.length;
                                        //if l2 is 0,it means there is no same fName in the database
                                        if(l2==0){
                                            connection.query('UPDATE ?? set ??=? WHERE ??=?',['file','fName',fName,'parentId',id],function (err,results) {
                                                if(err) {
                                                    console.log('更新表file失败！'+err);
                                                }else{
                                                    console.log('更新file表成功！');
                                                    res.send({
                                                        'status':true
                                                    });
                                                }
                                            })
                                                .on('end',function () {
                                                    console.log('本次数据库操作完毕！');
                                                    try{connection.release();}catch (e){};
                                                });
                                        }else{
                                            res.send({
                                                'status':false,
                                                'name':sign_name
                                            });
                                        }
                                    }
                                })
                                    .on('end',function () {
                                        console.log('本次数据库操作完毕！');
                                        try{connection.release();}catch (e){};
                                    });
                            }
                        }
                    })
                        .on('end',function () {
                            console.log('本次数据库操作完毕！');
                            try{connection.release();}catch (e){};
                        });
                else
                   connection.query('SELECT ??,?? FROM ?? WHERE ??=?',['f_id','iName','imgs','id',id],function (err,results) {
                       if(err) {
                           console.log('查询表失败！'+err);
                       }
                       else{
                           var f_id=results[0].f_id,
                               img_name=results[0].iName;
                           connection.query('SELECT ?? FROM ?? WHERE ??=? AND ??=?',['iName','imgs','f_id',f_id,'iName',fName],function (err,results) {
                               if(err) {
                                   console.log('查询表失败！'+err);
                               }
                               else{
                                   var len=results.length;
                                   if(len){
                                       res.send({
                                           'status':false,
                                           'name':img_name
                                       });
                                   }else{
                                       connection.query('SELECT baseUrl,url FROM imgs WHERE id=?',[id],function (err,results) {
                                           if(err) {
                                               console.log('查询表错误!'+err);
                                           }
                                           else{
                                               connection.query('UPDATE ?? SET iName=? WHERE id=?',['imgs',fName,id],function (err,results) {
                                                   if(err){
                                                       console.log('更新表失败！'+err);
                                                   }
                                                   else{
                                                       console.log('更改名成功！')
                                                   }
                                               })
                                                   .on('end',function () {
                                                       console.log('本次数据库操作完毕！');
                                                       try{connection.release();}catch (e){};
                                                   });
                                           }
                                       })
                                           .on('end',function () {
                                               console.log('本次数据库操作完毕！');
                                               try{connection.release();}catch (e){};
                                           });
                                   }
                               }
                           })
                               .on('end',function () {
                                   console.log('本次数据库操作完毕！');
                                   try{connection.release();}catch (e){};
                               });
                       }
                   })
                       .on('end',function () {
                           console.log('本次数据库操作完毕！');
                           try{connection.release();}catch (e){};
                       });
            })
        }
    })
};

//deleteFolder
exports.deleteFolderOrImg=function (req,res) {
    pool.getConnection(function (err,connection) {
        if(err) console.log('连接数据库失败！'+err);
        else{
            console.log('连接数据库成功！');
            req.on('data',function (data) {
                var datas=JSON.parse(data.toString()),
                    id=datas.id,
                    type=datas.type;
                if(/folder/.test(type))  selectRootFolder(connection,id,res);
                else{
                    connection.query('SELECT url,baseUrl FROM imgs WHERE id=?',[id],function (err,results) {
                       if (err) console.log('查询表失败！'+err);
                        else{
                            var r=results,
                                len=r.length,
                                url=r[0].url,
                                baseUrl=r[0].baseUrl;
                           if(len)
                               file.deleteImgSrc(url,baseUrl,function () {
                                   deleteSinglePic(connection,id,res);
                               });
                           else
                               deleteSinglePic(connection,id,res);
                       }
                    })
                        .on('end',function () {
                            console.log('本次数据库操作完毕！');
                            try{connection.release();}catch (e){};
                        });

                }
            })
        }
    })
};

//get each  folder infos in details
exports.getEachfolderInfo=function (req,res) {
    pool.getConnection(function (err,connection) {
        if(err) console.log('连接数据库失败！'+err);
        else{
            console.log('连接数据库成功！');
            getEachFolderInfo(req,res,connection,function (data) {
                console.log(data);
                res.send({
                    'data':data,
                    'status':true
                })
            })
        }
    })
};

//get the infomation of folders in th root directory
exports.getAllRootFolders=function (req,res) {
   getRootInfos(function (r) {
       res.send({
           'data':r,
           'status':true
       })
   })
};

//give data to file
exports.showRootData=function (req,res,callback) {
    getRootInfos(function (r) {
        if(callback)callback(r[r.length-1].fName);
    })
};

//uploads imgs
exports.uploadImgs=function(req,res){
    uploadImgsOperation(req,res,function (connection,tn_arr,de_url,f_id,zipImgs_select) {

        connection.query('SELECT iName,id,baseUrl FROM imgs WHERE f_id=?',[f_id],function (err,results) {
            if(err) console.log('查询表失败！'+err);
            else{
                console.log('查询表成功！');
                var re=results,
                    info=[];
                interator(re,function (i,item,len) {
                    if(inArray(item.iName,tn_arr)!=-1){
                        info.push({
                            'id':item.id,
                            'iName':item.iName,
                            'baseUrl':item.baseUrl
                        });
                    }
                    if(i==len-1){
                        file.getDatas(zipImgs_select,info,function (arr) {
                            file.createLocalSmPic(arr,function (arr) {
                                var array=arr,
                                    len=array.length;
                                // (function iterator(i) {
                                //     if(i==len){
                                //         res.send({
                                //             'success_imgs':tn_arr,
                                //             'decode_url':de_url,
                                //             'info':info,
                                //             'status':true
                                //         });
                                //         return;
                                //     }
                                //     iterator(++i);
                                // })(0);

                                res.send({
                                    'success_imgs':tn_arr,
                                    'decode_url':de_url,
                                    'info':info,
                                    'status':true
                                });
                            });
                        });
                    }
                });
            }
        })
            .on('end',function () {
                console.log('本次数据库操作完毕！');
                try{connection.release();}catch (e){};
            });

    })
};


function uploadImgsOperation(req,res,callback) {
    pool.getConnection(function (err,connection) {
        if(err) console.log('连接数据库失败!'+err);
        else{
            console.log('连接数据库成功!');
            var form=new formidable.IncomingForm(),
                i_arr=[];
            form.multiples=true;
            form.keepExtensions=true;
            form.uploadDir=path.normalize(__dirname+'/../uploads');

            form.on('file',function (name,file) {
                i_arr.push(file);
            });
            form.parse(req,function (err,fields,files) {
                if(err) {
                    // return;
                }
                var zipImgs=JSON.parse(fields.zipImgs).file,
                    f_id=fields.f_id,
                    zipImgs_select=[];
                connection.query('SELECT MAX(id) AS MAX_ID_IMGS FROM imgs',function (err,results) {
                    if(err) console.log(err);
                    else{
                        var i_len=i_arr.length,
                            MAX_ID_IMGS=results[0].MAX_ID_IMGS,
                            m_arr=[],//data:iName from mysql
                            n_arr=[],//data:name from file
                            tm_arr=[],//public name between file and mysql
                            tn_arr=[],
                            decode_url=[];
                        connection.query('SELECT iName FROM imgs WHERE f_id=?',[f_id],function (err,results) {
                            if(err) console.log('查找错误:'+err);
                            else{
                                var re=results,
                                    re_len=re.length;
                                //get imgs' name from mysql
                                for(var m=0;m<re_len;m++) m_arr.push(re[m].iName);
                                //get imgs'name from form data

                                for(var k=0;k<i_len;k++){
                                    n_arr.push({
                                        'name':i_arr[k].name,
                                        'path':i_arr[k].path
                                    });
                                }
                                //judge img's name uploaded whether it has existed in mysql
                                interator(n_arr,function (i,item) {
                                    if(inArray(item.name,m_arr)<0){
                                        tn_arr.push(item.name);//hasn't existed
                                    }else{
                                        tm_arr.push(item.name);//has existed
                                    }
                                });

                                //get imgs which uploads successfully
                                interator(zipImgs,function (i,item) {
                                    if(inArray(item.name,tn_arr)!=-1){
                                        zipImgs_select.push(item);
                                    }
                                });
                                var n_arr_len=n_arr.length;
                                if(n_arr_len>0){
                                    interator(tn_arr,function (i,item,len) {
                                        var extname = path.extname(item),
                                            time=new Date(),
                                            u='/'+f_id+parseInt(Math.random()*9999+109000)+parseInt(Math.random()*8889999988+987888987888)+extname,//url saved in mysql
                                            newPath=path.normalize(__dirname+'/../uploads'+u);
                                        decode_url.push({
                                            'url':u,
                                            'name':item
                                        });
                                        connection.query('INSERT INTO imgs set id=?,iName=?,f_id=?,url=?,baseUrl=?,iTime=?,extname=?',[++MAX_ID_IMGS,item,f_id,u,u,time,extname],function (err,results) {
                                            if(err) console.log('err'+err);
                                            else{
                                                //create imgs compressed on the local folders
                                                for(var j in n_arr){
                                                    if(n_arr[j].name==item) {
                                                        var oldPath=n_arr[i].path;
                                                        fs.rename(oldPath,newPath,function (err) {
                                                            if(err) console.log('错误：'+err);
                                                            else{
                                                                // file.createSmPic(zipImgs_select[i].url,u);

                                                            }
                                                        })
                                                    }
                                                }
                                                if(i==len-1) if(callback)callback(connection,tn_arr,decode_url,f_id,zipImgs_select,zipImgs_select);
                                            }
                                        })
                                            .on('end',function () {
                                                console.log('本次数据库操作完毕！');
                                                try{connection.release();}catch (e){};
                                            });
                                    });
                                }else{
                                    res.send({
                                        'status':false
                                    })
                                }
                            }
                        })
                            .on('end',function () {
                                console.log('本次数据库操作完毕！');
                                try{connection.release();}catch (e){};
                            });
                    }
                })
                    .on('end',function () {
                        console.log('本次数据库操作完毕！');
                        try{connection.release();}catch (e){};
                    });
            })
        }
    })
};

//get imgs
exports.getImgs=function (req,res) {
    pool.getConnection(function (err,connection) {
        if(err) console.log('连接数据库失败！'+err);
        else{
            req.on('data',function (data) {
                var d=JSON.parse(data.toString()),
                    id=d.fId;
                connection.query('SELECT iName,url FROM imgs WHERE f_id=?',[id],function (err,results) {
                    if(err) console.log('读取表失败！'+err);
                    else{
                        var r=results;
                        res.send({
                            'data':r
                        })
                    }
                })
            })
        }
    });
};

/*************************************************  operation function ********************************************/

//check root folder
function selectRootFolder(connection,id,res){
    var r_id=id;
    connection.query('SELECT id,fName,parentId FROM file WHERE id=?',[r_id],function (err,results) {
        if(err) {
            console.log('查询表失败！'+err);
        }
        else{
            var r=results[0];
            connection.query('SELECT id FROM imgs WHERE f_id=?',[r.id],function (err,results) {
                if(err) {
                    console.log('查询表失败！'+err);
                }
                else{
                    var r2=results,
                        len=r2.length;
                    if(len)
                        interator(r2,function (i,item) {
                            connection.query('CALL checkImgsUrl(?)',[item.id],function (err,results) {
                                if(err) console.log('查询表失败！'+err);
                                else{
                                    var r=results[0];
                                    file.deleteAllImgSrc(r,function () {
                                        connection.query('DELETE FROM imgs WHERE id=?',[item.id],function (err) {
                                            if(err) console.log('1-删除根文件夹图片失败！'+err);
                                            else{
                                                console.log('删除根文件夹图片成功！');
                                                if(i==len-1) {
                                                    checkChildFolder(connection,r_id,res);
                                                    detectRoot(connection,r_id,res);
                                                }
                                            }
                                        })
                                            .on('end',function () {
                                                console.log('本次数据库操作完毕！');
                                                try{connection.release();}catch (e){};
                                            });
                                    });
                                }
                            })
                        });
                    else{
                        checkChildFolder(connection,r_id,res);
                        detectRoot(connection,r_id,res);
                    }
                }
            })
                .on('end',function () {
                    console.log('本次数据库操作完毕！');
                    try{connection.release();}catch (e){};
                });
        }
    })
        .on('end',function () {
            console.log('本次数据库操作完毕！');
            try{connection.release();}catch (e){};
        });
}

//check whether folder chosen has children folder or imgs
function checkChildFolder(connection,id,res) {
    //root folder's id
    var r_id=id;
    connection.query('CALL check_folder_imgs(?)',[r_id],function (err,results) {
        if(err) console.log('查询表失败！'+err);
        else {
            var result=results,
                file_id=result[0],
                imgs_id=result[1],
                arr=file_id.concat(imgs_id),
                arr_len=arr.length;

            if(arr_len===0) {
                connection.query('CALL setNull(?)',[r_id],function (err) {
                    if(err) console.log('1-删除文件夹失败！'+r_id+err);
                    else{
                        console.log('1-删除文件夹成功：'+r_id);
                        return ;
                    }
                })
                    .on('end',function () {
                        console.log('本次数据库操作完毕！');
                        try{connection.release();}catch (e){};
                    });
            }

            interator(arr,function (j,item,len) {
                console.log(j,arr.length,r_id);
                if(item.imgs_id)
                    connection.query('CALL checkImgsUrl(?)',[item.imgs_id],function (err,results) {
                        if(err) console.log('查询表失败！'+err);
                        else{
                            var r=results[0];
                            file.deleteAllImgSrc(r,function () {
                                connection.query('DELETE FROM imgs WHERE id=?',[item.imgs_id],function (err) {
                                    if(err) console.log('1-删除图片失败！'+err);
                                    else {
                                        console.log('1-删除图片成功！');
                                        if(item.file_id)  checkChildFolder(connection, item.file_id, res);
                                        if(j===len-1) keepDelete(r_id);
                                    }
                                })
                                    .on('end',function () {
                                        console.log('本次数据库操作完毕！');
                                        try{connection.release();}catch (e){};
                                    });
                            });
                        }
                    })
                        .on('end',function () {
                            console.log('本次数据库操作完毕！');
                            try{connection.release();}catch (e){};
                        });
                else{
                    if(item.file_id) checkChildFolder(connection, item.file_id, res);
                    if(j===len-1) keepDelete(r_id);
                }
            });
        }
    })
        .on('end',function () {
            console.log('本次数据库操作完毕！');
            try{connection.release();}catch (e){};
        });

    function keepDelete(r_id) {

        //delete father node in each  traversal
        var timer=setTimeout(function () {
            connection.query('CALL setNull(?)',[r_id],function (err) {
                if(err) {
                    console.log('1-删除文件夹失败！'+err);
                    keepDelete(r_id);
                } else{
                    console.log('1-删除文件夹成功：'+r_id);
                    clearTimeout(timer);
                }
            })
                .on('end',function () {
                    console.log('本次数据库操作完毕！');
                    try{connection.release();}catch (e){};
                });
        },50);
    }


}

function detectRoot(connection,id,res) {
    var timer;
    connection.query('SELECT id FROM file WHERE id=?',[id],function (err,results) {
        if(err)console.log('查询表失败！'+err);
        else{
            var r_len=results.length;
            if(r_len===0) {
                clearTimeout(timer);
                res.send({
                    'status':true
                })
            }else{
                timer=setTimeout(function () {
                    detectRoot(connection,id,res);
                },100);
            }
        }
    })
        .on('end',function () {
            console.log('本次数据库操作完毕！');
            try{connection.release();}catch (e){};
        });
}

//delete a pic
function deleteSinglePic(connection,id,res) {
    connection.query('DELETE FROM ?? WHERE id=?',['imgs',id],function (err,results) {
        if(err) {
            console.log('删除失败！'+err);
            res.send({
                'status':false
            });
        }
        else{
            res.send({
                'status':true
            });
        }
    })
        .on('end',function () {
            console.log('本次数据库操作完毕！');
            try{connection.release();}catch (e){};
        });
}

//get root folder info
function getRootInfos(callback) {
    pool.getConnection(function (err,connection) {
        if(err) console.log('连接数据库失败！'+err);
        else{
            console.log('连接数据库成功！');
            var  arr=[];
            connection.query('SELECT id,fName,parentId FROM file WHERE parentId=id',function (err,results) {
                if(err) console.log('查询数据失败！'+err);
                else{
                    var r=results,
                        len=r.length;
                  if(len){
                      interator(r,function (i,item) {
                          var it=item;
                          connection.query('SELECT baseurl FROM imgs WHERE f_id=? ORDER BY iTime DESC',[it.id],function (err,results) {
                              if(err)  console.log(err);
                              else{
                                  var r2=results,
                                      l=r2.length;
                                  if(l>0){
                                      arr.push({
                                          'id':it.id,
                                          'fName':it.fName,
                                          'parentId':it.parentId,
                                          'baseUrl':r2[0].baseurl
                                      });
                                  }else{
                                      arr.push({
                                          'id':it.id,
                                          'fName':it.fName,
                                          'parentId':it.parentId,
                                          'baseUrl':' '
                                      });
                                  }
                                  if(i==len-1)
                                      if(callback) callback(arr);
                              }
                          })
                              .on('end',function () {
                                  console.log('本次数据库操作完毕！');
                                  try{connection.release();}catch (e){};
                              });
                      });
                  }else{
                      if(callback) callback(arr);
                  }
                }
            })
                .on('end',function () {
                    console.log('本次数据库操作完毕！');
                    try{connection.release();}catch (e){};
                });
        }
    })
}

//get each folder infos:include id,fName,parentId,imgs,children folders
function getEachFolderInfo(req,res,connection,callback) {
    req.on('data',function (data) {
        var datas=JSON.parse(data.toString()),
            id=datas.id;
        connection.query('CALL getEachFolderInfo(?)',[id],function (err,results) {
            if(err) {
                console.log('查询表失败！'+err);
            }
            else{
                var r=results,
                    id=r[0][0].num1,
                    fName=r[1][0].fName,
                    pId=r[1][0].parentId,
                    imgs=r[3],
                    files=r[2],
                    len=files.length;
                arr=[];
                if(len){
                    --len;
                    interator(files,function (i,item) {
                        connection.query('SELECT baseUrl FROM imgs WHERE f_id=? ORDER BY iTime DESC',[item.id],function (err,results) {
                            if(err) console.log('查询表错误！'+err);
                            else{
                                var r=results,
                                    l=r.length;
                                if(l)
                                    arr.push({
                                        'id':item.id,
                                        'fName':item.fName,
                                        'parentId':item.parentId,
                                        'baseUrl':r[0].baseUrl
                                    });
                                else
                                    arr.push({
                                        'id':item.id,
                                        'fName':item.fName,
                                        'parentId':item.parentId,
                                        'baseUrl':''
                                    });
                                if(i==len)
                                    if(callback)callback({
                                        'id':id,
                                        'fName':fName,
                                        'pId':pId,
                                        'imgs':imgs,
                                        'files':arr
                                    });
                            }
                        })
                            .on('end',function () {
                                console.log('本次数据库操作完毕！');
                                try{connection.release();}catch (e){};
                            });
                    });
                }
                else
                    if(callback)callback({
                        'id':id,
                        'fName':fName,
                        'pId':pId,
                        'imgs':imgs,
                        'files':files
                    });

            }
        })
            .on('end',function () {
                console.log('本次数据库操作完毕！');
                try{connection.release();}catch (e){};
            });

    });
}

//judge one thing is or isn't in the array
function inArray(elem,arr,i) {
    var len,
        a=arr.reverse();
    if(arr){
        // if(arr.indexOf) return arr.indexOf.call(arr,elem,i);
        len=a.length;
        i=i ? (i<0 ? Math.max(0,len+i):i):0;
        for(;i<len;i++){
            if(a[i]==elem) {
                return i;
            }
        }
    }

    return -1;
}


function interator(ary,callback) {
    for(var i=0,len=ary.length;i<len;i++) callback(i,ary[i],len);
}