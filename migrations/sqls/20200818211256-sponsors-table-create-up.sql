CREATE TABLE IF NOT EXISTS `sponsors`
(
 `id`                 varchar(64) NOT NULL ,
 `firstName`          text NOT NULL ,
 `lastName`           text NOT NULL ,
 `emailAddress`       mediumtext NOT NULL ,
 `createdAt`          mediumtext NOT NULL ,
 `lastModifiedAt`     mediumtext NULL ,
 `profileImageURL`    mediumtext NULL ,
 `isAccountActivated` boolean NOT NULL ,
 `entityName`         text NOT NULL ,
 `entityVersion`      text NOT NULL ,
 `entitySchema`       text NOT NULL ,
 `status`             text NULL ,

PRIMARY KEY (`id`)
);
