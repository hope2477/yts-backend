const commonRepository = require('../repositories/commonRepository');

class CommonService {
    async getAllFeaturedListings() {
        return commonRepository.getFeaturedListings();
      }
  }
  
  module.exports = new CommonService();
  