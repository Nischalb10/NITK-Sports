import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { infrastructureAPI } from '../services/api';

const AdminInfrastructureScreen = () => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    availability: 'available',
    capacity: 1,
    operatingHours: {
      open: '08:00',
      close: '18:00',
    },
  });

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

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      location: '',
      availability: 'available',
      capacity: 1,
      operatingHours: {
        open: '08:00',
        close: '18:00',
      },
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setSelectedInfrastructure(item);
    setFormData({
      name: item.name,
      location: item.location,
      availability: item.availability,
      capacity: item.capacity,
      operatingHours: {
        open: item.operatingHours.open,
        close: item.operatingHours.close,
      },
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInfrastructure(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'open' || name === 'close') {
      setFormData({
        ...formData,
        operatingHours: {
          ...formData.operatingHours,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'capacity' ? parseInt(value) : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await infrastructureAPI.createInfrastructure(formData);
      } else {
        await infrastructureAPI.updateInfrastructure(
          selectedInfrastructure._id,
          formData
        );
      }
      closeModal();
      fetchInfrastructure();
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to save infrastructure'
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this infrastructure?')) {
      try {
        await infrastructureAPI.deleteInfrastructure(id);
        fetchInfrastructure();
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to delete infrastructure'
        );
      }
    }
  };

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Infrastructure Management</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Add Infrastructure
          </Button>
        </Col>
      </Row>

      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Availability</th>
              <th>Capacity</th>
              <th>Operating Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {infrastructure.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.location}</td>
                <td>
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
                </td>
                <td>{item.capacity}</td>
                <td>
                  {item.operatingHours.open} - {item.operatingHours.close}
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditModal(item)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add/Edit Infrastructure Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Add New Infrastructure' : 'Edit Infrastructure'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter infrastructure name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="location" className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="availability" className="mb-3">
              <Form.Label>Availability</Form.Label>
              <Form.Select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                required
              >
                <option value="available">Available</option>
                <option value="not available">Not Available</option>
                <option value="under maintenance">Under Maintenance</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="capacity" className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="open" className="mb-3">
                  <Form.Label>Opening Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="open"
                    value={formData.operatingHours.open}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="close" className="mb-3">
                  <Form.Label>Closing Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="close"
                    value={formData.operatingHours.close}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {modalMode === 'add' ? 'Add Infrastructure' : 'Update Infrastructure'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminInfrastructureScreen; 