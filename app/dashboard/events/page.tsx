'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Button,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  LocationOn as LocationIcon, 
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

// Types
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  maxTeamSize: number;
  minTeamSize: number;
  registrationDeadline: string;
  createdAt: string;
  type: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Loading skeleton
function EventsSkeleton() {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card>
            <CardContent>
              <Skeleton variant="text" height={40} width="80%" />
              <Skeleton variant="text" height={20} width="40%" />
              <Skeleton variant="rectangular" height={120} />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={20} width="70%" />
                <Skeleton variant="text" height={20} width="50%" />
              </Box>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={36} width={100} />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and pagination state
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get unique event types for filter
  const eventTypes = events.length > 0 
    ? [...new Set(events.map(event => event.type))] 
    : [];
  
  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let url = `/api/events?page=${page}&limit=10`;
        
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data.events);
        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [page, search]);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  // Handle event type filter change
  const handleEventTypeChange = (e: any) => {
    setEventType(e.target.value);
    if (e.target.value !== 'all') {
      setSearch(e.target.value);
    } else {
      setSearch('');
    }
    setPage(1); // Reset to first page on new filter
  };
  
  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Filter events based on event type if needed
  const filteredEvents = eventType === 'all' 
    ? events 
    : events.filter(event => event.type === eventType);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ mb: 0 }}>
          Events
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          href="/dashboard/events/new"
          size={isMobile ? "small" : "medium"}
        >
          Add Event
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search Events"
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by title or venue"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={eventType}
                  label="Filter by Type"
                  onChange={handleEventTypeChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {eventTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {loading ? (
        <EventsSkeleton />
      ) : filteredEvents.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No events found matching your criteria.
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {event.title}
                    </Typography>
                    
                    <Chip 
                      label={event.type} 
                      color="primary" 
                      size="small" 
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {event.description}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          Event Date: {new Date(event.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          Registration Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {event.venue}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <GroupIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          Team Size: {event.minTeamSize === event.maxTeamSize 
                            ? event.minTeamSize 
                            : `${event.minTeamSize}-${event.maxTeamSize}`}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<EditIcon />}
                      href={`/dashboard/events/edit/${event._id}`}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this event?')) {
                          // Delete event API call would go here
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={pagination.pages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
} 