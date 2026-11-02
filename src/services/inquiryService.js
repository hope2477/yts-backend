const { loadEmailTemplate, escapeHtml } = require('../helpers/emailTemplateHelper');

function formatInquiryDate(value) {
    if (value == null || String(value).trim() === '') return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const label = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return label === 'Invalid Date' ? '' : label;
}

function buildInquiryDateRow(startDate, endDate) {
    const startLabel = formatInquiryDate(startDate);
    const endLabel = formatInquiryDate(endDate);
    if (!startLabel || !endLabel) return '';
    const dateDetails = startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
    return `<p style="margin:0 0 10px 0;"><strong style="color:#0a1628;">Date:</strong> ${escapeHtml(dateDetails)}</p>`;
}
const emailHelper = require('../helpers/emailHelper');
const inquiryRepository = require('../repositories/inquiryRepository');
const commonRepository = require('../repositories/commonRepository');
const vehicleRepository = require('../repositories/vehicleRepository');
const propertyRepository = require('../repositories/propertyRepository');

class InquiryService {
    // Admin-specific methods
    async getAllInquiriesForAdmin({ page, limit, status, rentalType, startDate, endDate }) {
        return inquiryRepository.getAllInquiriesForAdmin({ page, limit, status, rentalType, startDate, endDate });
    }

    async getInquiryByIdForAdmin(id) {
        return inquiryRepository.getInquiryByIdForAdmin(id);
    }

    async updateInquiryStatus(id, status, remarks, userId) {
        const key = String(status || '').trim().toLowerCase();
        const canonical = key === 'pending'
            ? 'Pending'
            : key === 'in progress'
                ? 'In progress'
                : key === 'done'
                    ? 'Done'
                    : null;
        if (!canonical) {
            throw new Error('Status must be Pending, In progress, or Done');
        }
        return inquiryRepository.updateInquiryStatus(id, canonical, remarks, userId);
    }

    async deleteInquiry(id) {
        return inquiryRepository.deleteInquiry(id);
    }

    async getInquiryStats() {
        return inquiryRepository.getInquiryStats();
    }

    async sendContactDetails({ firstName, lastName, email, phoneNumber, message }) {
        const companyEmailBody = loadEmailTemplate('email-contact-details.html', {
            firstName,
            lastName,
            email,
            phoneNumber,
            message,
        });

        const customerEmailBody = loadEmailTemplate('email-acknowledge.html', {
            name: `${firstName} ${lastName}`,
        });

        // Fire both in parallel without blocking the HTTP response
        Promise.all([
            emailHelper.sendEmailSafe({
                to: process.env.SUPPORT_EMAIL,
                subject: `Contact Us Inquiry from ${firstName} ${lastName}`,
                html: companyEmailBody,
            }),
            emailHelper.sendEmailSafe({
                to: email,
                subject: `Thank you for reaching out to us!`,
                html: customerEmailBody,
            }),
        ]).catch((err) => {
            console.error('Contact email batch failed:', err.message);
        });
    }

    async sendInquiryDetails({
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
    }) {
        try {
            let rentalDetails = '';
            let customerRentalDetails = '';
            // Save the inquiry details to the database first
            const now = new Date();
            const inquiryData = {
                name,
                email,
                contactNumber: phoneNumber,
                message,
                status: 'Pending',
                remarks: null,
                rentalTypeID: rentalTypeID || null,
                vehicleID: vehicleID || null,
                holidayHomeID: holidayHomeID || null,
                propertyID: propertyID || null,
                startDate: startDate || null,
                endDate: endDate || null,
                createdDate: now,
                updatedDate: now,
                updatedBy: 0,
            };

            const inquiryID = await inquiryRepository.saveInquiry(inquiryData);
            const rentalType = await commonRepository.getRentalTypeName(rentalTypeID);

            if (rentalTypeID == 1) {
                const vehicle = (await vehicleRepository.getVehicleByID(vehicleID)).data;
                if (vehicle) {
                    rentalDetails = `${vehicle.make} ${vehicle.model} - ${vehicle.NumberPlate}`;
                    customerRentalDetails = `${vehicle.make} ${vehicle.model}`;
                } else {
                    rentalDetails = `Vehicle with ID ${vehicleID} not found.`;
                }
            } else if (rentalTypeID == 2) {
                const property = (await propertyRepository.getPropertyByID(propertyID)).data;
                if (property) {
                    rentalDetails = property.name;
                } else {
                    rentalDetails = `Property with ID ${propertyID} not found.`;
                }
            } else if (rentalTypeID == 3) {
                rentalDetails = 'Newlands Bungalow Galle';
            }
            if (!customerRentalDetails) customerRentalDetails = rentalDetails;

            const dateRow = buildInquiryDateRow(startDate, endDate);

            const companyEmailBody = loadEmailTemplate(
                'email-inquiry-details.html',
                {
                    name,
                    email,
                    phoneNumber,
                    message,
                    dateRow,
                    rentalType,
                    rentalDetails,
                },
                { rawKeys: ['dateRow'] }
            );

            const customerEmailBody = loadEmailTemplate(
                'inquiry-email-acknowledge.html',
                {
                    name,
                    email,
                    phoneNumber,
                    message,
                    dateRow,
                    rentalType,
                    rentalDetails: customerRentalDetails,
                },
                { rawKeys: ['dateRow'] }
            );

            // Return success immediately; send both emails in the background
            Promise.all([
                emailHelper.sendEmailSafe({
                    to: process.env.SUPPORT_EMAIL,
                    subject: `${rentalType} Inquiry from ${name}`,
                    html: companyEmailBody,
                }),
                emailHelper.sendEmailSafe({
                    to: email,
                    subject: 'Thank You for Your Inquiry!',
                    html: customerEmailBody,
                }),
            ]).catch((err) => {
                console.error('Inquiry email batch failed:', err.message);
            });

            return { inquiryID };
        } catch (error) {
            console.error('Error in sendInquiryDetails service:', error.message, error.stack);
            throw new Error('Failed to handle the inquiry process.');
        }
    }
}

module.exports = new InquiryService();
