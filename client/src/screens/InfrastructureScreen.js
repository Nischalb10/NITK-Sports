import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { infrastructureAPI } from '../services/api';

const InfrastructureScreen = () => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  useEffect(() => {
    fetchInfrastructure();
  }, []);

  const fetchInfrastructure = async () => {
    try {
      setLoading(true);
      const response = await infrastructureAPI.getAllInfrastructure();
      setInfrastructure(response.data.infrastructure);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch infrastructure'
      );
      setLoading(false);
    }
  };

  // Get unique locations for filter
  const locations = [...new Set(infrastructure.map((item) => item.location))];

  // Filter infrastructure based on search term and filters
  const filteredInfrastructure = infrastructure.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === '' || item.location === locationFilter) &&
      (availabilityFilter === '' || item.availability === availabilityFilter)
    );
  });

  return (
    <>
      <h1>Sports Infrastructure</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search infrastructure..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="locationFilter">
                <Form.Select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="availabilityFilter">
                <Form.Select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="">All Availability</option>
                  <option value="available">Available</option>
                  <option value="not available">Not Available</option>
                  <option value="under maintenance">Under Maintenance</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {filteredInfrastructure.length === 0 ? (
            <Message>No infrastructure found</Message>
          ) : (
            <Row>
              {filteredInfrastructure.map((item) => (
                <Col key={item._id} sm={12} md={6} lg={4} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {item.location}
                      </Card.Subtitle>
                      <Card.Text>
                        <strong>Availability:</strong>{' '}
                        <span
                          className={
                            item.availability === 'available'
                              ? 'text-success'
                              : item.availability === 'under maintenance'
                              ? 'text-warning'
                              : 'text-danger'
                          }
                        >
                          {item.availability}
                        </span>
                        <br />
                        <strong>Capacity:</strong> {item.capacity} people
                        <br />
                        <strong>Operating Hours:</strong> {item.operatingHours.open} -{' '}
                        {item.operatingHours.close}
                      </Card.Text>
                      <Link to={`/infrastructure/${item._id}`}>
                        <Button
                          variant="primary"
                          className="me-2"
                          disabled={item.availability !== 'available'}
                        >
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/infrastructure/${item._id}/book`}>
                        <Button
                          variant="success"
                          disabled={item.availability !== 'available'}
                        >
                          Book Now
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default InfrastructureScreen; 