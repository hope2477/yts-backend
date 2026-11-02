-- New admins stay unable to sign in until they set a password.
-- Run once on hosted MySQL. Skip if the column already exists.

ALTER TABLE `admin`
  ADD COLUMN `mustSetPassword` BIT(1) NOT NULL DEFAULT b'0';
