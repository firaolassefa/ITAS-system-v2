import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Typography, IconButton, Card, CardContent,
  MenuItem, Alert, CircularProgress, Chip, Radio,
  FormControlLabel, Divider, Paper, Tabs, Tab, alpha,
} from '@mui/material';
import { Add, Edit, Delete, Quiz, Upload, EmojiEvents, MenuBook } from '@mui/icons-material';
import { apiClient } from '../../utils/axiosConfig';

const BLUE = '#339af0';
const GOLD = '#f59e0b';

type QCategory = 'PRACTICE' | 'QUIZ' | 'FINAL_EXAM';

interface Answer { answerText: string; isCorrect: boolean; order: number; }
interface Question {
  id?: number; moduleId?: number; courseId?: number;
  questionText: string; questionType: string; questionCategory: QCategory;
  isPractice: boolean; explanation?: string; points: number; order: number;
  answers: Answer[];
}

const defaultAnswers = (): Answer[] => [
  { answerText: '', isCorrect: false, order: 0 },
  { answerText: '', isCorrect: false, order: 1 },
  { answerText: '', isCorrect: false, order: 2 },
  { answerText: '', isCorrect: false, order: 3 },
];

const TABS = [
  { cat: 'PRACTICE' as QCategory, label: 'Practice', color: BLUE, desc: 'Unlimited attempts · Instant feedback · Shown inside module lessons' },
  { cat: 'QUIZ' as QCategory, label: 'Quiz', color: GOLD, desc: 'Must pass to unlock next module · Linked to a specific module' },
  { cat: 'FINAL_EXAM' as QCategory, label: 'Final Exam', color: BLUE, desc: 'Course-level · 75% to pass · Certificate auto-generated on pass' },
];

