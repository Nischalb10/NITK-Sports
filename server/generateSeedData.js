const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'seed-data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@nitk.edu.in',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@nitk.edu.in',
    password: bcrypt.hashSync('123456', 10),
    role: 'student',
  },
  {
    name: 'Jane Smith',
    email: 'jane@nitk.edu.in',
    password: bcrypt.hashSync('123456', 10),
    role: 'faculty',
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
    openTime: '06:00',
    closeTime: '20:00',
  },
  {
    name: 'Indoor Basketball Court',
    description: 'Regulation size indoor basketball court with wooden flooring',
    type: 'Court',
    location: 'Sports Complex',
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    openTime: '06:00',
    closeTime: '22:00',
  },
  {
    name: 'Tennis Court',
    description: 'Outdoor tennis court with hard surface',
    type: 'Court',
    location: 'East Campus',
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    openTime: '06:00',
    closeTime: '20:00',
  },
  {
    name: 'Swimming Pool',
    description: 'Olympic size swimming pool with 8 lanes',
    type: 'Pool',
    location: 'Sports Complex',
    capacity: 30,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    openTime: '06:00',
    closeTime: '20:00',
  },
  {
    name: 'Badminton Court',
    description: 'Indoor badminton court with wooden flooring',
    type: 'Court',
    location: 'Sports Complex',
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    openTime: '06:00',
    closeTime: '22:00',
  },
];

// Write data to JSON files
fs.writeFileSync(
  path.join(outputDir, 'users.json'),
  JSON.stringify(users, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'equipment.json'),
  JSON.stringify(equipment, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'infrastructures.json'),
  JSON.stringify(infrastructures, null, 2)
);

// Generate sample bookings
const adminId = '000000000000000000000001';
const studentId = '000000000000000000000002';
const facultyId = '000000000000000000000003';
const equipmentId1 = '000000000000000000000004';
const equipmentId2 = '000000000000000000000005';
const infrastructureId1 = '000000000000000000000006';
const infrastructureId2 = '000000000000000000000007';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const equipmentBookings = [
  {
    user: studentId,
    equipment: equipmentId1,
    quantity: 2,
    startDate: today,
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: 'approved',
    approvedBy: adminId,
  },
  {
    user: facultyId,
    equipment: equipmentId2,
    quantity: 1,
    startDate: today,
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'pending',
  },
];

const infrastructureBookings = [
  {
    user: studentId,
    infrastructure: infrastructureId1,
    date: today,
    startTime: '14:00',
    endTime: '16:00',
    status: 'approved',
    approvedBy: adminId,
  },
  {
    user: facultyId,
    infrastructure: infrastructureId2,
    date: tomorrow,
    startTime: '10:00',
    endTime: '12:00',
    status: 'pending',
  },
];

fs.writeFileSync(
  path.join(outputDir, 'equipmentBookings.json'),
  JSON.stringify(equipmentBookings, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'infrastructureBookings.json'),
  JSON.stringify(infrastructureBookings, null, 2)
);

console.log('Seed data JSON files generated in the seed-data directory.');
console.log('You can now import these files into MongoDB Compass.'); 