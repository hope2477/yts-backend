const contactService = require('../services/inquiryService');

class contactController{
    async sendContactUsDetails(req, res) {
        try{const { firstName, lastName, email, phoneNumber, message } = req.body;

        // Validate the required fields
        if (!firstName || !lastName || !email || !phoneNumber || !message) {
          return res.status(400).json({ error: 'All fields are required' });
        }
    
        // Call the service to handle the email sending
        await contactService.sendContactDetails({ firstName, lastName, email, phoneNumber, message });
    
        res.status(200).json({ message: 'Inquiry submitted successfully.' });
      } catch (error) {
        console.error('Error handling inquiry:', error.message, error.stack);  // Log error message and stack trace
        console.error('Error handling inquiry:', error);
        res.status(500).json({ error: error.message });
      }
    }

    async sendInquiryDetails(req, res) {
      try {
          const {
              startDate,
              endDate,
              name,
              email,
              phoneNumber,
              message,
              rentalTypeID,
              vehicleID,
              propertyID,
              holidayHomeID,
          } = req.body;
  
          // Validate required fields
          if (!name || !email || !phoneNumber || !message) {
              return res.status(400).json({ error: 'Name, email, phone number, and message are required.' });
          }
  
          // Call the service to handle the inquiry process
          const result = await contactService.sendInquiryDetails({
              startDate,
              endDate,
              name,
              email,
              phoneNumber,
              message,
              rentalTypeID,
              vehicleID,
              propertyID,
              holidayHomeID,
          });
  
          res.status(200).json({
              message: 'Inquiry submitted successfully.',
              inquiryID: result.inquiryID, // Include inquiry ID in the response
          });
      } catch (error) {
          console.error('Error handling inquiry:', error.message, error.stack);
          res.status(500).json({ error: 'Failed to process your inquiry. Please try again later.' });
      }
  };
}

module.exports = new contactController();