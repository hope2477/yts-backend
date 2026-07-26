const fs = require('fs');
const path = require('path');

const DEFAULT_SITE_URL = 'https://www.ytsenterprise.com';
const DEFAULT_LOGO_URL = 'https://www.ytsenterprise.com/images/yts-logo.png';
const LOGO_CID = 'yts-logo@ytsenterprise.com';
const LOGO_ASSET_PATH = path.join(__dirname, '../assets/yts-logo.png');

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getBrandDefaults() {
  const siteUrl = (process.env.FRONTEND_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
  // Default: hosted image URL (no attachment). CID attachments often mark mail as
  // "has attachment" and hurt Gmail spam scoring on shared hosting.
  // Set EMAIL_USE_CID_LOGO=true to embed the logo as an inline attachment again.
  const useCid = String(process.env.EMAIL_USE_CID_LOGO || '').toLowerCase() === 'true';
  const logoUrl =
    process.env.EMAIL_LOGO_URL ||
    (useCid && fs.existsSync(LOGO_ASSET_PATH) ? `cid:${LOGO_CID}` : DEFAULT_LOGO_URL);
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@ytsenterprise.com';

  return { logoUrl, siteUrl, supportEmail };
}

/**
 * Load an HTML email template and substitute ${placeholders}.
 * Always injects logoUrl, siteUrl, supportEmail.
 * User-provided variables are HTML-escaped unless listed in options.rawKeys.
 */
const loadEmailTemplate = (templateName, variables = {}, options = {}) => {
  const templatePath = path.join(__dirname, '../templates', templateName);
  let template = fs.readFileSync(templatePath, 'utf8');

  // URLs used in href/src should not be entity-escaped (except controlled brand defaults)
  const rawKeys = new Set([
    'logoUrl',
    'siteUrl',
    'supportEmail',
    'loginUrl',
    'resetLink',
    ...(options.rawKeys || []),
  ]);
  const brand = getBrandDefaults();
  const merged = { ...brand, ...variables };

  for (const key of Object.keys(merged)) {
    const raw = merged[key];
    const value = rawKeys.has(key)
      ? raw == null
        ? ''
        : String(raw)
      : escapeHtml(raw);
    const placeholder = new RegExp(`\\$\\{${key}\\}`, 'g');
    template = template.replace(placeholder, value);
  }

  return template;
};

module.exports = { loadEmailTemplate, escapeHtml };
