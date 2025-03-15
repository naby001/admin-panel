'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Pagination,
  Card,
  CardContent,
  Skeleton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Button,
  Tooltip,
  Badge,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  FileDownload as FileDownloadIcon,
  Event as EventIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { getEventById } from '../../../data/eventData';

// Types
interface Event {
  _id: string;
  title: string;
}

interface TeamMember {
  name: string;
  email: string;
  phone?: string;
}

interface Team {
  _id: string;
  name: string;
  event: {
    _id: string;
    title: string;
  } | null;
  phone: string;
  email: string;
  fullname: string;
  institution: string;
  leader: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  } | null;
  members: TeamMember[];
  member1?: string;
  member2?: string;
  member3?: string;
  registrationDate: string;
}

// Additional type for detailed event info
interface DetailedEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  groupSize: string;
  price?: number;
  prelimsDate?: string;
  finalsDate: string;
  coordinators: { name: string; phone: string }[];
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Loading skeleton
function TeamsTableSkeleton() {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team Name</TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Team Leader</TableCell>
            <TableCell>Members</TableCell>
            <TableCell>Registration Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton variant="text" width="80%" /></TableCell>
              <TableCell><Skeleton variant="text" width="60%" /></TableCell>
              <TableCell><Skeleton variant="text" width="70%" /></TableCell>
              <TableCell><Skeleton variant="text" width="50%" /></TableCell>
              <TableCell><Skeleton variant="text" width="40%" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add export loading state
  const [exportLoading, setExportLoading] = useState(false);
  
  // Filter and pagination state
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Fetch events for the filter dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error(err);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Fetch teams with filters
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        let apiUrl = `/api/teams?page=${page}&limit=10`;
        
        if (search) {
          apiUrl += `&search=${encodeURIComponent(search)}`;
        }
        
        if (selectedEvent && selectedEvent !== 'all') {
          apiUrl += `&eventId=${selectedEvent}`;
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        
        const data = await response.json();
        setTeams(data.teams);
        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to load teams. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, [page, search, selectedEvent]);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  // Handle event filter change
  const handleEventChange = (e: any) => {
    setSelectedEvent(e.target.value);
    setPage(1); // Reset to first page on new filter
  };
  
  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Function to get detailed event information
  const getDetailedEventInfo = (eventId: string): DetailedEvent | null => {
    if (!eventId) return null;
    return getEventById(eventId);
  };
  
  // Function to export teams data to CSV - modified to fetch all filtered data
  const exportToCSV = async () => {
    if (teams.length === 0) return;
    
    try {
      setExportLoading(true);
      
      // Build the same query URL used for filtering but with a larger limit
      let apiUrl = `/api/teams?page=1&limit=1000`;
      
      if (search) {
        apiUrl += `&search=${encodeURIComponent(search)}`;
      }
      
      if (selectedEvent && selectedEvent !== 'all') {
        apiUrl += `&eventId=${selectedEvent}`;
      }
      
      // Fetch all filtered teams
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch data for export');
      }
      
      const data = await response.json();
      const allTeams = data.teams as Team[];
      
      // Create CSV header
      const headers = [
        'Team ID',
        'Team Name',
        'Event',
        'Leader Name',
        'Leader Email',
        'Leader Phone',
        'Institution',
        'Members',
        'Registration Date'
      ];
      
      // Create CSV rows
      const rows = allTeams.map((team: Team) => {
        // Get all members (both from array and individual fields)
        const members = getTeamMembers(team);
        let membersString = '';
        
        if (members.length > 0) {
          if (typeof members[0] === 'string') {
            // Just join emails with semicolons
            membersString = members.join('; ');
          } else {
            // Format TeamMember objects
            membersString = team.members.map((member: TeamMember) => 
              `${member.name} (${member.email}, ${member.phone || 'N/A'})`
            ).join('; ');
          }
        }
        
        return [
          team._id,
          team.name,
          team.event ? team.event.title : 'No Event',
          team.leader ? team.leader.name : team.fullname || 'Unknown Leader',
          team.leader ? team.leader.email : team.email,
          team.leader ? team.leader.phone : team.phone,
          team.institution || 'Not specified',
          membersString,
          new Date(team.registrationDate).toLocaleDateString()
        ];
      });
      
      // Combine header and rows
      const csvContent = [
        headers.join(','),
        ...rows.map((row: any) => row.join(','))
      ].join('\n');
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', 'teams_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };
  
  // Function to get member emails from team
  const getTeamMembers = (team: Team): string[] | TeamMember[] => {
    const memberEmails: string[] = [];
    
    // First check the individual member fields
    if (team.member1 && team.member1.trim() !== '') {
      memberEmails.push(team.member1);
    }
    
    if (team.member2 && team.member2.trim() !== '') {
      memberEmails.push(team.member2);
    }
    
    if (team.member3 && team.member3.trim() !== '') {
      memberEmails.push(team.member3);
    }
    
    // If no individual members but we have an array, use that (fallback)
    if (memberEmails.length === 0 && team.members && team.members.length > 0) {
      return team.members;
    }
    
    return memberEmails;
  };
  
  // Render mobile view for teams
  const renderMobileTeamList = () => {
    return teams.map(team => (
      <Card key={team._id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="div">
              {team.name}
            </Typography>
            {team.event && (
              <Chip 
                label={team.event.title || 'No Event'} 
                color="primary" 
                size="small"
              />
            )}
          </Box>
          
          <Typography variant="caption" color="text.secondary" gutterBottom>
            ID: {team._id}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Team Leader:
            </Typography>
            <Box sx={{ ml: 2 }}>
              {team.leader ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {team.leader.name}
                    </Typography>
                    <Chip 
                      label={team.leader.role} 
                      color="secondary" 
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      <a href={`mailto:${team.leader.email}`}>{team.leader.email}</a>
                    </Typography>
                  </Box>
                  {team.leader.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <a href={`tel:${team.leader.phone}`}>{team.leader.phone}</a>
                      </Typography>
                    </Box>
                  )}
                  {!team.leader.phone && team.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <a href={`tel:${team.phone}`}>{team.phone}</a>
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    User ID: {team.leader._id}
                  </Typography>
                  {team.institution && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Institution: {team.institution}
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body2" fontWeight="bold">
                    {team.fullname || 'Unknown Leader'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      <a href={`mailto:${team.email}`}>{team.email}</a>
                    </Typography>
                  </Box>
                  {team.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <a href={`tel:${team.phone}`}>{team.phone}</a>
                      </Typography>
                    </Box>
                  )}
                  {team.institution && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Institution: {team.institution}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            Team Members:
          </Typography>
          
          <Stack spacing={1} sx={{ ml: 1 }}>
            {(() => {
              const members = getTeamMembers(team);
              
              if (members.length > 0) {
                if (typeof members[0] === 'string') {
                  // Handle string array (from member1, member2, member3)
                  return (members as string[]).map((email, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          <a href={`mailto:${email}`}>{email}</a>
                        </Typography>
                      </Box>
                    </Box>
                  ));
                } else {
                  // Handle TeamMember array (legacy support)
                  return (members as TeamMember[]).map((member, index) => (
                    <Box key={index}>
                      <Typography variant="body2">{member.name}</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, ml: 1 }}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <a href={`mailto:${member.email}`}>{member.email}</a>
                        </Typography>
                        {member.phone && (
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <a href={`tel:${member.phone}`}>{member.phone}</a>
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ));
                }
              } else {
                return (
                  <Typography variant="body2" color="text.secondary">
                    No members yet
                  </Typography>
                );
              }
            })()}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Registered: {new Date(team.registrationDate).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    ));
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant={isSmall ? "h5" : "h4"} gutterBottom sx={{ mb: 0 }}>
          Teams
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={exportLoading ? <CircularProgress size={16} /> : <DownloadIcon />}
          onClick={exportToCSV}
          disabled={teams.length === 0 || exportLoading}
          size={isSmall ? "small" : "medium"}
        >
          {exportLoading ? 'Exporting...' : 'Export to CSV'}
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
                label="Search Teams"
                variant="outlined"
                fullWidth
                size={isSmall ? "small" : "medium"}
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by team name or leader email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size={isSmall ? "small" : "medium"}>
                <InputLabel>Filter by Event</InputLabel>
                <Select
                  value={selectedEvent}
                  label="Filter by Event"
                  onChange={handleEventChange}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  {events.map(event => (
                    <MenuItem key={event._id} value={event._id}>
                      {event.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {loading ? (
        <TeamsTableSkeleton />
      ) : teams.length > 0 ? (
        <>
          {isMobile ? (
            renderMobileTeamList()
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Team Name</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Team Leader</TableCell>
                    <TableCell>Members</TableCell>
                    <TableCell>Registration Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team._id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {team.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {team._id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {team.event ? (
                          <Chip 
                            label={team.event.title} 
                            color="primary" 
                            size="small"
                          />
                        ) : (
                          'No Event'
                        )}
                      </TableCell>
                      <TableCell>
                        <Box>
                          {team.leader ? (
                            <>
                              <Typography variant="body2" fontWeight="bold">
                                {team.leader.name}
                              </Typography>
                              <Chip 
                                label={team.leader.role} 
                                color="secondary" 
                                size="small" 
                                sx={{ ml: 1, mb: 0.5 }}
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Tooltip title="Email">
                                  <IconButton size="small" href={`mailto:${team.leader.email}`}>
                                    <EmailIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                  {team.leader.email}
                                </Typography>
                              </Box>
                              {team.leader.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Tooltip title="Phone">
                                    <IconButton size="small" href={`tel:${team.leader.phone}`}>
                                      <PhoneIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Typography variant="body2">
                                    {team.leader.phone}
                                  </Typography>
                                </Box>
                              )}
                              {!team.leader.phone && team.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Tooltip title="Phone">
                                    <IconButton size="small" href={`tel:${team.phone}`}>
                                      <PhoneIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Typography variant="body2">
                                    {team.phone}
                                  </Typography>
                                </Box>
                              )}
                              <Typography variant="caption" color="text.secondary">
                                User ID: {team.leader._id}
                              </Typography>
                              {team.institution && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Institution: {team.institution}
                                </Typography>
                              )}
                            </>
                          ) : (
                            <>
                              <Typography variant="body2" fontWeight="bold">
                                {team.fullname || 'Unknown Leader'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Tooltip title="Email">
                                  <IconButton size="small" href={`mailto:${team.email}`}>
                                    <EmailIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                  {team.email}
                                </Typography>
                              </Box>
                              {team.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Tooltip title="Phone">
                                    <IconButton size="small" href={`tel:${team.phone}`}>
                                      <PhoneIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Typography variant="body2">
                                    {team.phone}
                                  </Typography>
                                </Box>
                              )}
                              {team.institution && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Institution: {team.institution}
                                </Typography>
                              )}
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          {(() => {
                            const members = getTeamMembers(team);
                            
                            if (members.length > 0) {
                              if (typeof members[0] === 'string') {
                                // Handle string array (from member1, member2, member3)
                                return (members as string[]).map((email, index) => (
                                  <Box key={index} sx={{ mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <EmailIcon fontSize="small" color="action" />
                                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                        <a href={`mailto:${email}`}>{email}</a>
                                      </Typography>
                                    </Box>
                                  </Box>
                                ));
                              } else {
                                // Handle TeamMember array (legacy support)
                                return (members as TeamMember[]).map((member, index) => (
                                  <Box key={index} sx={{ mb: 1 }}>
                                    <Typography variant="body2">
                                      {member.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, ml: 1 }}>
                                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <EmailIcon fontSize="small" color="action" />
                                        <a href={`mailto:${member.email}`}>{member.email}</a>
                                      </Typography>
                                      {member.phone && (
                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                          <PhoneIcon fontSize="small" color="action" />
                                          <a href={`tel:${member.phone}`}>{member.phone}</a>
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                ));
                              }
                            } else {
                              return (
                                <Typography variant="body2" color="text.secondary">
                                  No members yet
                                </Typography>
                              );
                            }
                          })()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(team.registrationDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
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
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No teams found matching your criteria.
          </Typography>
        </Paper>
      )}
    </Box>
  );
} 