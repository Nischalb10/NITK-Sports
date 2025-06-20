import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { equipmentAPI } from '../services/api';

const AdminEquipmentScreen = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    availability: 'available',
    quantity: 1,
    condition: 'good',
  });

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

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      category: '',
      availability: 'available',
      quantity: 1,
      condition: 'good',
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setSelectedEquipment(item);
    setFormData({
      name: item.name,
      category: item.category,
      availability: item.availability,
      quantity: item.quantity,
      condition: item.condition,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEquipment(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await equipmentAPI.createEquipment(formData);
      } else {
        await equipmentAPI.updateEquipment(selectedEquipment._id, formData);
      }
      closeModal();
      fetchEquipment();
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to save equipment'
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentAPI.deleteEquipment(id);
        fetchEquipment();
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to delete equipment'
        );
      }
    }
  };

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Equipment Management</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Add Equipment
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
              <th>Category</th>
              <th>Availability</th>
              <th>Quantity</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
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
                <td>{item.quantity}</td>
                <td>{item.condition}</td>
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

      {/* Add/Edit Equipment Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Add New Equipment' : 'Edit Equipment'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter equipment name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                name="category"
                value={formData.category}
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

            <Form.Group controlId="quantity" className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                required
              />
            </Form.Group>

            <Form.Group controlId="condition" className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {modalMode === 'add' ? 'Add Equipment' : 'Update Equipment'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminEquipmentScreen; 