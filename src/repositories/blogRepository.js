const db = require('../config/database');
const imageUploadHelper = require('../utils/imageUploadHelper');

function parseJsonField(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/** MariaDB BIT(1) often comes back as Buffer — Boolean(Buffer) is always true. */
function bitToBoolean(value) {
  if (Buffer.isBuffer(value)) return value[0] === 1;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'boolean') return value;
  if (value == null) return false;
  return Boolean(Number(value));
}

/** Literal for BIT columns — parameterized 0/1 is unreliable on MariaDB BIT(1). */
function bitLiteral(on) {
  return on ? "b'1'" : "b'0'";
}

function resolveCoverImage(coverImage) {
  if (!coverImage) return '';
  if (
    coverImage.startsWith('http://') ||
    coverImage.startsWith('https://') ||
    coverImage.startsWith('data:') ||
    coverImage.startsWith('/')
  ) {
    return coverImage;
  }
  return imageUploadHelper.getImageUrl(coverImage);
}

function mapBlogRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    metaTitle: row.metaTitle || '',
    metaDescription: row.metaDescription || '',
    category: row.category,
    author: row.author,
    publishedAt:
      row.publishedAt instanceof Date
        ? row.publishedAt.toISOString().slice(0, 10)
        : String(row.publishedAt).slice(0, 10),
    readingMinutes: Number(row.readingMinutes) || 5,
    coverImage: resolveCoverImage(row.coverImage),
    coverAlt: row.coverAlt || '',
    tags: parseJsonField(row.tags, []),
    body: parseJsonField(row.body, []),
    isFeatured: bitToBoolean(row.isFeatured),
    isPublished: bitToBoolean(row.isPublished),
    isActive: bitToBoolean(row.isActive),
    createdDate: row.createdDate,
    updatedDate: row.updatedDate,
  };
}

class BlogRepository {
  async getPublishedBlogs() {
    const [rows] = await db.query(
      `SELECT * FROM blog
       WHERE CAST(isActive AS UNSIGNED) = 1 AND CAST(isPublished AS UNSIGNED) = 1
       ORDER BY publishedAt DESC, id DESC`
    );
    return rows.map(mapBlogRow);
  }

  async getBlogBySlug(slug, { publishedOnly = true } = {}) {
    let query = `SELECT * FROM blog WHERE slug = ? AND isActive = 1`;
    if (publishedOnly) query += ` AND CAST(isPublished AS UNSIGNED) = 1`;
    const [rows] = await db.query(query, [slug]);
    return mapBlogRow(rows[0]);
  }

  async getAllBlogsForAdmin() {
    const [rows] = await db.query(
      `SELECT * FROM blog
       WHERE isActive = 1
       ORDER BY publishedAt DESC, id DESC`
    );
    return rows.map(mapBlogRow);
  }

  async getBlogById(id) {
    const [rows] = await db.query(`SELECT * FROM blog WHERE id = ? AND isActive = 1`, [id]);
    return mapBlogRow(rows[0]);
  }

  async getBlogByIdIncludingInactive(id) {
    const [rows] = await db.query(`SELECT * FROM blog WHERE id = ?`, [id]);
    return mapBlogRow(rows[0]);
  }

  async slugExists(slug, excludeId = null) {
    let query = `SELECT id FROM blog WHERE slug = ? AND isActive = 1`;
    const params = [slug];
    if (excludeId != null) {
      query += ` AND id <> ?`;
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows.length > 0;
  }

  async createBlog(data) {
    const featuredBit = bitLiteral(Boolean(data.isFeatured));
    const publishedBit = bitLiteral(data.isPublished !== false);
    const [result] = await db.query(
      `INSERT INTO blog (
        slug, title, excerpt, metaTitle, metaDescription, category, author, publishedAt, readingMinutes,
        coverImage, coverAlt, tags, body, isFeatured, isPublished, isActive,
        createdBy, createdDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${featuredBit}, ${publishedBit}, b'1', ?, NOW())`,
      [
        data.slug,
        data.title,
        data.excerpt,
        data.metaTitle || null,
        data.metaDescription || null,
        data.category,
        data.author,
        data.publishedAt,
        data.readingMinutes,
        data.coverImage || null,
        data.coverAlt || null,
        JSON.stringify(data.tags || []),
        JSON.stringify(data.body || []),
        data.createdBy,
      ]
    );
    return result.insertId;
  }

  async updateBlog(id, data) {
    const featuredBit = bitLiteral(Boolean(data.isFeatured));
    const publishedBit = bitLiteral(data.isPublished !== false);
    const [result] = await db.query(
      `UPDATE blog SET
        slug = ?, title = ?, excerpt = ?, metaTitle = ?, metaDescription = ?,
        category = ?, author = ?,
        publishedAt = ?, readingMinutes = ?, coverImage = ?, coverAlt = ?,
        tags = ?, body = ?,
        isFeatured = ${featuredBit}, isPublished = ${publishedBit},
        updatedBy = ?, updatedDate = NOW()
       WHERE id = ? AND isActive = 1`,
      [
        data.slug,
        data.title,
        data.excerpt,
        data.metaTitle || null,
        data.metaDescription || null,
        data.category,
        data.author,
        data.publishedAt,
        data.readingMinutes,
        data.coverImage || null,
        data.coverAlt || null,
        JSON.stringify(data.tags || []),
        JSON.stringify(data.body || []),
        data.updatedBy,
        id,
      ]
    );
    return result.affectedRows > 0;
  }

  async deleteBlog(id, userId) {
    const [result] = await db.query(
      `UPDATE blog SET isActive = b'0', updatedBy = ?, updatedDate = NOW() WHERE id = ?`,
      [userId, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new BlogRepository();
