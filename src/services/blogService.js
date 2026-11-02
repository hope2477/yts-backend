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

function normalizeBody(body, { allowEmpty = false } = {}) {
  const emptyBody = [{ type: 'p', text: '' }];
  if (!Array.isArray(body) || body.length === 0) {
    if (allowEmpty) return emptyBody;
    throw new Error('Body must include at least one block');
  }

  const blocks = [];
  for (let index = 0; index < body.length; index += 1) {
    const block = body[index];
    if (!block || !ALLOWED_BLOCK_TYPES.includes(block.type)) {
      throw new Error(`Invalid body block at index ${index}`);
    }
    if (block.type === 'ul') {
      const items = Array.isArray(block.items)
        ? block.items.map((item) => String(item).trim()).filter(Boolean)
        : [];
      if (items.length === 0) {
        if (allowEmpty) continue;
        throw new Error(`List block at index ${index} needs items`);
      }
      blocks.push({ type: 'ul', items });
      continue;
    }
    const text = String(block.text || '').trim();
    if (!text) {
      if (allowEmpty) continue;
      throw new Error(`Block at index ${index} needs text`);
    }
    blocks.push({ type: block.type, text });
  }

  if (blocks.length === 0) {
    if (allowEmpty) return emptyBody;
    throw new Error('Body must include at least one block');
  }
  return blocks;
}

function isDraft(input) {
  return input.isPublished === false || input.isPublished === 0;
}

function publishedDate(value, draft) {
  const text = String(value || '').slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  if (draft) return new Date().toISOString().slice(0, 10);
  throw new Error('Published date is required');
}

function prepareBlog(input, draft) {
  const title = String(input.title || '').trim();
  if (!title) throw new Error('Title is required');

  const slug = slugify(input.slug || title);
  if (!slug) throw new Error('Slug is required');

  let category = input.category;
  if (!ALLOWED_CATEGORIES.includes(category)) {
    if (!draft) {
      throw new Error(`Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
    }
    category = 'Travel tips';
  }

  const excerpt = String(input.excerpt || '').trim();
  const author = String(input.author || '').trim();
  if (!draft) {
    if (!excerpt) throw new Error('Summary is required');
    if (!author) throw new Error('Author is required');
    if (!input.coverImage) throw new Error('Cover image is required');
  }

  return {
    slug,
    title,
    excerpt,
    category,
    author,
    publishedAt: publishedDate(input.publishedAt, draft),
    body: normalizeBody(input.body, { allowEmpty: draft }),
  };
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
    if (input.createdBy == null || input.createdBy === '') {
      throw new Error('Missing required fields: createdBy');
    }
    const draft = isDraft(input);
    const prepared = prepareBlog(input, draft);
    if (await blogRepository.slugExists(prepared.slug)) {
      throw new Error('A blog with this slug already exists');
    }

    const tags = normalizeTags(input.tags);
    const coverImage = await resolveCoverImageForSave(input.coverImage, prepared.slug);

    return blogRepository.createBlog({
      ...prepared,
      metaTitle: clip(input.metaTitle, 70),
      metaDescription: clip(input.metaDescription, 160),
      readingMinutes: Number(input.readingMinutes) || 5,
      coverImage,
      coverAlt: input.coverAlt ? String(input.coverAlt).trim() : '',
      tags,
      isFeatured: Boolean(input.isFeatured),
      isPublished: !draft,
      createdBy: input.createdBy,
    });
  }

  async updateBlog(id, input) {
    const existing = await blogRepository.getBlogById(id);
    if (!existing) return false;

    const draft = isDraft(input);
    const prepared = prepareBlog(input, draft);
    if (await blogRepository.slugExists(prepared.slug, id)) {
      throw new Error('A blog with this slug already exists');
    }

    const tags = normalizeTags(input.tags);
    const coverImage = await resolveCoverImageForSave(input.coverImage, prepared.slug);

    return blogRepository.updateBlog(id, {
      ...prepared,
      metaTitle: clip(input.metaTitle, 70),
      metaDescription: clip(input.metaDescription, 160),
      readingMinutes: Number(input.readingMinutes) || 5,
      coverImage,
      coverAlt: input.coverAlt ? String(input.coverAlt).trim() : '',
      tags,
      isFeatured: Boolean(input.isFeatured),
      isPublished: !draft,
      updatedBy: input.updatedBy,
    });
  }

  async deleteBlog(id, userId) {
    return blogRepository.deleteBlog(id, userId);
  }
}

module.exports = new BlogService();
