import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { infrastructureAPI } from '../services/api';

const InfrastructureDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [infrastructure, setInfrastructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchInfrastructure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{infrastructure.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {infrastructure.location}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Availability:</strong>{' '}
                  <span
                    className={
                      infrastructure.availability === 'available'
                        ? 'text-success'
                        : infrastructure.availability === 'under maintenance'
                        ? 'text-warning'
                        : 'text-danger'
                    }
                  >
                    {infrastructure.availability}
                  </span>
                  <br />
                  <strong>Capacity:</strong> {infrastructure.capacity} people
                  <br />
                  <strong>Operating Hours:</strong> {infrastructure.operatingHours.open} -{' '}
                  {infrastructure.operatingHours.close}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Book This Infrastructure</Card.Title>
                <Card.Text>
                  {infrastructure.availability === 'available' ? (
                    <>
                      This infrastructure is currently available for booking.
                      <br />
                      Click the button below to proceed with your booking.
                    </>
                  ) : (
                    <>
                      This infrastructure is currently not available for booking.
                      <br />
                      Please check back later or contact the sports department.
                    </>
                  )}
                </Card.Text>
                <Link to={`/infrastructure/${infrastructure._id}/book`}>
                  <Button
                    variant="primary"
                    className="btn-block"
                    disabled={infrastructure.availability !== 'available'}
                  >
                    Book Now
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Message>Infrastructure not found</Message>
      )}
    </>
  );
};

export default InfrastructureDetailScreen; 