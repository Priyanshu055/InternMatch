const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb+srv://Priyanshu_05:XpPmJF2cFyFiJp7h@cluster0.bhfxe7p.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');

// Basic route
app.get('/', (req, res) => {
  res.send('Internship Recommendation Portal API');
});

// Routes
app.use('/api/auth', authRoutes);

const internshipRoutes = require('./routes/internships');
app.use('/api/internships', internshipRoutes);

const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

const profileRoutes = require('./routes/profiles');
app.use('/api/profiles', profileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
