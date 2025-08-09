const { loadEmailTemplate } = require('../helpers/emailTemplateHelper');
const emailHelper = require('../helpers/emailHelper');
const inquiryRepository = require('../repositories/inquiryRepository');
const commonRepository = require('../repositories/commonRepository');
const vehicleRepository = require('../repositories/vehicleRepository');
const propertyRepository = require('../repositories/propertyRepository');

exports.sendContactDetails = async ({ firstName, lastName, email, phoneNumber, message }) => {
    const companyEmailBody = loadEmailTemplate('email-contact-details.html', { firstName, lastName, email, phoneNumber, message });

    const customerEmailBody = loadEmailTemplate('email-acknowledge.html', { name: `${firstName} ${lastName}` });

    // Send email to the company
    await emailHelper.sendEmail({
        to: process.env.SUPPORT_EMAIL,
        subject: `Contact Us Inquiry from ${firstName} ${lastName}`,
        html: companyEmailBody,
    });

    // Send acknowledgment email to the customer
    await emailHelper.sendEmail({
        to: email,
        subject: `Thank you for reaching out to us!`,
        html: customerEmailBody,
    });
};

exports.sendInquiryDetails = async ({
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
}) => {
    try {
        let rentalDetails = "";
        let dateDetails = "";
        // Save the inquiry details to the database
        const inquiryData = {
            name,
            email,
            contactNumber: phoneNumber,
            message,
            status: 'Pending', // Default status
            remarks: null, // Optional remarks
            rentalTypeID: rentalTypeID || null,
            vehicleID: vehicleID || null,
            holidayHomeID: holidayHomeID || null,
            propertyID: propertyID || null,
            startDate: startDate || null,
            endDate: endDate || null,
            updatedDate: new Date(),
            updatedBy: 'System', // Or replace with user info
        };

        const inquiryID = await inquiryRepository.saveInquiry(inquiryData);
        const rentalType = await commonRepository.getRentalTypeName(rentalTypeID);

        if(rentalTypeID == 1)
        {
            const vehicle = (await vehicleRepository.getVehicleByID(vehicleID)).data;
            if (vehicle) {
                rentalDetails = `${vehicle.make} ${vehicle.model} - ${vehicle.NumberPlate}`;
            } else {
                rentalDetails = `Vehicle with ID ${vehicleID} not found.`;
            }
            
        }else if (rentalTypeID == 2)
        {
            rentalDetails = await propertyRepository.getPropertyByID(propertyID).data.name;
        }else if (rentalTypeID == 3) 
        {
            rentalDetails = "Newlands Bungalow Galle";
        }

        dateDetails = startDate === endDate
        ? new Date(startDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : `${new Date(startDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })} - ${new Date(endDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })}`;

        // Prepare email bodies
        const companyEmailBody = loadEmailTemplate('email-inquiry-details.html', {
            name,
            email,
            phoneNumber,
            message,
            dateDetails,
            rentalType,
            rentalDetails
        });

        const customerEmailBody = loadEmailTemplate('inquiry-email-acknowledge.html', {
            name,
            email,
            phoneNumber,
            message,
            dateDetails,
            rentalType,
            rentalDetails
        });

        // Send email to the company
        await emailHelper.sendEmail({
            to: process.env.SUPPORT_EMAIL,
            subject: `${rentalType} Inquiry from ${name}`,
            html: companyEmailBody,
        });

        // Send acknowledgment email to the customer
        await emailHelper.sendEmail({
            to: email,
            subject: 'Thank You for Your Inquiry!',
            html: customerEmailBody,
        });

        return { inquiryID }; // Return the inquiry ID for tracking purposes
    } catch (error) {
        console.error('Error in sendInquiryDetails service:', error.message, error.stack);
        throw new Error('Failed to handle the inquiry process.');
    }
};