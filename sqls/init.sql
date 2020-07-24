CREATE DATABASE IF NOT EXISTS fontina;

USE fontina;

-- ****************** SqlDBM: MySQL ******************;
-- ***************************************************;


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

#Tony Stark
INSERT INTO students (id, firstName, lastName, dateOfBirth, emailAddress, createdAt, lastModifiedAt, profileImageURL, anticipatedGraduationDate, enrolledAt, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('1d2b3f93-804b-4e02-94ad-2eec6b90997d', 'Tony', 'Stark', '1000-01-01', 'tstark@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', '1004-05-30', 'P.S. 118', false, 'student', '0.0.1', '/api/schemas/student/v0.0.1.json' , NULL);  

#Peter Parker
INSERT INTO students (id, firstName, lastName, dateOfBirth, emailAddress, createdAt, lastModifiedAt, profileImageURL, anticipatedGraduationDate, enrolledAt, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('2294a21b-ba63-4e5e-b537-d61ba40e4a65', 'Peter', 'Parker', '1000-01-01', 'pparker@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', '1004-05-30', 'P.S. 118', false, 'student', '0.0.1', '/api/schemas/student/v0.0.1.json' , NULL); 


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

#Steve Rogers
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('2a1acb10-8d2b-4248-a74e-a8418f941dd9', 'Steve', 'Rogers', 'srogers@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', false , 'sponsor', '0.0.1', '/api/schemas/sponsor/v0.0.1.json' , NULL);


#Natasha Romanoff
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('f50ef714-5a51-4a0b-a3e5-99529ba41fce', 'Natasha', 'Romanoff', 'nromanoff@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', false , 'sponsor', '0.0.1', '/api/schemas/sponsor/v0.0.1.json' , NULL);


#Bruce Banner
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, isAccountActivated, entityName, entityVersion, entitySchema, status)
VALUES ('b20cdf59-b121-4b00-9e43-d2c48e2cf98f', 'Bruce', 'Banner', 'nromanoff@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', false , 'sponsor', '0.0.1', '/api/schemas/sponsor/v0.0.1.json' , NULL);




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

INSERT INTO accounts (id, value, currency, createdAt, entityName, entityVersion, entitySchema, status) VALUES('c7d63189-07f8-4ea8-9a62-37a7b8cfe973', 1024.64, 'USD', '1000-01-01 00:00:00', 'account', '0.0.1', '/api/schemas/account/v0.0.1.json', NULL);



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


#Tony Stark => Steve Rogers
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('1d2b3f93-804b-4e02-94ad-2eec6b90997d' ,'2a1acb10-8d2b-4248-a74e-a8418f941dd9');

#Tony Stark => Natasha Romanoff
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('1d2b3f93-804b-4e02-94ad-2eec6b90997d' ,'f50ef714-5a51-4a0b-a3e5-99529ba41fce');

#Peter Parker => Natasha Romanoff 
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('2294a21b-ba63-4e5e-b537-d61ba40e4a65' ,'f50ef714-5a51-4a0b-a3e5-99529ba41fce');



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


#Tony Stark account
INSERT INTO student_accounts (student_id, account_id) VALUES('1d2b3f93-804b-4e02-94ad-2eec6b90997d' ,'c7d63189-07f8-4ea8-9a62-37a7b8cfe973');




-- ************************************** `transactions`

CREATE TABLE IF NOT EXISTS `transactions`
(
 `id`             varchar(64) NOT NULL ,
 `amount`         decimal(10, 2) NOT NULL ,
 `createdAt`      mediumtext NOT NULL ,
 `cardNumber`     integer NOT NULL ,
 `cardType`       text NOT NULL ,
 `cardExpiryDate` text NOT NULL ,

PRIMARY KEY (`id`)
);

INSERT INTO transactions (id, amount, createdAt, cardNumber, cardType, cardExpiryDate) VALUES('a71169e0-9d70-4aaa-a639-d9d04fbb11bf', 0.53, '1000-01-01 00:00:00', 1987, 'visa', '07/24'); 

INSERT INTO transactions (id, amount, createdAt, cardNumber, cardType, cardExpiryDate) VALUES('6c2f3e3d-2fe1-4acb-8033-6356eb4f64bb', 0.47, '1000-01-01 00:00:00', 1987, 'visa', '07/24');




-- ************************************** `account_transactions`

CREATE TABLE IF NOT EXISTS `account_transactions`
(
 `account_id`     varchar(64) NOT NULL ,
 `transaction_id` varchar(64) NOT NULL ,

KEY `fkIdx_106` (`account_id`),
CONSTRAINT `FK_106` FOREIGN KEY `fkIdx_106` (`account_id`) REFERENCES `accounts` (`id`),
KEY `fkIdx_109` (`transaction_id`),
CONSTRAINT `FK_109` FOREIGN KEY `fkIdx_109` (`transaction_id`) REFERENCES `transactions` (`id`)
);

#Tony Stark account transaction
INSERT INTO account_transactions (account_id, transaction_id) VALUES('c7d63189-07f8-4ea8-9a62-37a7b8cfe973' ,'a71169e0-9d70-4aaa-a639-d9d04fbb11bf');

INSERT INTO account_transactions (account_id, transaction_id) VALUES('c7d63189-07f8-4ea8-9a62-37a7b8cfe973','6c2f3e3d-2fe1-4acb-8033-6356eb4f64bb');
