import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { equipmentAPI } from '../services/api';

const EquipmentBookingScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentAPI.getEquipmentById(id);
      setEquipment(response.data.equipment);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch equipment details'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Helper to get available time slots for today and future dates
  const getAvailableTimes = (dateType) => {
    if (!equipment) return [];
    // For demo, assume equipment is available 08:00 to 20:00 (or use equipment.operatingHours if available)
    const openTime = '08:00';
    const closeTime = '20:00';
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    const times = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    times.push(`${closeHour.toString().padStart(2, '0')}:00`);

    // Filter for today
    if ((dateType === 'start' && startDate) || (dateType === 'end' && endDate)) {
      const selectedDate = new Date(dateType === 'start' ? startDate : endDate);
      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();
      if (isToday) {
        const nowHour = now.getHours();
        const nowMinute = now.getMinutes();
        return times.filter((t) => {
          const [h, m] = t.split(':').map(Number);
          return h > nowHour || (h === nowHour && m > nowMinute);
        });
      }
    }
    return times;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');
    setSuccess(false);

    // Validate dates and times
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const now = new Date();

    if (startDateTime < now) {
      setError('Start time must be in the future');
      setBookingLoading(false);
      return;
    }

    if (endDateTime <= startDateTime) {
      setError('End time must be after start time');
      setBookingLoading(false);
      return;
    }

    try {
      await equipmentAPI.bookEquipment({
        equipmentId: id,
        quantity,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Booking failed'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => navigate('/equipment')} className="btn btn-light my-3">
        Go Back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : equipment ? (
        <FormContainer>
          <h1>Book Equipment</h1>
          <h2>{equipment.name}</h2>
          <p>
            <strong>Category:</strong> {equipment.category}
            <br />
            <strong>Availability:</strong> {equipment.availability}
            <br />
            <strong>Available Quantity:</strong> {equipment.quantity}
            <br />
            <strong>Condition:</strong> {equipment.condition}
          </p>

          {success ? (
            <Message variant="success">
              Equipment booked successfully! Redirecting to your bookings...
            </Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="quantity" className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={equipment.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="startDate" className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="startTime" className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Select value={startTime} onChange={(e) => setStartTime(e.target.value)} required>
                      <option value="">Select Start Time</option>
                      {getAvailableTimes('start').map((t) => <option key={t} value={t}>{t}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="endDate" className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="endTime" className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Select value={endTime} onChange={(e) => setEndTime(e.target.value)} required>
                      <option value="">Select End Time</option>
                      {getAvailableTimes('end').map((t) => <option key={t} value={t}>{t}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                variant="primary"
                className="mt-3"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Booking...' : 'Book Equipment'}
              </Button>
            </Form>
          )}
        </FormContainer>
      ) : (
        <Message>Equipment not found</Message>
      )}
    </>
  );
};

export default EquipmentBookingScreen; 