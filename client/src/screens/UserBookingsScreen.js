import React, { useState, useEffect } from 'react';
import { Table, Button, Tab, Tabs, Badge } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { equipmentAPI, infrastructureAPI } from '../services/api';

const UserBookingsScreen = () => {
  const [equipmentBookings, setEquipmentBookings] = useState([]);
  const [infrastructureBookings, setInfrastructureBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('equipment');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [equipmentResponse, infrastructureResponse] = await Promise.all([
        equipmentAPI.getUserEquipmentBookings(),
        infrastructureAPI.getUserInfrastructureBookings(),
      ]);

      setEquipmentBookings(equipmentResponse.data.bookings);
      setInfrastructureBookings(infrastructureResponse.data.bookings);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch bookings'
      );
      setLoading(false);
    }
  };

  const cancelEquipmentBooking = async (id) => {
    try {
      setCancelLoading(true);
      setCancelError('');
      setCancelSuccess(false);

      await equipmentAPI.cancelBooking(id);
      setEquipmentBookings(equipmentBookings.filter((booking) => booking._id !== id));
      setCancelSuccess(true);
    } catch (error) {
      setCancelError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to cancel booking'
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const cancelInfrastructureBooking = async (id) => {
    try {
      setCancelLoading(true);
      setCancelError('');
      setCancelSuccess(false);

      await infrastructureAPI.cancelBooking(id);
      setInfrastructureBookings(
        infrastructureBookings.filter((booking) => booking._id !== id)
      );
      setCancelSuccess(true);
    } catch (error) {
      setCancelError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to cancel booking'
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'approved':
        variant = 'success';
        break;
      case 'pending':
        variant = 'warning';
        break;
      case 'rejected':
        variant = 'danger';
        break;
      case 'returned':
        variant = 'info';
        break;
      case 'cancelled':
        variant = 'secondary';
        break;
      default:
        variant = 'primary';
    }
    return <Badge bg={variant}>{status}</Badge>;
  };

  return (
    <>
      <h1>My Bookings</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {cancelSuccess && (
            <Message variant="success">Booking cancelled successfully</Message>
          )}
          {cancelError && <Message variant="danger">{cancelError}</Message>}

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="equipment" title="Equipment Bookings">
              {equipmentBookings.length === 0 ? (
                <Message>No equipment bookings found</Message>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Quantity</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Status</th>
                      <th>Admin Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.equipment.name}</td>
                        <td>{booking.quantity}</td>
                        <td>
                          {new Date(booking.startTime).toLocaleDateString()}{' '}
                          {new Date(booking.startTime).toLocaleTimeString()}
                        </td>
                        <td>
                          {new Date(booking.endTime).toLocaleDateString()}{' '}
                          {new Date(booking.endTime).toLocaleTimeString()}
                        </td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>{booking.adminComment}</td>
                        <td>
                          {booking.status === 'pending' && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => cancelEquipmentBooking(booking._id)}
                              disabled={cancelLoading}
                            >
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
            <Tab eventKey="infrastructure" title="Infrastructure Bookings">
              {infrastructureBookings.length === 0 ? (
                <Message>No infrastructure bookings found</Message>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Infrastructure</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Admin Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infrastructureBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.infrastructure.name}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>
                          {booking.startTime} - {booking.endTime}
                        </td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>{booking.adminComment}</td>
                        <td>
                          {booking.status === 'pending' && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => cancelInfrastructureBooking(booking._id)}
                              disabled={cancelLoading}
                            >
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </>
      )}
    </>
  );
};

export default UserBookingsScreen; 