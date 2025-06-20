const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const Infrastructure = require('./models/Infrastructure');
const EquipmentBooking = require('./models/EquipmentBooking');
const InfrastructureBooking = require('./models/InfrastructureBooking');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/sports-infrastructure');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@nitk.edu.in',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    branch: 'Administration',
  },
  {
    name: 'John Doe',
    email: 'john@nitk.edu.in',
    password: bcrypt.hashSync('123456', 10),
    role: 'student',
    branch: 'Computer Science',
  },
  {
    name: 'Jane Smith',
    email: 'jane@nitk.edu.in',
    password: bcrypt.hashSync('123456', 10),
    role: 'student',
    branch: 'Electronics and Communication',
  },
];

const equipment = [
  {
    name: 'Cricket Bat',
    description: 'Professional grade cricket bat for matches and practice',
    category: 'Cricket',
    quantity: 20,
    available: 20,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Football',
    description: 'Standard size football for matches and practice',
    category: 'Football',
    quantity: 15,
    available: 15,
    image: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Basketball',
    description: 'Regulation size basketball for indoor and outdoor use',
    category: 'Basketball',
    quantity: 10,
    available: 10,
    image: 'https://images.unsplash.com/photo-1518778578946-2d58e03a41d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Tennis Racket',
    description: 'Professional tennis racket for matches and practice',
    category: 'Tennis',
    quantity: 12,
    available: 12,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Badminton Racket',
    description: 'Lightweight badminton racket for indoor and outdoor play',
    category: 'Badminton',
    quantity: 20,
    available: 20,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
];

const infrastructures = [
  {
    name: 'Main Football Ground',
    description: 'Regulation size football ground with natural grass',
    type: 'Ground',
    location: 'North Campus',
    capacity: 22,
    image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    operatingHours: {
      open: '06:00',
      close: '20:00'
    }
  },
  {
    name: 'Indoor Basketball Court',
    description: 'Regulation size indoor basketball court with wooden flooring',
    type: 'Court',
    location: 'Sports Complex',
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    operatingHours: {
      open: '06:00',
      close: '22:00'
    }
  },
  {
    name: 'Tennis Court',
    description: 'Outdoor tennis court with hard surface',
    type: 'Court',
    location: 'East Campus',
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    operatingHours: {
      open: '06:00',
      close: '20:00'
    }
  },
  {
    name: 'Swimming Pool',
    description: 'Olympic size swimming pool with 8 lanes',
    type: 'Pool',
    location: 'Sports Complex',
    capacity: 30,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    operatingHours: {
      open: '06:00',
      close: '20:00'
    }
  },
  {
    name: 'Badminton Court',
    description: 'Indoor badminton court with wooden flooring',
    type: 'Court',
    location: 'Sports Complex',
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    operatingHours: {
      open: '06:00',
      close: '22:00'
    }
  },
];

// Function to import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Equipment.deleteMany();
    await Infrastructure.deleteMany();
    await EquipmentBooking.deleteMany();
    await InfrastructureBooking.deleteMany();

    // Insert new data
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleEquipment = equipment.map(item => {
      return { ...item, user: adminUser };
    });
    await Equipment.insertMany(sampleEquipment);

    const sampleInfrastructures = infrastructures.map(item => {
      return { ...item, user: adminUser };
    });
    await Infrastructure.insertMany(sampleInfrastructures);

    // Create some sample bookings
    const student = createdUsers[1]._id;
    const faculty = createdUsers[2]._id;
    
    // Get IDs of created equipment and infrastructure
    const allEquipment = await Equipment.find({});
    const allInfrastructure = await Infrastructure.find({});
    
    // Create equipment bookings
    const equipmentBookings = [
      {
        user: student,
        equipment: allEquipment[0]._id,
        quantity: 2,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'approved',
        approvedBy: adminUser,
      },
      {
        user: faculty,
        equipment: allEquipment[1]._id,
        quantity: 1,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'pending',
      },
    ];
    
    await EquipmentBooking.insertMany(equipmentBookings);
    
    // Update available equipment quantities
    await Equipment.findByIdAndUpdate(
      allEquipment[0]._id,
      { $inc: { available: -2 } }
    );
    
    // Create infrastructure bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const infrastructureBookings = [
      {
        user: student,
        infrastructure: allInfrastructure[0]._id,
        date: today,
        startTime: '14:00',
        endTime: '16:00',
        status: 'approved',
        approvedBy: adminUser,
      },
      {
        user: faculty,
        infrastructure: allInfrastructure[1]._id,
        date: tomorrow,
        startTime: '10:00',
        endTime: '12:00',
        status: 'pending',
      },
    ];
    
    await InfrastructureBooking.insertMany(infrastructureBookings);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Equipment.deleteMany();
    await Infrastructure.deleteMany();
    await EquipmentBooking.deleteMany();
    await InfrastructureBooking.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the appropriate function based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 