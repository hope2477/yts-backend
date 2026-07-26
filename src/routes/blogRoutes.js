const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/getAllBlogs', blogController.getAllBlogs.bind(blogController));
router.get('/getBlogBySlug/:slug', blogController.getBlogBySlug.bind(blogController));

module.exports = router;
