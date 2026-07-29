-- =============================================================================
-- Vehicle: public "Starting from" price (customer-facing)
-- Keep dailyCharge / weeklyCharge / monthlyCharge for internal/admin use.
-- =============================================================================
-- Run on hosted MySQL (phpMyAdmin). Safe to run once.
-- =============================================================================

ALTER TABLE `vehicle`
  ADD COLUMN `startingFromCharge` decimal(12,2) DEFAULT NULL AFTER `monthlyCharge`;

-- Backfill from client spreadsheet (Number plate → Starting From LKR)
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CAV2940';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBH7053';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBD1826';
UPDATE `vehicle` SET `startingFromCharge` = 11000 WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBG0932';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBI2070';
UPDATE `vehicle` SET `startingFromCharge` = 8500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBM3556';
UPDATE `vehicle` SET `startingFromCharge` = 8500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBM3557';
UPDATE `vehicle` SET `startingFromCharge` = 8500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBM3558';
UPDATE `vehicle` SET `startingFromCharge` = 11000 WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CAP4898';
UPDATE `vehicle` SET `startingFromCharge` = 8000  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CAE5685';
UPDATE `vehicle` SET `startingFromCharge` = 10500 WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBJ8653';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBK7998';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBF2869';
UPDATE `vehicle` SET `startingFromCharge` = 17500 WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CAQ0009';
UPDATE `vehicle` SET `startingFromCharge` = 13500 WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'KN2087';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBA6203';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBL5813';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CAV0987';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBO4695';
UPDATE `vehicle` SET `startingFromCharge` = 7500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBO7530';
UPDATE `vehicle` SET `startingFromCharge` = 8500  WHERE REPLACE(UPPER(TRIM(`NumberPlate`)), ' ', '') = 'CBY6015';
