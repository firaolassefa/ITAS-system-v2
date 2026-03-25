import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Box, Grid, Card, CardContent, Typography, Button, Chip,
  Avatar, CircularProgress, Alert, IconButton, Tooltip, Paper, Divider, alpha,
  Dialog, DialogContent, DialogActions,
} from '@mui/material';
import {
  EmojiEvents, Download, Verified, Share, Print, CheckCircle,
  ArrowBack, Close, QrCode2, School,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/axiosConfig';
import MORLogo from '../../assets/MORLogo';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

interface Certificate {
  id: number;
  courseTitle: string;
  certificateNumber: string;
  issuedDate: string;
  validUntil?: string;
  verified: boolean;
  userName: string;
}

const CertificateCard: React.FC<{ cert: Certificate; onView: () => void }> = ({ cert, onView }) => (
  <Card elevation={0} sx={{
    border: `1px solid ${alpha(BLUE, 0.2)}`, borderRadius: 3,
    transition: 'all 0.3s', overflow: 'visible', position: 'relative',
    '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 16px 40px ${alpha(BLUE, 0.15)}`, borderColor: BLUE },
  }}>
    {/* Gold top bar */}
    <Box sx={{ height: 5, background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`, borderRadius: '12px 12px 0 0' }} />
    {/* Verified badge */}
    <Box sx={{ position: 'absolute', top: -14, right: 20 }}>
      <Avatar sx={{ width: 48, height: 48, bgcolor: cert.verified ? BLUE : '#9ca3af', boxShadow: 3 }}>
        <Verified sx={{ fontSize: 28 }} />
      </Avatar>
    </Box>
    <CardContent sx={{ pt: 3, pb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <EmojiEvents sx={{ color: GOLD, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1, pr: 4 }}>
          {cert.courseTitle}
        </Typography>
      </Box>
      <Chip label={cert.verified ? 'VERIFIED' : 'PENDING'} size="small"
        sx={{ mb: 2, bgcolor: cert.verified ? alpha(BLUE, 0.1) : alpha('#9ca3af', 0.1),
          color: cert.verified ? BLUE : '#9ca3af', fontWeight: 700,
          border: `1px solid ${cert.verified ? alpha(BLUE, 0.3) : alpha('#9ca3af', 0.3)}` }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Certificate No.</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', color: BLUE }}>
            {cert.certificateNumber}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Issued</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {new Date(cert.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>
        </Box>
        {cert.validUntil && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Valid Until</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {new Date(cert.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" startIcon={<Print />} onClick={onView} fullWidth
          sx={{ bgcolor: BLUE, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#1c7ed6' } }}>
          View & Print
        </Button>
        <Tooltip title="Copy verification link">
          <IconButton onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/verify/${cert.certificateNumber}`);
            alert('Verification link copied!');
          }} sx={{ border: `1px solid ${alpha(BLUE, 0.3)}`, color: BLUE }}>
            <Share />
          </IconButton>
        </Tooltip>
      </Box>
    </CardContent>
  </Card>
);

