import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { equipmentAPI, infrastructureAPI, userAPI } from '../services/api';
import Message from '../components/Message';
import Loader from '../components/Loader';

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState({
    users: 0,
    equipment: 0,
    infrastructure: 0,
    equipmentBookings: 0,
    infrastructureBookings: 0,
    pendingEquipmentBookings: 0,
    pendingInfrastructureBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [
        usersResponse,
        equipmentResponse,
        infrastructureResponse,
        equipmentBookingsResponse,
        infrastructureBookingsResponse,
      ] = await Promise.all([
        userAPI.getAllUsers(),
        equipmentAPI.getAllEquipment(),
        infrastructureAPI.getAllInfrastructure(),
        equipmentAPI.getAllEquipmentBookings(),
        infrastructureAPI.getAllInfrastructureBookings(),
      ]);

      const users = usersResponse.data.users;
      const equipment = equipmentResponse.data.equipment;
      const infrastructure = infrastructureResponse.data.infrastructure;
      const equipmentBookings = equipmentBookingsResponse.data.bookings;
      const infrastructureBookings = infrastructureBookingsResponse.data.bookings;

      const pendingEquipmentBookings = equipmentBookings.filter(
        (booking) => booking.status === 'pending'
      );
      const pendingInfrastructureBookings = infrastructureBookings.filter(
        (booking) => booking.status === 'pending'
      );

      setStats({
        users: users.length,
        equipment: equipment.length,
        infrastructure: infrastructure.length,
        equipmentBookings: equipmentBookings.length,
        infrastructureBookings: infrastructureBookings.length,
        pendingEquipmentBookings: pendingEquipmentBookings.length,
        pendingInfrastructureBookings: pendingInfrastructureBookings.length,
      });

      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch dashboard data'
      );
      setLoading(false);
    }
  };

  const sendReminders = async () => {
    try {
      await infrastructureAPI.sendReminders();
      alert('Reminders sent successfully!');
    } catch (error) {
      alert('Failed to send reminders');
    }
  };

  return (
    <>
      <h1>Admin Dashboard</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <Card.Title>Users</Card.Title>
                  <h2>{stats.users}</h2>
                  <Link to="/admin/users">
                    <Button variant="primary" size="sm">
                      Manage Users
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <Card.Title>Equipment</Card.Title>
                  <h2>{stats.equipment}</h2>
                  <Link to="/admin/equipment">
                    <Button variant="primary" size="sm">
                      Manage Equipment
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <Card.Title>Infrastructure</Card.Title>
                  <h2>{stats.infrastructure}</h2>
                  <Link to="/admin/infrastructure">
                    <Button variant="primary" size="sm">
                      Manage Infrastructure
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <Card.Title>Total Bookings</Card.Title>
                  <h2>{stats.equipmentBookings + stats.infrastructureBookings}</h2>
                  <Link to="/admin/bookings">
                    <Button variant="primary" size="sm">
                      Manage Bookings
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Pending Equipment Bookings</Card.Header>
                <Card.Body>
                  <Card.Title>
                    {stats.pendingEquipmentBookings} pending requests
                  </Card.Title>
                  <Card.Text>
                    You have {stats.pendingEquipmentBookings} equipment booking requests
                    that need your approval.
                  </Card.Text>
                  <Link to="/admin/bookings">
                    <Button variant="primary">Review Requests</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Pending Infrastructure Bookings</Card.Header>
                <Card.Body>
                  <Card.Title>
                    {stats.pendingInfrastructureBookings} pending requests
                  </Card.Title>
                  <Card.Text>
                    You have {stats.pendingInfrastructureBookings} infrastructure booking
                    requests that need your approval.
                  </Card.Text>
                  <Link to="/admin/bookings">
                    <Button variant="primary">Review Requests</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card>
                <Card.Header>Quick Actions</Card.Header>
                <Card.Body>
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={sendReminders}
                  >
                    Send Booking Reminders
                  </Button>
                  <Link to="/admin/equipment">
                    <Button variant="success" className="me-2">
                      Add New Equipment
                    </Button>
                  </Link>
                  <Link to="/admin/infrastructure">
                    <Button variant="info">Add New Infrastructure</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default AdminDashboardScreen; 