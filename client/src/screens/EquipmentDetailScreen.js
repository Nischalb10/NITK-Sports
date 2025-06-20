import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { equipmentAPI } from '../services/api';

const EquipmentDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{equipment.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {equipment.category}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Availability:</strong>{' '}
                  <span
                    className={
                      equipment.availability === 'available'
                        ? 'text-success'
                        : equipment.availability === 'under maintenance'
                        ? 'text-warning'
                        : 'text-danger'
                    }
                  >
                    {equipment.availability}
                  </span>
                  <br />
                  <strong>Quantity:</strong> {equipment.quantity}
                  <br />
                  <strong>Condition:</strong> {equipment.condition}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Book This Equipment</Card.Title>
                <Card.Text>
                  {equipment.availability === 'available' && equipment.quantity > 0 ? (
                    <>
                      This equipment is currently available for booking.
                      <br />
                      Click the button below to proceed with your booking.
                    </>
                  ) : (
                    <>
                      This equipment is currently not available for booking.
                      <br />
                      Please check back later or contact the sports department.
                    </>
                  )}
                </Card.Text>
                <Link to={`/equipment/${equipment._id}/book`}>
                  <Button
                    variant="primary"
                    className="btn-block"
                    disabled={
                      equipment.availability !== 'available' || equipment.quantity === 0
                    }
                  >
                    Book Now
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Message>Equipment not found</Message>
      )}
    </>
  );
};

export default EquipmentDetailScreen; 