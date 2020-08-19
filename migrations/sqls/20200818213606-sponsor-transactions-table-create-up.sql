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