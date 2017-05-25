
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
                    if(err) console.log('查询表失败！'+err);
                    else{
                        var r=results.length;
                        console.log(r);
                        if(r) res.send({
                            'status':true
                        });
                        else res.send({
                            'status':false
                        });
                    }
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
                    if(err) console.log('更新表失败！'+err);
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
                if(err) console.log('查询表失败！'+err);
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
                        console.log(datas);
                        if(pId==0){
                            //root folder
                            connection.query('SELECT id,fName,parentId FROM file WHERE fName=? AND id=parentId',[fName],function (err,results) {
                                if(err) console.log('查询表失败'+err);
                                else{
                                    console.log('查询表成功');
                                    var len=results.length;
                                    if(len==0) {
                                        connection.query('INSERT INTO file set id=?,fName=?,parentId=?',[id,datas.fName,id],function (err,results) {
                                            if(err)console.log('插入表失败！');
                                            else{
                                                console.log('插入表成功！');
                                                res.send({
                                                    'newId':id,
                                                    'pId':id,
                                                    'fName':fName,
                                                    'status':true
                                                })
                                            }
                                        });
                                    }
                                    else{
                                        res.send({
                                            'status':false
                                        })
                                    }
                                }
                            });
                        }else{
                            connection.query('SELECT id,fName,parentId FROM file WHERE fName=? AND parentId=? AND parentId!=id',[fName,pId],function (err,results) {
                                if(err) console.log('查询表失败'+err);
                                else{
                                    console.log('查询表成功');
                                    var len=results.length;
                                    if(len==0) {
                                        connection.query('INSERT INTO file set id=?,fName=?,parentId=?',[id,fName,pId],function (err,results) {
                                            if(err)console.log('插入表失败！');
                                            else{
                                                console.log('插入表成功！');
                                                res.send({
                                                    'newId':id,
                                                    'pId':pId,
                                                    'status':true
                                                })
                                            }
                                        });
                                    }
                                    else{
                                        res.send({
                                            'status':false
                                        })
                                    }
                                }
                            });
                        }

                    });
                }
            })
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
                    connection.query('SELECT ?? FROM ?? WHERE ??=?',['parentId','file','id',id],function (err,results) {
                        if(err)console.log('查询file表失败!'+err);
                        else{
                            var pId=results[0].parentId;
                            //if id equals to pId,the folder is the folder in the root directory
                            if(id==pId){
                                //root folders
                                connection.query('SELECT ?? FROM ?? WHERE ??=?? AND ??=?',['fName','file','id','parentId','fName',fName],function (err,results) {
                                    if(err) console.log('查询表file失败！'+err);
                                    else{
                                        var l1=results.length;
                                        //if l1 is 0,it means there is no same fName in the database
                                        if(l1==0){
                                            connection.query('UPDATE ?? set ??=? WHERE ??=?',['file','fName',fName,'id',id],function (err,results) {
                                                if(err){
                                                    console.log('更新file表失败！'+err);
                                                }else{
                                                    console.log('更新file表成功！');
                                                    res.send({
                                                        'status':true
                                                    })
                                                }
                                            })
                                        }else{
                                            res.send({
                                                'status':false
                                            })
                                        }
                                    }
                                })
                            }else{
                                //child folders
                                connection.query('SELECT ?? FROM ?? WHERE ??=? AND ??!=?? AND ??=?  ',['fName','file','parentId',pId,'parentId','id','fName',fName],function (err,results) {
                                    if(err) console.log('查询表file失败！'+err);
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
                                                    })
                                                }
                                            })
                                        }else{
                                            res.send({
                                                'status':false
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    });
                else
                    connection.query('SELECT ?? FROM ?? WHERE ??=?',['f_id','imgs','id',id],function (err,results) {
                        if(err) console.log('查询表失败！'+err);
                        else{
                            console.log(results);
                            var f_id=results[0].f_id;
                            connection.query('SELECT ?? FROM ?? WHERE ??=? AND ??=?',['iName','imgs','f_id',f_id,'iName',fName],function (err,results) {
                                if(err) console.log('查询表失败！'+err);
                                else{
                                    var len=results.length;
                                    if(len){
                                        res.send({
                                            'status':false
                                        })
                                    }else{
                                        connection.query('SELECT baseUrl,url FROM imgs WHERE id=?',[id],function (err,results) {
                                            if(err) console.log('查询表错误!'+err);
                                            else{
                                                var old_b=results[0].baseUrl,
                                                    old_u=results[0].url;
                                                var b='/'+id+'-'+fName+'.txt',
                                                    u='/'+id+'-'+fName;
                                                connection.query('UPDATE ?? SET iName=?,baseUrl=?,url=? WHERE id=?',['imgs',fName,b,u,id],function (err,results) {
                                                    if(err) console.log('更新表失败！'+err);
                                                    else{
                                                        file.modifyImgSrc(old_u,u,old_b,b);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
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
                if(/folder/.test(type)){

                    var timer=setTimeout(function () {
                        res.send({
                            'status':true
                        })
                    },500);
                    selectRootFolder(connection,id,res,timer);


                }else{
                    connection.query('SELECT url,baseUrl FROM imgs WHERE id=?',[id],function (err,results) {
                        if (err) console.log('查询表失败！'+err);
                        else{
                            var r=results,
                                len=r.length,
                                url=r[0].url,
                                baseUrl=r[0].baseUrl;
                            if(len)
                            {
                                file.deleteImgSrc(url,baseUrl,function () {
                                    deleteSinglePic(connection,id,res);
                                });
                            }
                            else
                                deleteSinglePic(connection,id,res);
                        }
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

//modifyImgInfo
exports.modifyImgInfo=function (req,res) {
    pool.getConnection(function (err,connection) {
        if(err) console.log(err);
        else{
            console.log('连接数据库成功!');
            req.on('data',function (data) {
                var id=JSON.parse(data.toString()).id;
                connection.query('')
            })
        }
    })
};

//judeFolderInfo
exports.judeFolderInfo=function (req,res) {
    pool.getConnection(function (err,connection) {
        if(err) console.log(err);
        else{
            console.log('连接数据库成功!');
            req.on('data',function (data) {
                var name=JSON.parse(data.toString()).fName;
                connection.query('SELECT fName FROM file WHERE fName=? AND id=parentId',[name],function (err,results) {
                    var l=results.length;
                    console.log(l);
                    if(l>0){
                        res.send({
                            'status':false
                        })
                    }else{
                        res.send({
                            'status':true
                        })
                    }

                })
            })
        }
    })
};

//uploads imgs
exports.uploadImgs=function (req,res) {
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
                var zipImgs=JSON.parse(fields.zipImgs),
                    f_id=fields.f_id,
                    zipImgs_select={};
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
                                for(;re_len--;) m_arr.push(re[re_len].iName);
                                //get imgs'name from form data
                                for(;i_len--;){
                                    n_arr.push({
                                        'name':i_arr[i_len].name,
                                        'path':i_arr[i_len].path
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
                                var n_arr_len=n_arr.length;
                                if(n_arr_len>0){
                                    interator(tn_arr,function (i,item) {
                                        zipImgs_select[item]=zipImgs[item];
                                        file.createSmPic(zipImgs_select,f_id);
                                        var  newPath=path.normalize(__dirname+'/../uploads/'+ f_id +'-'+item),
                                            u=encodeURIComponent('/'+f_id +'-'+item),
                                            time=new Date();
                                        decode_url.push({
                                            'url':u,
                                            'name':item
                                        });
                                        connection.query('INSERT INTO imgs set id=?,iName=?,f_id=?,url=?,baseUrl=?,iTime=?',[++MAX_ID_IMGS,item,f_id,u,u,time],function (err,results) {
                                            if(err) console.log('err'+err);
                                            else{
                                                for(var j in n_arr){
                                                    if(n_arr[j].name==item) {
                                                        var oldPath=n_arr[i].path;
                                                        fs.rename(oldPath,newPath,function (err) {
                                                            if(err) console.log('错误：'+err);
                                                        })
                                                    }
                                                }
                                            }
                                        })
                                    });
                                    res.send({
                                        'success_imgs':tn_arr,
                                        'decode_url':decode_url,
                                        'fail_imgs':tm_arr,
                                        'status':true
                                    })
                                }else{
                                    res.send({
                                        'status':false
                                    })
                                }
                            }
                        });
                    }
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

function getRootFImgs(connection,index,callback) {
    //pics in the root doc
    connection.query('SELECT ??,??,?? FROM imgs WHERE f_id=?',['id','iName','iTime',index],function (err,results) {
        if(err) console.log('查询表失败！'+err);
        else{
            console.log('查询表成功');
            var pic=[],
                root_pic=results;
            if(root_pic.length>0){
                (function iterator(i) {
                    if(i==root_pic.length){
                        return;
                    }
                    pic.push(root_pic[i]);
                    iterator(i+1);
                })(0);
            }else{
                pic=[];
            }
            if(callback)callback(pic);
        }
    });
};

//check root folder
function selectRootFolder(connection,id,res,timer){
    var r_id=id;
    connection.query('SELECT id,fName,parentId FROM file WHERE id=?',[r_id],function (err,results) {
        if(err) console.log('查询表失败！'+err);
        else{
            var r=results[0];
            connection.query('SELECT id FROM imgs WHERE f_id=?',[r.id],function (err,results) {
                if(err) console.log('查询表失败！'+err);
                else{
                    var r2=results,
                        len=r2.length;
                    if(len)
                        interator(r2,function (i,item) {
                            connection.query('DELETE FROM imgs WHERE id=?',[item.id],function (err) {
                                if(err) console.log('删除根文件夹图片失败！'+err);
                                else{
                                    console.log('删除根文件夹图片成功！');
                                    if(i==len-1)
                                        selectChildFolder(connection,r_id,res,timer);
                                }
                            })
                        });
                    else
                        selectChildFolder(connection,r_id,res,timer);

                }
            })
        }
    })
}


//check whether folder chosen has children folder
function selectChildFolder(connection,id,res,timer) {
    //root folder's id
    var r_id=id;
    connection.query('SELECT id,fName,parentId FROM file WHERE parentId=? AND NOT id=parentId',[id],function (err,results) {
        if(err) console.log('查询表失败!'+err);
        else{
            clearTimeout(timer);
            var r=results,
                len=r.length;
            if(len)
                reverseIterator(r,function (i,item) {
                    selectChildFolder(connection,item.id,res);
                    //each children folder's id
                    var id=item.id;
                    //check whether child folder has imgs
                    connection.query('SELECT id,f_id FROM  imgs WHERE f_id=?',[id],function (err,results) {
                        if(err) console.log('1-查询表失败！'+err);
                        else{
                            var r1=results,
                                r1_len=r1.length;
                            //has imgs,delete imgs
                            if(r1_len){
                                //reverse each img and delete it
                                reverseIterator(r1,function (i,item) {
                                    var r1_item=item;
                                    connection.query('DELETE FROM imgs WHERE id=?',[r1_item.id],function (err) {
                                        if(err) console.log('1-删除子文件夹图片失败!'+err);
                                        else{
                                            console.log('1-删除子文件夹图片成功!');
                                            if(i==r1_len-1){
                                                connection.query('CALL setNull(?)',[r1[0].f_id],function (err,results) {
                                                    if(err) console.log('1-更新表失败！'+err);
                                                    else{
                                                        console.log('1-更新表成功！');
                                                        connection.query('DELETE FROM file WHERE id=?',[r1[0].f_id],function (err) {
                                                            if(err) console.log('1-删除子文件夹失败！'+err);
                                                            else{
                                                                console.log('1-删除子文件夹成功！');
                                                                connection.query('SELECT id FROM file WHERE parentId=? AND NOT id=?',[r_id,r_id],function (err,results) {
                                                                    if(err)  console.log('1-查询表失败！'+err);
                                                                    else{
                                                                        console.log('1-查询表成功！');
                                                                        var r_len_1=results.length;
                                                                        console.log('r_len_1'+r_len_1);
                                                                        if(!r_len_1)
                                                                            connection.query('CALL DeleteRoot(?)',[r_id],function (err) {
                                                                                if(err) console.log('1-删除根文件夹失败！'+err);
                                                                                else
                                                                                {
                                                                                    console.log('1-删除跟文件夹成功！');

                                                                                    timer=setTimeout(function () {
                                                                                        res.send({
                                                                                            'status':true
                                                                                        })
                                                                                    },500)
                                                                                }

                                                                            });
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }

                                        }
                                    })
                                });

                            }else{

                                connection.query('CALL setNull(?)',[id],function (err) {
                                    if(err) console.log('2-更新子文件夹数据失败！'+err);
                                    else{
                                        console.log('2-更新子文件夹数据成功！');
                                        connection.query('DELETE FROM file WHERE id=?',[id],function (err) {
                                            if(err) console.log('2-删除子文件夹数据失败！'+err);
                                            else{
                                                console.log('2-删除子文件夹数据成功！');
                                                connection.query('SELECT id FROM file WHERE parentId=? AND NOT id=?',[r_id,r_id],function (err,results) {
                                                    if(err)  console.log('2-查询表失败！'+err);
                                                    else{
                                                        console.log('2-查询表成功！');
                                                        var r_len_2=results.length;
                                                        console.log('r_len_2:'+r_len_2);
                                                        if(!r_len_2)
                                                            connection.query('CALL DeleteRoot(?)',[r_id],function (err) {
                                                                if(err) console.log('2-删除根文件夹失败！'+err);
                                                                else{
                                                                    console.log('2-删除根文件夹成功！');
                                                                    timer=setTimeout(function () {
                                                                        res.send({
                                                                            'status':true
                                                                        })
                                                                    },500)
                                                                }
                                                            });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    });
                });
            else
                connection.query('CALL DeleteRoot(?)',[r_id],function (err) {
                    if(err) console.log('3-删除根文件夹失败！'+err);
                    else{
                        timer=setTimeout(function () {
                            res.send({
                                'status':true
                            })
                        },500);
                        console.log('3-删除根文件夹成功！');
                    }

                });


        }
    });


}

function deleteSinglePic(connection,id,res) {
    connection.query('DELETE FROM ?? WHERE id=?',['imgs',id],function (err,results) {
        if(err) {
            console.log('删除失败！'+err);
            res.send({
                'status':false
            })
        }
        else{
            // console.log(results);
            res.send({
                'status':true
            })
        }
    })
}

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
                            });
                        });
                    }else{
                        if(callback) callback(arr);
                    }
                }
            })
        }
    })
}

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
                        console.log(item.id);
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

    });
}

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
};

function reverseIterator(ary,callback) {
    var i =ary.length-1;
    do callback(i,ary[i]);  while(ary[--i]);
};

function interator(ary,callback) {
    for(var i=0,len=ary.length;i<len;i++) callback(i,ary[i]);
};/**
 * Created by jm on 2017/4/10.
 */
