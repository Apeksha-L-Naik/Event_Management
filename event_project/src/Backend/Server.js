require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const multer = require('multer');
const path = require('path');
const { log } = require('console');

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const upload = multer({ storage });



// Connect to MongoDB
// server.js or db.js
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

  const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

// User schema & model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
//event scheme
const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  price: { type: Number, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);


const DecorationSchema = new mongoose.Schema({
  name: { type: String, required: true },         // company name
  place: { type: String, required: true },
  price: { type: Number, required: true },
// optional now
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });


const Decoration = mongoose.model('Decoration', DecorationSchema);

const foodSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  foodType: { type: String, enum: ['veg', 'non-veg'], required: true },
  price: { type: Number, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);
// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) 
      return res.status(400).json({ message: 'Please fill all fields including role' });

    if (!['admin', 'user'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please fill all fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events/create', verifyToken, async (req, res) => {
  try {
    const { name, date, time, description } = req.body;
    if (!name || !date || !time || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newEvent = new Event({
      user: req.user.id,
      name,
      date,
      time,
      description,
    });

    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events for logged-in user
app.get('/api/events/my-events', verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



  app.get('/api/events/:id', verifyToken, async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/venues/create', verifyToken, async (req, res) => {
  try {
    const { name, place, price } = req.body;

    if (!name || !place || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const venue = new Venue({
      name,
      place,
      price,
      adminId: req.user.id,
    });

    await venue.save();
    res.status(201).json({ message: 'Venue added successfully', venue });
  } catch (error) {
    console.error('Error adding venue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/venues/my-venues', verifyToken, async (req, res) => {
  try {
    const venues = await Venue.find({ adminId: req.user.id }).sort({ createdAt: -1 });
    res.json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching venues' });
  }
});

// Update venue
app.put('/api/venues/:id', verifyToken, async (req, res) => {
  try {
    const { name, place, price } = req.body;

    const updatedVenue = await Venue.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id },
      { name, place, price },
      { new: true }
    );

    if (!updatedVenue) {
      return res.status(404).json({ message: 'Venue not found or unauthorized' });
    }

    res.json({ message: 'Venue updated successfully', venue: updatedVenue });
  } catch (err) {
    console.error('Error updating venue:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete venue
app.delete('/api/venues/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Venue.findOneAndDelete({ _id: req.params.id, adminId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Venue not found or unauthorized' });
    }

    res.json({ message: 'Venue deleted successfully' });
  } catch (err) {
    console.error('Error deleting venue:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events/:eventId/select-venue', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { venueId } = req.body;

    const event = await Event.findOne({ _id: eventId, user: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    // Assign venue to event (store venue info inside event or just venue id)
    event.venue = venue; // embedding entire venue object for easy display
    await event.save();

    res.json({ message: 'Venue selected for event', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/decorations/create-basic', verifyToken, async (req, res) => {
  try {
    const { name, place, price } = req.body;

    if (!name || !place || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newDecoration = new Decoration({
      name,
      place,
      price,
      adminId: req.user.id,
    });

    await newDecoration.save();
    res.status(201).json({ message: 'Decoration added successfully', decoration: newDecoration });
  } catch (error) {
    console.error('Error adding decoration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.get('/api/decorations/my-decorations', verifyToken, async (req, res) => {
  try {
    const adminId = req.user.id;
    const decorations = await Decoration.find({ adminId }).sort({ createdAt: -1 });

    res.json(decorations);
  } catch (err) {
    console.error('Error fetching decorations:', err);
    res.status(500).json({ message: 'Error fetching decorations' });
  }
});

// Update decoration
app.put('/api/decorations/:id', verifyToken, async (req, res) => {
  try {
    const { name, place, price } = req.body;

    const updatedDecoration = await Decoration.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id },
      { name, place, price },
      { new: true }
    );

    if (!updatedDecoration) {
      return res.status(404).json({ message: 'Decoration not found or unauthorized' });
    }

    res.json({ message: 'Decoration updated successfully', decoration: updatedDecoration });
  } catch (err) {
    console.error('Error updating decoration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete decoration
app.delete('/api/decorations/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Decoration.findOneAndDelete({ _id: req.params.id, adminId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Decoration not found or unauthorized' });
    }

    res.json({ message: 'Decoration deleted successfully' });
  } catch (err) {
    console.error('Error deleting decoration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST route to create food menu
app.post('/api/foods/create', verifyToken, async (req, res) => {
  try {
    const { companyName, foodType, price } = req.body;
    const food = new Food({
      adminId: req.user.id,
      companyName,
      foodType,
      price
    });

    await food.save();
    res.status(201).json({ message: 'Food menu added', food });
  } catch (err) {
    console.error('Error adding food:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get food menus by current admin
app.get('/api/foods/my-foods', verifyToken, async (req, res) => {
  try {
    const foods = await Food.find({ adminId: req.user.id }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error('Error fetching foods:', err);
    res.status(500).json({ message: 'Error fetching food menus' });
  }
});

// Update food
app.put('/api/foods/:id', verifyToken, async (req, res) => {
  try {
    const { companyName, foodType, price } = req.body;

    const updatedFood = await Food.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id },
      { companyName, foodType, price },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: 'Food not found or unauthorized' });
    }

    res.json({ message: 'Food updated successfully', food: updatedFood });
  } catch (err) {
    console.error('Error updating food:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food
app.delete('/api/foods/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Food.findOneAndDelete({ _id: req.params.id, adminId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Food not found or unauthorized' });
    }

    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    console.error('Error deleting food:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
