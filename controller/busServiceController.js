const driverModel=require("../model/busService/busDriverModel");
const busModel=require("../model/busService/busModel");
const busSeatModel=require("../model/busService/busSeatModel");


exports.CreateNewBusesService = async (req, res) => {
    try {
      const { busNo, route, source, destination, totalSeats, departureTime, arrivalTime } = req.body;
  
      // 1. Create a new Bus document
      const newBus = new busModel({
        busNo,
        route,
        source,
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
          price: "100", // You can customize the price
          bookingStatus: false, // Initial booking status is false
        });
  
        seatPromises.push(newSeat.save());
      }
  
      // Save all seats in parallel
      const savedSeats = await Promise.all(seatPromises);
  
      // 3. Update the Bus document with the created seat references
      newBus.seats = savedSeats.map(seat => seat._id); // Update the seats field with the seat references
      await newBus.save();
  
      // Send the response
      res.status(201).json({ message: 'Bus and seats created successfully', bus: newBus });
    } catch (err) {
      console.error('Error creating bus and seats:', err);
      res.status(500).json({ message: 'Failed to create bus and seats', error: err });
    }
  };

  

  exports.getBusDetails = async (req, res) => {
    try {
      const { busId } = req.params;
  
      // Find the bus by ID and populate the seats field with full seat details
      const bus = await busModel.findById(busId).populate('seats');
  
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      res.status(200).json({ bus });
    } catch (error) {
      console.error('Error fetching bus details:', error);
      res.status(500).json({ message: 'Failed to fetch bus details', error });
    }
  };