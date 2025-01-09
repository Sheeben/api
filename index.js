const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/dbname', {
  useNewUrlParser: true, useUnifiedTopology: true, 
});

// Schema for traditional dress
const traditionalDressSchema = new mongoose.Schema({
  name: String,
  region: String,
  image: String,
  description: String
});

// Schema for famous places
const famousPlacesSchema = new mongoose.Schema({
  name: String,
  region: String,
  image: String,
  description: String
});

// Schema for famous foods
const famousFoodSchema = new mongoose.Schema({
  name: String,
  region: String,
  image: String,
  description: String
});

// Service schema
const serviceSchema = new mongoose.Schema({
  country: String,
  traditionalDress: [traditionalDressSchema], // Array of objects for traditional dress
  famousPlaces: [famousPlacesSchema],         // Array of objects for famous places
  famousFood: [famousFoodSchema],             // Array of objects for famous food
  language: [{
    name: String,
    region: String,
    description: String
  }]
});

// Service model
const Service = mongoose.model('Service', serviceSchema);

// GET all services
app.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

// GET service by country
app.get('/services/:country', async (req, res) => {
  const country = req.params.country;
  try {
    const service = await Service.findOne({ country: new RegExp(`^${country}$`, 'i') });
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Country not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the service', error });
  }
});

// POST a new service
app.post('/services', async (req, res) => {
  const { country, traditionalDress, famousPlaces, famousFood, language } = req.body;

  const newService = new Service({
    country,
    traditionalDress,  // Array of objects for traditional dress
    famousPlaces,      // Array of objects for famous places
    famousFood,        // Array of objects for famous food
    language           // Array of objects for languages
  });

  try {
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: 'Error creating service', error });
  }
});

// PUT - Update a service by country
app.put('/services/:country', async (req, res) => {
  const country = req.params.country;
  const updates = req.body; // This should include the fields you want to update

  try {
    const updatedService = await Service.findOneAndUpdate(
      { country: new RegExp(`^${country}$`, 'i') }, 
      updates, 
      { new: true }
    );

    if (updatedService) {
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Country not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating the service', error });
  }
});

// DELETE - Delete a service by country
app.delete('/services/:country', async (req, res) => {
  const country = req.params.country;

  try {
    const deletedService = await Service.findOneAndDelete({ country: new RegExp(`^${country}$`, 'i') });

    if (deletedService) {
      res.json({ message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ message: 'Country not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the service', error });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`B4uGO API is running on http://localhost:${port}`);
});
