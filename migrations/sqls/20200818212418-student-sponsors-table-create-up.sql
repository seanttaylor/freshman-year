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