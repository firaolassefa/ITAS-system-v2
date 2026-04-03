import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import {
  VerifiedUser,
  Cancel,
  Search,
  School,
  Person,
  CalendarToday,
  Grade,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';

const VerifyCertificate: React.FC = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!certificateNumber.trim()) {
      setError('Please enter a certificate number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const response = await axios.get(
        `${API_BASE_URL}/certificates/verify/${certificateNumber}`
      );

      const data = response.data.data || response.data;
      setResult(data);
    } catch (err: any) {
      setError('Certificate not found or invalid');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <VerifiedUser sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Certificate Verification
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Verify the authenticity of ITAS certificates
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Search Box */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Certificate Number"
                placeholder="Enter certificate number (e.g., CERT-2026-001234)"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleVerify}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              >
                {loading ? 'Verifying...' : 'Verify Certificate'}
              </Button>
            </Box>

            {/* Error Message */}
            {error && (
              <Alert 
                severity="error" 
                icon={<Cancel />}
                sx={{ mb: 3 }}
              >
                {error}
              </Alert>
            )}

            {/* Verification Result */}
            {result && (
              <Box>
                {result.valid ? (
                  <Alert 
                    severity="success" 
                    icon={<VerifiedUser />}
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      âœ… Valid Certificate
                    </Typography>
                    <Typography variant="body2">
                      This certificate is authentic and issued by ITAS
                    </Typography>
                  </Alert>
                ) : (
                  <Alert 
                    severity="error" 
                    icon={<Cancel />}
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      âŒ Invalid Certificate
                    </Typography>
                    <Typography variant="body2">
                      This certificate number is not found in our records
                    </Typography>
                  </Alert>
                )}

                {result.valid && result.certificate && (
                  <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                        Certificate Details
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Person color="primary" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Recipient Name
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {result.certificate.user?.fullName || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <School color="primary" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Course Name
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {result.certificate.course?.title || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CalendarToday color="primary" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Issue Date
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {result.certificate.issueDate 
                                  ? new Date(result.certificate.issueDate).toLocaleDateString()
                                  : 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Grade color="primary" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Final Score
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {result.certificate.score 
                                  ? `${result.certificate.score}%`
                                  : 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={`Certificate #${result.certificate.certificateNumber}`}
                              color="primary"
                            />
                            <Chip 
                              label="Verified"
                              color="success"
                              icon={<VerifiedUser />}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}

            {/* Info Box */}
            <Box sx={{ mt: 4, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> Certificate numbers are case-sensitive. 
                Please enter the exact certificate number as shown on your certificate.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Â© 2026 Ministry of Revenue Ethiopia - Tax Education Platform
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default VerifyCertificate;
