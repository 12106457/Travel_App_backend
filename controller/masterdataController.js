const fs = require('fs');
const path = require('path');

const couponCategoryData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'optionList/adminpanel/couponCategory.json')));
const discountTypeData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'optionList/adminpanel/discountType.json')));
const typeOfBookingData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'optionList/adminpanel/typeOfBooking.json')));

exports.adminPanelMasterData = (req, res) => {
    try {
        res.status(200).send({
            status: true,
            message: "Fetch master data successfully",
            data: {
                couponCategory: couponCategoryData.categories,
                discountType: discountTypeData.discountType,
                typeOfBooking: typeOfBookingData.bookingType
            }
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Error fetching master data",
            error: error.message
        });
    }
};
