-- =============================================================================
-- Blog SEO: optional meta title / description for SERP snippets
-- =============================================================================
-- Run on hosted MySQL after 20260725_blog.sql
-- =============================================================================

ALTER TABLE `blog`
  ADD COLUMN `metaTitle` varchar(70) DEFAULT NULL AFTER `excerpt`,
  ADD COLUMN `metaDescription` varchar(160) DEFAULT NULL AFTER `metaTitle`;
