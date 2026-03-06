import React from 'react';
import {
  Card, CardContent, Box, Typography, LinearProgress, Chip,
  Stack, alpha, Button, Divider,
} from '@mui/material';
import {
  CheckCircle, Lock, PlayArrow, Quiz, EmojiEvents,
  TrendingUp, Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Module {
  id: number;
  title: string;
  order: number;
  completed: boolean;
  locked: boolean;
  quizPassed: boolean;
  lastAttemptScore?: number;
  attemptsUsed?: number;
  maxAttempts?: number;
}

interface EnhancedProgressCardProps {
  courseId: number;
  courseTitle: string;
  modules: Module[];
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  finalExamEligible: boolean;
  certificateEarned: boolean;
}

const EnhancedProgressCard: React.FC<EnhancedProgressCardProps> = ({
  courseId,
  courseTitle,
  modules,
  overallProgress,
  completedModules,
  totalModules,
  finalExamEligible,
  certificateEarned,
}) => {
  const navigate = useNavigate();

  const getNextModule = () => {
    return modules.find(m => !m.completed && !m.locked);
  };

  const nextModule = getNextModule();

  const getStatusColor = (module: Module) => {
    if (module.completed) return '#10B981';
    if (module.locked) return '#9CA3AF';
    return '#667eea';
  };

  const getStatusIcon = (module: Module) => {
    if (module.completed) return <CheckCircle sx={{ fontSize: 20 }} />;
    if (module.locked) return <Lock sx={{ fontSize: 20 }} />;
    return <PlayArrow sx={{ fontSize: 20 }} />;
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: alpha('#000', 0.08),
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: `0 8px 24px ${alpha('#667eea', 0.15)}`,
          borderColor: alpha('#667eea', 0.3),
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {courseTitle}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              icon={<TrendingUp />}
              label={`${overallProgress}% Complete`}
              size="small"
              sx={{
                background: alpha('#667eea', 0.1),
                color: '#667eea',
                fontWeight: 700,
              }}
            />
            <Chip
              label={`${completedModules}/${totalModules} Modules`}
              size="small"
              variant="outlined"
            />
            {certificateEarned && (
              <Chip
                icon={<EmojiEvents />}
                label="Certificate Earned"
                size="small"
                sx={{
                  background: alpha('#F59E0B', 0.1),
                  color: '#F59E0B',
                  fontWeight: 700,
                }}
              />
            )}
          </Stack>
          <LinearProgress
            variant="determinate"
            value={overallProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              background: alpha('#667eea', 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Next Action */}
        {nextModule && !certificateEarned && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: alpha('#667eea', 0.05),
              border: '1px solid',
              borderColor: alpha('#667eea', 0.2),
              mb: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              CONTINUE LEARNING
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Module {nextModule.order + 1}: {nextModule.title}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrow />}
              onClick={() => navigate(`/taxpayer/courses/${courseId}/modules/${nextModule.id}/lesson`)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Start Module
            </Button>
          </Box>
        )}

        {/* Final Exam */}
        {finalExamEligible && !certificateEarned && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: alpha('#10B981', 0.05),
              border: '1px solid',
              borderColor: alpha('#10B981', 0.2),
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <EmojiEvents sx={{ color: '#F59E0B' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Final Exam Available!
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
              You've completed all modules. Take the final exam to earn your certificate!
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Quiz />}
              onClick={() => navigate(`/taxpayer/courses/${courseId}/final-exam`)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              }}
            >
              Take Final Exam
            </Button>
          </Box>
        )}

        {/* Module List */}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block' }}>
          MODULE PROGRESS
        </Typography>
        <Stack spacing={1}>
          {modules.slice(0, 5).map((module) => (
            <Box
              key={module.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 2,
                background: alpha(getStatusColor(module), 0.05),
                border: '1px solid',
                borderColor: alpha(getStatusColor(module), 0.15),
                cursor: module.locked ? 'not-allowed' : 'pointer',
                opacity: module.locked ? 0.6 : 1,
                transition: 'all 0.2s',
                '&:hover': module.locked ? {} : {
                  background: alpha(getStatusColor(module), 0.1),
                  borderColor: alpha(getStatusColor(module), 0.3),
                },
              }}
              onClick={() => {
                if (!module.locked) {
                  navigate(`/taxpayer/courses/${courseId}/modules/${module.id}/lesson`);
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    background: alpha(getStatusColor(module), 0.15),
                    color: getStatusColor(module),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getStatusIcon(module)}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {module.title}
                  </Typography>
                  {module.lastAttemptScore !== undefined && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Last score: {module.lastAttemptScore}% ({module.attemptsUsed}/{module.maxAttempts} attempts)
                    </Typography>
                  )}
                </Box>
              </Box>
              {module.completed && (
                <Chip
                  label="Done"
                  size="small"
                  sx={{
                    background: alpha('#10B981', 0.15),
                    color: '#10B981',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                />
              )}
              {module.locked && (
                <Chip
                  label="Locked"
                  size="small"
                  sx={{
                    background: alpha('#9CA3AF', 0.15),
                    color: '#9CA3AF',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>

        {modules.length > 5 && (
          <Button
            fullWidth
            size="small"
            onClick={() => navigate(`/taxpayer/courses/${courseId}`)}
            sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
          >
            View All {modules.length} Modules
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedProgressCard;
