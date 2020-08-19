CREATE TABLE IF NOT EXISTS `students`
(
 `id`                        varchar(64) NOT NULL ,
 `firstName`                 text NOT NULL ,
 `lastName`                  text NOT NULL ,
 `dateOfBirth`               text NOT NULL ,
 `emailAddress`              mediumtext NOT NULL ,
 `createdAt`                 mediumtext NOT NULL ,
 `lastModifiedAt`            mediumtext NULL ,
 `profileImageURL`           mediumtext NULL ,
 `anticipatedGraduationDate` text NOT NULL ,
 `enrolledAt`                mediumtext NOT NULL ,
 `isAccountActivated`        boolean NOT NULL ,
 `entityName`                text NOT NULL ,
 `entityVersion`             text NOT NULL ,
 `entitySchema`              text NOT NULL ,
 `status`                    text NULL ,

PRIMARY KEY (`id`)
);
