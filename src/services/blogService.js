const blogRepository = require('../repositories/blogRepository');
const imageUploadHelper = require('../utils/imageUploadHelper');

const ALLOWED_CATEGORIES = ['Car rentals', 'Holiday stays', 'Properties', 'Travel tips'];
const ALLOWED_BLOCK_TYPES = ['p', 'h2', 'ul', 'quote'];

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeBody(body) {
  if (!Array.isArray(body) || body.length === 0) {
    throw new Error('Body must include at least one block');
  }

  return body.map((block, index) => {
    if (!block || !ALLOWED_BLOCK_TYPES.includes(block.type)) {
      throw new Error(`Invalid body block at index ${index}`);
    }
    if (block.type === 'ul') {
      if (!Array.isArray(block.items) || block.items.length === 0) {
        throw new Error(`List block at index ${index} needs items`);
      }
      return {
        type: 'ul',
        items: block.items.map((item) => String(item).trim()).filter(Boolean),
      };
    }
    const text = String(block.text || '').trim();
    if (!text) {
      throw new Error(`Block at index ${index} needs text`);
    }
    return { type: block.type, text };
  });
}

async function resolveCoverImageForSave(coverImage, slug) {
  if (!coverImage) return null;
  if (typeof coverImage !== 'string') {
    throw new Error('Invalid cover image');
  }
  if (coverImage.startsWith('data:image/')) {
    const filename = await imageUploadHelper.saveBase64Image(
      coverImage,
      `blog-${slugify(slug) || 'post'}-1`
    );
    return filename;
  }
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    return coverImage;
  }
  // filename only (existing upload)
  return coverImage.split('/').pop() || coverImage;
}

function clip(value, max) {
  const text = String(value || '').trim();
  if (!text) return '';
  return text.slice(0, max);
}

class BlogService {
  async getPublishedBlogs() {
    return blogRepository.getPublishedBlogs();
  }

  async getBlogBySlug(slug) {
    return blogRepository.getBlogBySlug(slug, { publishedOnly: true });
  }

  async getAllBlogsForAdmin() {
    return blogRepository.getAllBlogsForAdmin();
  }

  async getBlogById(id) {
    return blogRepository.getBlogById(id);
  }

  async createBlog(input) {
    const required = ['title', 'excerpt', 'category', 'author', 'publishedAt', 'createdBy'];
    const missing = required.filter((field) => input[field] == null || input[field] === '');
    if (missing.length) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    if (!ALLOWED_CATEGORIES.includes(input.category)) {
      throw new Error(`Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
    }

    const slug = slugify(input.slug || input.title);
    if (!slug) throw new Error('Slug is required');
    if (await blogRepository.slugExists(slug)) {
      throw new Error('A blog with this slug already exists');
    }

    const body = normalizeBody(input.body);
    const tags = normalizeTags(input.tags);
    const coverImage = await resolveCoverImageForSave(input.coverImage, slug);

    return blogRepository.createBlog({
      slug,
      title: String(input.title).trim(),
      excerpt: String(input.excerpt).trim(),
      metaTitle: clip(input.metaTitle, 70),
      metaDescription: clip(input.metaDescription, 160),
      category: input.category,
      author: String(input.author).trim(),
      publishedAt: String(input.publishedAt).slice(0, 10),
      readingMinutes: Number(input.readingMinutes) || 5,
      coverImage,
      coverAlt: input.coverAlt ? String(input.coverAlt).trim() : '',
      tags,
      body,
      isFeatured: Boolean(input.isFeatured),
      isPublished: input.isPublished !== false && input.isPublished !== 0,
      createdBy: input.createdBy,
    });
  }

  async updateBlog(id, input) {
    const existing = await blogRepository.getBlogById(id);
    if (!existing) return false;

    if (!ALLOWED_CATEGORIES.includes(input.category)) {
      throw new Error(`Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
    }

    const slug = slugify(input.slug || input.title);
    if (!slug) throw new Error('Slug is required');
    if (await blogRepository.slugExists(slug, id)) {
      throw new Error('A blog with this slug already exists');
    }

    const body = normalizeBody(input.body);
    const tags = normalizeTags(input.tags);
    const coverImage = await resolveCoverImageForSave(input.coverImage, slug);

    return blogRepository.updateBlog(id, {
      slug,
      title: String(input.title).trim(),
      excerpt: String(input.excerpt).trim(),
      metaTitle: clip(input.metaTitle, 70),
      metaDescription: clip(input.metaDescription, 160),
      category: input.category,
      author: String(input.author).trim(),
      publishedAt: String(input.publishedAt).slice(0, 10),
      readingMinutes: Number(input.readingMinutes) || 5,
      coverImage,
      coverAlt: input.coverAlt ? String(input.coverAlt).trim() : '',
      tags,
      body,
      isFeatured: Boolean(input.isFeatured),
      isPublished: input.isPublished !== false && input.isPublished !== 0,
      updatedBy: input.updatedBy,
    });
  }

  async deleteBlog(id, userId) {
    return blogRepository.deleteBlog(id, userId);
  }
}

module.exports = new BlogService();
