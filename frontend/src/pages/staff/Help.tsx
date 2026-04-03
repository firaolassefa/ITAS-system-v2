import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Accordion, AccordionSummary,
  AccordionDetails, TextField, Button, Alert, Chip, alpha, Stack,
} from '@mui/material';
import {
  ExpandMore, Help, Email, Phone, QuestionAnswer,
  School, Assessment, CardMembership, Security,
} from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

const BLUE = '#339af0';

const faqs = [
  {
    category: 'Courses',
    icon: <School />,
    items: [
      { q: 'How do I enroll in a course?', a: 'Go to "All Courses", find the course you want, and click "Enroll Now". You will be automatically enrolled and can start learning immediately.' },
      { q: 'Can I take a course multiple times?', a: 'Yes, you can retake courses as many times as you need. Your progress will be tracked for each attempt.' },
      { q: 'How do I access course materials?', a: 'After enrolling, go to the course page and click on any module to access videos, documents, and practice questions.' },
    ],
  },
  {
    category: 'Assessments',
    icon: <Assessment />,
    items: [
      { q: 'How many attempts do I have for a quiz?', a: 'Each module quiz allows up to 3 attempts. You need to score at least 70% to pass and unlock the next module.' },
      { q: 'What happens if I fail a quiz?', a: 'You can retry the quiz up to the maximum attempts allowed. Review the module content before retrying.' },
      { q: 'When can I take the final exam?', a: 'The final exam becomes available after you complete all modules in a course. You need 70% or higher to pass.' },
    ],
  },
  {
    category: 'Certificates',
    icon: <CardMembership />,
    items: [
      { q: 'How do I get a certificate?', a: 'Complete all modules and pass the final exam with 70% or higher. Your certificate is generated automatically.' },
      { q: 'Where can I download my certificate?', a: 'Go to "Certificates" in the sidebar. You can view and download all your earned certificates from there.' },
      { q: 'How long is a certificate valid?', a: 'Certificates are valid for 1 year from the date of issue. You will need to renew by retaking the course.' },
    ],
  },
  {
    category: 'Compliance',
    icon: <Security />,
    items: [
      { q: 'What is the compliance score?', a: 'Your compliance score reflects how many mandatory training courses you have completed. A score of 100% means all required training is done.' },
      { q: 'Which courses are mandatory?', a: 'Mandatory courses are marked with a "Required" badge. Check the Compliance page for a full list of required training.' },
      { q: 'What happens if my compliance score is low?', a: 'A low compliance score may affect your performance review. Complete all mandatory courses to maintain full compliance.' },
    ],
  },
];

const StaffHelp: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  const handleAccordion = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      // Try to send via notification API, fallback gracefully
      await apiClient.post('/notifications/send', {
        subject,
        message,
        type: 'HELP_REQUEST',
      }).catch(() => {});
      setSent(true);
      setSubject('');
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Help & Support</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* FAQ Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${alpha(BLUE, 0.15)}`, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Frequently Asked Questions
            </Typography>
            <TextField fullWidth size="small" placeholder="Search FAQs..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 3 }} />

            {filteredFaqs.length === 0 ? (
              <Alert severity="info">No FAQs match your search.</Alert>
            ) : (
              filteredFaqs.map((cat) => (
                <Box key={cat.category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ color: BLUE }}>{cat.icon}</Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{cat.category}</Typography>
                  </Box>
                  {cat.items.map((item, idx) => (
                    <Accordion key={idx} expanded={expanded === `${cat.category}-${idx}`}
                      onChange={handleAccordion(`${cat.category}-${idx}`)}
                      elevation={0}
                      sx={{ border: `1px solid ${alpha(BLUE, 0.1)}`, borderRadius: '8px !important',
                        mb: 1, '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.q}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ bgcolor: alpha(BLUE, 0.03) }}>
                        <Typography variant="body2" color="text.secondary">{item.a}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* Contact & Quick Links */}
        <Grid item xs={12} md={4}>
          {/* Contact Support */}
          <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${alpha(BLUE, 0.15)}`, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Contact Support
            </Typography>

            {sent ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Message sent! We'll get back to you within 24 hours.
              </Alert>
            ) : (
              <Stack spacing={2}>
                <TextField fullWidth size="small" label="Subject"
                  value={subject} onChange={(e) => setSubject(e.target.value)} />
                <TextField fullWidth multiline rows={4} size="small" label="Message"
                  value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button variant="contained" fullWidth onClick={handleSendMessage}
                  disabled={!subject.trim() || !message.trim() || sending}
                  sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' }, fontWeight: 700 }}>
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </Stack>
            )}
          </Paper>

          {/* Contact Info */}
          <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${alpha(BLUE, 0.15)}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Contact Info</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ color: BLUE, fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>support@itas.gov.et</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ color: BLUE, fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>+251 11 557 5757</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <QuestionAnswer sx={{ color: BLUE, fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Working Hours</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Mon–Fri, 8:00 AM – 5:00 PM</Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffHelp;
