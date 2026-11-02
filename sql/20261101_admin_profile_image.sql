-- Admin profile photo, stored as a small JPEG data URL.
-- Run once on hosted MySQL.

ALTER TABLE `admin`
  ADD COLUMN `profileImage` MEDIUMTEXT NULL;
