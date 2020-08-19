CREATE TABLE IF NOT EXISTS `student_accounts`
(
 `student_id` varchar(64) NOT NULL ,
 `account_id` varchar(64) NOT NULL ,

KEY `fkIdx_87` (`student_id`),
CONSTRAINT `FK_87` FOREIGN KEY `fkIdx_87` (`student_id`) REFERENCES `students` (`id`),
KEY `fkIdx_90` (`account_id`),
CONSTRAINT `FK_90` FOREIGN KEY `fkIdx_90` (`account_id`) REFERENCES `accounts` (`id`)
);