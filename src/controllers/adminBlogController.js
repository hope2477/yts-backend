const blogService = require('../services/blogService');

class AdminBlogController {
  async getAllBlogs(req, res) {
    try {
      const blogs = await blogService.getAllBlogsForAdmin();
      res.json({ success: true, data: blogs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getBlogById(req, res) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, error: 'Blog not found' });
      }
      res.json({ success: true, data: blog });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createBlog(req, res) {
    try {
      const blogId = await blogService.createBlog({
        ...req.body,
        createdBy: req.user.id,
      });
      res.status(201).json({ success: true, data: { blogId } });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async updateBlog(req, res) {
    try {
      const success = await blogService.updateBlog(req.params.id, {
        ...req.body,
        updatedBy: req.user.id,
      });
      if (!success) {
        return res.status(404).json({ success: false, error: 'Blog not found' });
      }
      res.json({ success: true, message: 'Blog updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async deleteBlog(req, res) {
    try {
      const success = await blogService.deleteBlog(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Blog not found' });
      }
      res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AdminBlogController();
