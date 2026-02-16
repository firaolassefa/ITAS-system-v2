import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Verified as VerifiedIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

interface CertificateViewerProps {
  certificate: any;
  onDownload?: () => void;
}

const CertificateViewer: React.FC<CertificateViewerProps> = ({
  certificate,
  onDownload,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {/* Certificate Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Certificate of Completion
        </Typography>
        <Typography variant="h6" color="text.secondary">
          ITAS Tax Education System
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Certificate Content */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="body1" paragraph>
          This certifies that
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          John Taxpayer
        </Typography>
        <Typography variant="body1" paragraph>
          has successfully completed the course
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {certificate?.course?.title || 'Tax Education Course'}
        </Typography>
      </Box>

      {/* Certificate Details */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssignmentIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Certificate ID
              </Typography>
              <Typography variant="body1">
                {certificate?.certificateId || 'ITAS-CERT-2024-001'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Issued Date
              </Typography>
              <Typography variant="body1">
                {certificate?.issuedAt ? formatDate(certificate.issuedAt) : 'January 20, 2024'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Valid Until
              </Typography>
              <Typography variant="body1">
                {certificate?.validUntil ? formatDate(certificate.validUntil) : 'January 20, 2025'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <VerifiedIcon sx={{ mr: 1, color: 'success.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label="Verified"
                color="success"
                size="small"
                icon={<VerifiedIcon />}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Footer */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          This certificate is issued by the ITAS Tax Education System
          and can be verified online through our verification portal.
        </Typography>
        
        {onDownload && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            sx={{ mt: 2 }}
          >
            Download Certificate (PDF)
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default CertificateViewer;
