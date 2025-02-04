const driverModel = require("../model/busService/busDriverModel");
const busModel = require("../model/busService/busModel");
const busSeatModel = require("../model/busService/busSeatModel");

exports.CreateNewBusesService = async (req, res) => {
  try {
    const {
      busNo,
      route,
      source,
      destination,
      basePrice,
      totalSeats,
      departureTime,
      arrivalTime,
    } = req.body;

    // 1. Create a new Bus document
    const newBus = new busModel({
      busNo,
      route,
      source,
      basePrice,
      destination,
      totalSeats,
      departureTime,
      arrivalTime,
      seats: [], // Empty array initially for seats
    });

    // Save the bus document to the database
    await newBus.save();

    // 2. Create BusSeat documents for each seat
    const seatPromises = [];
    for (let i = 1; i <= totalSeats; i++) {
      const newSeat = new busSeatModel({
        busId: newBus._id, // Reference to the created bus
        seatNo: i,
        price: newBus.basePrice, // You can customize the price
        bookingStatus: false, // Initial booking status is false
      });

      seatPromises.push(newSeat.save());
    }

    // Save all seats in parallel
    const savedSeats = await Promise.all(seatPromises);

    // 3. Update the Bus document with the created seat references
    newBus.seats = savedSeats.map((seat) => seat._id); // Update the seats field with the seat references
    await newBus.save();

    // Send the response
    res
      .status(201)
      .json({ message: "Bus and seats created successfully", bus: newBus });
  } catch (err) {
    console.error("Error creating bus and seats:", err);
    res
      .status(500)
      .json({ message: "Failed to create bus and seats", error: err });
  }
};

exports.getBusDetails = async (req, res) => {
  try {
    const { busId } = req.params;

    // Find the bus by ID and populate the seats field with full seat details
    const bus = await busModel.findById(busId).populate("seats");

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ bus });
  } catch (error) {
    console.error("Error fetching bus details:", error);
    res.status(500).json({ message: "Failed to fetch bus details", error });
  }
};

exports.sendBusLayout = async (req, res) => {
  const { busId } = req.params;

  try {
    const seats = await busSeatModel.find({ busId }).sort("seatNo");
    if (seats.length === 0) {
      return res
        .status(404)
        .json({ error: "No seat layout found for this bus" });
    }
    res.status(200).send({
      status: true,
      message: "fetch bus layout successfully",
      data: seats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.ConformBookingStatus = async (req, res) => {
  const { busId, seatNumbers, userId } = req.body;
  console.log(req.body);

  try {
    // Check if seats are available
    const seats = await busSeatModel.find({ busId, seatNo: { $in: seatNumbers } });

    // Ensure 'bookingStatus' is used instead of 'booked'
    const unavailableSeats = seats.filter(seat => seat.bookingStatus);
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        error: 'Some seats are already booked',
        seats: unavailableSeats.map(seat => seat.seatNo),  // Use 'seatNo'
      });
    }

    // Book the seats
    const updateResult = await busSeatModel.updateMany(
      { busId, seatNo: { $in: seatNumbers } },
      { $set: { bookingStatus: true, userId: userId || null } }
    );

    // Ensure update actually happened
    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ error: "No seats updated, check request data." });
    }

    // Return updated seat layout
    const updatedSeats = await busSeatModel.find({ busId }).sort('seatNo');
    res.status(200).json({
      status: true,
      message: "Booked successfully",
      data: updatedSeats
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Something went wrong", error: err.message });
  }
};


exports.CancelBookedTickets = async (req, res) => {
  const { busId, seatNumbers, userId } = req.body;

  try {
    // Find only seats that are booked and belong to the same user
    const bookedSeats = await busSeatModel.find({
      busId,
      seatNo: { $in: seatNumbers },
      bookingStatus: true,  // Ensure the seat is actually booked
      userId: userId        // Ensure the same user is canceling
    });

    // Get the seat numbers that were actually booked by the user
    const bookedSeatNumbers = bookedSeats.map(seat => seat.seatNo);

    // Find which seat numbers were invalid (not booked or booked by another user)
    const invalidSeats = seatNumbers.filter(seat => !bookedSeatNumbers.includes(seat));

    // If any invalid seats were found, return an error
    if (invalidSeats.length > 0) {
      return res.status(400).json({
        status: false,
        message: `Seats ${invalidSeats.join(", ")} cannot be canceled because they are either not booked or booked by another user.`,
      });
    }

    // Cancel only the seats that were actually booked by the user
    await busSeatModel.updateMany(
      { busId, seatNo: { $in: bookedSeatNumbers } },
      { $set: { bookingStatus: false, userId: null } }
    );

    // Fetch updated seat layout
    const updatedSeats = await busSeatModel.find({ busId }).sort('seatNo');

    res.status(200).send({
      status: true,
      message: `Successfully cancelled seats: ${bookedSeatNumbers.join(", ")}`,
      data: updatedSeats
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: err.message
    });
  }
};
