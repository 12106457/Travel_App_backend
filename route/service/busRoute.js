const express = require("express");
const router = express.Router();
const busServiceController = require("../../controller/busServiceController");

router.post("/createBus", busServiceController.CreateNewBusesService);

router.get("/busDetails/:busId", busServiceController.getBusDetails);

//routes for frontend App
router.get("/seats/:busId",busServiceController.sendBusLayout);

router.put("/busbooking",busServiceController.ConformBookingStatus);

router.put("/cancelBusTicket",busServiceController.CancelBookedTickets);

module.exports = router;
