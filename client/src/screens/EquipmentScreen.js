import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardActions, Button, Typography, Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { motion } from 'framer-motion';
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
    <Box>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>Sports Equipment</Typography>
      </motion.div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <TextField
                  label="Search equipment..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="availability-label">Availability</InputLabel>
                <Select
                  labelId="availability-label"
                  value={availabilityFilter}
                  label="Availability"
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <MenuItem value="">All Availability</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="not available">Not Available</MenuItem>
                  <MenuItem value="under maintenance">Under Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {filteredEquipment.length === 0 ? (
            <Message>No equipment found</Message>
          ) : (
            <Grid container spacing={3}>
              {filteredEquipment.map((item, idx) => (
                <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.05 }}>
                    <Card className="h-100" sx={{ boxShadow: 6 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600}>{item.name}</Typography>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>{item.category}</Typography>
                        <Typography variant="body2">
                          <strong>Availability:</strong>{' '}
                          <span
                            style={{ color: item.availability === 'available' ? '#22c55e' : item.availability === 'under maintenance' ? '#eab308' : '#ef4444', fontWeight: 600 }}
                          >
                            {item.availability}
                          </span>
                          <br />
                          <strong>Quantity:</strong> {item.quantity}
                          <br />
                          <strong>Condition:</strong> {item.condition}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={Link}
                          to={`/equipment/${item._id}`}
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={item.availability !== 'available' || item.quantity === 0}
                        >
                          View Details
                        </Button>
                        <Button
                          component={Link}
                          to={`/equipment/${item._id}/book`}
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={item.availability !== 'available' || item.quantity === 0}
                        >
                          Book Now
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default EquipmentScreen; 