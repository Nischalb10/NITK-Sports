import React, { useState, useEffect } from 'react';
import { Table, Button, Tab, Tabs, Badge, Form, Modal } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { equipmentAPI, infrastructureAPI } from '../services/api';

const AdminBookingsScreen = () => {
  const [equipmentBookings, setEquipmentBookings] = useState([]);
  const [infrastructureBookings, setInfrastructureBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('equipment');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingType, setBookingType] = useState('');
  const [status, setStatus] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [equipmentResponse, infrastructureResponse] = await Promise.all([
        equipmentAPI.getAllEquipmentBookings(),
        infrastructureAPI.getAllInfrastructureBookings(),
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

  const openUpdateModal = (booking, type) => {
    setSelectedBooking(booking);
    setBookingType(type);
    setStatus(booking.status);
    setAdminComment(booking.adminComment || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setStatus('');
    setAdminComment('');
    setUpdateSuccess(false);
    setUpdateError('');
  };

  const updateBookingStatus = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError('');
      setUpdateSuccess(false);

      const updateData = {
        status,
        adminComment,
      };

      if (bookingType === 'equipment') {
        await equipmentAPI.updateBookingStatus(selectedBooking._id, updateData);
        // Update local state
        setEquipmentBookings(
          equipmentBookings.map((booking) =>
            booking._id === selectedBooking._id
              ? { ...booking, status, adminComment }
              : booking
          )
        );
      } else {
        await infrastructureAPI.updateBookingStatus(selectedBooking._id, updateData);
        // Update local state
        setInfrastructureBookings(
          infrastructureBookings.map((booking) =>
            booking._id === selectedBooking._id
              ? { ...booking, status, adminComment }
              : booking
          )
        );
      }

      setUpdateSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setUpdateError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update booking status'
      );
    } finally {
      setUpdateLoading(false);
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

  // Filter bookings based on status
  const filteredEquipmentBookings = equipmentBookings.filter(
    (booking) => filterStatus === '' || booking.status === filterStatus
  );

  const filteredInfrastructureBookings = infrastructureBookings.filter(
    (booking) => filterStatus === '' || booking.status === filterStatus
  );

  return (
    <>
      <h1>Manage Bookings</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="equipment" title="Equipment Bookings">
              {filteredEquipmentBookings.length === 0 ? (
                <Message>No equipment bookings found</Message>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>User</th>
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
                    {filteredEquipmentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.user.name}</td>
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
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openUpdateModal(booking, 'equipment')}
                          >
                            Update Status
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
            <Tab eventKey="infrastructure" title="Infrastructure Bookings">
              {filteredInfrastructureBookings.length === 0 ? (
                <Message>No infrastructure bookings found</Message>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Infrastructure</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Admin Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInfrastructureBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.user.name}</td>
                        <td>{booking.infrastructure.name}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>
                          {booking.startTime} - {booking.endTime}
                        </td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>{booking.adminComment}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openUpdateModal(booking, 'infrastructure')}
                          >
                            Update Status
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>

          {/* Update Status Modal */}
          <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Update Booking Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {updateSuccess && (
                <Message variant="success">Status updated successfully!</Message>
              )}
              {updateError && <Message variant="danger">{updateError}</Message>}

              {selectedBooking && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>User</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedBooking.user.name}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      {bookingType === 'equipment' ? 'Equipment' : 'Infrastructure'}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        bookingType === 'equipment'
                          ? selectedBooking.equipment.name
                          : selectedBooking.infrastructure.name
                      }
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      {bookingType === 'equipment' && (
                        <option value="returned">Returned</option>
                      )}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Admin Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="Add a comment (optional)"
                    />
                  </Form.Group>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={updateBookingStatus}
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update Status'}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default AdminBookingsScreen; 