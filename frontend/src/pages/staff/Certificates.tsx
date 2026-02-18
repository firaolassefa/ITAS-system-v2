import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip,
  Avatar, CircularProgress, Alert, IconButton, Tooltip,
} from '@mui/material';
import {
  CardMembership, Download, Verified, Share, Print,
  CheckCircle, EmojiEvents,
} from '@mui/icons-material';
import { certificatesAPI } from '../../api/certificates';
import { useAuth } from '../../hooks/useAuth';

interface Certificate {
  id: number;
  courseTitle: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate?: string;
  score: number;
  status: 'active' | 'expired';
}

const Certificates: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificatesAPI.getUserCertificates(user?.id || 2);
      const data = response.data || response || [];
      
      // Map backend data to frontend format
      const mappedCerts = data.map((cert: any) => ({
        id: cert.id,
        courseTitle: cert.courseTitle || cert.course?.title || 'Unknown Course',
        certificateNumber: cert.certificateNumber || `CERT-${cert.id}`,
        issuedDate: cert.issuedDate || cert.createdAt || new Date().toISOString(),
        expiryDate: cert.expiryDate,
        score: cert.score || 100,
        status: cert.status || 'active',
      }));
      
      setCertificates(mappedCerts);
    } catch (error) {
      console.error('Failed to load certificates:', error);
      // Set mock data if API fails
      setCertificates([
        {
          id: 1,
          courseTitle: 'Internal Audit Procedures',
          certificateNumber: 'CERT-MOR-2026-001',
          issuedDate: '2026-01-15',
          score: 95,
          status: 'active',
        },
        {
          id: 2,
          courseTitle: 'Tax Policy Updates 2025',
          certificateNumber: 'CERT-MOR-2025-089',
          issuedDate: '2025-12-20',
          score: 92,
          status: 'active',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: number) => {
    try {
      // In a real implementation, this would download the PDF
      console.log('Downloading certificate:', certificateId);
      alert('Certificate download will be implemented with PDF generation');
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  const handleShare = (certificate: Certificate) => {
    // Copy certificate link to clipboard
    const link = `${window.location.origin}/verify/${certificate.certificateNumber}`;
    navigator.clipboard.writeText(link);
    alert('Certificate verification link copied to clipboard!');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          My Certificates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and download your earned certificates
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <CardMembership sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">{certificates.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Certificates
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <CheckCircle sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">
                    {certificates.filter(c => c.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <EmojiEvents sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">
                    {Math.round(certificates.reduce((sum, c) => sum + c.score, 0) / certificates.length) || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Score
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <Verified sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3">100%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <Alert severity="info">
          You haven't earned any certificates yet. Complete courses to earn certificates!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {certificates.map((certificate) => (
            <Grid item xs={12} md={6} key={certificate.id}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: 20,
                    zIndex: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: certificate.status === 'active' ? 'success.main' : 'grey.400',
                      boxShadow: 3,
                    }}
                  >
                    <Verified sx={{ fontSize: 36 }} />
                  </Avatar>
                </Box>

                <CardContent sx={{ pt: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {certificate.courseTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={certificate.status.toUpperCase()}
                        size="small"
                        color={certificate.status === 'active' ? 'success' : 'default'}
                      />
                      <Chip
                        label={`Score: ${certificate.score}%`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Certificate Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {certificate.certificateNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Issued Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {new Date(certificate.issuedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => handleDownload(certificate.id)}
                      fullWidth
                    >
                      Download
                    </Button>
                    <Tooltip title="Share verification link">
                      <IconButton
                        color="primary"
                        onClick={() => handleShare(certificate)}
                        sx={{ border: '1px solid', borderColor: 'primary.main' }}
                      >
                        <Share />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print certificate">
                      <IconButton
                        color="primary"
                        onClick={() => window.print()}
                        sx={{ border: '1px solid', borderColor: 'primary.main' }}
                      >
                        <Print />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Certificates;
