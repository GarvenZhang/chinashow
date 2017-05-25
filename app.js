/**
 * Created by jm_hello on 2017/3/14.
 */
var express=require('express'),
    app=express(),
    router=require('./controller/router.js');

//create public module
app.use(express.static('./WEB'));
app.use(express.static('./public'));
app.use(express.static('./uploads'));



//get main html

app.get('/login',router.getLogin);

//login
app.post('/login_action',router.login);

//modify psw
app.post('/modify_psw_action',router.modifyPsw);

//add New Folder
app.post('/addFolder_action',router.addNewFolder);

//modify Folder Info
app.post('/modifyFolderOrImgs_action',router.modifyFolderOrImgs);

//get each  folder infos in details
app.post('/getEachfolderInfo_action',router.getEachfolderInfo);

//get the infomation of folders in th root directory
app.get('/getAllRootFolders_action',router.getAllRootFolders);


//delete root folder including its imgs and docs
app.post('/deleteFolderAndImg_action',router.deleteFolderOrImg);


//upload imgs
app.post('/uploadImgs_action',router.uploadImgs);

//get imgs
app.post('/getimgs_action',router.getImgs);

app.listen(80);