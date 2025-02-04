const express = require("express");
const router = express.Router();
const busServiceController = require("../../controller/busServiceController");

router.post("/createBus", busServiceController.CreateNewBusesService);

router.get("/busDetails/:busId", busServiceController.getBusDetails);


module.exports = router;
