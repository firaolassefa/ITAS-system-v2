import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField,
  Button, Chip, Avatar, CircularProgress, Alert, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip,
  InputAdornment, alpha, Divider,
} from '@mui/material';
import {
  EmojiEvents, Search, Verified, Block, Print, Share,
  Refresh, Person, School, CalendarToday, Badge,
  CheckCircle, Cancel, OpenInNew, Download,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';
import MORLogo from '../../assets/MORLogo';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

interface Certificate {
  id: number;
  certificateNumber: string;
  issuedAt: string;
  validUntil: string;
  verified: boolean;
  user: { id: number; fullName: string; email: string; username: string };
  course: { id: number; title: string };
}

// Certificate print preview
const CertificatePreview: React.FC<{ cert: Certificate }> = ({ cert }) => (
  <Box id="cert-preview" sx={{
    width: '100%', maxWidth: 720, mx: 'auto',
    border: `10px solid ${BLUE}`, position: 'relative',
    p: '32px 48px', textAlign: 'center', bgcolor: 'white',
    '&::before': { content: '""', position: 'absolute', inset: '6px',
      border: `2px solid ${GOLD}`, pointerEvents: 'none' },
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
      <Box sx={{ width: 48, height: 48 }}><MORLogo /></Box>
      <Box sx={{ textAlign: 'left' }}>
        <Typography sx={{ fontWeight: 800, color: BLUE, fontSize: '0.95rem', letterSpacing: 2, textTransform: 'uppercase' }}>
          Ministry of Revenue
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#666', letterSpacing: 1 }}>
          Federal Democratic Republic of Ethiopia
        </Typography>
      </Box>
    </Box>
    <Box sx={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, my: 2 }} />
    <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: BLUE, letterSpacing: 3, textTransform: 'uppercase', mb: 0.5 }}>
      Certificate of Completion
    </Typography>
    <Typography sx={{ fontSize: '0.75rem', color: '#888', letterSpacing: 2, mb: 2.5 }}>
      TAX EDUCATION &amp; COMPLIANCE TRAINING
    </Typography>
    <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 0.5 }}>This certifies that</Typography>
    <Typography sx={{ fontSize: '1.8rem', fontStyle: 'italic', fontWeight: 700, color: '#1a1a1a',
      borderBottom: `2px solid ${GOLD}`, display: 'inline-block', px: 3, pb: 0.5, mb: 1 }}>
      {cert.user?.fullName}
    </Typography>
    <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 0.5 }}>has successfully completed</Typography>
    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: BLUE, mb: 2.5 }}>
      {cert.course?.title}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
      {[
        { label: 'Certificate No.', value: cert.certificateNumber },
        { label: 'Issue Date', value: new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
        { label: 'Valid Until', value: cert.validUntil ? new Date(cert.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
      ].map((item, i) => (
        <Box key={i} sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.6rem', color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333', mt: 0.3 }}>{item.value}</Typography>
        </Box>
      ))}
    </Box>
    <Box sx={{ position: 'absolute', bottom: 20, right: 36, width: 60, height: 60, borderRadius: '50%',
      bgcolor: BLUE, border: `3px solid ${GOLD}`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column' }}>
      <Typography sx={{ color: 'white', fontSize: '0.5rem', fontWeight: 800, letterSpacing: 0.5, textAlign: 'center', lineHeight: 1.3 }}>
        MOR<br/>VERIFIED
      </Typography>
    </Box>
  </Box>
);

const CertificateManagement: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filtered, setFiltered] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Certificate | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(!q ? certificates : certificates.filter(c =>
      c.user?.fullName?.toLowerCase().includes(q) ||
      c.course?.title?.toLowerCase().includes(q) ||
      c.certificateNumber?.toLowerCase().includes(q) ||
      c.user?.email?.toLowerCase().includes(q)
    ));
  }, [search, certificates]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/certificates/all');
      const data = res.data.data || res.data || [];
      setCertificates(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await apiClient.put(`/certificates/${revokeTarget.id}/revoke`);
      setMsg({ type: 'success', text: `Certificate ${revokeTarget.certificateNumber} revoked.` });
      setRevokeTarget(null);
      await loadAll();
    } catch (e: any) {
      setMsg({ type: 'error', text: e.response?.data?.message || 'Failed to revoke' });
    } finally {
      setRevoking(false);
    }
  };

  const handleRestore = async (cert: Certificate) => {
    try {
      await apiClient.put(`/certificates/${cert.id}/restore`);
      setMsg({ type: 'success', text: `Certificate ${cert.certificateNumber} restored.` });
      await loadAll();
    } catch (e: any) {
      setMsg({ type: 'error', text: e.response?.data?.message || 'Failed to restore' });
    }
  };

  const handlePrint = () => {
    const el = document.getElementById('cert-preview');
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificate</title>
      <style>@page{size:A4 landscape;margin:10mm}body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style>
      </head><body>${el.outerHTML}<script>window.onload=function(){window.print();window.close()}<\/script></body></html>`);
    win.document.close();
  };

  const stats = {
    total: certificates.length,
    active: certificates.filter(c => c.verified).length,
    revoked: certificates.filter(c => !c.verified).length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Certificate Management</Typography>
      </Box>

      {msg && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Certificates', value: stats.total, icon: <EmojiEvents />, color: GOLD },
          { label: 'Active', value: stats.active, icon: <CheckCircle />, color: BLUE },
          { label: 'Revoked', value: stats.revoked, icon: <Cancel />, color: '#ef4444' },
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

      {/* Search + Refresh */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${alpha(BLUE, 0.15)}`, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField fullWidth size="small" placeholder="Search by name, course, certificate number, email..."
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: BLUE }} /></InputAdornment> }} />
          <Tooltip title="Refresh">
            <IconButton onClick={loadAll} sx={{ color: BLUE, border: `1px solid ${alpha(BLUE, 0.3)}` }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ border: `1px solid ${alpha(BLUE, 0.15)}`, borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: BLUE }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EmojiEvents sx={{ fontSize: 56, color: alpha(GOLD, 0.3), mb: 2 }} />
            <Typography color="text.secondary">
              {search ? 'No certificates match your search' : 'No certificates issued yet'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(BLUE, 0.04) }}>
                  {['Certificate No.', 'Recipient', 'Course', 'Issued', 'Valid Until', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: BLUE, fontSize: '0.8rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(cert => (
                  <TableRow key={cert.id} hover sx={{ '&:hover': { bgcolor: alpha(BLUE, 0.02) } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: BLUE }}>
                        {cert.certificateNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(BLUE, 0.1), color: BLUE, fontSize: '0.85rem' }}>
                          {cert.user?.fullName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{cert.user?.fullName}</Typography>
                          <Typography variant="caption" color="text.secondary">{cert.user?.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cert.course?.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {cert.validUntil ? new Date(cert.validUntil).toLocaleDateString() : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={cert.verified ? <Verified sx={{ fontSize: 14 }} /> : <Block sx={{ fontSize: 14 }} />}
                        label={cert.verified ? 'Active' : 'Revoked'}
                        size="small"
                        sx={{
                          bgcolor: cert.verified ? alpha(BLUE, 0.1) : alpha('#ef4444', 0.1),
                          color: cert.verified ? BLUE : '#ef4444',
                          fontWeight: 700,
                          border: `1px solid ${cert.verified ? alpha(BLUE, 0.3) : alpha('#ef4444', 0.3)}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View & Print">
                          <IconButton size="small" onClick={() => setSelected(cert)} sx={{ color: BLUE }}>
                            <Print fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy verification link">
                          <IconButton size="small" onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/verify/${cert.certificateNumber}`);
                            setMsg({ type: 'success', text: 'Verification link copied!' });
                          }} sx={{ color: BLUE }}>
                            <Share fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {cert.verified ? (
                          <Tooltip title="Revoke certificate">
                            <IconButton size="small" onClick={() => setRevokeTarget(cert)} sx={{ color: '#ef4444' }}>
                              <Block fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Restore certificate">
                            <IconButton size="small" onClick={() => handleRestore(cert)} sx={{ color: BLUE }}>
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Preview Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          p: 2, borderBottom: `1px solid ${alpha(BLUE, 0.1)}` }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Certificate Preview</Typography>
          <IconButton onClick={() => setSelected(null)}><Cancel /></IconButton>
        </Box>
        <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
          {selected && <CertificatePreview cert={selected} />}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setSelected(null)} variant="outlined" sx={{ borderColor: BLUE, color: BLUE }}>Close</Button>
          <Button variant="outlined" startIcon={<Share />}
            onClick={() => { if (selected) { navigator.clipboard.writeText(`${window.location.origin}/verify/${selected.certificateNumber}`); setMsg({ type: 'success', text: 'Link copied!' }); }}}
            sx={{ borderColor: BLUE, color: BLUE }}>
            Copy Link
          </Button>
          <Button variant="contained" startIcon={<Print />} onClick={handlePrint}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
            Print / Save PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Confirm Dialog */}
      <Dialog open={!!revokeTarget} onClose={() => setRevokeTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>Revoke Certificate?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will invalidate the certificate. The user will no longer be able to verify it.
          </Alert>
          {revokeTarget && (
            <Box sx={{ p: 2, bgcolor: alpha('#ef4444', 0.05), borderRadius: 2, border: `1px solid ${alpha('#ef4444', 0.2)}` }}>
              <Typography variant="body2"><strong>Recipient:</strong> {revokeTarget.user?.fullName}</Typography>
              <Typography variant="body2"><strong>Course:</strong> {revokeTarget.course?.title}</Typography>
              <Typography variant="body2"><strong>Cert No.:</strong> {revokeTarget.certificateNumber}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setRevokeTarget(null)} variant="outlined">Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRevoke} disabled={revoking}
            startIcon={revoking ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Block />}>
            {revoking ? 'Revoking...' : 'Revoke'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificateManagement;
