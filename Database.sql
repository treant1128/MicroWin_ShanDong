DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `provName` varchar(128) NOT NULL,
  `ProvEname` varchar(32) NOT NULL COMMENT '省英文名',
  `isValid` boolean COMMENT '是否激活',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

LOCK TABLES `provinces` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `isValid` boolean NOT NULL,
  `detail` varchar(256),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `provID` int(3) NOT NULL,
  `postSTR` varchar(256) ,
  `partNumber` varchar(256),
  `nrPkg` varchar(256) ,
  `phoneModel` varchar(256) ,
  `city` varchar(128),
  `url` varchar(256),
  `isRandom` boolean,
  `beginTime` datetime,
  `endTime` datetime,
  `isUpdate` boolean,
  `content` text,
  `isDelete` boolean,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tasks` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(256),
  `dateTime` datetime ,
  `log` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `logs` WRITE;
UNLOCK TABLES;
