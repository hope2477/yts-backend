const commonService = require('../services/commonService');

class CommonController {
    // Get all featured Listings
    async getAllFeaturedListings(req, res) {
      try {
        const featuredListings = await commonService.getAllFeaturedListings();
        res.json(featuredListings);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  }
  
  module.exports = new CommonController();
  