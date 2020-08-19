CREATE TABLE IF NOT EXISTS `accounts`
(
 `id`            varchar(64) NOT NULL ,
 `value`         decimal(10,2) NOT NULL ,
 `currency`      text NOT NULL ,
 `createdAt`     mediumtext NOT NULL ,
 `entityName`    text NOT NULL ,
 `entityVersion` text NOT NULL ,
 `entitySchema`  text NOT NULL ,
 `status`        text NULL ,

PRIMARY KEY (`id`)
);
