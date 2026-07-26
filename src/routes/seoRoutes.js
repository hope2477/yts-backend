const express = require('express');
const seoController = require('../controllers/seoController');

const router = express.Router();

router.get('/sitemap.xml', seoController.getSitemap.bind(seoController));

module.exports = router;