const QuestionManagement: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedModule, setSelectedModule] = useState<number | ''>('');
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Question | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState<Question>({
    questionText: '', questionType: 'MULTIPLE_CHOICE', questionCategory: 'PRACTICE',
    isPractice: true, points: 1, order: 0, answers: defaultAnswers(),
  });

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) loadModules(selectedCourse as number); }, [selectedCourse]);
  useEffect(() => { loadQ(); }, [selectedModule, selectedCourse, tab]);

  const loadCourses = async () => {
    try { const r = await apiClient.get('/courses'); setCourses(r.data.data || r.data || []); } catch (e) { console.error(e); }
  };

  const loadModules = async (cid: number) => {
    try {
      const r = await apiClient.get(`/modules/course/${cid}`);
      setModules(r.data.data || r.data || []);
      setSelectedModule(''); setQuestions([]);
    } catch (e) { console.error(e); }
  };

  const loadQ = async () => {
    const cat = TABS[tab].cat;
    if (cat === 'FINAL_EXAM') {
      if (!selectedCourse) return;
      try { setLoading(true); const r = await apiClient.get(`/questions/course/${selectedCourse}/final-exam`); setQuestions(r.data.data || r.data || []); }
      catch (e) { console.error(e); } finally { setLoading(false); }
    } else {
      if (!selectedModule) return;
      try {
        setLoading(true);
        const r = await apiClient.get(`/questions/module/${selectedModule}`);
        const all: Question[] = r.data.data || r.data || [];
        setQuestions(all.filter(q => (q.questionCategory || (q.isPractice ? 'PRACTICE' : 'QUIZ')) === cat));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
  };

  const openAdd = (q?: Question) => {
    const cat = TABS[tab].cat;
    if (q) { setEditing(q); setForm({ ...q, questionCategory: q.questionCategory || (q.isPractice ? 'PRACTICE' : 'QUIZ') }); }
    else { setEditing(null); setForm({ questionText: '', questionType: 'MULTIPLE_CHOICE', questionCategory: cat, isPractice: cat === 'PRACTICE', points: 1, order: questions.length, answers: defaultAnswers(), moduleId: selectedModule as number, courseId: selectedCourse as number }); }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.questionText.trim()) { setMsg({ type: 'error', text: 'Question text required' }); return; }
    if (!form.answers.some(a => a.isCorrect)) { setMsg({ type: 'error', text: 'Mark one answer as correct' }); return; }
    if (form.questionCategory === 'PRACTICE' && !form.explanation?.trim()) { setMsg({ type: 'error', text: 'Explanation required for practice questions' }); return; }
    const payload: any = { ...form, isPractice: form.questionCategory === 'PRACTICE' };
    if (form.questionCategory === 'FINAL_EXAM') { payload.courseId = selectedCourse; delete payload.moduleId; }
    else { payload.moduleId = selectedModule; }
    try {
      setLoading(true);
      if (editing?.id) { await apiClient.put(`/questions/${editing.id}`, payload); setMsg({ type: 'success', text: 'Updated!' }); }
      else { await apiClient.post('/questions', payload); setMsg({ type: 'success', text: 'Created!' }); }
      await loadQ();
      setTimeout(() => { setOpenDialog(false); setEditing(null); setMsg(null); }, 1200);
    } catch (e: any) { setMsg({ type: 'error', text: e.response?.data?.message || 'Failed' }); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this question?')) return;
    try { await apiClient.delete(`/questions/${id}`); await loadQ(); } catch { alert('Failed to delete'); }
  };

  const handleUpload = async () => {
    const cat = TABS[tab].cat;
    const tid = cat === 'FINAL_EXAM' ? selectedCourse : selectedModule;
    if (!uploadFile || !tid) { setMsg({ type: 'error', text: 'Select a file first' }); return; }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('file', uploadFile);
      fd.append('moduleId', tid.toString());
      fd.append('questionCategory', cat);
      if (cat === 'FINAL_EXAM') fd.append('courseId', selectedCourse.toString());
      const r = await apiClient.post('/assessment-definitions/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const data = r.data.data || r.data;
      setMsg({ type: 'success', text: `Imported ${Array.isArray(data) ? data.length : 0} questions!` });
      setUploadOpen(false); setUploadFile(null); await loadQ();
    } catch (e: any) { setMsg({ type: 'error', text: e.response?.data?.message || 'Upload failed' }); }
    finally { setLoading(false); }
  };

  const cur = TABS[tab];
  const needsMod = cur.cat !== 'FINAL_EXAM';
  const canLoad = cur.cat === 'FINAL_EXAM' ? !!selectedCourse : !!selectedModule;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: BLUE }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Question Management</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, border: `1px solid ${alpha(BLUE, 0.15)}`, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={needsMod ? 4 : 6}>
            <TextField fullWidth select label="Select Course" value={selectedCourse}
              onChange={(e) => setSelectedCourse(Number(e.target.value) || '')}>
              <MenuItem value="">Choose a course...</MenuItem>
              {courses.map(c => <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>)}
            </TextField>
          </Grid>
          {needsMod && (
            <Grid item xs={12} md={4}>
              <TextField fullWidth select label="Select Module" value={selectedModule}
                onChange={(e) => setSelectedModule(Number(e.target.value) || '')} disabled={!selectedCourse}>
                <MenuItem value="">Choose a module...</MenuItem>
                {modules.map(m => <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>)}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} md={needsMod ? 4 : 6} sx={{ display: 'flex', gap: 1 }}>
            <Button fullWidth variant="outlined" startIcon={<Upload />} onClick={() => setUploadOpen(true)}
              disabled={!canLoad} sx={{ height: 56, borderColor: BLUE, color: BLUE }}>
              Upload File
            </Button>
            <Button fullWidth variant="contained" startIcon={<Add />} onClick={() => openAdd()}
              disabled={!canLoad} sx={{ height: 56, bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
              Add Question
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: `2px solid ${alpha(BLUE, 0.1)}`,
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minHeight: 56 },
            '& .Mui-selected': { color: BLUE },
            '& .MuiTabs-indicator': { bgcolor: BLUE, height: 3 } }}>
          <Tab icon={<MenuBook />} iconPosition="start" label="Practice" />
          <Tab icon={<Quiz />} iconPosition="start" label="Quiz" />
          <Tab icon={<EmojiEvents />} iconPosition="start" label="Final Exam" />
        </Tabs>
      </Paper>

      <Alert severity="info" sx={{ mb: 3, bgcolor: alpha(BLUE, 0.04), border: `1px solid ${alpha(BLUE, 0.2)}` }}>
        <strong>{cur.label}:</strong> {cur.desc}
        {cur.cat === 'FINAL_EXAM' && <span> — Users need <strong>75%</strong> to receive a certificate.</span>}
      </Alert>

      {!canLoad ? (
        <Paper sx={{ p: 6, textAlign: 'center', border: `1px dashed ${alpha(BLUE, 0.3)}`, borderRadius: 2 }}>
          <Typography color="text.secondary">
            {cur.cat === 'FINAL_EXAM' ? 'Select a course above to manage final exam questions' : 'Select a course and module above to manage questions'}
          </Typography>
        </Paper>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: BLUE }} /></Box>
      ) : questions.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', border: `1px dashed ${alpha(BLUE, 0.3)}`, borderRadius: 2 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>No {cur.label} questions yet</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => openAdd()}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
            Add First Question
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {questions.map((q, i) => (
            <Grid item xs={12} key={q.id}>
              <Paper sx={{ p: 3, borderRadius: 2, borderLeft: `4px solid ${cur.color}`,
                border: `1px solid ${alpha(cur.color, 0.2)}`, transition: 'all 0.2s',
                '&:hover': { boxShadow: `0 4px 16px ${alpha(cur.color, 0.15)}` } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip label={`Q${i + 1}`} size="small" sx={{ bgcolor: cur.color, color: 'white', fontWeight: 700 }} />
                      <Chip label={`${q.points} pt${q.points > 1 ? 's' : ''}`} size="small" variant="outlined" />
                      <Chip label={q.questionType} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{q.questionText}</Typography>
                    {q.answers && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {q.answers.map((a, ai) => (
                          <Chip key={ai} label={a.answerText} size="small"
                            sx={{ bgcolor: a.isCorrect ? alpha(BLUE, 0.1) : 'transparent',
                              border: `1px solid ${a.isCorrect ? BLUE : '#e0e0e0'}`,
                              color: a.isCorrect ? BLUE : 'text.secondary',
                              fontWeight: a.isCorrect ? 700 : 400 }} />
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', ml: 2 }}>
                    <IconButton size="small" onClick={() => openAdd(q)} sx={{ color: BLUE }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(q.id!)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setMsg(null); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: `3px solid ${cur.color}` }}>
          {editing ? 'Edit' : 'Add'} {cur.label} Question
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {msg && <Alert severity={msg.type} sx={{ mb: 2 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Question Text" value={form.questionText}
                onChange={(e) => setForm({ ...form, questionText: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Question Type" value={form.questionType}
                onChange={(e) => setForm({ ...form, questionType: e.target.value })}>
                <MenuItem value="MULTIPLE_CHOICE">Multiple Choice</MenuItem>
                <MenuItem value="TRUE_FALSE">True / False</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Points" value={form.points}
                onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) || 1 })} />
            </Grid>
            {form.questionCategory === 'PRACTICE' && (
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Explanation (shown after answer)"
                  value={form.explanation || ''}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Answer Options</Typography>
              {form.answers.map((ans, idx) => (
                <Paper key={idx} sx={{ p: 2, mb: 1.5, bgcolor: ans.isCorrect ? alpha(BLUE, 0.05) : '#fafafa',
                  border: `1px solid ${ans.isCorrect ? BLUE : '#e0e0e0'}`, borderRadius: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <TextField fullWidth label={`Option ${String.fromCharCode(65 + idx)}`}
                        value={ans.answerText}
                        onChange={(e) => {
                          const a = [...form.answers]; a[idx] = { ...a[idx], answerText: e.target.value };
                          setForm({ ...form, answers: a });
                        }} />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <FormControlLabel
                        control={<Radio checked={ans.isCorrect} onChange={() => {
                          setForm({ ...form, answers: form.answers.map((x, i) => ({ ...x, isCorrect: i === idx })) });
                        }} sx={{ color: BLUE, '&.Mui-checked': { color: BLUE } }} />}
                        label={<Typography variant="body2" sx={{ fontWeight: ans.isCorrect ? 700 : 400, color: ans.isCorrect ? BLUE : 'text.secondary' }}>Correct</Typography>}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <IconButton color="error" onClick={() => {
                        if (form.answers.length > 2) setForm({ ...form, answers: form.answers.filter((_, i) => i !== idx) });
                      }} disabled={form.answers.length <= 2}><Delete /></IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button variant="outlined" startIcon={<Add />}
                onClick={() => setForm({ ...form, answers: [...form.answers, { answerText: '', isCorrect: false, order: form.answers.length }] })}
                disabled={form.answers.length >= 6} sx={{ borderColor: BLUE, color: BLUE }}>
                Add Option
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => { setOpenDialog(false); setMsg(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
            {loading ? <CircularProgress size={20} /> : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onClose={() => { setUploadOpen(false); setUploadFile(null); setMsg(null); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Import {cur.label} Questions</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Alert severity="info">
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Upload .docx or .pdf with this format:</Typography>
              <Box component="pre" sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, fontSize: '0.82rem', overflow: 'auto', fontFamily: 'monospace' }}>
{`Question 1: What is VAT?
Type: ${cur.cat === 'PRACTICE' ? 'Practice' : cur.cat === 'FINAL_EXAM' ? 'FinalExam' : 'Quiz'}
A) Value Added Tax
B) Variable Annual Tax
C) Verified Asset Tax
D) None of the above
Correct Answer: A
Explanation: VAT stands for Value Added Tax
Points: 10`}
              </Box>
              {cur.cat === 'FINAL_EXAM' && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: BLUE }}>
                  Final Exam: users need 75% to earn a certificate.
                </Typography>
              )}
            </Alert>
            {msg && <Alert severity={msg.type} onClose={() => setMsg(null)}>{msg.text}</Alert>}
            <Button variant="outlined" component="label" startIcon={<Upload />} fullWidth
              sx={{ py: 2, borderColor: BLUE, color: BLUE }}>
              {uploadFile ? uploadFile.name : 'Choose File (.docx or .pdf)'}
              <input type="file" hidden accept=".docx,.pdf,.doc" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => { setUploadOpen(false); setUploadFile(null); setMsg(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload} disabled={!uploadFile || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
            sx={{ bgcolor: BLUE, '&:hover': { bgcolor: '#1c7ed6' } }}>
            {loading ? 'Uploading...' : 'Upload & Import'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionManagement;

