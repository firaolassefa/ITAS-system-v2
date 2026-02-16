import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Button, Chip, LinearProgress, alpha, Fade, IconButton, Tooltip,
  TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Campaign, Send, Schedule, People, TrendingUp, Email,
  Sms, CheckCircle, Pending, Error as ErrorIcon, Add,
  Visibility, Edit, Delete, Notifications,
} from '@mui/icons-material';
import { dashboardAPI } from '../../api/dashboard';

interface Campaign {
  id: number;
  title: string;
  type: 'email' | 'sms' | 'both';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: number;
  openRate?: number;
  sentDate?: string;
  scheduledDate?: string;
}

const CommOfficerDashboard: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setMounted(true);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getCommOfficerDashboard();
      const data = response.data || response;
      setDashboardData(data);
      
      // Map recent campaigns
      const recentCampaigns = (data.recentCampaigns || []).map((campaign: any, index: number) => ({
        id: campaign.id || index,
        title: campaign.title || 'Untitled Campaign',
        type: 'email' as const,
        status: 'sent' as const,
        recipients: 100,
        openRate: 70,
        sentDate: campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      }));
      setCampaigns(recentCampaigns);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  const stats = [
    { label: 'Total Campaigns', value: (dashboardData.totalCampaigns || 0).toString(), icon: <Campaign />, color: '#667eea', change: '+12%' },
    { label: 'Messages Sent', value: (dashboardData.sentToday || 0).toString(), icon: <Send />, color: '#10B981', change: '+28%' },
    { label: 'Avg Open Rate', value: `${dashboardData.openRate || 0}%`, icon: <TrendingUp />, color: '#F59E0B', change: '+5%' },
    { label: 'Active Recipients', value: (dashboardData.activeRecipients || 0).toString(), icon: <People />, color: '#8B5CF6', change: '+18%' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return '#10B981';
      case 'scheduled': return '#F59E0B';
      case 'draft': return '#64748B';
      case 'failed': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle />;
      case 'scheduled': return <Schedule />;
      case 'draft': return <Edit />;
      case 'failed': return <ErrorIcon />;
      default: return <Pending />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in={mounted} timeout={600}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Communication Center
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Manage campaigns and engage with your audience
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              Create Campaign
            </Button>
          </Box>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Fade in={mounted} timeout={800 + index * 100}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                  border: '1px solid',
                  borderColor: alpha(stat.color, 0.2),
                  borderRadius: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${alpha(stat.color, 0.2)}`,
                    borderColor: alpha(stat.color, 0.4),
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        background: alpha(stat.color, 0.1),
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        background: alpha('#10B981', 0.1),
                        color: '#10B981',
                        fontWeight: 700,
                        border: 'none',
                      }}
                    />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Campaign List */}
      <Fade in={mounted} timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: '#FFFFFF',
            border: '1px solid',
            borderColor: alpha('#000', 0.08),
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Campaigns
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="All" sx={{ fontWeight: 600 }} />
              <Chip label="Sent" variant="outlined" />
              <Chip label="Scheduled" variant="outlined" />
              <Chip label="Draft" variant="outlined" />
            </Box>
          </Box>

          <Grid container spacing={2}>
            {campaigns.map((campaign, index) => (
              <Grid item xs={12} key={campaign.id}>
                <Fade in={mounted} timeout={1200 + index * 100}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: alpha('#F8FAFC', 0.5),
                      border: '1px solid',
                      borderColor: alpha('#000', 0.06),
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: '#FFFFFF',
                        borderColor: alpha('#667eea', 0.3),
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: alpha(getStatusColor(campaign.status), 0.1),
                            color: getStatusColor(campaign.status),
                          }}
                        >
                          {getStatusIcon(campaign.status)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {campaign.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Chip
                              icon={campaign.type === 'email' || campaign.type === 'both' ? <Email sx={{ fontSize: 16 }} /> : <Sms sx={{ fontSize: 16 }} />}
                              label={campaign.type.toUpperCase()}
                              size="small"
                              sx={{
                                background: alpha('#667eea', 0.1),
                                color: '#667eea',
                                fontWeight: 600,
                              }}
                            />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {campaign.recipients.toLocaleString()} recipients
                            </Typography>
                            {campaign.openRate && (
                              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                                {campaign.openRate}% open rate
                              </Typography>
                            )}
                            {campaign.sentDate && (
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Sent: {campaign.sentDate}
                              </Typography>
                            )}
                            {campaign.scheduledDate && (
                              <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                                Scheduled: {campaign.scheduledDate}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" sx={{ color: '#667eea' }}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ color: '#F59E0B' }}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" sx={{ color: '#EF4444' }}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Fade>

      {/* Create Campaign Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          Create New Campaign
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Campaign Title"
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Campaign Type"
              select
              fullWidth
              defaultValue="email"
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="both">Email & SMS</MenuItem>
            </TextField>
            <TextField
              label="Target Audience"
              select
              fullWidth
              defaultValue="all"
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="taxpayers">Taxpayers Only</MenuItem>
              <MenuItem value="staff">Staff Only</MenuItem>
              <MenuItem value="custom">Custom Selection</MenuItem>
            </TextField>
            <TextField
              label="Message"
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Schedule Date (Optional)"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            Create Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CommOfficerDashboard;
