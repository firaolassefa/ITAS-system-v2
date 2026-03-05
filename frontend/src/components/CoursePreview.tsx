import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import { Close, PlayCircle, Description, Quiz } from '@mui/icons-material';

interface CoursePreviewProps {
  open: boolean;
  onClose: () => void;
  course: any;
  firstModule?: any;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({
  open,
  onClose,
  course,
  firstModule,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Course Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course?.title}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Course Info */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={course?.category} color="primary" />
            <Chip label={course?.difficulty} />
            <Chip label={`${course?.durationHours} hours`} variant="outlined" />
          </Box>
          <Typography variant="body1" color="text.secondary">
            {course?.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Preview Content */}
        {firstModule ? (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Preview: {firstModule.title}
            </Typography>

            {/* Video Preview */}
            {firstModule.videoUrl && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PlayCircle color="primary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Introduction Video
                  </Typography>
                  <Chip label="FREE PREVIEW" size="small" color="success" />
                </Box>
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    src={firstModule.videoUrl}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              </Box>
            )}

            {/* PDF Preview */}
            {firstModule.contentUrl && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Description color="primary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Course Materials
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  href={firstModule.contentUrl}
                  target="_blank"
                >
                  Preview PDF Material
                </Button>
              </Box>
            )}

            {/* Module Description */}
            <Box>
              <Typography variant="body2" color="text.secondary">
                {firstModule.description}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No preview available for this course yet.
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* What You'll Learn */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            What You'll Learn
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <Typography>✓</Typography>
              <Typography variant="body2">
                Complete understanding of {course?.category} concepts
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <Typography>✓</Typography>
              <Typography variant="body2">
                Practical examples and real-world applications
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <Typography>✓</Typography>
              <Typography variant="body2">
                Interactive quizzes and assessments
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <Typography>✓</Typography>
              <Typography variant="body2">
                Certificate upon successful completion
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>
          Close Preview
        </Button>
        <Button variant="contained" size="large">
          Enroll Now - It's Free!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CoursePreview;
