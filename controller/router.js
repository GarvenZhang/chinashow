/**
 * Created by jm_hello on 2017/3/14.
 */
var mysql=require('../modules/mysql.js'),
    file=require('../modules/file.js');


//get main html
exports.getMain=function (req,res) {

  file.getMain(req,res);
};

//get main html
exports.getLogin=function (req,res) {
    file.getLogin(req,res);
};

// register
exports.register=function (req,res) {
    mysql.register(req,res);
};

//login
exports.login=function (req,res) {
    mysql.login(req,res);
};

//modifyPsw
exports.modifyPsw=function (req,res) {
    mysql.modifyPsw(req,res);
};

//add new folder
exports.addNewFolder=function (req,res) {
    mysql.addNewFolder(req,res);
};

//modify folder name
exports.modifyFolderOrImgs=function (req,res) {
    mysql.modifyFolderOrImgs(req,res);
};

//get each  folder infos in details
exports.getEachfolderInfo=function (req,res) {
    mysql.getEachfolderInfo(req,res);
};

//get the infomation of folders in th root directory
exports.getAllRootFolders=function (req,res) {
  mysql.getAllRootFolders(req,res);
};

//delete folders or imgs
exports.deleteFolderOrImg=function (req,res) {
    mysql.deleteFolderOrImg(req,res);
};


//judeFolderInfo
exports.judeFolderInfo=function (req,res) {
    mysql.judeFolderInfo(req,res);
};

//upload imgs
exports.uploadImgs=function (req,res) {
    mysql.uploadImgs(req,res);
};

//getImgs
exports.getImgs=function (req,res) {
    mysql.getImgs(req,res);
};

