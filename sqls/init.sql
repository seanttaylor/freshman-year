CREATE DATABASE IF NOT EXISTS muenster;

USE muenster;

#CREATE DATABASE IF NOT EXISTS fontina;

#USE fontina;

-- ****************** SqlDBM: MySQL ******************;
-- ***************************************************;


-- ************************************** `students`

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






-- ************************************** `sponsors`

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






-- ************************************** `accounts`

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






-- ************************************** `student_sponsors`

CREATE TABLE IF NOT EXISTS `student_sponsors`
(
 `sponsor_id` varchar(64) NOT NULL ,
 `student_id` varchar(64) NOT NULL ,

KEY `fkIdx_35` (`sponsor_id`),
CONSTRAINT `FK_35` FOREIGN KEY `fkIdx_35` (`sponsor_id`) REFERENCES `sponsors` (`id`),
KEY `fkIdx_41` (`student_id`),
CONSTRAINT `FK_41` FOREIGN KEY `fkIdx_41` (`student_id`) REFERENCES `students` (`id`),
UNIQUE INDEX(`sponsor_id`, `student_id`)  
);






-- ************************************** `student_accounts`

CREATE TABLE IF NOT EXISTS `student_accounts`
(
 `student_id` varchar(64) NOT NULL ,
 `account_id` varchar(64) NOT NULL ,

KEY `fkIdx_87` (`student_id`),
CONSTRAINT `FK_87` FOREIGN KEY `fkIdx_87` (`student_id`) REFERENCES `students` (`id`),
KEY `fkIdx_90` (`account_id`),
CONSTRAINT `FK_90` FOREIGN KEY `fkIdx_90` (`account_id`) REFERENCES `accounts` (`id`)
);






-- ************************************** `sponsor_transactions`

CREATE TABLE IF NOT EXISTS `sponsor_transactions`
(
 `id`         varchar(64) NOT NULL ,
 `createdAt`  mediumtext NOT NULL ,
 `amount`     decimal(10,2) NOT NULL ,
 `sponsor_id` varchar(64) NOT NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_124` (`sponsor_id`),
CONSTRAINT `FK_124` FOREIGN KEY `fkIdx_124` (`sponsor_id`) REFERENCES `sponsors` (`id`)
);



-- ************************************** `sponsor_plaid_credentials`

CREATE TABLE IF NOT EXISTS `sponsor_plaid_credentials`
(
 `sponsor_id`   varchar(64) NOT NULL ,
 `item_id`      text NOT NULL ,
 `access_token` text NOT NULL ,

KEY `fkIdx_116` (`sponsor_id`),
CONSTRAINT `FK_116` FOREIGN KEY `fkIdx_116` (`sponsor_id`) REFERENCES `sponsors` (`id`)
);



##INSERT STATEMENTS

#Tony Stark
INSERT INTO students (id, firstName, lastName, dateOfBirth, emailAddress, createdAt, lastModifiedAt, profileImageURL, anticipatedGraduationDate, enrolledAt, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('1d2b3f93-804b-4e02-94ad-2eec6b90997d', 'Tony', 'Stark', '1000-01-01', 'tstark@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', '1004-05-30', 'P.S. 118', false, 'student', '0.0.1', '/api/schemas/student/v0.0.1.json' , NULL);  

#Peter Parker
INSERT INTO students (id, firstName, lastName, dateOfBirth, emailAddress, createdAt, lastModifiedAt, profileImageURL, anticipatedGraduationDate, enrolledAt, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('2294a21b-ba63-4e5e-b537-d61ba40e4a65', 'Peter', 'Parker', '1000-01-01', 'pparker@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', '1004-05-30', 'P.S. 118', false, 'student', '0.0.1', '/api/schemas/student/v0.0.1.json' , NULL); 


#Steve Rogers
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('2a1acb10-8d2b-4248-a74e-a8418f941dd9', 'Steve', 'Rogers', 'srogers@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', false , 'sponsor', '0.0.1', '/api/schemas/sponsor/v0.0.1.json' , NULL);


#Natasha Romanoff
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('f50ef714-5a51-4a0b-a3e5-99529ba41fce', 'Natasha', 'Romanoff', 'nromanoff@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', false , 'sponsor', '0.0.1', '/api/schemas/sponsor/v0.0.1.json' , NULL);


#Bruce Banner
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('b20cdf59-b121-4b00-9e43-d2c48e2cf98f', 'Bruce', 'Banner', 'bbanner@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', false , 'sponsor', '0.0.1', '/api/schemas/sponsor/v0.0.1.json' , NULL);


INSERT INTO accounts (id, value, currency, createdAt, entityName, entityVersion, entitySchema, status) VALUES('c7d63189-07f8-4ea8-9a62-37a7b8cfe973', 1000.00, 'USD', '1000-01-01 00:00:00', 'account', '0.0.1', '/api/schemas/account/v0.0.1.json', NULL);


#Tony Stark => Steve Rogers
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('1d2b3f93-804b-4e02-94ad-2eec6b90997d' ,'2a1acb10-8d2b-4248-a74e-a8418f941dd9');

#Tony Stark => Natasha Romanoff
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('1d2b3f93-804b-4e02-94ad-2eec6b90997d' ,'f50ef714-5a51-4a0b-a3e5-99529ba41fce');

#Peter Parker => Natasha Romanoff 
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('2294a21b-ba63-4e5e-b537-d61ba40e4a65' ,'f50ef714-5a51-4a0b-a3e5-99529ba41fce');


#Tony Stark account
INSERT INTO student_accounts (student_id, account_id) VALUES('1d2b3f93-804b-4e02-94ad-2eec6b90997d' ,'c7d63189-07f8-4ea8-9a62-37a7b8cfe973');

#Steve Rogers 
INSERT INTO sponsor_plaid_credentials (sponsor_id, item_id, access_token) VALUES('2a1acb10-8d2b-4248-a74e-a8418f941dd9', '7KK8mlxrp1IAdzl3ZZEKSo9eZla5o7hgLgr4a', 'access-sandbox-f9e9dcf6-5ddf-4fe7-9ee4-6c11d1e7b4c6');

INSERT INTO sponsor_transactions (sponsor_id, id, amount, createdAt) VALUES('2a1acb10-8d2b-4248-a74e-a8418f941dd9', '5a4a06e1-decb-41b2-a9cd-f47fdcfd2375', 0.67, '1000-01-01 00:00:00');