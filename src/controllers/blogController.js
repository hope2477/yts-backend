const blogService = require('../services/blogService');

class BlogController {
  async getAllBlogs(req, res) {
    try {
      const blogs = await blogService.getPublishedBlogs();
      res.json({ success: true, data: blogs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getBlogBySlug(req, res) {
    try {
      const { slug } = req.params;
      const blog = await blogService.getBlogBySlug(slug);
      if (!blog) {
        return res.status(404).json({ success: false, error: 'Blog not found' });
      }
      res.json({ success: true, data: blog });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new BlogController();
