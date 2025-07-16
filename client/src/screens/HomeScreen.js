import React from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';

const HomeScreen = () => {
  return (
    <Box>
      <Box textAlign="center" py={5}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.15} scale={1.04} transitionSpeed={1200}>
            <Typography variant="h2" fontWeight={700} gutterBottom>NITK Sports Infrastructure Management System</Typography>
          </Tilt>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Book sports equipment and courts with ease. No more waiting in queues!
          </Typography>
        </motion.div>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Card sx={{ mb: 4, boxShadow: 6 }}>
              <CardMedia
                component="img"
                height="240"
                image="images/sports-equipment.jpg"
                alt="Sports Equipment"
              />
              <CardContent>
                <Typography variant="h5" fontWeight={600}>Equipment Booking</Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  Browse and book sports equipment like cricket bats, footballs, and more. Check real-time availability and get instant updates on your requests.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to="/equipment" variant="contained" color="primary" size="large">Browse Equipment</Button>
              </CardActions>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Card sx={{ mb: 4, boxShadow: 6 }}>
              <CardMedia
                component="img"
                height="240"
                image="images/sports-infrastructure.jpg"
                alt="Sports Infrastructure"
              />
              <CardContent>
                <Typography variant="h5" fontWeight={600}>Infrastructure Booking</Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  Book sports facilities like badminton courts, tennis courts, and more. Check availability, book a slot, and receive reminders before your booking.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to="/infrastructure" variant="contained" color="primary" size="large">Browse Infrastructure</Button>
              </CardActions>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} sm={4}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Card sx={{ textAlign: 'center', mb: 4, boxShadow: 3 }}>
              <CardContent>
                <SportsSoccerIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" fontWeight={600}>Real-time Availability</Typography>
                <Typography variant="body2" color="text.secondary">
                  Check real-time availability of equipment and courts before booking.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            <Card sx={{ textAlign: 'center', mb: 4, boxShadow: 3 }}>
              <CardContent>
                <NotificationsActiveIcon color="secondary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" fontWeight={600}>Instant Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive instant updates on your booking requests and reminders.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
            <Card sx={{ textAlign: 'center', mb: 4, boxShadow: 3 }}>
              <CardContent>
                <EventAvailableIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" fontWeight={600}>Easy Tracking</Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your bookings and manage them from a single dashboard.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeScreen; 