

INSERT INTO `directshipdb`.`users` (`firstname`, `lastname`, `username`, `password`, `status`, `createdAt`, `updatedAt`) 
VALUES ('Dave', 'Dobbin', 'dave@email.com', 'asrgyhjsd9buxc', 'inactive', '2020-11-28 13:24:00', '2020-11-28 13:24:00');

INSERT INTO `directshipdb`.`customers` (`name`, `address`, `contact`, `phone`, `createdAt`, `updatedAt`) 
VALUES ('Jim\'s Junkets', 'Jimtown', 'Jim', '8788', '2020-11-28 13:24:00', '2020-11-28 13:24:00');
INSERT INTO `directshipdb`.`customers` (`name`, `address`, `contact`, `phone`, `createdAt`, `updatedAt`) 
VALUES ('Bob\'s Trucks', 'Bobville', 'Bob', '47437', '2020-11-28 13:24:00', '2020-11-28 13:24:00');


INSERT INTO `directshipdb`.`statuses` (`status`, `createdAt`, `updatedAt`) VALUES ('New', '20-11-28 13:24:00', '20-11-28 13:24:00');
INSERT INTO `directshipdb`.`statuses` (`status`, `createdAt`, `updatedAt`) VALUES ('Complete', '20-11-28 13:24:00', '20-11-28 13:24:00');
INSERT INTO `directshipdb`.`statuses` (`status`, `createdAt`, `updatedAt`) VALUES ('Archived', '20-11-28 13:24:00', '20-11-28 13:24:00');

INSERT INTO `directshipdb`.`freightmethods` (`freightMethod`, `createdAt`, `updatedAt`) VALUES ('TNT', '20-11-28 13:24:00', '20-11-28 13:24:00');
INSERT INTO `directshipdb`.`freightmethods` (`freightMethod`, `createdAt`, `updatedAt`) VALUES ('Toll', '20-11-28 13:24:00', '20-11-28 13:24:00');