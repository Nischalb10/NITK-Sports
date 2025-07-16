import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardActions, Button, Typography, Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { motion } from 'framer-motion';
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
    <Box>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>Sports Infrastructure</Typography>
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
                  label="Search infrastructure..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  value={locationFilter}
                  label="Location"
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
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

          {filteredInfrastructure.length === 0 ? (
            <Message>No infrastructure found</Message>
          ) : (
            <Grid container spacing={3}>
              {filteredInfrastructure.map((item, idx) => (
                <Grid item key={item._id} xs={12} sm={6} md={4}>
                  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.05 }}>
                    <Card className="h-100" sx={{ boxShadow: 6 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600}>{item.name}</Typography>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>{item.location}</Typography>
                        <Typography variant="body2">
                          <strong>Availability:</strong>{' '}
                          <span
                            style={{ color: item.availability === 'available' ? '#22c55e' : item.availability === 'under maintenance' ? '#eab308' : '#ef4444', fontWeight: 600 }}
                          >
                            {item.availability}
                          </span>
                          <br />
                          <strong>Capacity:</strong> {item.capacity} people
                          <br />
                          <strong>Operating Hours:</strong> {item.operatingHours.open} - {item.operatingHours.close}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={Link}
                          to={`/infrastructure/${item._id}`}
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={item.availability !== 'available'}
                        >
                          View Details
                        </Button>
                        <Button
                          component={Link}
                          to={`/infrastructure/${item._id}/book`}
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={item.availability !== 'available'}
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

export default InfrastructureScreen; 