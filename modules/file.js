/**
 * Created by jm_hello on 2017/3/20.
 */
var fs=require('fs'),
    path=require('path');


exports.getLogin=function (req,res) {
    res.sendFile(path.normalize(__dirname+'/../public/login.html'),function (err) {
        if(err) {
            console.log(err);
            console.log('读取页面错误');
        }
    });
};


//create imgs compressed on the local folder
exports.getDatas=function (zipImgs,infos,callback) {

    var zip=zipImgs,
        info=infos,
        arr=[];

    for(var i=0,z_len=zip.length;i<z_len;i++){
        for(var j=0,i_len=info.length;j<i_len;j++){
            if(info[j].iName==zip[i].name){

                arr.push({
                    'name':info[i].iName,
                    'base':zip[i].url,
                    'baseUrl':info[j].baseUrl
                });
            }
        }
    }
    if(callback) callback(arr);

};

exports.createLocalSmPic=function (arr,callback) {
    var array=arr,
        len=array.length;
    for(var i=0;i<len;i++)
        (function (k) {
            var url=array[k].baseUrl,
                base=array[k].base,
                u=path.normalize(__dirname+'/../public/baseurl')+url+'.txt';
            fs.writeFile(u,base,function (err) {          //parameter 1, 2  must be a basic class, such as <String> <Number>..ex
                if(err) console.log('创建图片失败！');
                else{
                    console.log('创建图片成功！');
                    if(k===len-1){
                        if(callback) callback(arr);
                    }
                }
            });
        })(i);
};


//delete imga in local folders
exports.deleteImgSrc=function (url,baseUrl,callback) {
    deletePic(url,baseUrl,function () {
        if(callback)callback();
    });
};

//delete all pics
exports.deleteAllImgSrc=function (data,callback) {
    var d=data,
        len=d.length;
    (function iterator(i) {
        if(i==len){
            if(callback)callback();
            return;
        }
        deletePic(d[i].url,d[i].baseUrl);
        iterator(++i);
    })(0)
};

/*************************operation function************************************/
function deletePic(url,baseUrl,callback) {
    var ur=path.normalize(__dirname+'/../uploads'+url),
        bUrl=path.normalize(__dirname+'/../public/baseurl'+baseUrl+'.txt');

    fs.exists(ur,function (exists) {
        if(exists)
            fs.unlink(ur,function (err) {
                if(err) console.log('删除图片失败！');
                else{
                    console.log('删除图片成功！');
                    fs.exists(bUrl,function (exists) {
                        if(exists)
                            fs.unlink(bUrl,function (err) {
                                if(err) console.log('删除图片失败！');
                                else{
                                    console.log('删除图片成功！');
                                    if(callback)callback()
                                };
                            });
                    });
                }
            });
    });

}
