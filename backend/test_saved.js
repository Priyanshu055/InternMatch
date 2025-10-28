const mongoose = require('mongoose');
require('dotenv').config();

// Require all models to register them
require('./models/User');
require('./models/Internship');
require('./models/SavedInternship');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internship_recommendation')
.then(() => {
  console.log('Connected to MongoDB');
  const SavedInternship = require('./models/SavedInternship');
  SavedInternship.find({}).populate('internship_id').populate('user_id').then(docs => {
    console.log('SavedInternship documents:', JSON.stringify(docs, null, 2));
    process.exit(0);
  }).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
