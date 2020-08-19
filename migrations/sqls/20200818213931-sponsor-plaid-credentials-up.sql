CREATE TABLE IF NOT EXISTS `sponsor_plaid_credentials`
(
 `sponsor_id`   varchar(64) NOT NULL ,
 `item_id`      text NOT NULL ,
 `access_token` text NOT NULL ,

KEY `fkIdx_116` (`sponsor_id`),
CONSTRAINT `FK_116` FOREIGN KEY `fkIdx_116` (`sponsor_id`) REFERENCES `sponsors` (`id`)
);