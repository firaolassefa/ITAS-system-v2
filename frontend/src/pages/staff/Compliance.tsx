import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, LinearProgress,
  Chip, Avatar, List, ListItem, ListItemText, ListItemIcon,
  Divider, Alert, Button,
} from '@mui/material';
import {
  Security, CheckCircle, Warning, Error as ErrorIcon,
  Schedule, Assignment, TrendingUp, Download,
} from '@mui/icons-material';

interface ComplianceItem {
  id: number;
  title: string;
  category: string;
  status: 'compliant' | 'warning' | 'overdue' | 'pending';
  dueDate: string;
  completedDate?: string;
  description: string;
  mandatory: boolean;
}

const Compliance: React.FC = () => {
  const [complianceItems] = useState<ComplianceItem[]>([
    {
      id: 1,
      title: 'Annual Ethics Training',
      category: 'Ethics',
      status: 'compliant',
      dueDate: '2026-12-31',
      completedDate: '2026-01-15',
      description: 'Completed on time - Valid until end of year',
      mandatory: true,
    },
    {
      id: 2,
      title: 'Security Awareness Update',
      category: 'Security',
      status: 'warning',
      dueDate: '2026-03-01',
      description: 'Due in 2 weeks - Please complete soon',
      mandatory: true,
    },
    {
      id: 3,
      title: 'Tax Law Certification Renewal',
      category: 'Technical',
      status: 'overdue',
      dueDate: '2026-01-31',
      description: 'Overdue by 18 days - Immediate action required',
      mandatory: true,
    },
    {
      id: 4,
      title: 'Data Protection Training',
      category: 'Security',
      status: 'compliant',
      dueDate: '2026-06-30',
      completedDate: '2025-12-10',
      description: 'Completed - Valid for 6 months',
      mandatory: true,
    },
    {
      id: 5,
      title: 'Customer Service Excellence',
      category: 'Soft Skills',
      status: 'pending',
      dueDate: '2026-04-15',
      description: 'Optional training - Recommended for staff',
      mandatory: false,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'warning': return 'warning';
      case 'overdue': return 'error';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'overdue': return <ErrorIcon />;
      case 'pending': return <Schedule />;
      default: return <Assignment />;
    }
  };

  const compliantCount = complianceItems.filter(i => i.status === 'compliant').length;
  const warningCount = complianceItems.filter(i => i.status === 'warning').length;
  const overdueCount = complianceItems.filter(i => i.status === 'overdue').length;
  const mandatoryCount = complianceItems.filter(i => i.mandatory).length;
  const mandatoryCompliant = complianceItems.filter(i => i.mandatory && i.status === 'compliant').length;
  const complianceScore = Math.round((mandatoryCompliant / mandatoryCount) * 100);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Compliance Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your training compliance status
        </Typography>
      </Box>

      {/* Alerts */}
      {overdueCount > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            You have {overdueCount} overdue compliance item{overdueCount > 1 ? 's' : ''}!
          </Typography>
          <Typography variant="body2">
            Please complete the overdue training immediately to maintain compliance.
          </Typography>
        </Alert>
      )}

      {warningCount > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {warningCount} compliance item{warningCount > 1 ? 's' : ''} due soon
          </Typography>
          <Typography variant="body2">
            Complete these trainings before the deadline to avoid compliance issues.
          </Typography>
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <Security sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{complianceScore}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compliance Score
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={complianceScore}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color={complianceScore >= 90 ? 'success' : complianceScore >= 70 ? 'warning' : 'error'}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <CheckCircle sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{compliantCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compliant
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <Warning sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{warningCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due Soon
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                  <ErrorIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{overdueCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overdue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compliance Items */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Compliance Requirements
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              size="small"
            >
              Export Report
            </Button>
          </Box>

          <List>
            {complianceItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 0,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderRadius: 2,
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: `${getStatusColor(item.status)}.main`,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {getStatusIcon(item.status)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        {item.mandatory && (
                          <Chip label="Mandatory" size="small" color="error" />
                        )}
                        <Chip
                          label={item.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(item.status) as any}
                        />
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'block' }}>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mb: 0.5 }}>
                          {item.description}
                        </Typography>
                        <Box component="span" sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="caption" component="span">
                            Category: {item.category}
                          </Typography>
                          <Typography variant="caption" component="span">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </Typography>
                          {item.completedDate && (
                            <Typography variant="caption" component="span" color="success.main">
                              Completed: {new Date(item.completedDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <Box>
                    {item.status !== 'compliant' && (
                      <Button
                        variant="contained"
                        color={item.status === 'overdue' ? 'error' : 'primary'}
                        size="small"
                      >
                        {item.status === 'overdue' ? 'Complete Now' : 'Start Training'}
                      </Button>
                    )}
                    {item.status === 'compliant' && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Completed"
                        color="success"
                      />
                    )}
                  </Box>
                </ListItem>
                {index < complianceItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Compliance Tips */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Compliance Tips
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <TrendingUp color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Complete mandatory trainings before deadlines"
                secondary="Set reminders 2 weeks before due dates"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Schedule color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Schedule regular training sessions"
                secondary="Dedicate 1-2 hours per week for compliance training"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Assignment color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Keep certificates organized"
                secondary="Download and save all completion certificates"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Compliance;
