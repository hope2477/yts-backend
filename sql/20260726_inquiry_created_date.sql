-- =============================================================================
-- Inquiry createdDate — only run what's still needed
-- =============================================================================
-- If phpMyAdmin already shows `createdDate`, do NOT run ADD COLUMN
-- (you'll get #1060 Duplicate column name).
-- =============================================================================

-- 1) Backfill any NULL createdDate rows (safe to re-run)
UPDATE `inquiry`
SET `createdDate` = COALESCE(`updatedDate`, NOW())
WHERE `createdDate` IS NULL;

-- 2) Optional index (skip if it already exists)
-- ALTER TABLE `inquiry` ADD INDEX `idx_inquiry_createdDate` (`createdDate`);
