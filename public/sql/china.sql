/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 60011
Source Host           : localhost:3306
Source Database       : china

Target Server Type    : MYSQL
Target Server Version : 60011
File Encoding         : 65001

Date: 2017-04-11 21:04:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `file`
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fName` varchar(100) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `file_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `file` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=300 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of file
-- ----------------------------
INSERT INTO `file` VALUES ('1', 'asdas', '1');

-- ----------------------------
-- Table structure for `getmain`
-- ----------------------------
DROP TABLE IF EXISTS `getmain`;
CREATE TABLE `getmain` (
  `id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of getmain
-- ----------------------------
INSERT INTO `getmain` VALUES ('1', '189226.html');

-- ----------------------------
-- Table structure for `imgs`
-- ----------------------------
DROP TABLE IF EXISTS `imgs`;
CREATE TABLE `imgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iName` varchar(255) DEFAULT NULL,
  `extname` varchar(10) DEFAULT NULL,
  `baseUrl` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `iTime` varchar(30) DEFAULT NULL,
  `f_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `f_id` (`f_id`),
  CONSTRAINT `imgs_ibfk_1` FOREIGN KEY (`f_id`) REFERENCES `file` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of imgs
-- ----------------------------
INSERT INTO `imgs` VALUES ('1', '0.png', '.png', '/149191536023810569.png', '/149191536023810569.png', '2017-04-11 20:56:00.238', '1');
INSERT INTO `imgs` VALUES ('2', '1.png', '.png', '/149191536023913218.png', '/149191536023913218.png', '2017-04-11 20:56:00.239', '1');
INSERT INTO `imgs` VALUES ('3', '2.png', '.png', '/149191536024016470.png', '/149191536024016470.png', '2017-04-11 20:56:00.240', '1');
INSERT INTO `imgs` VALUES ('4', '3.png', '.png', '/149191536024110690.png', '/149191536024110690.png', '2017-04-11 20:56:00.241', '1');
INSERT INTO `imgs` VALUES ('5', '4.png', '.png', '/149191536024312208.png', '/149191536024312208.png', '2017-04-11 20:56:00.243', '1');
INSERT INTO `imgs` VALUES ('6', '5.png', '.png', '/149191536024912762.png', '/149191536024912762.png', '2017-04-11 20:56:00.249', '1');
INSERT INTO `imgs` VALUES ('7', '6.png', '.png', '/149191536025013849.png', '/149191536025013849.png', '2017-04-11 20:56:00.250', '1');
INSERT INTO `imgs` VALUES ('8', '7.png', '.png', '/149191536025417257.png', '/149191536025417257.png', '2017-04-11 20:56:00.254', '1');
INSERT INTO `imgs` VALUES ('9', '8.png', '.png', '/149191536025910904.png', '/149191536025910904.png', '2017-04-11 20:56:00.259', '1');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(8) DEFAULT NULL,
  `phone` int(13) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'yaojie', null, 'dd4b21e9ef71e1291183a46b913ae6f2');

-- ----------------------------
-- Procedure structure for `checkImgsUrl`
-- ----------------------------
DROP PROCEDURE IF EXISTS `checkImgsUrl`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `checkImgsUrl`(IN `id_num` int)
BEGIN
	#Routine body goes here...
	SELECT url,baseUrl,id FROM imgs WHERE id=id_num ORDER BY iTime;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for `check_folder_imgs`
-- ----------------------------
DROP PROCEDURE IF EXISTS `check_folder_imgs`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `check_folder_imgs`(IN `d_id` int)
BEGIN
	SELECT id AS file_id,parentId  FROM file WHERE parentId=d_id;

	SELECT id AS imgs_id FROM imgs WHERE f_id in(SELECT id FROM file WHERE parentId=d_id);
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for `getEachFolderInfo`
-- ----------------------------
DROP PROCEDURE IF EXISTS `getEachFolderInfo`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getEachFolderInfo`(IN `d_id` int)
BEGIN
	#Routine body goes here...
	DECLARE num1 INT;
	#folder's id which is chosen
	SELECT id INTO num1 FROM file WHERE id=d_id;
	SELECT num1;

	#folder's name,parentId which is chosen
	SELECT fName,parentId FROM file WHERE id=d_id;

	#folder's child-folder which is chosen
	SELECT id,fName,parentId FROM file WHERE parentId=num1 AND NOT parentId=id;	

	#folder's pics which is chosen
	SELECT id,iName,url,baseUrl FROM imgs WHERE f_id=num1;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for `setNull`
-- ----------------------------
DROP PROCEDURE IF EXISTS `setNull`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setNull`(IN `f_id_null` int)
BEGIN
		#Routine body goes here...
		UPDATE file SET parentId=NULL WHERE id=f_id_null;
		DELETE FROM file WHERE id=f_id_null;
END
;;
DELIMITER ;
