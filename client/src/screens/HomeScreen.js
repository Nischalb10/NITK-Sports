import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <>
      <div className="text-center py-5">
        <h1>NITK Sports Infrastructure Management System</h1>
        <p className="lead">
          Book sports equipment and courts with ease. No more waiting in queues!
        </p>
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src="https://source.unsplash.com/random/800x400/?sports-equipment"
              alt="Sports Equipment"
            />
            <Card.Body>
              <Card.Title>Equipment Booking</Card.Title>
              <Card.Text>
                Browse and book sports equipment like cricket bats, footballs, and more.
                Check real-time availability and get instant updates on your requests.
              </Card.Text>
              <Link to="/equipment">
                <Button variant="primary">Browse Equipment</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src="https://source.unsplash.com/random/800x400/?sports-court"
              alt="Sports Infrastructure"
            />
            <Card.Body>
              <Card.Title>Infrastructure Booking</Card.Title>
              <Card.Text>
                Book sports facilities like badminton courts, tennis courts, and more.
                Check availability, book a slot, and receive reminders before your booking.
              </Card.Text>
              <Link to="/infrastructure">
                <Button variant="primary">Browse Infrastructure</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center mb-4">
            <Card.Body>
              <i className="fas fa-clock fa-3x mb-3"></i>
              <Card.Title>Real-time Availability</Card.Title>
              <Card.Text>
                Check real-time availability of equipment and courts before booking.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-4">
            <Card.Body>
              <i className="fas fa-bell fa-3x mb-3"></i>
              <Card.Title>Instant Notifications</Card.Title>
              <Card.Text>
                Receive instant updates on your booking requests and reminders.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-4">
            <Card.Body>
              <i className="fas fa-calendar-check fa-3x mb-3"></i>
              <Card.Title>Easy Tracking</Card.Title>
              <Card.Text>
                Track your bookings and manage them from a single dashboard.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default HomeScreen; 