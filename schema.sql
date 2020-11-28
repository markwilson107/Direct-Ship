-- SCHEMA
DROP DATABASE IF EXISTS directshipDB;
CREATE DATABASE directshipDB;

USE directshipDB;

CREATE TABLE tblCustomers (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50),
  `address` TEXT,
  `contact` VARCHAR(50),
  `phone` VARCHAR(15),
  PRIMARY KEY (`id`)
);

CREATE TABLE tblFreightMethods (
  `id` INT NOT NULL AUTO_INCREMENT,
  `freightMethod` VARCHAR(50),
  PRIMARY KEY (`id`)
);

CREATE TABLE tblStatus (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(30),
  PRIMARY KEY (`id`)
);

CREATE TABLE tblUsers (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50),
  `password` VARCHAR(50),
  `email` VARCHAR(50),
  `active` BOOLEAN,
  PRIMARY KEY (`id`)
);

CREATE TABLE tblRequests (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `requestingBranch` INT,
  `requiringBranch` INT,
  `customerId` INT,
  `ibt` VARCHAR(15),
  `proforma` VARCHAR(15),
  `branchInvoice` INT(10),
  `parts` TEXT,
  `freightCostAllocation` VARCHAR(10),
  `freightMethod` INT,
  `notes` TEXT,
  `status` INT,
  KEY `tblrequests_fk_freightmethod` (`freightMethod`),
  KEY `tblrequests_fk_customer` (`customerId`),
  KEY `tblrequests_fk_user` (`userId`),
  KEY `tblrequests_fk_status` (`status`),
  CONSTRAINT `tblrequests_fk_customer` FOREIGN KEY (`customerId`) REFERENCES `tblcustomers` (`id`),
  CONSTRAINT `tblrequests_fk_freightmethod` FOREIGN KEY (`freightMethod`) REFERENCES `tblfreightmethods` (`id`),
  CONSTRAINT `tblrequests_fk_status` FOREIGN KEY (`status`) REFERENCES `tblstatus` (`id`),
  CONSTRAINT `tblrequests_fk_user` FOREIGN KEY (`userId`) REFERENCES `tblcustomers` (`id`),
  PRIMARY KEY (`id`)
) ;
