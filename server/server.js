const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const infrastructureRoutes = require('./routes/infrastructureRoutes');

// Load environment variables
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/sports-infrastructure');

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connnection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/infrastructure', infrastructureRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('NITK Sports Infrastructure Management API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 