// The printable certificate design
const CertificatePrint: React.FC<{ cert: Certificate }> = ({ cert }) => (
  <Box id="certificate-print" sx={{
    width: '100%', maxWidth: 800, mx: 'auto',
    border: `12px solid ${BLUE}`, position: 'relative', p: '40px 60px',
    textAlign: 'center', bgcolor: 'white',
    '&::before': {
      content: '""', position: 'absolute', inset: '8px',
      border: `3px solid ${GOLD}`, pointerEvents: 'none',
    },
  }}>
    {/* Header */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
      <Box sx={{ width: 56, height: 56 }}><MORLogo /></Box>
      <Box sx={{ textAlign: 'left' }}>
        <Typography sx={{ fontWeight: 800, color: BLUE, fontSize: '1rem', letterSpacing: 2, textTransform: 'uppercase' }}>
          Ministry of Revenue
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#666', letterSpacing: 1 }}>
          Federal Democratic Republic of Ethiopia
        </Typography>
      </Box>
    </Box>

    {/* Gold divider */}
    <Box sx={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, my: 2 }} />

    <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: BLUE, letterSpacing: 4, textTransform: 'uppercase', mb: 0.5 }}>
      Certificate of Completion
    </Typography>
    <Typography sx={{ fontSize: '0.8rem', color: '#888', letterSpacing: 3, mb: 3 }}>
      TAX EDUCATION &amp; COMPLIANCE TRAINING
    </Typography>

    <Typography sx={{ fontSize: '0.9rem', color: '#555', mb: 0.5 }}>This certifies that</Typography>
    <Typography sx={{
      fontSize: '2rem', fontStyle: 'italic', fontWeight: 700, color: '#1a1a1a',
      borderBottom: `2px solid ${GOLD}`, display: 'inline-block', px: 4, pb: 0.5, mb: 1.5,
    }}>
      {cert.userName}
    </Typography>
    <Typography sx={{ fontSize: '0.9rem', color: '#555', mb: 0.5 }}>has successfully completed the course</Typography>
    <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: BLUE, mb: 3 }}>
      {cert.courseTitle}
    </Typography>

    {/* Meta row */}
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mt: 2 }}>
      {[
        { label: 'Certificate No.', value: cert.certificateNumber },
        { label: 'Issue Date', value: new Date(cert.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
        { label: 'Valid Until', value: cert.validUntil ? new Date(cert.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
      ].map((item, i) => (
        <Box key={i} sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Typography>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', mt: 0.3 }}>{item.value}</Typography>
        </Box>
      ))}
    </Box>

    {/* Seal */}
    <Box sx={{
      position: 'absolute', bottom: 24, right: 40,
      width: 72, height: 72, borderRadius: '50%',
      bgcolor: BLUE, border: `4px solid ${GOLD}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <Typography sx={{ color: 'white', fontSize: '0.6rem', fontWeight: 800, letterSpacing: 1, lineHeight: 1.2, textAlign: 'center' }}>
        MOR<br/>VERIFIED
      </Typography>
    </Box>
  </Box>
);

const Certificates: React.FC = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCert, setViewCert] = useState<Certificate | null>(null);

  useEffect(() => { loadCertificates(); }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('itas_user') || '{}');
      if (!user?.id) return;
      const res = await apiClient.get(`/certificates/user/${user.id}`);
      const data = res.data.data || res.data || [];
      setCertificates(data.map((c: any) => ({
        id: c.id,
        courseTitle: c.course?.title || 'Tax Education Course',
        certificateNumber: c.certificateNumber || `ITAS-CERT-${c.id}`,
        issuedDate: c.issuedAt || c.issuedDate || new Date().toISOString(),
        validUntil: c.validUntil,
        verified: c.verified !== false,
        userName: c.user?.fullName || user.fullName || 'Participant',
      })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handlePrint = () => {
    const el = document.getElementById('certificate-print');
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Certificate</title>
      <style>
        @page { size: A4 landscape; margin: 10mm; }
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      </style></head><body>
      ${el.outerHTML}
      <script>window.onload=function(){window.print();window.close();}<\/script>
      </body></html>
    `);
    win.document.close();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: BLUE }} size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/taxpayer/dashboard')}
          sx={{ mb: 2, color: BLUE }}>
          Back to Dashboard
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>My Certificates</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Certificates are awarded when you pass the Final Exam with 75% or higher.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Certificates', value: certificates.length, icon: <EmojiEvents />, color: GOLD },
          { label: 'Verified', value: certificates.filter(c => c.verified).length, icon: <CheckCircle />, color: BLUE },
          { label: 'Courses Completed', value: certificates.length, icon: <School />, color: BLUE },
        ].map((s, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card elevation={0} sx={{ border: `1px solid ${alpha(s.color, 0.2)}`, borderRadius: 2,
              borderLeft: `4px solid ${s.color}` }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(s.color, 0.1), color: s.color, width: 48, height: 48 }}>
                  {s.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Certificates */}
      {certificates.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: `1px dashed ${alpha(BLUE, 0.3)}`, borderRadius: 3 }}>
          <EmojiEvents sx={{ fontSize: 64, color: alpha(GOLD, 0.4), mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No certificates yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Complete a course's Final Exam with 75% or higher to earn your certificate.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/taxpayer/courses')}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
            Browse Courses
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {certificates.map(cert => (
            <Grid item xs={12} md={6} key={cert.id}>
              <CertificateCard cert={cert} onView={() => setViewCert(cert)} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Certificate Preview Dialog */}
      <Dialog open={!!viewCert} onClose={() => setViewCert(null)} maxWidth="md" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: `1px solid ${alpha(BLUE, 0.1)}` }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Certificate Preview</Typography>
          <IconButton onClick={() => setViewCert(null)}><Close /></IconButton>
        </Box>
        <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
          {viewCert && <CertificatePrint cert={viewCert} />}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setViewCert(null)} variant="outlined" sx={{ borderColor: BLUE, color: BLUE }}>
            Close
          </Button>
          <Button variant="outlined" startIcon={<Share />}
            onClick={() => {
              if (viewCert) {
                navigator.clipboard.writeText(`${window.location.origin}/verify/${viewCert.certificateNumber}`);
                alert('Verification link copied!');
              }
            }}
            sx={{ borderColor: BLUE, color: BLUE }}>
            Copy Link
          </Button>
          <Button variant="contained" startIcon={<Print />} onClick={handlePrint}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
            Print / Save as PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Certificates;

