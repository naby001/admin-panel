'use client';

import { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Tooltip,
  Skeleton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Event as EventIcon, 
  Group as GroupIcon, 
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Interface for dashboard stats
interface DashboardStats {
  totalEvents: number;
  totalTeams: number;
  upcomingEvents: {
    _id: string;
    title: string;
    date: Date;
    venue: string;
    type: string;
  }[];
  recentRegistrations: {
    _id: string;
    name: string;
    event?: {
      _id: string;
      title: string;
    };
    leader: {
      name: string;
      email: string;
      phone: string;
    };
    registrationDate: string;
  }[];
}

// Loading skeleton for dashboard
function DashboardSkeleton() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={120} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={120} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={400} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={400} />
      </Grid>
    </Grid>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch events
        const eventsResponse = await fetch('/api/events?limit=100');
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventsData = await eventsResponse.json();
        
        // Fetch teams
        const teamsResponse = await fetch('/api/teams?limit=5');
        if (!teamsResponse.ok) {
          throw new Error('Failed to fetch teams');
        }
        const teamsData = await teamsResponse.json();
        
        // Process and format the data
        const events = eventsData.events;
        const teams = teamsData.teams;
        
        // Sort events by date
        const sortedEvents = [...events].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        // Get upcoming events (events with dates in the future)
        const now = new Date();
        const upcomingEvents = sortedEvents
          .filter(event => new Date(event.date) >= now)
          .slice(0, 5)
          .map(event => ({
            _id: event._id,
            title: event.title,
            date: new Date(event.date),
            venue: event.venue,
            type: event.type
          }));
        
        // Format dashboard stats
        const dashboardStats: DashboardStats = {
          totalEvents: eventsData.pagination.total,
          totalTeams: teamsData.pagination.total,
          upcomingEvents,
          recentRegistrations: teams
        };
        
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Dashboard
        </Typography>
        <DashboardSkeleton />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Dashboard
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Box>
    );
  }
  
  if (!stats) {
    return (
      <Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Dashboard
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No data available</Typography>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        Dashboard
      </Typography>
      
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(144, 202, 249, 0.08)',
              borderRadius: 2,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: 'primary.main',
                height: { xs: 48, sm: 56 },
                width: { xs: 48, sm: 56 },
                mr: { xs: 2, sm: 3 },
              }}
            >
              <EventIcon />
            </Avatar>
            <Box>
              <Typography color="text.secondary" variant="body2">
                Total Events
              </Typography>
              <Typography variant={isMobile ? "h5" : "h4"}>{stats.totalEvents}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(244, 143, 177, 0.08)',
              borderRadius: 2,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: 'secondary.main',
                height: { xs: 48, sm: 56 },
                width: { xs: 48, sm: 56 },
                mr: { xs: 2, sm: 3 },
              }}
            >
              <GroupIcon />
            </Avatar>
            <Box>
              <Typography color="text.secondary" variant="body2">
                Total Teams
              </Typography>
              <Typography variant={isMobile ? "h5" : "h4"}>{stats.totalTeams}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Upcoming Events" 
              avatar={<CalendarIcon color="primary" />}
              titleTypographyProps={{ variant: isMobile ? 'h6' : 'h5' }}
            />
            <Divider />
            <CardContent sx={{ p: 0, maxHeight: { xs: 300, sm: 400 }, overflow: 'auto' }}>
              <List>
                {stats.upcomingEvents.length > 0 ? (
                  stats.upcomingEvents.map((event) => (
                    <ListItem key={event._id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <TodayIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography 
                              variant="body1" 
                              fontWeight="medium"
                              sx={{ mr: 1 }}
                            >
                              {event.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                              {`${event.date.toLocaleDateString()} - ${event.venue}`}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={event.type} 
                              color="primary" 
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No upcoming events" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Registrations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Recent Registrations" 
              avatar={<GroupIcon color="secondary" />}
              titleTypographyProps={{ variant: isMobile ? 'h6' : 'h5' }}
            />
            <Divider />
            <CardContent sx={{ p: 0, maxHeight: { xs: 300, sm: 400 }, overflow: 'auto' }}>
              <List>
                {stats.recentRegistrations.length > 0 ? (
                  stats.recentRegistrations.map((team) => (
                    <ListItem key={team._id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {team.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {team.name}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={team.event && team.event.title ? team.event.title : 'No Event'} 
                              color="primary" 
                              variant="outlined"
                              sx={{ ml: { xs: 0, sm: 1 } }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                              <PersonIcon fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                {team.leader.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <EmailIcon fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                {team.leader.email}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                {team.leader.phone}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              Registered: {new Date(team.registrationDate).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No recent registrations" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 