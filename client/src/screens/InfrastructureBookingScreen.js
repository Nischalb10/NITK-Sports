import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Table } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { infrastructureAPI } from '../services/api';

const InfrastructureBookingScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [infrastructure, setInfrastructure] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [existingBookings, setExistingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchInfrastructure = async () => {
    try {
      setLoading(true);
      const response = await infrastructureAPI.getInfrastructureById(id);
      setInfrastructure(response.data.infrastructure);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch infrastructure details'
      );
      setLoading(false);
    }
  };

  const fetchBookingsByDate = async (selectedDate) => {
    try {
      const response = await infrastructureAPI.getBookingsByDate(selectedDate);
      // Filter bookings for this infrastructure only
      const filteredBookings = response.data.bookings.filter(
        (booking) => booking.infrastructure._id === id
      );
      setExistingBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchInfrastructure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (date) {
      fetchBookingsByDate(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');
    setSuccess(false);

    // Validate date and times
    const selectedDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      setError('Date must be today or in the future');
      setBookingLoading(false);
      return;
    }

    // Check if the time is within operating hours
    if (infrastructure) {
      const openTime = infrastructure.operatingHours.open;
      const closeTime = infrastructure.operatingHours.close;

      if (startTime < openTime || endTime > closeTime) {
        setError(
          `Booking time must be within operating hours (${openTime} - ${closeTime})`
        );
        setBookingLoading(false);
        return;
      }
    }

    // Check if the slot is already booked
    const isSlotBooked = existingBookings.some(
      (booking) =>
        booking.startTime === startTime &&
        booking.endTime === endTime &&
        booking.status !== 'rejected' &&
        booking.status !== 'cancelled'
    );

    if (isSlotBooked) {
      setError('This time slot is already booked');
      setBookingLoading(false);
      return;
    }

    try {
      await infrastructureAPI.bookInfrastructure({
        infrastructureId: id,
        date,
        startTime,
        endTime,
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

  // Generate time slots based on operating hours
  const generateTimeSlots = () => {
    if (!infrastructure) return [];

    const slots = [];
    const openTime = infrastructure.operatingHours.open;
    const closeTime = infrastructure.operatingHours.close;

    // Parse hours and minutes
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    // Generate slots in 1-hour increments
    let currentHour = openHour;
    let currentMinute = openMinute;

    while (
      currentHour < closeHour ||
      (currentHour === closeHour && currentMinute < closeMinute)
    ) {
      const nextHour = currentHour + 1;
      const timeSlot = {
        start: `${currentHour.toString().padStart(2, '0')}:${currentMinute
          .toString()
          .padStart(2, '0')}`,
        end: `${nextHour.toString().padStart(2, '0')}:${currentMinute
          .toString()
          .padStart(2, '0')}`,
      };

      // Check if this slot is already booked
      const isBooked = existingBookings.some(
        (booking) =>
          booking.startTime === timeSlot.start &&
          booking.endTime === timeSlot.end &&
          booking.status !== 'rejected' &&
          booking.status !== 'cancelled'
      );

      slots.push({ ...timeSlot, isBooked });
      currentHour++;
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <>
      <Button onClick={() => navigate('/infrastructure')} className="btn btn-light my-3">
        Go Back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : infrastructure ? (
        <FormContainer>
          <h1>Book Infrastructure</h1>
          <h2>{infrastructure.name}</h2>
          <p>
            <strong>Location:</strong> {infrastructure.location}
            <br />
            <strong>Availability:</strong> {infrastructure.availability}
            <br />
            <strong>Capacity:</strong> {infrastructure.capacity} people
            <br />
            <strong>Operating Hours:</strong> {infrastructure.operatingHours.open} -{' '}
            {infrastructure.operatingHours.close}
          </p>

          {success ? (
            <Message variant="success">
              Infrastructure booked successfully! Redirecting to your bookings...
            </Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="date" className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>

              {date && (
                <>
                  <h4>Available Time Slots</h4>
                  {timeSlots.length === 0 ? (
                    <Message>No time slots available</Message>
                  ) : (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Time Slot</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((slot, index) => (
                          <tr key={index}>
                            <td>
                              {slot.start} - {slot.end}
                            </td>
                            <td>
                              {slot.isBooked ? (
                                <span className="text-danger">Booked</span>
                              ) : (
                                <span className="text-success">Available</span>
                              )}
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={slot.isBooked}
                                onClick={() => {
                                  setStartTime(slot.start);
                                  setEndTime(slot.end);
                                }}
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}

                  {startTime && endTime && (
                    <div className="mb-3">
                      <h5>Selected Time Slot</h5>
                      <p>
                        {startTime} - {endTime}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="mt-3"
                    disabled={bookingLoading || !startTime || !endTime}
                  >
                    {bookingLoading ? 'Booking...' : 'Book Infrastructure'}
                  </Button>
                </>
              )}
            </Form>
          )}
        </FormContainer>
      ) : (
        <Message>Infrastructure not found</Message>
      )}
    </>
  );
};

export default InfrastructureBookingScreen; 