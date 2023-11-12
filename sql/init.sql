DROP DATABASE IF EXISTS `arcaea`;
CREATE DATABASE `arcaea`; 
USE `arcaea`;

SET NAMES utf8 ;
SET character_set_client = utf8mb4 ;

CREATE TABLE `user` (
  `account` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- INSERT INTO `user` VALUES ('GUYwcnm','616SB');

CREATE TABLE `grade` (
  `account` varchar(50) NOT NULL,
  `grade` LONGTEXT NOT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `comment` (
  `id` INT NOT NULL,
  `account` varchar(50) NOT NULL,
  `comment` varchar(5000) NOT NULL,
  `like` INT NOT NULL,
  `fun` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- INSERT INTO `user` VALUES (1,'GUYwcnm','616SB');