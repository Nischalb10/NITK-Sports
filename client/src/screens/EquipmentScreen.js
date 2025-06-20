import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { equipmentAPI } from '../services/api';

const EquipmentScreen = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentAPI.getAllEquipment();
      setEquipment(response.data.equipment);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch equipment'
      );
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(equipment.map((item) => item.category))];

  // Filter equipment based on search term and filters
  const filteredEquipment = equipment.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === '' || item.category === categoryFilter) &&
      (availabilityFilter === '' || item.availability === availabilityFilter)
    );
  });

  return (
    <>
      <h1>Sports Equipment</h1>
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
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="categoryFilter">
                <Form.Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
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

          {filteredEquipment.length === 0 ? (
            <Message>No equipment found</Message>
          ) : (
            <Row>
              {filteredEquipment.map((item) => (
                <Col key={item._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {item.category}
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
                        <strong>Quantity:</strong> {item.quantity}
                        <br />
                        <strong>Condition:</strong> {item.condition}
                      </Card.Text>
                      <Link to={`/equipment/${item._id}`}>
                        <Button
                          variant="primary"
                          className="me-2"
                          disabled={item.availability !== 'available' || item.quantity === 0}
                        >
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/equipment/${item._id}/book`}>
                        <Button
                          variant="success"
                          disabled={item.availability !== 'available' || item.quantity === 0}
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

export default EquipmentScreen; 