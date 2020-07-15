CREATE DATABASE IF NOT EXISTS fontina;

USE fontina;

-- ****************** SqlDBM: MySQL ******************;
-- ***************************************************;


-- ************************************** `students`

CREATE TABLE IF NOT EXISTS `students`
(
 `id`                        varchar(64) NOT NULL ,
 `firstName`                 text NOT NULL ,
 `lastName`                  text NOT NULL ,
 `dateOfBirth`               date NOT NULL ,
 `emailAddress`              mediumtext NOT NULL ,
 `createdAt`                 datetime NOT NULL ,
 `lastModifiedAt`             datetime NULL ,
 `profileImageURL`           mediumtext NULL ,
 `anticipatedGraduationDate` date NOT NULL ,
 `enrolledAt`                mediumtext NOT NULL ,
 `entityName`                text NOT NULL ,
 `entityVersion`             text NOT NULL ,
 `isAccountActivated`        boolean NOT NULL ,
 `status`                    text NULL ,

PRIMARY KEY (`id`)
);

#Tony Stark
INSERT INTO students (id, firstName, lastName, dateOfBirth, emailAddress, createdAt, lastModifiedAt, profileImageURL, anticipatedGraduationDate, enrolledAt, entityName, entityVersion, isAccountActivated, status)
VALUES ('1d2b3f93-804b-4e02-94ad-2eec6b90997d', 'Tony', 'Stark', '1000-01-01', 'tstark@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', '1004-05-30', 'P.S. 118', 'student', '0.0.1', false, NULL);  

#Peter Parker
INSERT INTO students (id, firstName, lastName, dateOfBirth, emailAddress, createdAt, lastModifiedAt, profileImageURL, anticipatedGraduationDate, enrolledAt, entityName, entityVersion, isAccountActivated, status)
VALUES ('2294a21b-ba63-4e5e-b537-d61ba40e4a65', 'Peter', 'Parker', '1000-01-01', 'pparker@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', '1004-05-30', 'P.S. 118', 'student', '0.0.1', false, NULL);  


-- ************************************** `sponsors`

CREATE TABLE IF NOT EXISTS `sponsors`
(
 `id`                 varchar(64) NOT NULL ,
 `firstName`          text NOT NULL ,
 `lastName`           text NOT NULL ,
 `emailAddress`       mediumtext NOT NULL ,
 `createdAt`          datetime NOT NULL ,
 `lastModifiedAt`     datetime NULL ,
 `profileImageURL`    mediumtext NULL ,
 `entityName`         text NOT NULL ,
 `entityVersion`      text NOT NULL ,
 `isAccountActivated` boolean NOT NULL ,
 `status`             text NULL ,

PRIMARY KEY (`id`)
);

#Steve Rogers
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, entityName, entityVersion, isAccountActivated, status)
VALUES ('2a1acb10-8d2b-4248-a74e-a8418f941dd9', 'Steve', 'Rogers', 'srogers@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', 'sponsor', '0.0.1', false, NULL);  

#Natasha Romanoff
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, entityName, entityVersion, isAccountActivated, status)
VALUES ('f50ef714-5a51-4a0b-a3e5-99529ba41fce', 'Natasha', 'Romanoff', 'nromanoff@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', 'sponsor', '0.0.1', false, NULL); 

#Bruce Banner
INSERT INTO sponsors (id, firstName, lastName, emailAddress, createdAt, lastModifiedAt, profileImageURL, entityName, entityVersion, isAccountActivated, status)
VALUES ('b20cdf59-b121-4b00-9e43-d2c48e2cf98f', 'Bruce', 'Banner', 'bbanner@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', 'sponsor', '0.0.1', false, NULL);

-- ************************************** `student_sponsors`

CREATE TABLE IF NOT EXISTS `student_sponsors`
(
 `sponsor_id` varchar(64) NOT NULL ,
 `student_id` varchar(64) NOT NULL ,

KEY `fkIdx_35` (`sponsor_id`),
CONSTRAINT `FK_35` FOREIGN KEY `fkIdx_35` (`sponsor_id`) REFERENCES `sponsors` (`id`),
KEY `fkIdx_41` (`student_id`),
CONSTRAINT `FK_41` FOREIGN KEY `fkIdx_41` (`student_id`) REFERENCES `students` (`id`)
);

#Tony Stark => Steve Rogers
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('1d2b3f93-804b-4e02-94ad-2eec6b90997d' ,'2a1acb10-8d2b-4248-a74e-a8418f941dd9');

#Tony Stark => Natasha Romanoff
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('1d2b3f93-804b-4e02-94ad-2eec6b90997d' ,'f50ef714-5a51-4a0b-a3e5-99529ba41fce');

#Peter Parker => Natasha Romanoff 
INSERT INTO student_sponsors (student_id, sponsor_id) VALUES('2294a21b-ba63-4e5e-b537-d61ba40e4a65' ,'f50ef714-5a51-4a0b-a3e5-99529ba41fce');
