# NITK Sports Infrastructure Booking Portal

A web-based platform for booking sports equipment and courts at NITK, featuring real-time availability, role-based access, and a seamless user experience.

---

## Features

- User authentication (login/signup)
- Role-based access (Admin/Student)
- Add, update, and manage sports equipment (Admin)
- Book and release equipment (Student)
- Book sports infrastructure (courts, etc.) for specific time slots
- Real-time availability display
- Booking approval/rejection by Admin
- Notifications for booking status and reminders
- Responsive UI with Material-UI and/or Tailwind CSS

---

## Installation Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB (local or Atlas)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/nitk-sports
     JWT_SECRET=your_jwt_secret_key
     ```

4. **Start the server folder:**
   ```bash
   npm run dev
   ```
   
5. **Start the client folder:**
   ```bash
   npm run dev
   ```
   The app will be available at localhost:3000 for client and localhost:5000 for server.

---

## Usage

- Register as a student or login as an admin.
- Students can view, book, and release equipment and courts.
- Admins can manage equipment and approve/reject bookings.

---

---

## Implemented Features

- User authentication
- Equipment management (add/update/delete)
- Infrastructure booking with slot management
- Role-based access
- Notifications (in-app/toast)
- Responsive UI

---

## Planned Features / Not Implemented

- Email/SMS notifications
- Analytics dashboard for admins
- User profile management
- Booking history export

---

## References

- [React Documentation](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React Router](https://reactrouter.com/)

---
